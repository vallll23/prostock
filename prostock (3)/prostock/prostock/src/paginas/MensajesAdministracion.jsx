import { useCallback, useEffect, useState } from 'react';
import { DisenoAdministracion, usarAccesoAdministracion } from './CompartidoAdministracion.jsx';
import { alternarEstadoMensajeContacto, eliminarMensajeContacto, listarMensajesContacto } from '../servicios/tienda.js';

export function MensajesAdministracion() {
  const ready = usarAccesoAdministracion();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listarMensajesContacto();
      setMessages(data);
      setError('');
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    cargar();
  }, [cargar, ready]);

  if (!ready) return null;

  const toggleMessage = async message => {
    try {
      await alternarEstadoMensajeContacto(message.id);
      setMessages(current => current.map(item => item.id === message.id ? { ...item, atendido: !item.atendido } : item));
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message || 'Error al actualizar estado.' });
    }
  };

  const deleteMessage = async message => {
    if (!window.confirm(`¿Seguro de eliminar el mensaje de "${message.nombre}"?`)) return;
    try {
      await eliminarMensajeContacto(message.id);
      setMessages(current => current.filter(item => item.id !== message.id));
      setFeedback({ type: 'success', message: 'Mensaje eliminado correctamente.' });
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message || 'Error al eliminar el mensaje.' });
    }
  };

  return (
    <DisenoAdministracion activePage="messages">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 m-0">Mensajes de Contacto</h1>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cargar} disabled={loading}>
          <i className="bi bi-arrow-clockwise me-1" /> Actualizar
        </button>
      </div>

      {feedback.message && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show`} role="alert">
          {feedback.message}
          <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setFeedback({ type: '', message: '' })} />
        </div>
      )}

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Asunto</th>
                <th>Mensaje</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Cargando mensajes...</td></tr>
              ) : messages.length ? (
                messages.map(message => (
                  <tr key={message.id}>
                    <td className="fw-medium">{message.nombre}</td>
                    <td><a href={`mailto:${message.email}`}>{message.email}</a></td>
                    <td>{message.asunto}</td>
                    <td style={{ maxWidth: '280px', whiteSpace: 'pre-wrap' }}>{message.mensaje}</td>
                    <td>{message.fecha}</td>
                    <td>
                      <span className={`badge ${message.atendido ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {message.atendido ? 'Atendido' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="text-nowrap">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success me-1"
                        title="Cambiar estado"
                        aria-label={`Cambiar estado de ${message.asunto}`}
                        onClick={() => toggleMessage(message)}
                      >
                        <i className="bi bi-check2" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        title="Eliminar mensaje"
                        aria-label={`Eliminar mensaje ${message.asunto}`}
                        onClick={() => deleteMessage(message)}
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="text-center text-muted py-4">No hay mensajes de contacto.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DisenoAdministracion>
  );
}
