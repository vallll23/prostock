import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PieSitio } from '../componentes/PieSitio.jsx';
import { EncabezadoSitio } from '../componentes/EncabezadoSitio.jsx';
import { ModalDespacho } from './CompartidoTienda.jsx';
import { formatearPrecio } from '../utilidades/almacenamiento.js';
import { obtenerUsuario } from '../servicios/sesion.js';
import { crearBoleta, establecerCantidad, obtenerCarrito, quitarDelCarrito, vaciarCarrito } from '../servicios/tienda.js';

export function Carrito() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], subtotal: 0, impuestos: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { items, subtotal, impuestos: tax, total } = cart;

  const cargar = useCallback(async () => {
    try {
      setCart(await obtenerCarrito());
      setError('');
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    if (!checkoutOpen) return undefined;
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [checkoutOpen]);

  const ejecutar = async accion => {
    setBusy(true);
    try {
      await accion();
      await cargar();
    } catch (actionError) {
      window.alert(actionError.message);
    } finally {
      setBusy(false);
    }
  };

  const changeQuantity = (item, amount) => ejecutar(() => establecerCantidad(item.id, item.cantidad + amount));

  const beginCheckout = () => {
    if (!items.length) {
      window.alert('El carrito está vacío.');
      return;
    }
    if (!obtenerUsuario()) {
      window.alert('Debes iniciar sesión para finalizar tu compra.');
      navigate('/login');
      return;
    }
    setCheckoutOpen(true);
  };

  const confirmOrder = async event => {
    event.preventDefault();
    const user = obtenerUsuario();
    if (!items.length || !user) {
      window.alert('Debes iniciar sesión y agregar productos antes de continuar.');
      return;
    }

    const form = new FormData(event.currentTarget);
    const field = name => String(form.get(name) || '').trim();
    const direccion = [field('address'), field('commune'), field('region')].filter(Boolean).join(', ');
    setBusy(true);
    try {
      await crearBoleta(user.id, { metodoPago: field('payment'), direccion });
      setCheckoutOpen(false);
      window.alert('¡Pedido confirmado con éxito! Puedes revisar el pedido en tu perfil.');
      navigate('/');
    } catch (orderError) {
      window.alert(orderError.message);
      await cargar();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <EncabezadoSitio />
      <main className="container my-5 flex-grow-1">
        <h1 className="h2 mb-4"><i className="bi bi-cart3" /> Carrito de Compras</h1>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <div className="row">
          <section className="col-lg-8 mb-4">
            <div className="table-responsive shadow-sm border rounded">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light"><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th>Acción</th></tr></thead>
                <tbody>
                  {items.length ? items.map(item => (
                    <tr key={item.id}>
                      <td><img src={item.imagen} width="50" height="50" className="rounded object-fit-cover me-2" alt="" /><span className="fw-bold">{item.nombre}</span></td>
                      <td>{formatearPrecio(item.precio)}</td>
                      <td>
                        <div className="input-group input-group-sm" style={{ width: 110 }}>
                          <button type="button" className="btn btn-outline-secondary" aria-label={`Disminuir ${item.nombre}`} disabled={busy} onClick={() => changeQuantity(item, -1)}>-</button>
                          <span className="form-control text-center">{item.cantidad}</span>
                          <button type="button" className="btn btn-outline-secondary" aria-label={`Aumentar ${item.nombre}`} disabled={busy} onClick={() => changeQuantity(item, 1)}>+</button>
                        </div>
                      </td>
                      <td className="fw-bold">{formatearPrecio(item.precio * item.cantidad)}</td>
                      <td><button type="button" className="btn btn-sm btn-outline-danger" aria-label={`Eliminar ${item.nombre}`} disabled={busy} onClick={() => ejecutar(() => quitarDelCarrito(item.id))}><i className="bi bi-trash" /></button></td>
                    </tr>
                  )) : <tr><td colSpan="5" className="text-center py-4 text-muted">{loading ? 'Cargando carrito...' : <>El carrito está vacío. <Link to="/productos">Ver productos</Link></>}</td></tr>}
                </tbody>
              </table>
            </div>
            <button type="button" className="btn btn-outline-secondary btn-sm mt-3" onClick={() => {
              if (window.confirm('¿Deseas vaciar todo el carrito?')) ejecutar(vaciarCarrito);
            }}>
              <i className="bi bi-trash" /> Vaciar Carrito
            </button>
          </section>
          <aside className="col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h2 className="h5 fw-bold border-bottom pb-2">Resumen de Orden</h2>
                <div className="d-flex justify-content-between my-2"><span>Subtotal Neto:</span><span>{formatearPrecio(subtotal)}</span></div>
                <div className="d-flex justify-content-between my-2"><span>IVA:</span><span>{formatearPrecio(tax)}</span></div>
                <hr />
                <div className="d-flex justify-content-between fs-5 fw-bold mb-3"><span>Total:</span><span className="text-primary">{formatearPrecio(total)}</span></div>
                <button type="button" className="btn btn-success w-100 py-2 fw-bold" onClick={beginCheckout}>Pagar Pedido</button>
                <Link to="/productos" className="btn btn-link w-100 mt-2 text-decoration-none">Seguir comprando</Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <ModalDespacho isOpen={checkoutOpen} onCancel={() => setCheckoutOpen(false)} onConfirm={confirmOrder} busy={busy} />
      <PieSitio />
    </>
  );
}
