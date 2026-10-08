import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DisenoFormularioAdministracion, DisenoAdministracion, usarAccesoAdministracion } from './CompartidoAdministracion.jsx';
import { obtenerUsuario } from '../servicios/sesion.js';
import { eliminarCliente, listarClientes } from '../servicios/tienda.js';

export function UsuariosAdministracion() {
  const ready = usarAccesoAdministracion();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return undefined;
    let activo = true;
    listarClientes()
      .then(items => activo && setUsers(items))
      .catch(loadError => activo && setError(loadError.message))
      .finally(() => activo && setLoading(false));
    return () => {
      activo = false;
    };
  }, [ready]);

  if (!ready) return null;

  const removeUser = async user => {
    const activeUser = obtenerUsuario();
    if (activeUser?.id === user.id) {
      window.alert('No puedes eliminar la cuenta con la que iniciaste sesión.');
      return;
    }
    if (!window.confirm('¿Seguro de eliminar este usuario?')) return;
    try {
      await eliminarCliente(user.id);
      setUsers(current => current.filter(item => item.id !== user.id));
    } catch (removeError) {
      window.alert(removeError.message);
    }
  };

  return (
    <DisenoAdministracion activePage="users">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 m-0">Gestión de Usuarios</h1>
        <Link to="/admin/usuario" className="btn btn-primary"><i className="bi bi-person-plus me-1" /> Nuevo Usuario</Link>
      </div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="card border-0 shadow-sm">
        <div className="table-responsive"><table className="table table-hover align-middle mb-0">
          <thead className="table-dark"><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th></tr></thead>
          <tbody>{users.map(user => <tr key={user.id}><td>{user.nombre}</td><td>{user.email}</td><td><span className={`badge ${user.rol === 'ADMIN' ? 'bg-danger' : 'bg-secondary'}`}>{user.rol}</span></td><td className="text-nowrap"><Link to={`/admin/usuario?id=${user.id}`} className="btn btn-sm btn-warning me-1" aria-label={`Editar ${user.nombre}`}><i className="bi bi-pencil" /></Link><button type="button" className="btn btn-sm btn-danger" aria-label={`Eliminar ${user.nombre}`} onClick={() => removeUser(user)}><i className="bi bi-trash" /></button></td></tr>)}{!users.length && <tr><td colSpan="4" className="text-center text-muted py-4">{loading ? 'Cargando usuarios...' : 'No hay usuarios registrados.'}</td></tr>}</tbody>
        </table></div>
      </div>
    </DisenoAdministracion>
  );
}
