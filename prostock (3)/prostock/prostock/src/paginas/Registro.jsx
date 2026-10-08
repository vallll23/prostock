import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import regionsData from '../../data/regiones.json';
import { DisenoCuenta, AlertaFormulario } from './CompartidoCuenta.jsx';
import { leerAlmacenamiento, guardarAlmacenamiento } from '../utilidades/almacenamiento.js';

export function Registro() {
  const navigate = useNavigate();
  const regions = regionsData;
  const [region, setRegion] = useState('');
  const [commune, setCommune] = useState('');
  const [alert, setAlert] = useState(null);

  const communes = regions.find(item => item.region === region)?.comunas || [];

  const submit = event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name')).trim();
    const email = String(form.get('email')).trim().toLowerCase();
    const password = String(form.get('password'));
    const confirmPassword = String(form.get('confirmPassword'));
    const allowedDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];

    if (!allowedDomains.some(domain => email.endsWith(domain))) {
      setAlert({ type: 'danger', message: 'El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com.' });
      return;
    }
    if (password.length < 4 || password.length > 10) {
      setAlert({ type: 'warning', message: 'La contraseña debe tener entre 4 y 10 caracteres.' });
      return;
    }
    if (password !== confirmPassword) {
      setAlert({ type: 'danger', message: 'Las contraseñas no coinciden.' });
      return;
    }

    const users = leerAlmacenamiento('usuarios_db');
    if (users.some(user => user.email === email)) {
      setAlert({ type: 'info', message: 'El correo ya está registrado.' });
      return;
    }

    users.push({
      id: Date.now(),
      nombre: name,
      email,
      password,
      run: String(form.get('run')).trim(),
      region,
      comuna: commune,
      direccion: String(form.get('address')).trim(),
      rol: 'CLIENTE'
    });
    guardarAlmacenamiento('usuarios_db', users);
    setAlert({ type: 'success', message: '¡Cuenta creada con éxito! Redirigiendo al login...' });
    event.currentTarget.reset();
    setRegion('');
    setCommune('');
    window.setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <DisenoCuenta>
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h1 className="h3 text-center mb-4">Crear una Cuenta</h1>
          <AlertaFormulario alert={alert} />
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="register-name">Nombre Completo</label>
              <input id="register-name" name="name" className="form-control" required placeholder="Juan Pérez" />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="register-email">Correo Electrónico</label>
              <input id="register-email" name="email" className="form-control" type="email" required placeholder="usuario@duoc.cl / gmail.com" />
              <div className="form-text">Dominios aceptados: @duoc.cl, @profesor.duoc.cl, @gmail.com</div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="register-run">RUN</label>
              <input id="register-run" name="run" className="form-control" required placeholder="12.345.678-9" />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label" htmlFor="register-region">Región</label>
                <select id="register-region" className="form-select" required value={region} onChange={event => { setRegion(event.target.value); setCommune(''); }}>
                  <option value="">{regions.length ? 'Seleccione una región...' : 'Cargando regiones...'}</option>
                  {regions.map(item => <option key={item.region} value={item.region}>{item.region}</option>)}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label" htmlFor="register-commune">Comuna</label>
                <select id="register-commune" className="form-select" required disabled={!region} value={commune} onChange={event => setCommune(event.target.value)}>
                  <option value="">{region ? 'Seleccione una comuna...' : 'Seleccione primero una región'}</option>
                  {communes.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="register-address">Dirección de despacho</label>
              <input id="register-address" name="address" className="form-control" required placeholder="Ej: Av. Principal 123, Santiago" />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label" htmlFor="register-password">Contraseña</label>
                <input id="register-password" name="password" className="form-control" type="password" minLength="4" maxLength="10" required />
                <div className="form-text">De 4 a 10 caracteres.</div>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label" htmlFor="register-confirm">Confirmar Contraseña</label>
                <input id="register-confirm" name="confirmPassword" className="form-control" type="password" required />
              </div>
            </div>
            <button type="submit" className="btn btn-success w-100 fw-bold py-2 mt-3">Registrarse</button>
          </form>
          <p className="text-center mt-3 mb-0 small">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </div>
      </div>
    </DisenoCuenta>
  );
}
