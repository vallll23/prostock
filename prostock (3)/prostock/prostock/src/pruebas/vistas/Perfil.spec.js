import { Perfil } from '../../paginas/Perfil.jsx';
import { limpiarVista, prepararVista, renderizarVista, usuarioAdministrador } from '../utilidades/pruebasReact.js';

describe('Vista del perfil', () => {
  beforeEach(() => prepararVista({
    usuarioActivo: usuarioAdministrador(24),
    pedidos_db: [{ id: 81, usuarioId: 24, fecha: '08/10/2026', total: 5000, estado: 'Confirmado' }]
  }));
  afterEach(limpiarVista);

  it('presenta la información del usuario y su historial de compras', () => {
    const vista = renderizarVista(<Perfil />, '/perfil');
    expect(vista.textContent).toContain('Administradora de prueba');
    expect(vista.textContent).toContain('Historial de Compras Recientes');
    expect(vista.textContent).toContain('#81');
    expect(vista.textContent).toContain('Confirmado');
  });
});
