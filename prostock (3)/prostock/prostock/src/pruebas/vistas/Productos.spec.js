import { Productos } from '../../paginas/Productos.jsx';
import { productoPrueba, cambiarValor, configurarMockApi, esperar, limpiarVista, prepararVista, renderizarVista } from '../utilidades/pruebasReact.js';

describe('Vista de productos', () => {
  let restaurarApi;
  beforeEach(() => {
    prepararVista();
  });
  afterEach(() => {
    if (restaurarApi) restaurarApi();
    limpiarVista();
  });

  it('renderiza todos los productos y filtra la lista al actualizar la búsqueda', async () => {
    restaurarApi = configurarMockApi(async (ruta) => {
      if (ruta === '/api/productos') {
        return {
          status: 200,
          body: [
            { id: 17, nombreModelo: 'Cuaderno de prueba', precio: 2500, stock: 3, tipoCategoria: { nombre: 'Escolar' } },
            { id: 18, nombreModelo: 'Lápiz de prueba', precio: 800, stock: 10, tipoCategoria: { nombre: 'Escolar' } }
          ]
        };
      }
    });

    const vista = renderizarVista(<Productos />);
    await esperar(30);

    expect(vista.querySelectorAll('.product-card').length).toBe(2);
    expect(vista.textContent).toContain('Cuaderno de prueba');
    expect(vista.textContent).toContain('Lápiz de prueba');

    cambiarValor(vista.querySelector('#product-search'), 'lápiz');

    expect(vista.querySelectorAll('.product-card').length).toBe(1);
    expect(vista.textContent).toContain('Lápiz de prueba');
    expect(vista.textContent).not.toContain('Cuaderno de prueba');
  });
});
