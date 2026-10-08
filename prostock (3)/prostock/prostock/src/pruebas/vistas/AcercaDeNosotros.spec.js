import { AcercaDeNosotros } from '../../paginas/AcercaDeNosotros.jsx';
import { limpiarVista, prepararVista, renderizarVista } from '../utilidades/pruebasReact.js';

describe('Vista acerca de nosotros', () => {
  beforeEach(() => prepararVista());
  afterEach(limpiarVista);

  it('presenta la historia, los valores y las personas del equipo', () => {
    const vista = renderizarVista(<AcercaDeNosotros />);
    expect(vista.textContent).toContain('Nuestra Historia');
    expect(vista.textContent).toContain('Misión');
    expect(vista.textContent).toContain('Visión');
    expect(vista.textContent).toContain('Valores');
    expect(vista.textContent).toContain('Valentina');
    expect(vista.textContent).toContain('Javiera');
  });
});
