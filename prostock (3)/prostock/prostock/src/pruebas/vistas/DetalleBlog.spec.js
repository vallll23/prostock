import { DetalleBlog } from '../../paginas/DetalleBlog.jsx';
import { limpiarVista, prepararVista, renderizarVista } from '../utilidades/pruebasReact.js';

describe('Vista de detalle del blog', () => {
  beforeEach(() => prepararVista());
  afterEach(limpiarVista);

  it('muestra el artículo completo con sus cinco recomendaciones', () => {
    const vista = renderizarVista(<DetalleBlog />);
    expect(vista.querySelector('h1').textContent).toContain('Organizar el Inventario');
    expect(vista.querySelectorAll('article section h2').length).toBe(5);
    expect(vista.querySelector('article a[href="/blogs"]').textContent).toContain('Volver al blog');
  });
});
