export function leerAlmacenamiento(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`No se pudo leer ${key} desde el almacenamiento local.`, error);
    return fallback;
  }
}

export function guardarAlmacenamiento(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function asegurarAdministradorInicial() {
  const users = leerAlmacenamiento('usuarios_db');
  if (users.some(user => user.email === 'admin@duoc.cl')) return;

  users.push({
    id: 999,
    nombre: 'Administrador Prostock',
    email: 'admin@duoc.cl',
    password: 'admin123',
    rol: 'ADMIN'
  });
  guardarAlmacenamiento('usuarios_db', users);
}

export function formatearPrecio(value) {
  return `$${Number(value || 0).toLocaleString('es-CL')}`;
}
