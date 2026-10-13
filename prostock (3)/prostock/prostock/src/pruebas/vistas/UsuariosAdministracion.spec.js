import { UsuariosAdministracion } from '../../paginas/UsuariosAdministracion.jsx';
import { configurarMockApi, esperar, limpiarVista, prepararVista, renderizarVista, usuarioAdministrador } from '../utilidades/pruebasReact.js';

describe('Vista de usuarios de administración', () => {
  let restaurarApi;
  beforeEach(() => {
    prepararVista({
      usuarioActivo: usuarioAdministrador()
    });
  });
  afterEach(() => {
    if (restaurarApi) restaurarApi();
    limpiarVista();
  });

  it('lista los usuarios registrados y ofrece editar cada uno', async () => {
    restaurarApi = configurarMockApi(async (ruta) => {
      if (ruta === '/api/clientes') {
        return {
          status: 200,
          body: [
            usuarioAdministrador(),
            { id: 25, nombreCompleto: 'Cliente de prueba', email: 'cliente@gmail.com', rol: 'CLIENTE' }
          ]
        };
      }
    });

    const vista = renderizarVista(<UsuariosAdministracion />, '/admin/usuarios');
    await esperar(30);

    expect(vista.querySelector('h1').textContent).toContain('Gestión de Usuarios');
    expect(vista.textContent).toContain('Administradora de prueba');
    expect(vista.textContent).toContain('Cliente de prueba');
    expect(vista.querySelector('a[href="/admin/usuario?id=25"]')).not.toBeNull();
  });
});
