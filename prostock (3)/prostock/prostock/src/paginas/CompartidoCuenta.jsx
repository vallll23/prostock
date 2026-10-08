import { PieSitio } from '../componentes/PieSitio.jsx';
import { Link } from 'react-router-dom';

export function DisenoCuenta({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src="/img/logo-prostock.svg" className="brand-logo" alt="Prostock" />
          </Link>
        </div>
      </nav>
      <main className="container my-5 flex-grow-1">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">{children}</div>
        </div>
      </main>
      <PieSitio />
    </div>
  );
}

export function AlertaFormulario({ alert }) {
  if (!alert) return null;
  return <div className={`alert alert-${alert.type}`} role="alert">{alert.message}</div>;
}
