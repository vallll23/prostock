import { UsuariosAdministracion } from '../../paginas/UsuariosAdministracion.jsx';
import { limpiarVista, prepararVista, renderizarVista, usuarioAdministrador } from '../utilidades/pruebasReact.js';

describe('Vista de usuarios de administración', () => {
  beforeEach(() => prepararVista({
    usuarioActivo: usuarioAdministrador(),
    usuarios_db: [usuarioAdministrador(), { id: 25, nombre: 'Cliente de prueba', email: 'cliente@gmail.com', rol: 'CLIENTE' }]
  }));
  afterEach(limpiarVista);

  it('lista los usuarios registrados y ofrece editar cada uno', () => {
    const vista = renderizarVista(<UsuariosAdministracion />, '/admin/usuarios');
    expect(vista.querySelector('h1').textContent).toContain('Gestión de Usuarios');
    expect(vista.textContent).toContain('Administradora de prueba');
    expect(vista.textContent).toContain('Cliente de prueba');
    expect(vista.querySelector('a[href="/admin/usuario?id=25"]')).not.toBeNull();
  });
});
