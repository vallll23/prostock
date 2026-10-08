import { IniciarSesion } from '../../paginas/IniciarSesion.jsx';
import { cambiarValor, enviarFormulario, limpiarVista, prepararVista, renderizarVista, usuarioAdministrador } from '../utilidades/pruebasReact.js';

describe('Vista de inicio de sesión', () => {
  beforeEach(() => prepararVista({ usuarios_db: [usuarioAdministrador(24)] }));
  afterEach(limpiarVista);

  it('muestra un error al ingresar credenciales inválidas', () => {
    const vista = renderizarVista(<IniciarSesion />, '/login');
    cambiarValor(vista.querySelector('#login-email'), 'invalido@duoc.cl');
    cambiarValor(vista.querySelector('#login-password'), 'incorrecta');
    enviarFormulario(vista.querySelector('form'));
    expect(vista.querySelector('[role="alert"]').textContent).toContain('Credenciales inválidas');
    expect(localStorage.getItem('usuarioActivo')).toBeNull();
  });

  it('guarda el usuario y navega al panel con credenciales correctas', () => {
    const vista = renderizarVista(<IniciarSesion />, '/login');
    cambiarValor(vista.querySelector('#login-email'), 'admin@duoc.cl');
    cambiarValor(vista.querySelector('#login-password'), 'secreto');
    enviarFormulario(vista.querySelector('form'));
    expect(JSON.parse(localStorage.getItem('usuarioActivo')).id).toBe(24);
    expect(vista.querySelector('[data-testid="ruta-actual"]').textContent).toBe('/admin');
  });
});
