import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
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
    setAlert(null);

    try {
      const user = await iniciarSesion(
        email.trim().toLowerCase(),
        password
      );
      navigate(user.rol === 'ADMIN' ? '/admin' : '/');
    } catch (error) {
      setAlert({
        type: 'danger',
        message:
          error.status === 401
            ? 'Credenciales inválidas. Inténtalo nuevamente.'
            : error.message
      });
    } finally {
      setBusy(false);
    }
  };

  const iniciarConGoogle = credentialResponse => {
    if (!credentialResponse.credential) {
      setAlert({
        type: 'danger',
        message: 'Google no devolvió una credencial válida.'
      });
      return;
    }

    setAlert({
      type: 'info',
      message:
        'Google verificó tu acceso. Falta conectar la autenticación con el backend para iniciar sesión en ProStock.'
    });

    // La credencial deberá enviarse al backend para validarla
    // y crear o recuperar la cuenta de ProStock.
    console.log('Credencial de Google recibida correctamente.');
  };

  return (
    <DisenoCuenta>
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h1 className="h3 text-center mb-4">
            Iniciar sesión
          </h1>

          <AlertaFormulario alert={alert} />

          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="login-email">
                Correo electrónico
              </label>
              <input
                id="login-email"
                className="form-control"
                type="email"
                required
                placeholder="correo@duoc.cl"
                value={email}
                onChange={event => setEmail(event.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="login-password">
                Contraseña
              </label>
              <input
                id="login-password"
                className="form-control"
                type="password"
                required
                value={password}
                onChange={event => setPassword(event.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 fw-bold py-2"
              disabled={busy}
            >
              {busy ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className="text-center my-3">
            <span className="text-muted">O continúa con</span>
          </div>

          <div className="d-flex justify-content-center">
            <GoogleLogin
              onSuccess={iniciarConGoogle}
              onError={() =>
                setAlert({
                  type: 'danger',
                  message: 'No se pudo iniciar sesión con Google.'
                })
              }
              text="continue_with"
              shape="rectangular"
              width="300"
            />
          </div>

          <p className="text-center mt-3 mb-0 small">
            ¿No tienes cuenta?{' '}
            <Link to="/registro">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </DisenoCuenta>
  );
}