import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DisenoCuenta, AlertaFormulario } from './CompartidoCuenta.jsx';
import { iniciarSesion } from '../servicios/tienda.js';

export function IniciarSesion() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(null);

  const [busy, setBusy] = useState(false);

  const submit = async event => {
    event.preventDefault();
    setBusy(true);
    try {
      const user = await iniciarSesion(email.trim().toLowerCase(), password);
      navigate(user.rol === 'ADMIN' ? '/admin' : '/');
    } catch (error) {
      setAlert({ type: 'danger', message: error.status === 401 ? 'Credenciales inválidas. Inténtalo nuevamente.' : error.message });
      setBusy(false);
    }
  };

  return (
    <DisenoCuenta>
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h1 className="h3 text-center mb-4">Iniciar Sesión</h1>
          <AlertaFormulario alert={alert} />
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="login-email">Correo Electrónico</label>
              <input id="login-email" className="form-control" type="email" required placeholder="correo@duoc.cl" value={email} onChange={event => setEmail(event.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="login-password">Contraseña</label>
              <input id="login-password" className="form-control" type="password" required value={password} onChange={event => setPassword(event.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-bold py-2" disabled={busy}>{busy ? 'Ingresando...' : 'Ingresar'}</button>
          </form>
          <p className="text-center mt-3 mb-0 small">¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
        </div>
      </div>
    </DisenoCuenta>
  );
}
