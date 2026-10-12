import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DisenoPublico } from './CompartidoTienda.jsx';
import { formatearPrecio } from '../utilidades/almacenamiento.js';
import { obtenerUsuario } from '../servicios/sesion.js';
import { crearBoleta, obtenerCarrito } from '../servicios/tienda.js';

const campos = [
  ['name', 'Nombre completo', 'text'],
  ['phone', 'Teléfono', 'tel'],
  ['address', 'Dirección', 'text'],
  ['commune', 'Comuna', 'text'],
  ['region', 'Región', 'text']
];

export function Checkout() {
  const navigate = useNavigate();
  const user = obtenerUsuario();
  const valores = { name: user?.nombre, phone: user?.telefono, address: user?.direccion, commune: user?.comuna, region: user?.region };
  const [cart, setCart] = useState({ items: [], subtotal: 0, impuestos: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let activo = true;
    obtenerCarrito()
      .then(data => activo && setCart(data))
      .catch(loadError => activo && setError(loadError.message))
      .finally(() => activo && setLoading(false));
    return () => {
      activo = false;
    };
  }, []);

  const confirmar = async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const field = name => String(form.get(name) || '').trim();
    const direccion = [field('address'), field('commune'), field('region')].filter(Boolean).join(', ');
    setBusy(true);
    try {
      const boleta = await crearBoleta(user.id, { metodoPago: field('payment'), direccion });
      navigate('/compra-exitosa', { state: { boleta: { ...boleta, direccion: boleta.direccion || direccion, metodoPago: boleta.metodoPago || field('payment') }, items: cart.items, cliente: field('name') } });
    } catch (orderError) {
      navigate('/pago-error', { state: { mensaje: orderError.message } });
    }
  };

  if (!user) {
    return (
      <DisenoPublico activePage="cart">
        <div className="text-center py-5">
          <h1 className="h3 mb-3">Finalizar compra</h1>
          <p className="text-muted">Debes iniciar sesión para finalizar tu compra. Los productos de tu carrito se conservarán.</p>
          <Link to="/login" className="btn btn-primary me-2">Iniciar sesión</Link>
          <Link to="/registro" className="btn btn-outline-primary">Crear cuenta</Link>
        </div>
      </DisenoPublico>
    );
  }

  const vacio = !loading && !cart.items.length;
  return (
    <DisenoPublico activePage="cart">
      <h1 className="h2 mb-4"><i className="bi bi-bag-check" /> Finalizar compra</h1>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {loading && <p className="text-muted" role="status">Cargando carrito...</p>}
      {vacio ? (
        <div className="text-center py-5">
          <p className="text-muted">Tu carrito está vacío.</p>
          <Link to="/productos" className="btn btn-primary">Ver productos</Link>
        </div>
      ) : !loading && (
        <div className="row g-4">
          <form className="col-lg-7" onSubmit={confirmar} aria-label="Datos de despacho">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h2 className="h5 fw-bold mb-3">Datos del cliente y despacho</h2>
                {campos.map(([name, label, type]) => (
                  <div className="mb-3" key={name}>
                    <label className="form-label" htmlFor={`checkout-${name}`}>{label}</label>
                    <input id={`checkout-${name}`} name={name} className="form-control" type={type} required defaultValue={valores[name] || ''} {...(name === 'phone' ? { pattern: '[0-9]{9}', minLength: 9, maxLength: 9, inputMode: 'numeric', title: 'Debe tener exactamente 9 dígitos' } : {})} />
                  </div>
                ))}
                <div className="mb-3">
                  <label className="form-label" htmlFor="checkout-payment">Método de pago</label>
                  <select id="checkout-payment" name="payment" className="form-select" required defaultValue="TARJETA">
                    <option value="TARJETA">Tarjeta</option>
                    <option value="TRANSFERENCIA">Transferencia</option>
                    <option value="EFECTIVO">Efectivo contra entrega</option>
                  </select>
                  <div className="form-text">El método de pago solo se registra en el pedido; no se procesa ningún cobro.</div>
                </div>
                <div className="d-flex gap-2">
                  <Link to="/carrito" className="btn btn-outline-secondary">Volver al carrito</Link>
                  <button type="submit" className="btn btn-success flex-grow-1 fw-bold" disabled={busy}>{busy ? 'Procesando...' : 'Confirmar pedido'}</button>
                </div>
              </div>
            </div>
          </form>
          <aside className="col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h2 className="h5 fw-bold border-bottom pb-2">Resumen de la orden</h2>
                <ul className="list-unstyled mb-3">
                  {cart.items.map(item => (
                    <li className="d-flex justify-content-between small py-1" key={item.id}>
                      <span>{item.nombre} × {item.cantidad}</span>
                      <span>{formatearPrecio(item.precio * item.cantidad)}</span>
                    </li>
                  ))}
                </ul>
                <div className="d-flex justify-content-between"><span>Subtotal:</span><span>{formatearPrecio(cart.subtotal)}</span></div>
                <div className="d-flex justify-content-between"><span>IVA:</span><span>{formatearPrecio(cart.impuestos)}</span></div>
                <hr />
                <div className="d-flex justify-content-between fs-5 fw-bold"><span>Total:</span><span className="text-primary">{formatearPrecio(cart.total)}</span></div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </DisenoPublico>
  );
}