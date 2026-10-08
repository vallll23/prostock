import { FormularioUsuarioAdministracion } from '../../paginas/FormularioUsuarioAdministracion.jsx';
import { limpiarVista, prepararVista, renderizarVista, usuarioAdministrador } from '../utilidades/pruebasReact.js';

describe('Vista de formulario de usuario', () => {
  beforeEach(() => prepararVista({ usuarioActivo: usuarioAdministrador(), usuarios_db: [usuarioAdministrador()] }));
  afterEach(limpiarVista);

  it('muestra los datos y controles necesarios para crear un usuario', () => {
    const vista = renderizarVista(<FormularioUsuarioAdministracion />, '/admin/usuario');
    expect(vista.querySelector('h1').textContent).toBe('Administrar Usuario');
    expect(vista.querySelector('#user-name')).not.toBeNull();
    expect(vista.querySelector('#user-email')).not.toBeNull();
    expect(vista.querySelector('#user-password')).not.toBeNull();
    expect(vista.querySelector('#user-role')).not.toBeNull();
  });
});
