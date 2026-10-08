import { api } from '../utilidades/api.js';
import { leerAlmacenamiento, guardarAlmacenamiento } from '../utilidades/almacenamiento.js';
import { guardarUsuario, normalizarCliente, obtenerUsuario } from './sesion.js';

const IVA_ESTIMADO = 0.19;
const CLAVE_CARRITO = 'carrito';

const nombreDe = valor => (valor && typeof valor === 'object' ? valor.nombre : valor) ?? '';

// ---------- Productos ----------

export function normalizarProducto(producto) {
  const imagen = producto.linkImagen ?? producto.imagen ?? producto.imagenUrl ?? '';
  return {
    id: producto.id,
    codigo: `PRO-${producto.id}`,
    nombre: producto.nombreModelo ?? producto.nombre ?? '',
    descripcion: producto.descripcion || '',
    precio: Number(producto.precio || 0),
    stock: Number(producto.stock || 0),
    imagen,
    imagenes: imagen ? [imagen] : [],
    categoria: nombreDe(producto.tipoCategoria ?? producto.categoria),
    categoriaApi: producto.tipoCategoria && typeof producto.tipoCategoria === 'object' ? producto.tipoCategoria : null
  };
}

export async function listarProductos() {
  const datos = await api('/api/productos');
  return (Array.isArray(datos) ? datos : []).map(normalizarProducto);
}

export async function obtenerProducto(id) {
  return normalizarProducto(await api(`/api/productos/${id}`));
}

export async function guardarProducto(datos, id) {
  const productos = await listarProductos();
  const categoria = productos.find(item => item.categoria === datos.categoria)?.categoriaApi || { nombre: datos.categoria };
  const cuerpo = {
    nombreModelo: datos.nombre,
    descripcion: datos.descripcion,
    precio: datos.precio,
    stock: datos.stock,
    linkImagen: datos.imagen,
    tipoCategoria: categoria
  };
  const guardado = await api(id ? `/api/productos/${id}` : '/api/productos', { method: id ? 'PUT' : 'POST', body: cuerpo });
  return normalizarProducto(guardado);
}

export function eliminarProducto(id) {
  return api(`/api/productos/${id}`, { method: 'DELETE' });
}

// ---------- Clientes ----------

export async function listarClientes() {
  const datos = await api('/api/clientes');
  return (Array.isArray(datos) ? datos : []).map(normalizarCliente);
}

export async function obtenerCliente(id) {
  return normalizarCliente(await api(`/api/clientes/${id}`));
}

function cuerpoCliente(datos) {
  const cuerpo = {
    nombreCompleto: datos.nombre,
    email: datos.email,
    numero: datos.telefono,
    direccion: datos.direccion,
    region: datos.region,
    comuna: datos.comuna
  };
  if (datos.password) cuerpo.contrasena = datos.password;
  return cuerpo;
}

export async function registrarCliente(datos) {
  return normalizarCliente(await api('/api/clientes', { method: 'POST', body: cuerpoCliente(datos) }));
}

export async function actualizarCliente(id, datos) {
  return normalizarCliente(await api(`/api/clientes/${id}`, { method: 'PUT', body: cuerpoCliente(datos) }));
}

export function eliminarCliente(id) {
  return api(`/api/clientes/${id}`, { method: 'DELETE' });
}

export async function iniciarSesion(email, password) {
  const cliente = await api('/api/clientes/login', { method: 'POST', body: { email, contrasena: password } });
  if (!cliente || typeof cliente !== 'object' || cliente.id === undefined) {
    throw new Error('El servidor no devolvió los datos del cliente.');
  }
  guardarUsuario(cliente);
  await fusionarCarritoLocal();
  return obtenerUsuario();
}

// ---------- Carrito ----------

function avisarCarrito() {
  window.dispatchEvent(new Event('storage'));
}

function leerCarritoLocal() {
  const items = leerAlmacenamiento(CLAVE_CARRITO);
  return Array.isArray(items) ? items : [];
}

function totalesLocales(items) {
  const subtotal = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  const impuestos = Math.round(subtotal * IVA_ESTIMADO);
  return { subtotal, impuestos, total: subtotal + impuestos };
}

function normalizarCarrito(carrito, productos) {
  const items = (carrito?.items ?? []).map(item => {
    const id = Number(item.productoId ?? item.id);
    const producto = productos.find(entry => entry.id === id);
    return {
      id,
      nombre: item.nombreProducto ?? item.nombre ?? producto?.nombre ?? '',
      precio: Number(item.precioUnitario ?? item.precio ?? producto?.precio ?? 0),
      cantidad: Number(item.cantidad || 0),
      imagen: producto?.imagen || '',
      stock: producto?.stock
    };
  });
  const subtotal = Number(carrito?.subtotal ?? items.reduce((suma, item) => suma + item.precio * item.cantidad, 0));
  const impuestos = Number(carrito?.impuestos ?? carrito?.impuesto ?? 0);
  return { items, subtotal, impuestos, total: Number(carrito?.total ?? subtotal + impuestos) };
}

export async function obtenerCarrito() {
  const usuario = obtenerUsuario();
  if (!usuario) {
    const items = leerCarritoLocal();
    return { items, ...totalesLocales(items) };
  }
  const [carrito, productos] = await Promise.all([
    api(`/api/clientes/${usuario.id}/carrito`),
    listarProductos().catch(() => [])
  ]);
  return normalizarCarrito(carrito, productos);
}

export async function contarCarrito() {
  if (!obtenerUsuario()) return leerCarritoLocal().reduce((suma, item) => suma + item.cantidad, 0);
  const { items } = await obtenerCarrito();
  return items.reduce((suma, item) => suma + item.cantidad, 0);
}

async function guardarItemLocal(producto, cantidad) {
  const actual = await obtenerProducto(producto.id);
  if (cantidad > actual.stock) throw new Error(`Solo hay ${actual.stock} unidades disponibles.`);
  const items = leerCarritoLocal().filter(item => item.id !== actual.id);
  if (cantidad > 0) {
    items.push({ id: actual.id, nombre: actual.nombre, precio: actual.precio, imagen: actual.imagen, stock: actual.stock, cantidad });
  }
  guardarAlmacenamiento(CLAVE_CARRITO, items);
}

export async function agregarAlCarrito(producto, cantidad = 1) {
  const usuario = obtenerUsuario();
  if (usuario) {
    await api(`/api/clientes/${usuario.id}/carrito/items`, { method: 'POST', body: { productoId: producto.id, cantidad } });
  } else {
    const existente = leerCarritoLocal().find(item => item.id === producto.id);
    await guardarItemLocal(producto, (existente?.cantidad || 0) + cantidad);
  }
  avisarCarrito();
}

export async function establecerCantidad(productoId, cantidad) {
  if (cantidad <= 0) return quitarDelCarrito(productoId);
  const usuario = obtenerUsuario();
  if (usuario) {
    await api(`/api/clientes/${usuario.id}/carrito/items/${productoId}`, { method: 'PUT', body: { productoId, cantidad } });
  } else {
    await guardarItemLocal({ id: productoId }, cantidad);
  }
  avisarCarrito();
}

export async function quitarDelCarrito(productoId) {
  const usuario = obtenerUsuario();
  if (usuario) {
    await api(`/api/clientes/${usuario.id}/carrito/items/${productoId}`, { method: 'DELETE' });
  } else {
    guardarAlmacenamiento(CLAVE_CARRITO, leerCarritoLocal().filter(item => item.id !== productoId));
  }
  avisarCarrito();
}

export async function vaciarCarrito() {
  const usuario = obtenerUsuario();
  if (usuario) await api(`/api/clientes/${usuario.id}/carrito`, { method: 'DELETE' });
  else localStorage.removeItem(CLAVE_CARRITO);
  avisarCarrito();
}

// Traslada los artículos del carrito de invitado al carrito del cliente que inicia sesión.
export async function fusionarCarritoLocal() {
  const usuario = obtenerUsuario();
  const items = leerCarritoLocal();
  if (!usuario || !items.length) return;
  const pendientes = [];
  for (const item of items) {
    try {
      await api(`/api/clientes/${usuario.id}/carrito/items`, { method: 'POST', body: { productoId: item.id, cantidad: item.cantidad } });
    } catch {
      pendientes.push(item);
    }
  }
  if (pendientes.length) guardarAlmacenamiento(CLAVE_CARRITO, pendientes);
  else localStorage.removeItem(CLAVE_CARRITO);
  avisarCarrito();
}

// ---------- Boletas / pedidos ----------

export function normalizarBoleta(boleta) {
  const fecha = new Date(boleta.fecha);
  return {
    id: boleta.id,
    fecha: Number.isNaN(fecha.getTime()) ? String(boleta.fecha ?? '') : fecha.toLocaleDateString('es-CL'),
    estado: boleta.estado || '',
    subtotal: Number(boleta.subtotal || 0),
    impuestos: Number(boleta.impuestos ?? boleta.impuesto ?? 0),
    total: Number(boleta.total || 0)
  };
}

export async function crearBoleta(clienteId, { metodoPago, direccion }) {
  const boleta = await api(`/api/clientes/${clienteId}/boletas`, { method: 'POST', body: { metodoPago, direccion } });
  avisarCarrito();
  return normalizarBoleta(boleta || {});
}

export async function listarBoletas(clienteId) {
  const datos = await api(`/api/clientes/${clienteId}/boletas`);
  return (Array.isArray(datos) ? datos : []).map(normalizarBoleta);
}

// ---------- Blogs ----------

export function normalizarBlog(blog) {
  return {
    id: blog.id,
    titulo: blog.nombre ?? blog.titulo ?? '',
    descripcion: blog.descripcion || '',
    contenido: blog.contenido || '',
    imagen: blog.linkImagen ?? blog.imagen ?? blog.imagenUrl ?? ''
  };
}

export async function listarBlogs() {
  const datos = await api('/api/blogs');
  return (Array.isArray(datos) ? datos : []).map(normalizarBlog);
}

export async function obtenerBlog(id) {
  return normalizarBlog(await api(`/api/blogs/${id}`));
}
