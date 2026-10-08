import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obtenerUsuario } from '../servicios/sesion.js';
import { eliminarProducto, listarProductos } from '../servicios/tienda.js';

export const menu = [
  { to: '/admin', label: 'Dashboard', page: 'dashboard' },
  { to: '/admin/productos', label: 'Productos', page: 'products' },
  { to: '/admin/usuarios', label: 'Usuarios', page: 'users' },
  { to: '/admin/mensajes', label: 'Mensajes', page: 'messages' }
];

export const categories = ['Papelería y Oficina', 'Escolar', 'Aseo y Limpieza', 'Insumos'];

export function usarAccesoAdministracion() {
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const user = obtenerUsuario();
    if (!user || user.rol !== 'ADMIN') {
      window.alert('Acceso restringido solo para Administradores.');
      navigate('/login', { replace: true });
      return;
    }
    setReady(true);
  }, [navigate]);
  return ready;
}

export function usarInventarioProductos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const recargar = useCallback(async () => {
    try {
      setProducts(await listarProductos());
      setError('');
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  const removeProduct = async id => {
    try {
      await eliminarProducto(id);
      setProducts(current => current.filter(product => product.id !== id));
    } catch (removeError) {
      window.alert(removeError.message);
    }
  };

  return { products, loading, error, recargar, removeProduct };
}

export function DisenoAdministracion({ activePage, children }) {
  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/admin">
            <img src="/img/logo-prostock.svg" className="brand-logo" alt="Prostock" /> <span className="admin-label">ADMIN</span>
          </Link>
          <Link to="/" className="btn btn-outline-light btn-sm">Volver a la Tienda</Link>
        </div>
      </nav>
      <main className="container-fluid my-4">
        <div className="row">
          <aside className="col-md-3 col-lg-2 mb-3">
            <nav className="list-group shadow-sm" aria-label="Administración">
              {menu.map(item => (
                <Link key={item.page} to={item.to} className={`list-group-item list-group-item-action${activePage === item.page ? ' active' : ''}`} aria-current={activePage === item.page ? 'page' : undefined}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <section className="col-md-9 col-lg-10">{children}</section>
        </div>
      </main>
    </div>
  );
}

export function DisenoFormularioAdministracion({ children }) {
  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/admin">
            <img src="/img/logo-prostock.svg" className="brand-logo" alt="Prostock" /> <span className="admin-label">ADMIN</span>
          </Link>
          <Link className="btn btn-outline-light btn-sm" to="/admin">Volver al panel</Link>
        </div>
      </nav>
      <main className="container my-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
