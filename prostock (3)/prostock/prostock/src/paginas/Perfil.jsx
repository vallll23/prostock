import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieSitio } from '../componentes/PieSitio.jsx';
import { EncabezadoSitio } from '../componentes/EncabezadoSitio.jsx';
import { formatearPrecio } from '../utilidades/almacenamiento.js';
import { cerrarSesion, guardarUsuario, obtenerUsuario } from '../servicios/sesion.js';
import { listarBoletas, obtenerCliente } from '../servicios/tienda.js';

export function Perfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => obtenerUsuario());
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const sessionId = user?.id;

  useEffect(() => {
    if (sessionId === undefined) {
      navigate('/login', { replace: true });
      return undefined;
    }
    let activo = true;
    Promise.all([obtenerCliente(sessionId), listarBoletas(sessionId)])
      .then(([client, boletas]) => {
        if (!activo) return;
        guardarUsuario(client);
        setUser(obtenerUsuario());
        setOrders(boletas);
      })
      .catch(loadError => activo && setError(loadError.message))
      .finally(() => activo && setLoading(false));
    return () => {
      activo = false;
    };
  }, [navigate, sessionId]);

  if (!user) return null;
  const initials = (user.nombre || 'Usuario').split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'US';
  const profileFields = [
    ['Teléfono', user.telefono || 'No registrado'],
    ['Correo Electrónico', user.email || 'No registrado'],
    ['Región', user.region || 'No registrada'],
    ['Comuna', user.comuna || 'No registrada'],
    ['Dirección de Despacho', user.direccion || 'No registrada']
  ];

  const signOut = () => {
    cerrarSesion();
    navigate('/');
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <EncabezadoSitio />
      <main className="container my-5 flex-grow-1">
        <div className="row g-4">
          <aside className="col-md-4">
            <div className="card shadow-sm text-center p-4">
              <div className="mb-3"><div className="bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: 80, height: 80, fontSize: 32 }}>{initials}</div></div>
              <h1 className="h5 fw-bold mb-1">{user.nombre}</h1>
              <p className="text-muted small mb-3">{user.rol === 'ADMIN' ? 'Administrador' : 'Cliente registrado'}</p>
              <button type="button" className="btn btn-outline-danger btn-sm w-100" onClick={signOut}>Cerrar Sesión</button>
            </div>
          </aside>
          <div className="col-md-8">
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <section className="card shadow-sm mb-4">
              <h2 className="card-header bg-white h6 fw-bold">Información Personal</h2>
              <div className="card-body"><div className="row g-3">
                {profileFields.map(([label, value]) => <div className={label === 'Dirección de Despacho' ? 'col-12' : 'col-md-6'} key={label}><span className="form-label text-muted small mb-0 d-block">{label}</span><p className="fw-bold mb-0">{value}</p></div>)}
              </div></div>
            </section>
            <section className="card shadow-sm">
              <h2 className="card-header bg-white h6 fw-bold">Historial de Compras Recientes</h2>
              <div className="table-responsive">
                <table className="table mb-0 align-middle">
                  <thead className="table-light"><tr><th>N° Pedido</th><th>Fecha</th><th>Total</th><th>Estado</th></tr></thead>
                  <tbody>{orders.length ? orders.map(order => <tr key={order.id}><td>#{order.id}</td><td>{order.fecha}</td><td>{formatearPrecio(order.total)}</td><td><span className="badge bg-success">{order.estado}</span></td></tr>) : <tr><td colSpan="4" className="text-center text-muted py-4">{loading ? 'Cargando pedidos...' : 'Aún no tienes compras registradas.'}</td></tr>}</tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>
      <PieSitio />
    </div>
  );
}
