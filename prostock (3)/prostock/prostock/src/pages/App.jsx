import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from '../components/ProductCard.jsx';
import { SiteFooter } from '../components/SiteFooter.jsx';
import { SiteHeader } from '../components/SiteHeader.jsx';

function useProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      try {
        const savedProducts = localStorage.getItem('productos_db');
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts);
          if (!Array.isArray(parsedProducts)) {
            throw new Error('El inventario guardado no tiene un formato válido.');
          }
          if (active) setProducts(parsedProducts);
          return;
        }

        const response = await fetch(`${import.meta.env.BASE_URL}data/productos.json`);
        if (!response.ok) throw new Error('No se pudo cargar el catálogo de productos.');
        const initialProducts = await response.json();
        localStorage.setItem('productos_db', JSON.stringify(initialProducts));
        if (active) setProducts(initialProducts);
      } catch (loadError) {
        if (active) setError(loadError.message);
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  return { products, error };
}

function ProductCatalog({ featuredOnly = false }) {
  const { products, error } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const categories = useMemo(
    () => [...new Set(products.map(product => product.categoria))].sort(),
    [products]
  );
  const visibleProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('es');
    return products
      .filter(product => !category || product.categoria === category)
      .filter(product => !query || `${product.nombre} ${product.codigo}`.toLocaleLowerCase('es').includes(query))
      .slice(0, featuredOnly ? 8 : undefined);
  }, [category, featuredOnly, products, search]);

  return (
    <section className="container my-5">
      <div className="row align-items-end g-3 mb-4">
        <div className="col-md">
          <p className="text-primary text-uppercase small fw-bold mb-1">
            {featuredOnly ? 'Selección Prostock' : 'Encuentra lo que necesitas'}
          </p>
          <h2 className="mb-0">{featuredOnly ? 'Productos destacados' : 'Catálogo de Productos'}</h2>
        </div>
        <div className="col-md-8 col-lg-7">
          <div className="row g-2">
            <div className="col-sm">
              <label className="visually-hidden" htmlFor="product-search">Buscar productos</label>
              <input
                id="product-search"
                className="form-control"
                type="search"
                placeholder="Buscar por nombre o código..."
                value={search}
                onChange={event => setSearch(event.target.value)}
              />
            </div>
            <div className="col-sm-5">
              <label className="visually-hidden" htmlFor="product-category">Filtrar por categoría</label>
              <select
                id="product-category"
                className="form-select"
                value={category}
                onChange={event => setCategory(event.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categories.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="alert alert-danger" role="alert">{error}</div>
      ) : products.length === 0 ? (
        <p className="text-muted" role="status">Cargando productos...</p>
      ) : visibleProducts.length ? (
        <div className="row g-4">
          {visibleProducts.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <p className="text-muted text-center py-5">No se encontraron productos.</p>
      )}
    </section>
  );
}

function HomePage() {
  return (
    <>
      <SiteHeader activePage="home" />
      <div className="home-notice">
        <div className="container d-flex flex-wrap justify-content-center gap-4 gap-md-5">
          <span><i className="bi bi-truck" /> Despachos rápidos</span>
          <span><i className="bi bi-box-seam" /> Stock actualizado</span>
          <span><i className="bi bi-shield-check" /> Compra segura</span>
        </div>
      </div>
      <header className="home-hero mb-5">
        <div className="container">
          <div className="home-hero-content">
            <p className="home-hero-kicker">PROSTOCK / TIENDA ONLINE</p>
            <h1>Todo para tu oficina, en un solo lugar.</h1>
            <p className="home-hero-copy">Encuentra papelería, artículos escolares e insumos para mantener tu día en movimiento.</p>
            <a href="productos.html" className="btn btn-warning btn-lg fw-bold mt-3">
              Comprar ahora <i className="bi bi-arrow-right ms-2" />
            </a>
          </div>
        </div>
      </header>
      <ProductCatalog featuredOnly />
      <SiteFooter />
    </>
  );
}

function ProductsPage() {
  return (
    <>
      <SiteHeader activePage="products" />
      <main className="flex-grow-1">
        <ProductCatalog />
      </main>
      <SiteFooter />
    </>
  );
}

export function App() {
  return window.location.pathname.endsWith('/productos.html')
    ? <ProductsPage />
    : <HomePage />;
}
