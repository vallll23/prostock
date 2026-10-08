import { useEffect, useMemo, useState } from 'react';
import productCatalog from '../../data/productos.json';
import { PieSitio } from '../componentes/PieSitio.jsx';
import { EncabezadoSitio } from '../componentes/EncabezadoSitio.jsx';
import { addProductToCart } from './CompartidoTienda.jsx';
import { formatearPrecio, leerAlmacenamiento, guardarAlmacenamiento } from '../utilidades/almacenamiento.js';

export function DetalleProducto() {
  const productId = Number(new URLSearchParams(window.location.search).get('id'));
  const [product, setProduct] = useState(() => leerAlmacenamiento('productos_db').find(item => item.id === productId) || productCatalog.find(item => item.id === productId) || null);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const savedProducts = leerAlmacenamiento('productos_db');
    if (!localStorage.getItem('productos_db')) guardarAlmacenamiento('productos_db', productCatalog);
    const savedProduct = savedProducts.find(item => item.id === productId);
    const baseProduct = productCatalog.find(item => item.id === productId);
    const result = savedProduct && baseProduct
      ? { ...baseProduct, ...savedProduct, imagenes: savedProduct.imagenes?.length ? savedProduct.imagenes : baseProduct.imagenes }
      : savedProduct || baseProduct;
    setProduct(result || null);
    setActiveImage(0);
  }, [productId]);

  const images = useMemo(
    () => product?.imagenes?.length ? product.imagenes : product?.imagen ? [product.imagen] : [],
    [product]
  );

  return (
    <>
      <EncabezadoSitio activePage="products" />
      <main className="container my-5 flex-grow-1">
        <div className="row bg-white p-4 rounded shadow-sm border">
          {!product ? (
            <div className="col-12 text-center py-5">
              <h2 className="h4">Producto no encontrado.</h2>
              <Link to="/productos" className="btn btn-primary mt-3">Volver al catálogo</Link>
            </div>
          ) : (
            <>
              <div className="col-md-6 text-center">
                {images.length > 1 ? (
                  <div id="productCarousel" className="product-carousel position-relative" role="region" aria-label={`Imágenes de ${product.nombre}`}>
                    <img
                      src={images[activeImage]}
                      className="d-block w-100 product-detail-image"
                      alt={`${product.nombre}, imagen ${activeImage + 1}`}
                      aria-live="polite"
                    />
                    <div className="carousel-indicators">
                      {images.map((image, index) => (
                        <button
                          key={`${image}-${index}`}
                          type="button"
                          className={activeImage === index ? 'active' : ''}
                          aria-label={`Imagen ${index + 1}`}
                          aria-current={activeImage === index}
                          onClick={() => setActiveImage(index)}
                        />
                      ))}
                    </div>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      aria-label="Anterior"
                      onClick={() => setActiveImage(index => (index - 1 + images.length) % images.length)}
                    >
                      <span className="carousel-control-prev-icon" /><span className="visually-hidden">Anterior</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      aria-label="Siguiente"
                      onClick={() => setActiveImage(index => (index + 1) % images.length)}
                    >
                      <span className="carousel-control-next-icon" /><span className="visually-hidden">Siguiente</span>
                    </button>
                  </div>
                ) : <img src={images[0]} className="img-fluid product-detail-image" alt={product.nombre} />}
              </div>
              <div className="col-md-6 d-flex flex-column justify-content-center">
                <span className="badge bg-secondary mb-2 align-self-start">{product.categoria}</span>
                <h1 className="h2">{product.nombre}</h1>
                <p className="text-muted mb-1">SKU / Código: <strong>{product.codigo}</strong></p>
                <p className="text-primary fw-bold fs-3 my-3">{formatearPrecio(product.precio)}</p>
                <p>Stock disponible: <strong>{product.stock} unidades</strong></p>
                {added && <div className="alert alert-success py-2" role="status">Producto agregado al carrito.</div>}
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <button type="button" className="btn btn-danger btn-lg" disabled={product.stock <= 0} onClick={() => setAdded(addProductToCart(product))}>
                    <i className="bi bi-cart-plus" /> Agregar al Carrito
                  </button>
                  <Link to="/productos" className="btn btn-outline-secondary btn-lg">Volver</Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <PieSitio />
    </>
  );
}
import { Link } from 'react-router-dom';
