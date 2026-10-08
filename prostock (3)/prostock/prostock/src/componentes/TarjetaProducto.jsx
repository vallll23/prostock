import { Link } from 'react-router-dom';
import { agregarAlCarrito } from '../servicios/tienda.js';

export function TarjetaProducto({ product }) {
  const addToCart = async () => {
    try {
      await agregarAlCarrito(product, 1);
    } catch (error) {
      window.alert(error.message);
    }
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
