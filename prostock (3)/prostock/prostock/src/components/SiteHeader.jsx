import { useEffect, useState } from 'react';

const navigation = [
  { href: 'index.html', label: 'Inicio', page: 'home' },
  { href: 'productos.html', label: 'Productos', page: 'products' },
  { href: 'nosotros.html', label: 'Nosotros', page: 'about' },
  { href: 'blogs.html', label: 'Blog', page: 'blog' },
  { href: 'contacto.html', label: 'Contacto', page: 'contact' }
];

export function SiteHeader({ activePage }) {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const refreshHeader = () => {
      const cart = JSON.parse(localStorage.getItem('carrito') || '[]');
      setCartCount(cart.reduce((count, item) => count + Number(item.cantidad || 0), 0));
      setUser(JSON.parse(localStorage.getItem('usuarioActivo') || 'null'));
    };

    refreshHeader();
    window.addEventListener('storage', refreshHeader);
    return () => window.removeEventListener('storage', refreshHeader);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <a className="navbar-brand" href="index.html">
          <img src="img/logo-prostock.svg" className="brand-logo" alt="Prostock" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Abrir navegación"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {navigation.map(({ href, label, page }) => (
              <li className="nav-item" key={page}>
                <a
                  className={`nav-link${activePage === page ? ' active' : ''}`}
                  aria-current={activePage === page ? 'page' : undefined}
                  href={href}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="d-flex align-items-center gap-3">
            <a href="carrito.html" className="btn btn-outline-light position-relative" aria-label={`Carrito: ${cartCount} productos`}>
              <i className="bi bi-cart3" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
              </span>
            </a>
            {user ? (
              <a href="perfil.html" className="text-white small text-decoration-none">{user.nombre}</a>
            ) : (
              <a href="login.html" className="btn btn-sm btn-outline-light">Ingresar</a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
