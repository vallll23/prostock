import { Registro } from '../../paginas/Registro.jsx';
import { cambiarValor, limpiarVista, prepararVista, renderizarVista } from '../utilidades/pruebasReact.js';

describe('Vista de registro', () => {
  beforeEach(() => prepararVista());
  afterEach(limpiarVista);

  it('renderiza los campos y habilita la selección de comuna al elegir región', () => {
    const vista = renderizarVista(<Registro />, '/registro');
    const comuna = vista.querySelector('#register-commune');
    expect(vista.querySelector('#register-name')).not.toBeNull();
    expect(comuna.disabled).toBeTrue();

    const region = vista.querySelector('#register-region');
    cambiarValor(region, region.options[1].value);
    expect(comuna.disabled).toBeFalse();
    expect(comuna.options.length).toBeGreaterThan(1);
  });
});
