import { PieSitio } from '../componentes/PieSitio.jsx';
import { EncabezadoSitio } from '../componentes/EncabezadoSitio.jsx';
import { leerAlmacenamiento, guardarAlmacenamiento } from '../utilidades/almacenamiento.js';

export function DisenoPublico({ activePage, children }) {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <EncabezadoSitio activePage={activePage} />
      <main className="container my-5 flex-grow-1">{children}</main>
      <PieSitio />
    </div>
  );
}

export const blogTitle = '5 Tips para Organizar el Inventario de tu Oficina';

export const blogImage = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80';

export function addProductToCart(product) {
  const inventory = leerAlmacenamiento('productos_db');
  const currentProduct = inventory.find(item => item.id === product.id) || product;
  const cart = leerAlmacenamiento('carrito');
  const existingItem = cart.find(item => item.id === product.id);

  if (currentProduct.stock <= 0) {
    window.alert('Este producto no tiene stock disponible.');
    return false;
  }
  if (existingItem && existingItem.cantidad >= currentProduct.stock) {
    window.alert(`Solo hay ${currentProduct.stock} unidades disponibles.`);
    return false;
  }
  if (existingItem) existingItem.cantidad += 1;
  else cart.push({ ...currentProduct, cantidad: 1 });

  guardarAlmacenamiento('carrito', cart);
  window.dispatchEvent(new Event('storage'));
  return true;
}

export function ModalDespacho({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onCancel} aria-hidden="true" />
      <div
        className="modal fade show d-block"
        id="shippingModal"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shippingModalLabel"
        onKeyDown={event => {
          if (event.key === 'Escape') onCancel();
        }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5" id="shippingModalLabel">Datos de despacho</h2>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCancel} />
            </div>
            <form id="shippingForm" onSubmit={onConfirm}>
              <div className="modal-body">
                {[
                  ['name', 'Nombre completo', 'text'],
                  ['phone', 'Teléfono', 'tel'],
                  ['address', 'Dirección', 'text'],
                  ['commune', 'Comuna', 'text'],
                  ['region', 'Región', 'text']
                ].map(([name, label, type]) => (
                  <div className="mb-3" key={name}>
                    <label className="form-label" htmlFor={`shipping-${name}`}>{label}</label>
                    <input id={`shipping-${name}`} name={name} className="form-control" type={type} required autoFocus={name === 'name'} />
                  </div>
                ))}
                <div className="mb-3">
                  <label className="form-label" htmlFor="shipping-notes">Observaciones</label>
                  <textarea id="shipping-notes" name="notes" className="form-control" rows="3" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
                <button type="submit" className="btn btn-success">Confirmar Pedido</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
