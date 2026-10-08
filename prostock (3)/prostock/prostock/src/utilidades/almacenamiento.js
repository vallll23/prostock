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

export function formatearPrecio(value) {
  return `$${Number(value || 0).toLocaleString('es-CL')}`;
}
