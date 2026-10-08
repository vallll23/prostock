import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cerrarSesion, obtenerUsuario } from '../servicios/sesion.js';
import { contarCarrito } from '../servicios/tienda.js';

const navigation = [
  { to: '/', label: 'Inicio', page: 'home' },
  { to: '/productos', label: 'Productos', page: 'products' },
  { to: '/nosotros', label: 'Nosotros', page: 'about' },
  { to: '/blogs', label: 'Blog', page: 'blog' },
  { to: '/contacto', label: 'Contacto', page: 'contact' }
];

export function EncabezadoSitio({ activePage }) {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const refreshHeader = () => {
      setUser(obtenerUsuario());
      contarCarrito().then(setCartCount).catch(() => setCartCount(0));
    };

    refreshHeader();
    window.addEventListener('storage', refreshHeader);
    return () => window.removeEventListener('storage', refreshHeader);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/img/logo-prostock.svg" className="brand-logo" alt="Prostock" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={menuOpen}
          aria-label="Abrir navegación"
          onClick={() => setMenuOpen(open => !open)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse${menuOpen ? ' show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            {navigation.map(({ to, label, page }) => (
              <li className="nav-item" key={page}>
                <Link
                  className={`nav-link${activePage === page ? ' active' : ''}`}
                  aria-current={activePage === page ? 'page' : undefined}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="d-flex align-items-center gap-3">
            <Link to="/carrito" className="btn btn-outline-light position-relative" aria-label={`Carrito: ${cartCount} productos`}>
              <i className="bi bi-cart3" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
              </span>
            </Link>
            {user ? (
              <>
                <Link to="/perfil" className="text-white small text-decoration-none">
                  <i className="bi bi-person-circle" /> {user.nombre}
                </Link>
                {user.rol === 'ADMIN' && <Link to="/admin" className="badge bg-warning text-dark text-decoration-none">Panel Admin</Link>}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light"
                  onClick={() => {
                    cerrarSesion();
                    navigate('/');
                  }}
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-outline-light">Ingresar</Link>
                <Link to="/registro" className="btn btn-sm btn-primary">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
