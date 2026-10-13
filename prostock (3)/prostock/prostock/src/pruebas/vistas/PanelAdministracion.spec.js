import { PanelAdministracion } from '../../paginas/PanelAdministracion.jsx';
import { configurarMockApi, esperar, limpiarVista, prepararVista, renderizarVista, usuarioAdministrador } from '../utilidades/pruebasReact.js';

describe('Vista del panel de administración', () => {
  let restaurarApi;
  beforeEach(() => {
    prepararVista({
      usuarioActivo: usuarioAdministrador(),
      mensajes_contacto_db: [{ id: 7, atendido: false }]
    });
  });
  afterEach(() => {
    if (restaurarApi) restaurarApi();
    limpiarVista();
  });

  it('muestra los indicadores calculados desde los datos disponibles', async () => {
    restaurarApi = configurarMockApi(async (ruta) => {
      if (ruta === '/api/productos') {
        return { status: 200, body: [{ id: 1, nombreModelo: 'P1', precio: 1000, stock: 10 }] };
      }
      if (ruta === '/api/clientes') {
        return { status: 200, body: [usuarioAdministrador(), { id: 2, nombreCompleto: 'Cliente', email: 'cliente@gmail.com' }] };
      }
      if (ruta.startsWith('/api/clientes/') && ruta.endsWith('/boletas')) {
        return { status: 200, body: [{ id: 5, total: 12000, fecha: '2026-10-01' }] };
      }
    });

    const vista = renderizarVista(<PanelAdministracion />, '/admin');
    await esperar(40);
    expect(vista.querySelector('h1').textContent).toBe('Panel de Control');
    expect(vista.textContent).toContain('Productos Totales');
    expect(vista.textContent).toContain('Usuarios Registrados');
    expect(vista.textContent).toContain('Mensajes pendientes');
    expect(vista.textContent).toContain('Ventas totales');
    expect(vista.textContent).toContain('$24.000');
  });
});
