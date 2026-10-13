import { TarjetaProducto } from '../../componentes/TarjetaProducto.jsx';
import { limpiarVista, prepararVista, renderizarVista } from '../utilidades/pruebasReact.js';

describe('Componente TarjetaProducto (Pruebas de Props, Renderizado y Eventos)', () => {
  beforeEach(() => prepararVista());
  afterEach(limpiarVista);

  it('recibe propiedades (props) y renderiza la información y descuento condicional correctamente', () => {
    const productoConDescuento = {
      id: 99,
      codigo: 'PRO-99',
      nombre: 'Tijeras de Oficina',
      categoria: 'Papelería y Oficina',
      precio: 4000,
      descuento: 25,
      precioFinal: 3000,
      stock: 12,
      imagen: '/img/tijeras.jpg'
    };

    const vista = renderizarVista(<TarjetaProducto product={productoConDescuento} />);
    expect(vista.querySelector('.card-title').textContent).toBe('Tijeras de Oficina');
    expect(vista.querySelector('.badge.bg-light').textContent).toBe('Papelería y Oficina');
    expect(vista.textContent).toContain('Código: PRO-99');
    expect(vista.textContent).toContain('$3.000');
    expect(vista.textContent).toContain('$4.000');
    expect(vista.querySelector('.badge.bg-danger').textContent).toBe('-25%');
    expect(vista.querySelector('button.btn-primary').disabled).toBeFalse();
    expect(vista.querySelector('button.btn-primary').textContent).toContain('Agregar al carrito');
  });

  it('deshabilita el botón si no hay stock (renderizado condicional)', () => {
    const productoAgotado = {
      id: 100,
      codigo: 'PRO-100',
      nombre: 'Destacador Verde',
      categoria: 'Escolar',
      precio: 890,
      descuento: 0,
      precioFinal: 890,
      stock: 0,
      imagen: '/img/destacador.jpg'
    };

    const vista = renderizarVista(<TarjetaProducto product={productoAgotado} />);
    const boton = vista.querySelector('button.btn-primary');
    expect(boton.disabled).toBeTrue();
    expect(boton.textContent).toContain('Sin stock');
    expect(vista.querySelector('.badge.bg-danger')).toBeNull();
  });

  it('no asigna una ruta vacía cuando el producto no tiene imagen', () => {
    const productoSinImagen = {
      id: 101,
      codigo: 'PRO-101',
      nombre: 'Producto sin imagen',
      categoria: 'Escolar',
      precio: 1000,
      precioFinal: 1000,
      stock: 1,
      imagen: ''
    };

    const vista = renderizarVista(<TarjetaProducto product={productoSinImagen} />);
    expect(vista.querySelector('.product-card-image').getAttribute('src')).toBeNull();
  });
});
