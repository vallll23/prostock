import { DisenoPublico } from './CompartidoTienda.jsx';
import { articulosBlog } from './datosBlog.js';

export function DetalleBlog() {
  const postId = new URLSearchParams(window.location.search).get('id');
  const post = articulosBlog.find(item => item.id === postId) ?? articulosBlog[0];

  return (
    <DisenoPublico activePage="blog">
      <article className="row justify-content-center">
        <div className="col-lg-8">
          <Link to="/blogs" className="text-decoration-none"><i className="bi bi-arrow-left" /> Volver al blog</Link>
          <p className="text-primary text-uppercase small fw-bold mt-4 mb-2">{post.categoria}</p>
          <h1 className="fw-bold mb-3">{post.titulo}</h1>
          <p className="text-muted"><i className="bi bi-calendar3 me-2" />{post.fecha}</p>
          <img src={post.imagen} className="img-fluid rounded shadow-sm my-4" alt={post.alt} />
          <p>{post.introduccion}</p>
          {post.secciones.map(([title, text], index) => (
            <section key={title}>
              <h2 className="h4 mt-4">{index + 1}. {title}</h2>
              <p>{text}</p>
            </section>
          ))}
        </div>
      </article>
    </DisenoPublico>
  );
}
import { Link } from 'react-router-dom';