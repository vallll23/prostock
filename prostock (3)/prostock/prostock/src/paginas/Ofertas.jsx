import { useEffect, useState } from 'react';
import { TarjetaProducto } from '../componentes/TarjetaProducto.jsx';
import { DisenoPublico } from './CompartidoTienda.jsx';
import { listarOfertas } from '../servicios/tienda.js';

export function Ofertas() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    listarOfertas()
      .then(items => activo && setProducts(items))
      .catch(loadError => activo && setError(loadError.message))
      .finally(() => activo && setLoading(false));
    return () => {
      activo = false;
    };
  }, []);

  return (
    <DisenoPublico activePage="offers">
      <header className="text-center mb-5">
        <h1 className="fw-bold display-5">Ofertas</h1>
        <p className="text-muted">Productos con descuento por tiempo limitado.</p>
      </header>
      {error ? (
        <div className="alert alert-danger" role="alert">{error}</div>
      ) : loading ? (
        <p className="text-center text-muted" role="status">Cargando ofertas...</p>
      ) : products.length ? (
        <div className="row g-4">
          {products.map(product => <TarjetaProducto key={product.id} product={product} />)}
        </div>
      ) : (
        <p className="text-muted text-center py-5">No hay ofertas disponibles por ahora.</p>
      )}
    </DisenoPublico>
  );
}