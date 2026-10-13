import { FormularioProductoAdministracion } from '../../paginas/FormularioProductoAdministracion.jsx';
import { limpiarVista, prepararVista, renderizarVista, usuarioAdministrador } from '../utilidades/pruebasReact.js';

describe('Vista de formulario de producto', () => {
  beforeEach(() => {
    prepararVista({ usuarioActivo: usuarioAdministrador() });
    window.history.replaceState({}, '', '/admin/producto');
  });
  afterEach(() => {
    window.history.replaceState({}, '', '/context.html');
    limpiarVista();
  });

  it('muestra los campos requeridos para crear un producto', () => {
    const vista = renderizarVista(<FormularioProductoAdministracion />, '/admin/producto');
    expect(vista.querySelector('h1').textContent).toBe('Administrar Producto');
    expect(vista.querySelector('#product-name')).not.toBeNull();
    expect(vista.querySelector('#product-category')).not.toBeNull();
    expect(vista.querySelector('#product-price')).not.toBeNull();
    expect(vista.querySelector('#product-stock')).not.toBeNull();
    expect(vista.querySelector('#product-image')).not.toBeNull();
  });
});
