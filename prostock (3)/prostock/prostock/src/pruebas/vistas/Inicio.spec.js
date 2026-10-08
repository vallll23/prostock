import { Inicio } from '../../paginas/Inicio.jsx';
import { limpiarVista, prepararVista, renderizarVista } from '../utilidades/pruebasReact.js';

describe('Vista de inicio', () => {
  beforeEach(() => prepararVista());
  afterEach(limpiarVista);

  it('muestra el mensaje principal y el acceso al catálogo', () => {
    const vista = renderizarVista(<Inicio />);
    expect(vista.querySelector('h1').textContent).toContain('Todo para tu oficina');
    expect(vista.querySelector('.home-hero a[href="/productos"]').textContent).toContain('Comprar ahora');
  });
});
