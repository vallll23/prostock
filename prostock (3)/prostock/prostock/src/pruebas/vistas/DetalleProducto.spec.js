import { DetalleProducto } from '../../paginas/DetalleProducto.jsx';
import { configurarMockApi, esperar, limpiarVista, prepararVista, renderizarVista } from '../utilidades/pruebasReact.js';

describe('Vista de detalle del producto', () => {
  let restaurarApi;
  beforeEach(() => {
    prepararVista();
    window.history.replaceState({}, '', '/context.html');
  });
  afterEach(() => {
    if (restaurarApi) restaurarApi();
    window.history.replaceState({}, '', '/context.html');
    limpiarVista();
  });

  it('informa cuando no existe un producto seleccionado y ofrece volver al catálogo', async () => {
    restaurarApi = configurarMockApi(async (ruta) => {
      if (ruta.startsWith('/api/productos/')) {
        return { status: 404, body: { message: 'No encontrado' } };
      }
    });

    const vista = renderizarVista(<DetalleProducto />);
    await esperar(30);
    expect(vista.textContent).toContain('Producto no encontrado.');
    expect(vista.querySelector('a[href="/productos"]')).not.toBeNull();
  });
});
