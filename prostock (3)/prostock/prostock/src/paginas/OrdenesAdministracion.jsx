import { useEffect, useState } from 'react';
import { DisenoAdministracion, usarAccesoAdministracion } from './CompartidoAdministracion.jsx';
import { formatearPrecio } from '../utilidades/almacenamiento.js';
import { listarClientes, listarTodasLasBoletas } from '../servicios/tienda.js';

export function OrdenesAdministracion() {
  const ready = usarAccesoAdministracion();
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return undefined;
    let activo = true;
    listarClientes()
      .then(listarTodasLasBoletas)
      .then(items => activo && setOrders(items))
      .catch(loadError => activo && setError(loadError.message))
      .finally(() => activo && setLoading(false));
    return () => {
      activo = false;
    };
  }, [ready]);

  if (!ready) return null;
  return (
    <DisenoAdministracion activePage="orders">
      <h1 className="h3 mb-3">Gestión de Órdenes / Boletas</h1>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark"><tr><th>N°</th><th>Cliente</th><th>Fecha</th><th>Estado</th><th>Total</th><th>Detalle</th></tr></thead>
            <tbody>
              {orders.map(order => (
                <tr key={`${order.clienteId}-${order.id}`}>
                  <td>#{order.id}</td><td>{order.clienteNombre}<br /><small className="text-muted">{order.clienteEmail}</small></td>
                  <td>{order.fecha}</td><td><span className="badge bg-secondary">{order.estado || 'Sin estado'}</span></td>
                  <td>{formatearPrecio(order.total)}</td>
                  <td><button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setSelected(selected === order ? null : order)} aria-expanded={selected === order}>Ver detalle</button></td>
                </tr>
              ))}
              {!orders.length && <tr><td colSpan="6" className="text-center text-muted py-4">{loading ? 'Cargando boletas...' : 'No hay órdenes registradas.'}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {selected && (
        <section className="card border-0 shadow-sm mt-4" aria-label={`Detalle de la orden ${selected.id}`}>
          <div className="card-body">
            <h2 className="h5">Detalle de boleta #{selected.id}</h2>
            <p className="mb-1"><strong>Despacho:</strong> {selected.direccion || 'Sin dirección'}</p>
            <p className="mb-3"><strong>Método de pago:</strong> {selected.metodoPago || 'No informado'}</p>
            <div className="table-responsive"><table className="table table-sm">
              <thead><tr><th>Artículo</th><th>Cantidad</th><th>Precio unitario</th><th>Subtotal</th></tr></thead>
              <tbody>{selected.items.map((item, index) => <tr key={item.id ?? index}><td>{item.nombre || `Producto ${item.id}`}</td><td>{item.cantidad}</td><td>{formatearPrecio(item.precio)}</td><td>{formatearPrecio(item.subtotal)}</td></tr>)}
                {!selected.items.length && <tr><td colSpan="4" className="text-muted">El backend no incluyó el detalle de artículos en esta boleta.</td></tr>}
              </tbody>
            </table></div>
            <div className="text-end">
              <p className="mb-1">Subtotal: {formatearPrecio(selected.subtotal)}</p>
              <p className="mb-1">Impuestos: {formatearPrecio(selected.impuestos)}</p>
              <p className="fw-bold mb-0">Total: {formatearPrecio(selected.total)}</p>
            </div>
          </div>
        </section>
      )}
    </DisenoAdministracion>
  );
}
