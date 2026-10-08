import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DisenoFormularioAdministracion, DisenoAdministracion, categories, usarAccesoAdministracion, usarInventarioProductos } from './CompartidoAdministracion.jsx';
import { formatearPrecio, leerAlmacenamiento, guardarAlmacenamiento } from '../utilidades/almacenamiento.js';

export function PanelAdministracion() {
  const ready = usarAccesoAdministracion();
  const { products, error } = usarInventarioProductos();
  const users = leerAlmacenamiento('usuarios_db');
  const orders = leerAlmacenamiento('pedidos_db');
  const messages = leerAlmacenamiento('mensajes_contacto_db');

  if (!ready) return null;
  const stats = [
    { title: 'Productos Totales', value: products.length, color: 'primary', icon: 'bi-box-seam' },
    { title: 'Usuarios Registrados', value: users.length, color: 'success', icon: 'bi-people' },
    { title: 'Acciones Rápidas', value: <Link to="/admin/producto" className="btn btn-sm btn-dark mt-2">+ Nuevo Producto</Link>, color: 'warning', icon: 'bi-lightning-charge' },
    { title: 'Pedidos', value: orders.length, color: 'info', icon: 'bi-bag-check' },
    { title: 'Mensajes pendientes', value: messages.filter(message => !message.atendido).length, color: 'secondary', icon: 'bi-envelope' },
    { title: 'Ventas totales', value: formatearPrecio(orders.reduce((sum, order) => sum + Number(order.total || 0), 0)), color: 'dark', icon: 'bi-cash-stack' }
  ];

  return (
    <DisenoAdministracion activePage="dashboard">
      <h1 className="h3 mb-4">Panel de Control</h1>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="row g-3">
        {stats.map(stat => (
          <div className="col-md-6 col-xl-4" key={stat.title}>
            <article className={`card h-100 border-0 shadow-sm bg-${stat.color} ${['warning', 'info'].includes(stat.color) ? 'text-dark' : 'text-white'} p-3`}>
              <div className="d-flex justify-content-between align-items-center">
                <div><h2 className="h6 text-uppercase mb-1">{stat.title}</h2><div className="fs-2 fw-bold">{stat.value}</div></div>
                <i className={`bi ${stat.icon} fs-1`} aria-hidden="true" />
              </div>
            </article>
          </div>
        ))}
      </div>
    </DisenoAdministracion>
  );
}
