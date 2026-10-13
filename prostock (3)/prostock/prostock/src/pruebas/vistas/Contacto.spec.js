import { Contacto } from '../../paginas/Contacto.jsx';
import { cambiarValor, configurarMockApi, enviarFormulario, esperar, limpiarVista, prepararVista, renderizarVista } from '../utilidades/pruebasReact.js';

describe('Vista de contacto', () => {
  let restaurarApi;

  beforeEach(() => prepararVista());
  afterEach(() => {
    if (restaurarApi) restaurarApi();
    limpiarVista();
  });

  it('guarda el mensaje enviado mediante la API y presenta confirmación', async () => {
    let peticionEnviada = null;
    restaurarApi = configurarMockApi(async (ruta, metodo, cuerpo) => {
      if (ruta === '/api/mensajes' && metodo === 'POST') {
        peticionEnviada = cuerpo;
        return { status: 201, body: { id: 1, ...cuerpo } };
      }
    });

    const vista = renderizarVista(<Contacto />);
    cambiarValor(vista.querySelector('#contact-name'), 'Ana Prueba');
    cambiarValor(vista.querySelector('#contact-email'), 'ana@gmail.com');
    cambiarValor(vista.querySelector('#contact-subject'), 'Consulta');
    cambiarValor(vista.querySelector('#contact-message'), 'Necesito información.');
    enviarFormulario(vista.querySelector('form'));

    await esperar(30);

    expect(peticionEnviada).not.toBeNull();
    expect(peticionEnviada.nombre).toBe('Ana Prueba');
    expect(peticionEnviada.email).toBe('ana@gmail.com');
    expect(peticionEnviada.asunto).toBe('Consulta');
    expect(vista.textContent).toContain('Tu mensaje fue enviado correctamente');
  });

  it('autocompleta el nombre y correo si el cliente inició sesión', () => {
    prepararVista({
      usuarioActivo: { id: 5, nombre: 'Carlos Cliente', email: 'carlos@cliente.cl', rol: 'CLIENTE' }
    });

    const vista = renderizarVista(<Contacto />);
    expect(vista.querySelector('#contact-name').value).toBe('Carlos Cliente');
    expect(vista.querySelector('#contact-email').value).toBe('carlos@cliente.cl');
  });
});
