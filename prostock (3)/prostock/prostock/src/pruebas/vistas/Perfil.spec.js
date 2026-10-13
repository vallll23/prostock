import { Perfil } from '../../paginas/Perfil.jsx';
import { configurarMockApi, esperar, limpiarVista, prepararVista, renderizarVista, usuarioAdministrador } from '../utilidades/pruebasReact.js';

describe('Vista del perfil', () => {
  let restaurarApi;
  beforeEach(() => {
    prepararVista({
      usuarioActivo: usuarioAdministrador(24)
    });
  });
  afterEach(() => {
    if (restaurarApi) restaurarApi();
    limpiarVista();
  });

  it('presenta la información del usuario y su historial de compras', async () => {
    restaurarApi = configurarMockApi(async (ruta) => {
      if (ruta === '/api/clientes/24') {
        return { status: 200, body: usuarioAdministrador(24) };
      }
      if (ruta === '/api/clientes/24/boletas') {
        return { status: 200, body: [{ id: 81, fecha: '2026-10-08', total: 5000, estado: 'Confirmado' }] };
      }
    });

    const vista = renderizarVista(<Perfil />, '/perfil');
    await esperar(30);

    expect(vista.textContent).toContain('Administradora de prueba');
    expect(vista.textContent).toContain('Historial de Compras Recientes');
    expect(vista.textContent).toContain('#81');
    expect(vista.textContent).toContain('Confirmado');
  });
});
