import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DisenoFormularioAdministracion, usarAccesoAdministracion } from './CompartidoAdministracion.jsx';
import { guardarUsuario, obtenerUsuario } from '../servicios/sesion.js';
import { actualizarCliente, obtenerCliente, registrarCliente } from '../servicios/tienda.js';

export function FormularioUsuarioAdministracion() {
  const navigate = useNavigate();
  const ready = usarAccesoAdministracion();
  const userId = new URLSearchParams(window.location.search).get('id');
  const [existing, setExisting] = useState(null);
  const [form, setForm] = useState(null);
  const [alert, setAlert] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ready) return undefined;
    if (!userId) {
      setForm({ nombre: '', email: '', password: '', confirmPassword: '' });
      return undefined;
    }
    let activo = true;
    obtenerCliente(userId)
      .then(user => {
        if (!activo) return;
        setExisting(user);
        setForm({ nombre: user.nombre, email: user.email, password: '', confirmPassword: '' });
      })
      .catch(() => {
        if (!activo) return;
        window.alert('Usuario no encontrado.');
        navigate('/admin/usuarios', { replace: true });
      });
    return () => {
      activo = false;
    };
  }, [navigate, ready, userId]);

  if (!ready || !form) return null;
  const updateField = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async event => {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    const allowedDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    if (!allowedDomains.some(domain => email.endsWith(domain))) {
      setAlert('El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.');
      return;
    }
    if (!existing && !form.password) {
      setAlert('Debes definir una contraseña para el nuevo usuario.');
      return;
    }
    if (form.password && (form.password.length < 4 || form.password.length > 10)) {
      setAlert('La contraseña debe tener entre 4 y 10 caracteres.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setAlert('Las contraseñas no coinciden.');
      return;
    }
    const data = { ...existing, nombre: form.nombre.trim(), email, password: form.password };
    setSaving(true);
    try {
      const saved = existing ? await actualizarCliente(existing.id, data) : await registrarCliente(data);
      if (obtenerUsuario()?.id === saved.id) guardarUsuario(saved);
      navigate('/admin/usuarios');
    } catch (saveError) {
      setAlert(saveError.status === 409 ? 'El correo ya está registrado.' : saveError.message);
      setSaving(false);
    }
  };

  return (
    <DisenoFormularioAdministracion>
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h1 className="h4 mb-4">Administrar Usuario</h1>
          {alert && <div className="alert alert-danger" role="alert">{alert}</div>}
          <form onSubmit={submit}>
            <div className="mb-3"><label className="form-label" htmlFor="user-name">Nombre Completo</label><input id="user-name" name="nombre" className="form-control" required value={form.nombre} onChange={updateField} /></div>
            <div className="mb-3"><label className="form-label" htmlFor="user-email">Correo Electrónico</label><input id="user-email" name="email" type="email" className="form-control" required value={form.email} onChange={updateField} /></div>
            <div className="mb-3"><label className="form-label" htmlFor="user-password">Contraseña</label><input id="user-password" name="password" type="password" minLength="4" maxLength="10" className="form-control" placeholder="Dejar en blanco para mantener la actual" value={form.password} onChange={updateField} /></div>
            <div className="mb-3"><label className="form-label" htmlFor="user-confirm">Confirmar contraseña</label><input id="user-confirm" name="confirmPassword" type="password" minLength="4" maxLength="10" className="form-control" placeholder="Repite la contraseña si la modificas" value={form.confirmPassword} onChange={updateField} /></div>
            <div className="d-flex justify-content-between pt-2"><Link to="/admin/usuarios" className="btn btn-outline-secondary">Cancelar</Link><button type="submit" className="btn btn-success" disabled={saving}>{saving ? 'Guardando...' : 'Guardar Usuario'}</button></div>
          </form>
        </div>
      </div>
    </DisenoFormularioAdministracion>
  );
}
