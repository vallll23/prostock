import { Blog } from '../../paginas/Blog.jsx';
import { limpiarVista, prepararVista, renderizarVista } from '../utilidades/pruebasReact.js';

describe('Vista del blog', () => {
  beforeEach(() => prepararVista());
  afterEach(limpiarVista);

  it('renderiza los dos artículos con su enlace al detalle', () => {
    const vista = renderizarVista(<Blog />);
    expect(vista.querySelector('h1').textContent).toBe('Blog');
    expect(vista.querySelectorAll('article').length).toBe(2);
    expect(vista.textContent).toContain('Cómo Elegir los Insumos Correctos para tu Empresa');
    expect(vista.querySelector('a[href="/detalle-blog?id=inventario-oficina"]')).not.toBeNull();
    expect(vista.querySelector('a[href="/detalle-blog?id=elegir-insumos"]')).not.toBeNull();
  });
});