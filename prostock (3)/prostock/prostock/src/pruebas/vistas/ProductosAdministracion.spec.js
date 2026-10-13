import { ProductosAdministracion } from '../../paginas/ProductosAdministracion.jsx';
import { configurarMockApi, esperar, limpiarVista, prepararVista, renderizarVista, usuarioAdministrador } from '../utilidades/pruebasReact.js';

describe('Vista de productos de administración', () => {
  let restaurarApi;
  beforeEach(() => {
    prepararVista({
      usuarioActivo: usuarioAdministrador()
    });
  });
  afterEach(() => {
    if (restaurarApi) restaurarApi();
    limpiarVista();
  });

  it('renderiza el inventario y enlaza al formulario de edición', async () => {
    restaurarApi = configurarMockApi(async (ruta) => {
      if (ruta === '/api/productos') {
        return {
          status: 200,
          body: [{ id: 17, nombreModelo: 'Cuaderno de prueba', precio: 2500, stock: 3, tipoCategoria: { nombre: 'Escolar' } }]
        };
      }
    });

    const vista = renderizarVista(<ProductosAdministracion />, '/admin/productos');
    await esperar(30);

    expect(vista.querySelector('h1').textContent).toContain('Gestión de Productos');
    expect(vista.textContent).toContain('Cuaderno de prueba');
    expect(vista.querySelector('a[href="/admin/producto?id=17"]')).not.toBeNull();
  });
});
