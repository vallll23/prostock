import { Blog } from '../../paginas/Blog.jsx';
import { limpiarVista, prepararVista, renderizarVista } from '../utilidades/pruebasReact.js';

describe('Vista del blog', () => {
  beforeEach(() => prepararVista());
  afterEach(limpiarVista);

  it('renderiza el artículo y el enlace a su detalle', () => {
    const vista = renderizarVista(<Blog />);
    expect(vista.querySelector('h1').textContent).toBe('Blog');
    expect(vista.textContent).toContain('5 Tips para Organizar el Inventario de tu Oficina');
    expect(vista.querySelector('a[href="/detalle-blog"]')).not.toBeNull();
  });
});
