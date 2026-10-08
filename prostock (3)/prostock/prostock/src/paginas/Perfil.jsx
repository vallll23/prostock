import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieSitio } from '../componentes/PieSitio.jsx';
import { EncabezadoSitio } from '../componentes/EncabezadoSitio.jsx';
import { formatearPrecio, leerAlmacenamiento } from '../utilidades/almacenamiento.js';

export function Perfil() {
  const navigate = useNavigate();
  const user = leerAlmacenamiento('usuarioActivo', null);
  useEffect(() => {
    if (!user) navigate('/login', { replace: true });
  }, [navigate, user]);

  if (!user) return null;
  const initials = (user.nombre || 'Usuario').split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'US';
  const orders = leerAlmacenamiento('pedidos_db').filter(order => order.usuarioId === user.id);
  const profileFields = [
    ['RUN', user.run || 'No registrado'],
    ['Correo Electrónico', user.email || 'No registrado'],
    ['Región', user.region || 'No registrada'],
    ['Comuna', user.comuna || 'No registrada'],
    ['Dirección de Despacho', user.direccion || 'No registrada']
  ];

  const signOut = () => {
    localStorage.removeItem('usuarioActivo');
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
                  <tbody>{orders.length ? orders.map(order => <tr key={order.id}><td>#{order.id}</td><td>{order.fecha}</td><td>{formatearPrecio(order.total)}</td><td><span className="badge bg-success">{order.estado}</span></td></tr>) : <tr><td colSpan="4" className="text-center text-muted py-4">Aún no tienes compras registradas.</td></tr>}</tbody>
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
