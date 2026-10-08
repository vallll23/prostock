import { useEffect, useState } from 'react';
import { DisenoFormularioAdministracion, DisenoAdministracion, categories, usarAccesoAdministracion, usarInventarioProductos } from './CompartidoAdministracion.jsx';
import { formatearPrecio, leerAlmacenamiento, guardarAlmacenamiento } from '../utilidades/almacenamiento.js';

export function MensajesAdministracion() {
  const ready = usarAccesoAdministracion();
  const [messages, setMessages] = useState(() => leerAlmacenamiento('mensajes_contacto_db'));
  if (!ready) return null;

  const saveMessages = nextMessages => {
    setMessages(nextMessages);
    guardarAlmacenamiento('mensajes_contacto_db', nextMessages);
  };
  const toggleMessage = message => saveMessages(messages.map(item => item.id === message.id ? { ...item, atendido: !item.atendido } : item));
  const deleteMessage = message => {
    if (window.confirm('¿Seguro de eliminar este mensaje?')) saveMessages(messages.filter(item => item.id !== message.id));
  };

  return (
    <DisenoAdministracion activePage="messages">
      <h1 className="h3 mb-3">Mensajes de Contacto</h1>
      <div className="card border-0 shadow-sm">
        <div className="table-responsive"><table className="table table-hover align-middle mb-0">
          <thead className="table-dark"><tr><th>Nombre</th><th>Correo</th><th>Asunto</th><th>Mensaje</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>{messages.length ? messages.map(message => <tr key={message.id}><td>{message.nombre}</td><td>{message.email}</td><td>{message.asunto}</td><td>{message.mensaje}</td><td>{message.fecha}</td><td><span className={`badge ${message.atendido ? 'bg-success' : 'bg-warning text-dark'}`}>{message.atendido ? 'Atendido' : 'Pendiente'}</span></td><td className="text-nowrap"><button type="button" className="btn btn-sm btn-outline-success me-1" title="Cambiar estado" aria-label={`Cambiar estado de ${message.asunto}`} onClick={() => toggleMessage(message)}><i className="bi bi-check2" /></button><button type="button" className="btn btn-sm btn-outline-danger" title="Eliminar mensaje" aria-label={`Eliminar mensaje ${message.asunto}`} onClick={() => deleteMessage(message)}><i className="bi bi-trash" /></button></td></tr>) : <tr><td colSpan="7" className="text-center text-muted py-4">No hay mensajes de contacto.</td></tr>}</tbody>
        </table></div>
      </div>
    </DisenoAdministracion>
  );
}
