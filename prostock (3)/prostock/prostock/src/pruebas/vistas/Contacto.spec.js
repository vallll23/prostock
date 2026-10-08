import { Contacto } from '../../paginas/Contacto.jsx';
import { cambiarValor, enviarFormulario, limpiarVista, prepararVista, renderizarVista } from '../utilidades/pruebasReact.js';

describe('Vista de contacto', () => {
  beforeEach(() => prepararVista());
  afterEach(limpiarVista);

  it('guarda el mensaje enviado y presenta confirmación', () => {
    const vista = renderizarVista(<Contacto />);
    cambiarValor(vista.querySelector('#contact-name'), 'Ana Prueba');
    cambiarValor(vista.querySelector('#contact-email'), 'ana@gmail.com');
    cambiarValor(vista.querySelector('#contact-subject'), 'Consulta');
    cambiarValor(vista.querySelector('#contact-message'), 'Necesito información.');
    enviarFormulario(vista.querySelector('form'));

    const [mensaje] = JSON.parse(localStorage.getItem('mensajes_contacto_db'));
    expect(mensaje.nombre).toBe('Ana Prueba');
    expect(mensaje.email).toBe('ana@gmail.com');
    expect(mensaje.asunto).toBe('Consulta');
    expect(vista.textContent).toContain('Tu mensaje fue enviado correctamente');
  });
});
