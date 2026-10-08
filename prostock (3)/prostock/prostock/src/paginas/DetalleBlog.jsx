import { useEffect, useState } from 'react';
import { DisenoPublico, blogImage, blogTitle } from './CompartidoTienda.jsx';
import { obtenerBlog } from '../servicios/tienda.js';

export function DetalleBlog() {
  const postId = new URLSearchParams(window.location.search).get('id');
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(Boolean(postId));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!postId) return undefined;
    let activo = true;
    obtenerBlog(postId)
      .then(item => activo && setPost(item))
      .catch(loadError => activo && setError(loadError.status === 404 ? 'Publicación no encontrada.' : loadError.message))
      .finally(() => activo && setLoading(false));
    return () => {
      activo = false;
    };
  }, [postId]);

  if (postId) {
    return (
      <DisenoPublico activePage="blog">
        <article className="row justify-content-center">
          <div className="col-lg-8">
            <Link to="/blogs" className="text-decoration-none"><i className="bi bi-arrow-left" /> Volver al blog</Link>
            {loading && <p className="mt-4 text-muted" role="status">Cargando publicación...</p>}
            {error && <div className="alert alert-danger mt-4" role="alert">{error}</div>}
            {post && (
              <>
                <h1 className="fw-bold my-3">{post.titulo}</h1>
                {post.imagen && <img src={post.imagen} className="img-fluid rounded shadow-sm my-4" alt={post.titulo} />}
                {post.descripcion && <p className="lead">{post.descripcion}</p>}
                <div style={{ whiteSpace: 'pre-line' }}>{post.contenido}</div>
              </>
            )}
          </div>
        </article>
      </DisenoPublico>
    );
  }

  const tips = [
    ['Clasifica los insumos', 'Ordena los productos según su frecuencia de uso y define responsables para los artículos críticos.'],
    ['Registra entradas y salidas', 'Actualiza el inventario cada vez que recibas o entregues materiales. El registro oportuno evita diferencias con el stock físico.'],
    ['Define un stock mínimo', 'Establece un límite de reposición por producto para anticipar las compras antes de quedarte sin unidades.'],
    ['Asigna una ubicación', 'Etiqueta estantes y zonas de almacenamiento. Un lugar fijo facilita el recuento y reduce el tiempo de búsqueda.'],
    ['Realiza revisiones periódicas', 'Contrasta el inventario registrado con el físico de forma mensual para detectar diferencias a tiempo.']
  ];

  return (
    <DisenoPublico activePage="blog">
      <article className="row justify-content-center">
        <div className="col-lg-8">
          <Link to="/blogs" className="text-decoration-none"><i className="bi bi-arrow-left" /> Volver al blog</Link>
          <p className="text-primary text-uppercase small fw-bold mt-4 mb-2">Consejos</p>
          <h1 className="fw-bold mb-3">{blogTitle}</h1>
          <p className="text-muted"><i className="bi bi-calendar3 me-2" />12 de mayo de 2026</p>
          <img src={blogImage} className="img-fluid rounded shadow-sm my-4" alt="Oficina organizada con insumos y papelería" />
          <p>Un inventario ordenado reduce quiebres de stock, compras urgentes y pérdidas de materiales. Estas prácticas permiten mantener el control sin complejidad.</p>
          {tips.map(([title, text], index) => (
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
