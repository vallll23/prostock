import { DisenoPublico, blogImage, blogTitle } from './CompartidoTienda.jsx';

export function Blog() {
  return (
    <DisenoPublico activePage="blog">
      <header className="text-center mb-5">
        <h1 className="fw-bold display-5">Blog</h1>
        <p className="text-muted">Consejos para gestionar mejor los insumos de tu oficina.</p>
      </header>
      <section className="row justify-content-center" aria-label="Artículos del blog">
        <article className="col-md-8 col-lg-7">
          <div className="card h-100 border-0 shadow-sm">
            <img src={blogImage} className="card-img-top object-fit-cover" height="200" alt="Oficina organizada con insumos y papelería" />
            <div className="card-body d-flex flex-column">
              <span className="badge bg-primary align-self-start mb-2">Consejos</span>
              <h2 className="card-title h4 fw-bold">{blogTitle}</h2>
              <p className="card-text text-muted small flex-grow-1">Aprende a gestionar el stock de papelería e insumos para evitar pérdidas y desabastecimiento.</p>
              <Link to="/detalle-blog" className="btn btn-primary align-self-start">Leer noticia <i className="bi bi-arrow-right ms-1" /></Link>
              <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top text-muted small">
                <i className="bi bi-calendar3" /><time dateTime="2026-05-12">12 de Mayo, 2026</time>
              </div>
            </div>
          </div>
        </article>
      </section>
    </DisenoPublico>
  );
}
import { Link } from 'react-router-dom';
