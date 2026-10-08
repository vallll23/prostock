import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DisenoFormularioAdministracion, DisenoAdministracion, categories, usarAccesoAdministracion, usarInventarioProductos } from './CompartidoAdministracion.jsx';
import { formatearPrecio, leerAlmacenamiento, guardarAlmacenamiento } from '../utilidades/almacenamiento.js';

export function FormularioProductoAdministracion() {
  const navigate = useNavigate();
  const ready = usarAccesoAdministracion();
  const { products, saveProducts, error } = usarInventarioProductos();
  const productId = new URLSearchParams(window.location.search).get('id');
  const existing = products.find(item => item.id === Number(productId));
  const [form, setForm] = useState(null);
  const [alert, setAlert] = useState('');

  useEffect(() => {
    if (!form && (products.length || !productId)) {
      setForm(existing ? {
        codigo: existing.codigo || '',
        nombre: existing.nombre || '',
        categoria: existing.categoria || '',
        precio: String(existing.precio ?? ''),
        stock: String(existing.stock ?? ''),
        imagenes: (existing.imagenes?.length ? existing.imagenes : existing.imagen ? [existing.imagen] : []).join('\n')
      } : { codigo: '', nombre: '', categoria: '', precio: '', stock: '', imagenes: '' });
    }
  }, [existing, form, productId, products.length]);

  if (!ready) return null;
  if (!form) return <DisenoFormularioAdministracion><p role="status">Cargando producto...</p>{error && <p className="text-danger">{error}</p>}</DisenoFormularioAdministracion>;

  const updateField = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const submit = event => {
    event.preventDefault();
    const code = form.codigo.trim().toUpperCase();
    const name = form.nombre.trim();
    const price = Number(form.precio);
    const stock = Number(form.stock);
    const images = form.imagenes.split('\n').map(image => image.trim()).filter(Boolean);

    if (!code || !name || price <= 0 || stock < 0 || !Number.isFinite(price) || !Number.isFinite(stock)) {
      setAlert('Ingresa código y nombre, un precio mayor a cero y un stock válido.');
      return;
    }
    if (products.some(product => product.codigo.toUpperCase() === code && product.id !== Number(productId))) {
      setAlert('Ya existe un producto con ese código.');
      return;
    }
    if (!images.length) {
      setAlert('Debes ingresar al menos una imagen.');
      return;
    }
    const savedProduct = {
      id: productId ? Number(productId) : Date.now(),
      codigo: code,
      nombre: name,
      categoria: form.categoria,
      precio: price,
      stock,
      imagenes: images,
      imagen: images[0]
    };
    const nextProducts = productId
      ? products.map(product => product.id === Number(productId) ? savedProduct : product)
      : [...products, savedProduct];
    saveProducts(nextProducts);
    navigate('/admin/productos');
  };

  return (
    <DisenoFormularioAdministracion>
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h1 className="h4 mb-4">Administrar Producto</h1>
          {(error || alert) && <div className="alert alert-danger" role="alert">{alert || error}</div>}
          <form onSubmit={submit}>
            <div className="mb-3"><label className="form-label" htmlFor="product-code">Código del Producto</label><input id="product-code" name="codigo" className="form-control" required placeholder="Ej: PRI-101" value={form.codigo} onChange={updateField} /></div>
            <div className="mb-3"><label className="form-label" htmlFor="product-name">Nombre del Producto</label><input id="product-name" name="nombre" className="form-control" required placeholder="Ej: Resma Papel A4" value={form.nombre} onChange={updateField} /></div>
            <div className="mb-3"><label className="form-label" htmlFor="product-category">Categoría</label><select id="product-category" name="categoria" className="form-select" required value={form.categoria} onChange={updateField}><option value="">Seleccione...</option>{categories.map(category => <option key={category}>{category}</option>)}</select></div>
            <div className="row">
              <div className="col-md-6 mb-3"><label className="form-label" htmlFor="product-price">Precio ($)</label><input id="product-price" name="precio" type="number" min="1" className="form-control" required value={form.precio} onChange={updateField} /></div>
              <div className="col-md-6 mb-3"><label className="form-label" htmlFor="product-stock">Stock</label><input id="product-stock" name="stock" type="number" min="0" className="form-control" required value={form.stock} onChange={updateField} /></div>
            </div>
            <div className="mb-3"><label className="form-label" htmlFor="product-images">Imágenes del producto</label><textarea id="product-images" name="imagenes" className="form-control" rows="3" required placeholder={'Una URL o ruta por línea\nimg/productos/PRI-101.jpg\nhttps://ejemplo.com/segunda-foto.jpg'} value={form.imagenes} onChange={updateField} /><small className="text-muted">Agrega una ruta o URL por línea para crear el carrusel.</small></div>
            <div className="d-flex justify-content-between pt-2"><Link to="/admin/productos" className="btn btn-outline-secondary">Cancelar</Link><button type="submit" className="btn btn-success">Guardar Producto</button></div>
          </form>
        </div>
      </div>
    </DisenoFormularioAdministracion>
  );
}
