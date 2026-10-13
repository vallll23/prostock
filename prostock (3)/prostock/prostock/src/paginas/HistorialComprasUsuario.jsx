import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DisenoAdministracion, usarAccesoAdministracion } from './CompartidoAdministracion.jsx';
import { formatearPrecio } from '../utilidades/almacenamiento.js';
import { listarBoletas, obtenerCliente } from '../servicios/tienda.js';

export function HistorialComprasUsuario() {
  const ready = usarAccesoAdministracion();
  const { clienteId } = useParams();
  const [cliente, setCliente] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return undefined;
    let activo = true;
    Promise.all([obtenerCliente(clienteId), listarBoletas(clienteId)])
      .then(([user, boletas]) => {
        if (!activo) return;
        setCliente(user);
        setOrders(boletas);
      })
      .catch(loadError => activo && setError(loadError.message))
      .finally(() => activo && setLoading(false));
    return () => {
      activo = false;
    };
  }, [clienteId, ready]);

  if (!ready) return null;
  return (
    <DisenoAdministracion activePage="users">
      <Link to="/admin/usuarios" className="text-decoration-none">← Volver a usuarios</Link>
      <h1 className="h3 mt-3 mb-1">Historial de compras</h1>
      {cliente && <p className="text-muted">{cliente.nombre} · {cliente.email}</p>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="card border-0 shadow-sm">
        <div className="table-responsive"><table className="table table-hover align-middle mb-0">
          <thead className="table-dark"><tr><th>Boleta</th><th>Fecha</th><th>Estado</th><th>Dirección</th><th>Total</th></tr></thead>
          <tbody>{orders.map(order => <tr key={order.id}><td>#{order.id}</td><td>{order.fecha}</td><td>{order.estado}</td><td>{order.direccion || '—'}</td><td>{formatearPrecio(order.total)}</td></tr>)}
            {!orders.length && <tr><td colSpan="5" className="text-center text-muted py-4">{loading ? 'Cargando historial...' : 'Este usuario no tiene compras registradas.'}</td></tr>}
          </tbody>
        </table></div>
      </div>
    </DisenoAdministracion>
  );
}
