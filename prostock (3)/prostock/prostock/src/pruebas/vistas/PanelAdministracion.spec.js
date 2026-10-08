import { PanelAdministracion } from '../../paginas/PanelAdministracion.jsx';
import { limpiarVista, prepararVista, renderizarVista, usuarioAdministrador } from '../utilidades/pruebasReact.js';

describe('Vista del panel de administración', () => {
  beforeEach(() => prepararVista({
    usuarioActivo: usuarioAdministrador(),
    productos_db: [],
    usuarios_db: [usuarioAdministrador(), { id: 2, nombre: 'Cliente', rol: 'CLIENTE' }],
    pedidos_db: [{ id: 5, total: 12000 }],
    mensajes_contacto_db: [{ id: 7, atendido: false }]
  }));
  afterEach(limpiarVista);

  it('muestra los indicadores calculados desde los datos disponibles', () => {
    const vista = renderizarVista(<PanelAdministracion />, '/admin');
    expect(vista.querySelector('h1').textContent).toBe('Panel de Control');
    expect(vista.textContent).toContain('Productos Totales');
    expect(vista.textContent).toContain('Usuarios Registrados');
    expect(vista.textContent).toContain('Mensajes pendientes');
    expect(vista.textContent).toContain('Ventas totales');
    expect(vista.textContent).toContain('$12.000');
  });
});
