import { CategoriasAdministracion } from '../../paginas/CategoriasAdministracion.jsx';
import { configurarMockApi, esperar, hacerClic, limpiarVista, prepararVista, renderizarVista, usuarioAdministrador } from '../utilidades/pruebasReact.js';

describe('Vista de administración de categorías', () => {
  let restaurarApi;

  beforeEach(() => {
    prepararVista({ usuarioActivo: usuarioAdministrador() });
  });

  afterEach(() => {
    if (restaurarApi) restaurarApi();
    limpiarVista();
  });

  it('lista las categorías obtenidas del backend', async () => {
    restaurarApi = configurarMockApi(async (ruta, metodo) => {
      if (ruta === '/api/categorias' && metodo === 'GET') {
        return {
          status: 200,
          body: [
            { id: 1, nombre: 'Papelería y Oficina', descripcion: 'Artículos de oficina' },
            { id: 2, nombre: 'Escolar', descripcion: 'Cuadernos y lápices' }
          ]
        };
      }
    });

    const vista = renderizarVista(<CategoriasAdministracion />, '/admin/categorias');
    await esperar(30);

    expect(vista.querySelector('h1').textContent).toContain('Gestión de Categorías');
    expect(vista.textContent).toContain('Papelería y Oficina');
    expect(vista.textContent).toContain('Escolar');
  });

  it('abre el modal para crear una nueva categoría', async () => {
    restaurarApi = configurarMockApi(async (ruta) => {
      if (ruta === '/api/categorias') return { status: 200, body: [] };
    });

    const vista = renderizarVista(<CategoriasAdministracion />, '/admin/categorias');
    await esperar(30);

    const botonNuevo = vista.querySelector('button.btn-primary');
    expect(botonNuevo.textContent).toContain('Nueva Categoría');

    hacerClic(botonNuevo);
    await esperar(20);

    expect(vista.querySelector('.modal-title').textContent).toContain('Nueva Categoría');
    expect(vista.querySelector('#cat-nombre')).not.toBeNull();
  });
});
