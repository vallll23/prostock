import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PieSitio } from '../componentes/PieSitio.jsx';
import { EncabezadoSitio } from '../componentes/EncabezadoSitio.jsx';
import { ModalDespacho } from './CompartidoTienda.jsx';
import { formatearPrecio, leerAlmacenamiento, guardarAlmacenamiento } from '../utilidades/almacenamiento.js';

export function Carrito() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => leerAlmacenamiento('carrito'));
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const subtotal = cart.reduce((sum, item) => sum + Number(item.precio) * Number(item.cantidad), 0);
  const tax = Math.round(subtotal * 0.19);

  useEffect(() => {
    if (!checkoutOpen) return undefined;
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [checkoutOpen]);

  const saveCart = nextCart => {
    setCart(nextCart);
    guardarAlmacenamiento('carrito', nextCart);
    window.dispatchEvent(new Event('storage'));
  };

  const changeQuantity = (index, amount) => {
    const nextCart = [...cart];
    const item = nextCart[index];
    if (!item) return;
    if (amount > 0) {
      const product = leerAlmacenamiento('productos_db').find(entry => entry.id === item.id);
      if (!product || item.cantidad >= product.stock) {
        window.alert(`Solo hay ${product?.stock || 0} unidades disponibles.`);
        return;
      }
    }
    item.cantidad += amount;
    if (item.cantidad <= 0) nextCart.splice(index, 1);
    saveCart(nextCart);
  };

  const beginCheckout = () => {
    if (!cart.length) {
      window.alert('El carrito está vacío.');
      return;
    }
    if (!leerAlmacenamiento('usuarioActivo', null)) {
      window.alert('Debes iniciar sesión para finalizar tu compra.');
      navigate('/login');
      return;
    }
    setCheckoutOpen(true);
  };

  const confirmOrder = event => {
    event.preventDefault();
    const user = leerAlmacenamiento('usuarioActivo', null);
    if (!cart.length || !user) {
      window.alert('Debes iniciar sesión y agregar productos antes de continuar.');
      return;
    }

    const form = new FormData(event.currentTarget);
    const products = leerAlmacenamiento('productos_db');
    const productById = new Map(products.map(product => [product.id, product]));
    const outOfStock = cart.find(item => {
      const product = productById.get(item.id);
      return !product || product.stock < item.cantidad;
    });
    if (outOfStock) {
      window.alert(`No hay stock suficiente para "${outOfStock.nombre}".`);
      return;
    }

    cart.forEach(item => {
      productById.get(item.id).stock -= item.cantidad;
    });
    const shipping = {
      nombre: String(form.get('name')).trim(),
      telefono: String(form.get('phone')).trim(),
      direccion: String(form.get('address')).trim(),
      comuna: String(form.get('commune')).trim(),
      region: String(form.get('region')).trim(),
      observaciones: String(form.get('notes')).trim()
    };
    const orders = leerAlmacenamiento('pedidos_db');
    orders.push({
      id: Date.now(),
      usuarioId: user.id,
      fecha: new Date().toLocaleDateString('es-CL'),
      subtotal,
      iva: tax,
      total: subtotal + tax,
      estado: 'Confirmado',
      items: cart,
      despacho: shipping
    });

    guardarAlmacenamiento('productos_db', products);
    guardarAlmacenamiento('pedidos_db', orders);
    localStorage.removeItem('carrito');
    localStorage.removeItem('datosDespacho');
    setCheckoutOpen(false);
    window.alert('¡Pedido confirmado con éxito! Puedes revisar el pedido en tu perfil.');
    navigate('/');
  };

  return (
    <>
      <EncabezadoSitio />
      <main className="container my-5 flex-grow-1">
        <h1 className="h2 mb-4"><i className="bi bi-cart3" /> Carrito de Compras</h1>
        <div className="row">
          <section className="col-lg-8 mb-4">
            <div className="table-responsive shadow-sm border rounded">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light"><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th>Acción</th></tr></thead>
                <tbody>
                  {cart.length ? cart.map((item, index) => (
                    <tr key={item.id}>
                      <td><img src={item.imagen} width="50" height="50" className="rounded object-fit-cover me-2" alt="" /><span className="fw-bold">{item.nombre}</span></td>
                      <td>{formatearPrecio(item.precio)}</td>
                      <td>
                        <div className="input-group input-group-sm" style={{ width: 110 }}>
                          <button type="button" className="btn btn-outline-secondary" aria-label={`Disminuir ${item.nombre}`} onClick={() => changeQuantity(index, -1)}>-</button>
                          <span className="form-control text-center">{item.cantidad}</span>
                          <button type="button" className="btn btn-outline-secondary" aria-label={`Aumentar ${item.nombre}`} onClick={() => changeQuantity(index, 1)}>+</button>
                        </div>
                      </td>
                      <td className="fw-bold">{formatearPrecio(item.precio * item.cantidad)}</td>
                      <td><button type="button" className="btn btn-sm btn-outline-danger" aria-label={`Eliminar ${item.nombre}`} onClick={() => saveCart(cart.filter((_, itemIndex) => itemIndex !== index))}><i className="bi bi-trash" /></button></td>
                    </tr>
                  )) : <tr><td colSpan="5" className="text-center py-4 text-muted">El carrito está vacío. <Link to="/productos">Ver productos</Link></td></tr>}
                </tbody>
              </table>
            </div>
            <button type="button" className="btn btn-outline-secondary btn-sm mt-3" onClick={() => {
              if (window.confirm('¿Deseas vaciar todo el carrito?')) saveCart([]);
            }}>
              <i className="bi bi-trash" /> Vaciar Carrito
            </button>
          </section>
          <aside className="col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h2 className="h5 fw-bold border-bottom pb-2">Resumen de Orden</h2>
                <div className="d-flex justify-content-between my-2"><span>Subtotal Neto:</span><span>{formatearPrecio(subtotal)}</span></div>
                <div className="d-flex justify-content-between my-2"><span>IVA (19%):</span><span>{formatearPrecio(tax)}</span></div>
                <hr />
                <div className="d-flex justify-content-between fs-5 fw-bold mb-3"><span>Total:</span><span className="text-primary">{formatearPrecio(subtotal + tax)}</span></div>
                <button type="button" className="btn btn-success w-100 py-2 fw-bold" onClick={beginCheckout}>Pagar Pedido</button>
                <Link to="/productos" className="btn btn-link w-100 mt-2 text-decoration-none">Seguir comprando</Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <ModalDespacho isOpen={checkoutOpen} onCancel={() => setCheckoutOpen(false)} onConfirm={confirmOrder} />
      <PieSitio />
    </>
  );
}
