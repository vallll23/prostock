import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { TarjetaProducto } from '../componentes/TarjetaProducto.jsx';
import { listarProductos } from '../servicios/tienda.js';

export function usarProductos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    listarProductos()
      .then(items => activo && setProducts(items))
      .catch(loadError => activo && setError(loadError.message))
      .finally(() => activo && setLoading(false));
    return () => {
      activo = false;
    };
  }, []);

  return { products, loading, error };
}

export function ProductosDestacados({ products }) {
  const trackRef = useRef(null);
  const sponsored = products.slice(0, 8);

  if (!sponsored.length) return null;
  return (
    <section className="sponsored-section mb-5" aria-label="Productos patrocinados">
      <div className="container">
        <div className="sponsored-heading">
          <div>
            <p className="text-primary text-uppercase small fw-bold mb-1">Recomendados para ti</p>
            <h2 className="h3 mb-0">Productos patrocinados</h2>
          </div>
          <div className="sponsored-controls">
            <button type="button" className="sponsored-arrow" aria-label="Productos anteriores" onClick={() => trackRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}><i className="bi bi-chevron-left" /></button>
            <button type="button" className="sponsored-arrow" aria-label="Productos siguientes" onClick={() => trackRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}><i className="bi bi-chevron-right" /></button>
          </div>
        </div>
        <div ref={trackRef} className="sponsored-track">
          {sponsored.map(product => (
            <article className="sponsored-card" key={product.id}>
              <Link to={`/detalle-producto?id=${product.id}`} className="sponsored-image-link">
                <img src={product.imagen} alt={product.nombre} loading="lazy" />
              </Link>
              <div className="sponsored-card-body">
                <span className="sponsored-category">{product.categoria}</span>
                <h3><Link to={`/detalle-producto?id=${product.id}`}>{product.nombre}</Link></h3>
                <strong>{`$${Number(product.precio).toLocaleString('es-CL')}`}</strong>
                <span className="sponsored-provider">Prostock</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CatalogoProductos({ featuredOnly = false, showHomeSections = false }) {
  const { products, loading, error } = usarProductos();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [activeTab, setActiveTab] = useState('');
  const categories = useMemo(
    () => [...new Set(products.map(product => product.categoria))].sort(),
    [products]
  );
  useEffect(() => {
    if (showHomeSections && categories.length && !activeTab) setActiveTab(categories[0]);
  }, [activeTab, categories, showHomeSections]);
  const visibleProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('es');
    return products
      .filter(product => {
        const selectedCategory = showHomeSections
          ? activeTab === 'all' ? '' : activeTab || category
          : category;
        return !selectedCategory || product.categoria === selectedCategory;
      })
      .filter(product => !query || `${product.nombre} ${product.codigo}`.toLocaleLowerCase('es').includes(query))
      .slice(0, featuredOnly ? 8 : undefined);
  }, [activeTab, category, featuredOnly, products, search, showHomeSections]);

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
                onChange={event => {
                  setCategory(event.target.value);
                  if (showHomeSections) setActiveTab(event.target.value || 'all');
                }}
              >
                <option value="">Todas las categorías</option>
                {categories.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {showHomeSections && (
        <section className="home-categories mb-5" aria-label="Productos por categorías">
          <p className="text-primary text-uppercase small fw-bold mb-2 text-center">Compra por categoría</p>
          <h2 className="home-category-title">Productos por categorías</h2>
          <p className="home-category-intro">Encuentra todo lo que necesitas para tu oficina, colegio y empresa.</p>
          <div className="home-category-tabs" role="tablist" aria-label="Categorías de productos">
            {categories.map(item => (
              <button
                type="button"
                key={item}
                className={`home-category-tab${activeTab === item ? ' active' : ''}`}
                role="tab"
                aria-selected={activeTab === item}
                onClick={() => {
                  setActiveTab(item);
                  setCategory(item);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      )}

      {error ? (
        <div className="alert alert-danger" role="alert">{error}</div>
      ) : loading ? (
        <p className="text-muted" role="status">Cargando productos...</p>
      ) : visibleProducts.length ? (
        <div className="row g-4">
          {visibleProducts.map(product => <TarjetaProducto key={product.id} product={product} />)}
        </div>
      ) : (
        <p className="text-muted text-center py-5">No se encontraron productos.</p>
      )}
      {showHomeSections && <ProductosDestacados products={products} />}
    </section>
  );
}
