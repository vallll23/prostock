import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, useLocation } from 'react-router-dom';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let contenedor;
let raiz;

export const productoPrueba = {
  id: 17,
  codigo: 'TEST-17',
  nombre: 'Cuaderno de prueba',
  categoria: 'Escolar',
  precio: 2500,
  stock: 3,
  imagen: '/img/cuaderno.jpg',
  imagenes: ['/img/cuaderno.jpg', '/img/cuaderno-2.jpg']
};

export function prepararVista(almacenamiento = {}) {
  localStorage.clear();
  for (const [clave, valor] of Object.entries(almacenamiento)) {
    localStorage.setItem(clave, JSON.stringify(valor));
  }
  contenedor = document.createElement('div');
  document.body.appendChild(contenedor);
  raiz = createRoot(contenedor);
  return contenedor;
}

export function renderizarVista(vista, ruta = '/') {
  act(() => {
    raiz.render(
      <MemoryRouter initialEntries={[ruta]}>
        {vista}
        <UbicacionActual />
      </MemoryRouter>
    );
  });
  return contenedor;
}

export function cambiarValor(elemento, valor) {
  const propiedad = elemento.tagName === 'SELECT' ? 'value' : 'value';
  const prototipo = elemento.tagName === 'TEXTAREA'
    ? HTMLTextAreaElement.prototype
    : elemento.tagName === 'SELECT'
      ? HTMLSelectElement.prototype
      : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(prototipo, propiedad).set;
  act(() => {
    setter.call(elemento, valor);
    elemento.dispatchEvent(new Event(elemento.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
    if (elemento.tagName !== 'SELECT') elemento.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

export function enviarFormulario(formulario) {
  act(() => {
    formulario.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
}

export function hacerClic(elemento) {
  act(() => elemento.click());
}

export function limpiarVista() {
  if (raiz) act(() => raiz.unmount());
  contenedor?.remove();
  localStorage.clear();
  raiz = undefined;
  contenedor = undefined;
}

function UbicacionActual() {
  const ubicacion = useLocation();
  return <output data-testid="ruta-actual">{ubicacion.pathname}</output>;
}

export function usuarioAdministrador(id = 1) {
  return { id, nombre: 'Administradora de prueba', email: 'admin@duoc.cl', password: 'secreto', rol: 'ADMIN' };
}
