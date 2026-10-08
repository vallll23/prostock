import { DetalleProducto } from '../../paginas/DetalleProducto.jsx';
import { limpiarVista, prepararVista, renderizarVista } from '../utilidades/pruebasReact.js';

describe('Vista de detalle del producto', () => {
  beforeEach(() => {
    prepararVista();
    window.history.replaceState({}, '', '/context.html');
  });
  afterEach(() => {
    window.history.replaceState({}, '', '/context.html');
    limpiarVista();
  });

  it('informa cuando no existe un producto seleccionado y ofrece volver al catálogo', () => {
    const vista = renderizarVista(<DetalleProducto />);
    expect(vista.textContent).toContain('Producto no encontrado.');
    expect(vista.querySelector('a[href="/productos"]')).not.toBeNull();
  });
});
