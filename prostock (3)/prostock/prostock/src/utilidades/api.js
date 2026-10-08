export const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8080';

async function leerError(respuesta) {
  const porDefecto = {
    400: 'Solicitud inválida.',
    401: 'Credenciales inválidas o sesión expirada.',
    403: 'No tienes permisos para esta acción.',
    404: 'No se encontró el recurso solicitado.',
    409: 'El recurso ya existe o está en conflicto.'
  };
  try {
    const cuerpo = await respuesta.text();
    if (cuerpo) {
      try {
        const datos = JSON.parse(cuerpo);
        if (typeof datos === 'string') return datos;
        if (datos?.message || datos?.mensaje || datos?.error) return datos.message || datos.mensaje || datos.error;
      } catch {
        if (cuerpo.length < 200) return cuerpo;
      }
    }
  } catch {
    // Se usa el mensaje por defecto.
  }
  return porDefecto[respuesta.status] || `Error del servidor (${respuesta.status}).`;
}

export async function api(ruta, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      ...opciones,
      headers: { 'Content-Type': 'application/json', ...opciones.headers },
      body: opciones.body !== undefined ? JSON.stringify(opciones.body) : undefined
    });
  } catch {
    const error = new Error('No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.');
    error.status = 0;
    throw error;
  }
  if (!respuesta.ok) {
    const error = new Error(await leerError(respuesta));
    error.status = respuesta.status;
    throw error;
  }
  if (respuesta.status === 204) return null;
  const texto = await respuesta.text();
  if (!texto) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}
