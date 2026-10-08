import { MensajesAdministracion } from '../../paginas/MensajesAdministracion.jsx';
import { hacerClic, limpiarVista, prepararVista, renderizarVista, usuarioAdministrador } from '../utilidades/pruebasReact.js';

describe('Vista de mensajes de administración', () => {
  beforeEach(() => prepararVista({
    usuarioActivo: usuarioAdministrador(),
    mensajes_contacto_db: [{ id: 44, nombre: 'Ana Prueba', email: 'ana@gmail.com', asunto: 'Consulta', mensaje: 'Necesito ayuda', fecha: '08/10/2026', atendido: false }]
  }));
  afterEach(limpiarVista);

  it('presenta los mensajes recibidos y permite cambiar su estado', () => {
    const vista = renderizarVista(<MensajesAdministracion />, '/admin/mensajes');
    expect(vista.textContent).toContain('Mensajes de Contacto');
    expect(vista.textContent).toContain('Ana Prueba');
    expect(vista.textContent).toContain('Pendiente');

    hacerClic(vista.querySelector('button[aria-label="Cambiar estado de Consulta"]'));

    expect(vista.textContent).toContain('Atendido');
    expect(JSON.parse(localStorage.getItem('mensajes_contacto_db'))[0].atendido).toBeTrue();
  });
});
