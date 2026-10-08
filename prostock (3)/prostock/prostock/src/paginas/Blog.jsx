import { useEffect, useState } from 'react';
import { DisenoPublico, blogImage, blogTitle } from './CompartidoTienda.jsx';
import { listarBlogs } from '../servicios/tienda.js';

export function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    listarBlogs()
      .then(items => activo && setPosts(items))
      .catch(loadError => activo && setError(loadError.message))
      .finally(() => activo && setLoading(false));
    return () => {
      activo = false;
    };
  }, []);

  const articles = posts.length ? posts : [{ id: null, titulo: blogTitle, descripcion: 'Aprende a gestionar el stock de papelería e insumos para evitar pérdidas y desabastecimiento.', imagen: blogImage }];
  return (
    <DisenoPublico activePage="blog">
      <header className="text-center mb-5">
        <h1 className="fw-bold display-5">Blog</h1>
        <p className="text-muted">Consejos para gestionar mejor los insumos de tu oficina.</p>
      </header>
      {error && <div className="alert alert-warning" role="alert">{error}</div>}
      {loading && <p className="text-center text-muted" role="status">Cargando artículos...</p>}
      <section className="row justify-content-center g-4" aria-label="Artículos del blog">
        {!loading && articles.map(post => (
        <article className="col-md-8 col-lg-7" key={post.id ?? 'inventario'}>
          <div className="card h-100 border-0 shadow-sm">
            <img src={post.imagen || blogImage} className="card-img-top object-fit-cover" height="200" alt={post.titulo} />
            <div className="card-body d-flex flex-column">
              <span className="badge bg-primary align-self-start mb-2">Consejos</span>
              <h2 className="card-title h4 fw-bold">{post.titulo}</h2>
              <p className="card-text text-muted small flex-grow-1">{post.descripcion}</p>
              <Link to={post.id ? `/detalle-blog?id=${post.id}` : '/detalle-blog'} className="btn btn-primary align-self-start">Leer noticia <i className="bi bi-arrow-right ms-1" /></Link>
            </div>
          </div>
        </article>
        ))}
      </section>
    </DisenoPublico>
  );
}
import { Link } from 'react-router-dom';
