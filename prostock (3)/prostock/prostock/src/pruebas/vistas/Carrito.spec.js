import { Carrito } from '../../paginas/Carrito.jsx';
import { limpiarVista, prepararVista, renderizarVista } from '../utilidades/pruebasReact.js';

describe('Vista del carrito', () => {
  beforeEach(() => prepararVista());
  afterEach(limpiarVista);

  it('muestra el estado vacío y notifica si se intenta pagar sin productos', () => {
    const aviso = spyOn(window, 'alert');
    const vista = renderizarVista(<Carrito />);
    expect(vista.textContent).toContain('El carrito está vacío.');
    vista.querySelector('button.btn-success').click();
    expect(aviso).toHaveBeenCalledWith('El carrito está vacío.');
  });
});
