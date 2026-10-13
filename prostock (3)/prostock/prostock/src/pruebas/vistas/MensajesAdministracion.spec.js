import { MensajesAdministracion } from '../../paginas/MensajesAdministracion.jsx';
import { configurarMockApi, esperar, hacerClic, limpiarVista, prepararVista, renderizarVista, usuarioAdministrador } from '../utilidades/pruebasReact.js';

describe('Vista de mensajes de administración', () => {
  let restaurarApi;

  beforeEach(() => {
    prepararVista({ usuarioActivo: usuarioAdministrador() });
  });

  afterEach(() => {
    if (restaurarApi) restaurarApi();
    limpiarVista();
  });

  it('presenta los mensajes recibidos desde la API y permite cambiar su estado', async () => {
    let atendidoLlamado = false;
    restaurarApi = configurarMockApi(async (ruta, metodo) => {
      if (ruta === '/api/mensajes' && metodo === 'GET') {
        return {
          status: 200,
          body: [
            {
              id: 44,
              nombre: 'Ana Prueba',
              email: 'ana@gmail.com',
              asunto: 'Consulta',
              mensaje: 'Necesito ayuda',
              fecha: '2026-10-08T10:00:00',
              atendido: false
            }
          ]
        };
      }
      if (ruta === '/api/mensajes/44/atender' && metodo === 'PUT') {
        atendidoLlamado = true;
        return {
          status: 200,
          body: { id: 44, atendido: true }
        };
      }
    });

    const vista = renderizarVista(<MensajesAdministracion />, '/admin/mensajes');
    await esperar(30);

    expect(vista.textContent).toContain('Mensajes de Contacto');
    expect(vista.textContent).toContain('Ana Prueba');
    expect(vista.textContent).toContain('Pendiente');

    hacerClic(vista.querySelector('button[aria-label="Cambiar estado de Consulta"]'));
    await esperar(30);

    expect(vista.textContent).toContain('Atendido');
    expect(atendidoLlamado).toBeTrue();
  });
});
