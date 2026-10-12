import { Link, useLocation } from 'react-router-dom';
import { DisenoPublico } from './CompartidoTienda.jsx';

export function PagoError() {
  const { state } = useLocation();
  return (
    <DisenoPublico activePage="cart">
      <div className="text-center py-5">
        <i className="bi bi-x-circle-fill text-danger display-3" />
        <h1 className="h2 fw-bold mt-2">No se pudo realizar el pago</h1>
        <p className="text-muted">{state?.mensaje || 'Ocurrió un problema al procesar tu pedido.'}</p>
        <p className="small text-muted">Tu carrito no fue modificado.</p>
        <Link to="/checkout" className="btn btn-primary me-2">Reintentar</Link>
        <Link to="/carrito" className="btn btn-outline-secondary">Volver al carrito</Link>
      </div>
    </DisenoPublico>
  );
}