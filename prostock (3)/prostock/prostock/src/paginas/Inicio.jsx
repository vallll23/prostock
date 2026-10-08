import { Link } from 'react-router-dom';
import { CatalogoProductos } from './CatalogoProductos.jsx';
import { PieSitio } from '../componentes/PieSitio.jsx';
import { EncabezadoSitio } from '../componentes/EncabezadoSitio.jsx';

export function Inicio() {
  return (
    <>
      <EncabezadoSitio activePage="home" />
      <div className="home-notice">
        <div className="container d-flex flex-wrap justify-content-center gap-4 gap-md-5">
          <span><i className="bi bi-truck" /> Despachos rápidos</span>
          <span><i className="bi bi-box-seam" /> Stock actualizado</span>
          <span><i className="bi bi-shield-check" /> Compra segura</span>
        </div>
      </div>
      <header className="home-hero mb-5">
        <div className="container">
          <div className="home-hero-content">
            <p className="home-hero-kicker">PROSTOCK / TIENDA ONLINE</p>
            <h1>Todo para tu oficina, en un solo lugar.</h1>
            <p className="home-hero-copy">Encuentra papelería, artículos escolares e insumos para mantener tu día en movimiento.</p>
            <Link to="/productos" className="btn btn-warning btn-lg fw-bold mt-3">
              Comprar ahora <i className="bi bi-arrow-right ms-2" />
            </Link>
          </div>
        </div>
      </header>
      <CatalogoProductos featuredOnly showHomeSections />
      <PieSitio />
    </>
  );
}
