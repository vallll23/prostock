import { IniciarSesion } from '../../paginas/IniciarSesion.jsx';
import { cambiarValor, configurarMockApi, enviarFormulario, esperar, limpiarVista, prepararVista, renderizarVista, usuarioAdministrador } from '../utilidades/pruebasReact.js';

describe('Vista de inicio de sesión', () => {
  let restaurarApi;
  beforeEach(() => {
    prepararVista();
  });
  afterEach(() => {
    if (restaurarApi) restaurarApi();
    limpiarVista();
  });

  it('muestra un error al ingresar credenciales inválidas', async () => {
    restaurarApi = configurarMockApi(async (ruta, metodo) => {
      if (ruta === '/api/clientes/login' && metodo === 'POST') {
        return { status: 401, body: { message: 'Credenciales inválidas' } };
      }
    });

    const vista = renderizarVista(<IniciarSesion />, '/login');
    cambiarValor(vista.querySelector('#login-email'), 'invalido@duoc.cl');
    cambiarValor(vista.querySelector('#login-password'), 'incorrecta');
    enviarFormulario(vista.querySelector('form'));
    await esperar(30);

    expect(vista.querySelector('[role="alert"]').textContent).toContain('Credenciales inválidas');
    expect(localStorage.getItem('usuarioActivo')).toBeNull();
  });

  it('guarda el usuario y navega al panel con credenciales correctas', async () => {
    const admin = usuarioAdministrador(24);
    restaurarApi = configurarMockApi(async (ruta, metodo) => {
      if (ruta === '/api/clientes/login' && metodo === 'POST') {
        return { status: 200, body: { id: admin.id, nombreCompleto: admin.nombre, email: admin.email, rol: 'ADMIN' } };
      }
      if (ruta === `/api/clientes/${admin.id}/carrito`) {
        return { status: 200, body: { items: [], total: 0 } };
      }
    });

    const vista = renderizarVista(<IniciarSesion />, '/login');
    cambiarValor(vista.querySelector('#login-email'), 'admin@duoc.cl');
    cambiarValor(vista.querySelector('#login-password'), 'secreto');
    enviarFormulario(vista.querySelector('form'));
    await esperar(30);

    expect(JSON.parse(localStorage.getItem('usuarioActivo')).id).toBe(24);
    expect(vista.querySelector('[data-testid="ruta-actual"]').textContent).toBe('/admin');
  });
});
