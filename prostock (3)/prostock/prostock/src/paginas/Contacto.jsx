import { useState } from 'react';
import { DisenoPublico } from './CompartidoTienda.jsx';
import { leerAlmacenamiento, guardarAlmacenamiento } from '../utilidades/almacenamiento.js';

export function Contacto() {
  const [sent, setSent] = useState(false);

  const submit = event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const messages = leerAlmacenamiento('mensajes_contacto_db');
    messages.push({
      id: Date.now(),
      nombre: String(form.get('name')).trim(),
      email: String(form.get('email')).trim().toLowerCase(),
      asunto: String(form.get('subject')).trim(),
      mensaje: String(form.get('message')).trim(),
      fecha: new Date().toLocaleDateString('es-CL'),
      atendido: false
    });
    guardarAlmacenamiento('mensajes_contacto_db', messages);
    event.currentTarget.reset();
    setSent(true);
  };

  return (
    <DisenoPublico activePage="contact">
      <h1 className="h2 mb-4 text-center">Formulario de Contacto</h1>
      <div className="row g-4">
        <div className="col-md-7">
          <div className="card shadow-sm border-0 p-4">
            {sent && <div className="alert alert-success alert-dismissible" role="status">Gracias por contactarnos. Tu mensaje fue enviado correctamente.<button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setSent(false)} /></div>}
            <form onSubmit={submit}>
              <div className="mb-3"><label className="form-label" htmlFor="contact-name">Nombre Completo</label><input id="contact-name" name="name" className="form-control" required placeholder="Ej: Ana López" /></div>
              <div className="mb-3"><label className="form-label" htmlFor="contact-email">Correo Electrónico</label><input id="contact-email" name="email" className="form-control" type="email" required placeholder="correo@ejemplo.com" /></div>
              <div className="mb-3"><label className="form-label" htmlFor="contact-subject">Asunto</label><input id="contact-subject" name="subject" className="form-control" required placeholder="Consulta sobre cotización / stock" /></div>
              <div className="mb-3"><label className="form-label" htmlFor="contact-message">Mensaje</label><textarea id="contact-message" name="message" className="form-control" rows="4" required placeholder="Escribe tu mensaje aquí..." /></div>
              <button type="submit" className="btn btn-primary w-100 fw-bold">Enviar Mensaje</button>
            </form>
          </div>
        </div>
        <aside className="col-md-5">
          <div className="card shadow-sm border-0 p-4 h-100 bg-light">
            <h2 className="h4 mb-4">Información de Atención</h2>
            <p><i className="bi bi-geo-alt-fill text-primary me-2" /><strong>Dirección:</strong> Av. Providencia 1234, Santiago, Chile</p>
            <p><i className="bi bi-telephone-fill text-primary me-2" /><strong>Teléfono:</strong> +56 2 2987 6543</p>
            <p><i className="bi bi-envelope-fill text-primary me-2" /><strong>Email:</strong> contacto@prostock.cl</p>
            <p><i className="bi bi-clock-fill text-primary me-2" /><strong>Horario:</strong> Lunes a Viernes de 09:00 a 18:00 hrs</p>
          </div>
        </aside>
      </div>
    </DisenoPublico>
  );
}
