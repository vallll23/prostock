import { leerAlmacenamiento, guardarAlmacenamiento } from '../utilidades/almacenamiento.js';

const CLAVE_USUARIO = 'usuarioActivo';

// El backend no maneja roles: los administradores se identifican por correo (solo controla la interfaz).
const correosAdministradores = (import.meta.env?.VITE_ADMIN_EMAILS || 'admin@duoc.cl')
  .split(',')
  .map(correo => correo.trim().toLowerCase())
  .filter(Boolean);

export function normalizarCliente(cliente) {
  const email = String(cliente?.email || '').toLowerCase();
  return {
    id: cliente?.id,
    nombre: cliente?.nombreCompleto ?? cliente?.nombre ?? '',
    email,
    telefono: cliente?.numero ?? cliente?.telefono ?? '',
    direccion: cliente?.direccion || '',
    region: cliente?.region || '',
    comuna: cliente?.comuna || '',
    rol: correosAdministradores.includes(email) ? 'ADMIN' : 'CLIENTE'
  };
}

function notificar() {
  window.dispatchEvent(new Event('storage'));
}

export function obtenerUsuario() {
  return leerAlmacenamiento(CLAVE_USUARIO, null);
}

export function guardarUsuario(usuario) {
  guardarAlmacenamiento(CLAVE_USUARIO, normalizarCliente(usuario));
  notificar();
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_USUARIO);
  notificar();
}
