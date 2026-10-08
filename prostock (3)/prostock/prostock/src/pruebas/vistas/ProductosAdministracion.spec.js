import { ProductosAdministracion } from '../../paginas/ProductosAdministracion.jsx';
import { limpiarVista, prepararVista, renderizarVista, usuarioAdministrador } from '../utilidades/pruebasReact.js';

describe('Vista de productos de administración', () => {
  beforeEach(() => prepararVista({
    usuarioActivo: usuarioAdministrador(),
    productos_db: [{ id: 17, codigo: 'TEST-17', nombre: 'Cuaderno de prueba', categoria: 'Escolar', precio: 2500, stock: 3 }]
  }));
  afterEach(limpiarVista);

  it('renderiza el inventario y enlaza al formulario de edición', () => {
    const vista = renderizarVista(<ProductosAdministracion />, '/admin/productos');
    expect(vista.querySelector('h1').textContent).toContain('Gestión de Productos');
    expect(vista.textContent).toContain('Cuaderno de prueba');
    expect(vista.querySelector('a[href="/admin/producto?id=17"]')).not.toBeNull();
  });
});
