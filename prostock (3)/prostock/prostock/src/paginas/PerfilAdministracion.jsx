import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DisenoAdministracion, usarAccesoAdministracion } from './CompartidoAdministracion.jsx';
import { guardarUsuario, obtenerUsuario } from '../servicios/sesion.js';
import { actualizarCliente, obtenerCliente } from '../servicios/tienda.js';

export function PerfilAdministracion() {
  const ready = usarAccesoAdministracion();
  const activeUser = obtenerUsuario();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!ready || !activeUser?.id) return undefined;
    let activo = true;
    obtenerCliente(activeUser.id)
      .then(user => activo && setForm({ nombre: user.nombre, email: user.email, telefono: user.telefono, direccion: user.direccion, region: user.region, comuna: user.comuna }))
      .catch(loadError => activo && setError(loadError.message))
      .finally(() => activo && setLoading(false));
    return () => {
      activo = false;
    };
  }, [activeUser?.id, ready]);

  if (!ready) return null;
  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const save = async event => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const user = await actualizarCliente(activeUser.id, form);
      guardarUsuario(user);
      setForm(current => ({ ...current, nombre: user.nombre, telefono: user.telefono, direccion: user.direccion, region: user.region, comuna: user.comuna }));
      setSaved(true);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DisenoAdministracion activePage="profile">
      <h1 className="h3 mb-3">Mi perfil de administrador</h1>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {saved && <div className="alert alert-success" role="status">Perfil actualizado correctamente.</div>}
      {loading ? <p className="text-muted" role="status">Cargando perfil...</p> : form && (
        <div className="card border-0 shadow-sm"><div className="card-body">
          <form onSubmit={save}>
            <div className="mb-3"><label htmlFor="admin-profile-name" className="form-label">Nombre completo</label><input id="admin-profile-name" name="nombre" className="form-control" required value={form.nombre} onChange={update} /></div>
            <div className="mb-3"><label htmlFor="admin-profile-email" className="form-label">Correo electrónico</label><input id="admin-profile-email" className="form-control" type="email" value={form.email} readOnly /><div className="form-text">El correo identifica la cuenta administradora y no puede modificarse aquí.</div></div>
            <div className="mb-3"><label htmlFor="admin-profile-phone" className="form-label">Teléfono</label><input id="admin-profile-phone" name="telefono" className="form-control" type="tel" pattern="[0-9]{9}" minLength="9" maxLength="9" inputMode="numeric" required value={form.telefono} onChange={update} /></div>
            <div className="mb-3"><label htmlFor="admin-profile-address" className="form-label">Dirección</label><input id="admin-profile-address" name="direccion" className="form-control" required value={form.direccion} onChange={update} /></div>
            <div className="row"><div className="col-md-6 mb-3"><label htmlFor="admin-profile-region" className="form-label">Región</label><input id="admin-profile-region" name="region" className="form-control" required value={form.region} onChange={update} /></div><div className="col-md-6 mb-3"><label htmlFor="admin-profile-commune" className="form-label">Comuna</label><input id="admin-profile-commune" name="comuna" className="form-control" required value={form.comuna} onChange={update} /></div></div>
            <div className="d-flex gap-2"><button type="submit" className="btn btn-success" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button><Link to="/admin" className="btn btn-outline-secondary">Volver al panel</Link></div>
          </form>
        </div></div>
      )}
    </DisenoAdministracion>
  );
}
