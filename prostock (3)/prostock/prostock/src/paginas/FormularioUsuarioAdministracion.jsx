import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DisenoFormularioAdministracion, DisenoAdministracion, categories, usarAccesoAdministracion, usarInventarioProductos } from './CompartidoAdministracion.jsx';
import { formatearPrecio, leerAlmacenamiento, guardarAlmacenamiento } from '../utilidades/almacenamiento.js';

export function FormularioUsuarioAdministracion() {
  const navigate = useNavigate();
  const ready = usarAccesoAdministracion();
  const userId = new URLSearchParams(window.location.search).get('id');
  const users = leerAlmacenamiento('usuarios_db');
  const existing = users.find(user => user.id === Number(userId));
  const [form, setForm] = useState(null);
  const [alert, setAlert] = useState('');

  useEffect(() => {
    if (userId && !existing) {
      window.alert('Usuario no encontrado.');
      navigate('/admin/usuarios', { replace: true });
      return;
    }
    if (!form) setForm({
      nombre: existing?.nombre || '',
      email: existing?.email || '',
      password: '',
      confirmPassword: '',
      rol: existing?.rol || 'CLIENTE'
    });
  }, [existing, form, navigate, userId]);

  if (!ready || !form) return null;
  const updateField = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const submit = event => {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    const allowedDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    if (!allowedDomains.some(domain => email.endsWith(domain))) {
      setAlert('El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.');
      return;
    }
    if (users.some(user => user.email === email && user.id !== Number(userId))) {
      setAlert('El correo ya está registrado.');
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
    const savedUser = {
      ...existing,
      id: existing?.id || Date.now(),
      nombre: form.nombre.trim(),
      email,
      rol: form.rol,
      ...(form.password ? { password: form.password } : {})
    };
    const nextUsers = existing
      ? users.map(user => user.id === existing.id ? savedUser : user)
      : [...users, savedUser];
    guardarAlmacenamiento('usuarios_db', nextUsers);
    const activeUser = leerAlmacenamiento('usuarioActivo', null);
    if (activeUser?.id === savedUser.id) guardarAlmacenamiento('usuarioActivo', savedUser);
    navigate('/admin/usuarios');
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
            <div className="mb-3"><label className="form-label" htmlFor="user-role">Rol del Sistema</label><select id="user-role" name="rol" className="form-select" required value={form.rol} onChange={updateField}><option value="CLIENTE">CLIENTE</option><option value="ADMIN">ADMIN</option></select></div>
            <div className="d-flex justify-content-between pt-2"><Link to="/admin/usuarios" className="btn btn-outline-secondary">Cancelar</Link><button type="submit" className="btn btn-success">Guardar Usuario</button></div>
          </form>
        </div>
      </div>
    </DisenoFormularioAdministracion>
  );
}
