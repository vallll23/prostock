import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Inicio } from './Inicio.jsx';
import { Productos } from './Productos.jsx';
import { Ofertas } from './Ofertas.jsx';
import { Checkout } from './Checkout.jsx';
import { CompraExitosa } from './CompraExitosa.jsx';
import { PagoError } from './PagoError.jsx';
import { AcercaDeNosotros } from './AcercaDeNosotros.jsx';
import { Blog } from './Blog.jsx';
import { DetalleBlog } from './DetalleBlog.jsx';
import { DetalleProducto } from './DetalleProducto.jsx';
import { Contacto } from './Contacto.jsx';
import { Carrito } from './Carrito.jsx';
import { IniciarSesion } from './IniciarSesion.jsx';
import { Registro } from './Registro.jsx';
import { Perfil } from './Perfil.jsx';
import { PanelAdministracion } from './PanelAdministracion.jsx';
import { ProductosAdministracion } from './ProductosAdministracion.jsx';
import { FormularioProductoAdministracion } from './FormularioProductoAdministracion.jsx';
import { UsuariosAdministracion } from './UsuariosAdministracion.jsx';
import { FormularioUsuarioAdministracion } from './FormularioUsuarioAdministracion.jsx';
import { MensajesAdministracion } from './MensajesAdministracion.jsx';
import { OrdenesAdministracion } from './OrdenesAdministracion.jsx';
import { HistorialComprasUsuario } from './HistorialComprasUsuario.jsx';
import { ProductosCriticos } from './ProductosCriticos.jsx';
import { CategoriasAdministracion } from './CategoriasAdministracion.jsx';
import { PerfilAdministracion } from './PerfilAdministracion.jsx';
import { ReportesAdministracion } from './ReportesAdministracion.jsx';

function RutasAplicacion() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/compra-exitosa" element={<CompraExitosa />} />
        <Route path="/pago-error" element={<PagoError />} />
        <Route path="/nosotros" element={<AcercaDeNosotros />} />
      <Route path="/blogs" element={<Blog />} />
      <Route path="/detalle-blog" element={<DetalleBlog />} />
      <Route path="/detalle-producto" element={<DetalleProducto />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/login" element={<IniciarSesion />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/admin" element={<PanelAdministracion />} />
      <Route path="/admin/ordenes" element={<OrdenesAdministracion />} />
      <Route path="/admin/usuarios/:clienteId/compras" element={<HistorialComprasUsuario />} />
      <Route path="/admin/stock-critico" element={<ProductosCriticos />} />
      <Route path="/admin/categorias" element={<CategoriasAdministracion />} />
      <Route path="/admin/perfil" element={<PerfilAdministracion />} />
      <Route path="/admin/reportes" element={<ReportesAdministracion />} />
      <Route path="/admin/productos" element={<ProductosAdministracion />} />
      <Route path="/admin/producto" element={<FormularioProductoAdministracion />} />
      <Route path="/admin/usuarios" element={<UsuariosAdministracion />} />
      <Route path="/admin/usuario" element={<FormularioUsuarioAdministracion />} />
      <Route path="/admin/mensajes" element={<MensajesAdministracion />} />
      <Route path="*" element={<Inicio />} />
    </Routes>
  );
}

export function Aplicacion() {
  return (
    <BrowserRouter>
      <RutasAplicacion />
    </BrowserRouter>
  );
}
