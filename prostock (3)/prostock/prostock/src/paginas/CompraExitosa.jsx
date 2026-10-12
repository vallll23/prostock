import { Link, useLocation } from 'react-router-dom';
import { DisenoPublico } from './CompartidoTienda.jsx';
import { formatearPrecio } from '../utilidades/almacenamiento.js';

export function CompraExitosa() {
  const { state } = useLocation();
  const boleta = state?.boleta;
  const items = state?.items || [];

  if (!boleta) {
    return (
      <DisenoPublico activePage="cart">
        <div className="text-center py-5">
          <p className="text-muted">No hay una compra reciente para mostrar.</p>
          <Link to="/productos" className="btn btn-primary">Ver productos</Link>
        </div>
      </DisenoPublico>
    );
  }

  return (
    <DisenoPublico activePage="cart">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="text-center mb-4">
            <i className="bi bi-check-circle-fill text-success display-3" />
            <h1 className="h2 fw-bold mt-2">¡Compra exitosa!</h1>
            <p className="text-muted">Tu pedido fue registrado correctamente.</p>
          </div>
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h2 className="h5 fw-bold border-bottom pb-2">Resumen de la orden{boleta.id ? ` N° ${boleta.id}` : ''}</h2>
              {boleta.fecha && <p className="mb-1"><strong>Fecha:</strong> {boleta.fecha}</p>}
              {boleta.estado && <p className="mb-1"><strong>Estado:</strong> {boleta.estado}</p>}
              {boleta.direccion && <p className="mb-1"><strong>Dirección de despacho:</strong> {boleta.direccion}</p>}
              {boleta.metodoPago && <p className="mb-3"><strong>Método de pago:</strong> {boleta.metodoPago}</p>}
              <ul className="list-unstyled mb-3">
                {items.map(item => (
                  <li className="d-flex justify-content-between small py-1" key={item.id}>
                    <span>{item.nombre} × {item.cantidad}</span>
                    <span>{formatearPrecio(item.precio * item.cantidad)}</span>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between"><span>Subtotal:</span><span>{formatearPrecio(boleta.subtotal)}</span></div>
              <div className="d-flex justify-content-between"><span>IVA:</span><span>{formatearPrecio(boleta.impuestos)}</span></div>
              <hr />
              <div className="d-flex justify-content-between fs-5 fw-bold"><span>Total:</span><span className="text-primary">{formatearPrecio(boleta.total)}</span></div>
            </div>
          </div>
          <div className="d-flex gap-2 justify-content-center mt-4">
            <Link to="/perfil" className="btn btn-outline-primary">Ver mis pedidos</Link>
            <Link to="/productos" className="btn btn-primary">Seguir comprando</Link>
          </div>
        </div>
      </div>
    </DisenoPublico>
  );
}