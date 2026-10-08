import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Inicio } from './Inicio.jsx';
import { Productos } from './Productos.jsx';
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

function RutasAplicacion() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/productos" element={<Productos />} />
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
