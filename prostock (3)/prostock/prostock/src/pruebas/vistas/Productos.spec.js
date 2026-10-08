import { Productos } from '../../paginas/Productos.jsx';
import { productoPrueba, cambiarValor, limpiarVista, prepararVista, renderizarVista } from '../utilidades/pruebasReact.js';

describe('Vista de productos', () => {
  beforeEach(() => prepararVista({ productos_db: [
    productoPrueba,
    { ...productoPrueba, id: 18, codigo: 'TEST-18', nombre: 'Lápiz de prueba' }
  ] }));
  afterEach(limpiarVista);

  it('renderiza todos los productos y filtra la lista al actualizar la búsqueda', () => {
    const vista = renderizarVista(<Productos />);
    expect(vista.querySelectorAll('.product-card').length).toBe(2);
    expect(vista.textContent).toContain(productoPrueba.nombre);
    expect(vista.textContent).toContain('Lápiz de prueba');

    cambiarValor(vista.querySelector('#product-search'), 'lápiz');

    expect(vista.querySelectorAll('.product-card').length).toBe(1);
    expect(vista.textContent).toContain('Lápiz de prueba');
    expect(vista.textContent).not.toContain(productoPrueba.nombre);
  });
});
