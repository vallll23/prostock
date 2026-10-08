import { Link } from 'react-router-dom';

export function TarjetaProducto({ product }) {
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('carrito') || '[]');
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      if (existingItem.cantidad >= product.stock) {
        window.alert(`Solo hay ${product.stock} unidades disponibles.`);
        return;
      }
      existingItem.cantidad += 1;
    } else {
      cart.push({ ...product, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <article className="col-sm-6 col-lg-4 col-xl-3">
      <div className="card product-card h-100 shadow-sm border-0">
        <Link to={`/detalle-producto?id=${product.id}`} className="text-decoration-none">
          <img
            src={product.imagen}
            className="card-img-top product-card-image"
            alt={product.nombre}
            loading="lazy"
          />
        </Link>
        <div className="card-body d-flex flex-column">
          <span className="badge bg-light text-secondary align-self-start mb-2">{product.categoria}</span>
          <h2 className="h6 card-title">
            <Link to={`/detalle-producto?id=${product.id}`} className="text-dark text-decoration-none">
              {product.nombre}
            </Link>
          </h2>
          <p className="small text-muted mb-2">Código: {product.codigo}</p>
          <p className="fw-bold text-primary fs-5 mt-auto mb-3">
            ${Number(product.precio).toLocaleString('es-CL')}
          </p>
          <button type="button" className="btn btn-primary w-100" onClick={addToCart} disabled={product.stock <= 0}>
            {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
          </button>
        </div>
      </div>
    </article>
  );
}
