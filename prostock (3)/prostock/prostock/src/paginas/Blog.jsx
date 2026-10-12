import { DisenoPublico } from './CompartidoTienda.jsx';
import { articulosBlog } from './datosBlog.js';

export function Blog() {
  return (
    <DisenoPublico activePage="blog">
      <header className="text-center mb-5">
        <h1 className="fw-bold display-5">Blog</h1>
        <p className="text-muted">Consejos para gestionar mejor los insumos de tu oficina.</p>
      </header>
      <section className="row justify-content-center g-4" aria-label="Artículos del blog">
        {articulosBlog.map(post => (
          <article className="col-md-6 col-lg-5" key={post.id}>
            <div className="card h-100 border-0 shadow-sm">
              <img src={post.imagen} className="card-img-top object-fit-cover" height="200" alt={post.alt} />
              <div className="card-body d-flex flex-column">
                <span className="badge bg-primary align-self-start mb-2">{post.categoria}</span>
                <h2 className="card-title h4 fw-bold">{post.titulo}</h2>
                <p className="card-text text-muted small flex-grow-1">{post.descripcion}</p>
                <Link to={`/detalle-blog?id=${post.id}`} className="btn btn-primary align-self-start">Leer noticia <i className="bi bi-arrow-right ms-1" /></Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </DisenoPublico>
  );
}
import { Link } from 'react-router-dom';