import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DisenoFormularioAdministracion, DisenoAdministracion, categories, usarAccesoAdministracion, usarInventarioProductos } from './CompartidoAdministracion.jsx';
import { formatearPrecio, leerAlmacenamiento, guardarAlmacenamiento } from '../utilidades/almacenamiento.js';

export function ProductosAdministracion() {
  const ready = usarAccesoAdministracion();
  const { products, saveProducts, error } = usarInventarioProductos();

  const removeProduct = id => {
    if (!window.confirm('¿Seguro de eliminar este producto?')) return;
    saveProducts(products.filter(product => product.id !== id));
  };

  if (!ready) return null;
  return (
    <DisenoAdministracion activePage="products">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 m-0">Gestión de Productos</h1>
        <Link to="/admin/producto" className="btn btn-primary"><i className="bi bi-plus-circle me-1" /> Nuevo Producto</Link>
      </div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark"><tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
            <tbody>{products.map(product => (
              <tr key={product.id}>
                <td>{product.codigo}</td><td>{product.nombre}</td><td>{product.categoria}</td><td>{formatearPrecio(product.precio)}</td><td>{product.stock}</td>
                <td className="text-nowrap">
                  <Link to={`/admin/producto?id=${product.id}`} className="btn btn-sm btn-warning me-1" aria-label={`Editar ${product.nombre}`}><i className="bi bi-pencil" /></Link>
                  <button type="button" className="btn btn-sm btn-danger" aria-label={`Eliminar ${product.nombre}`} onClick={() => removeProduct(product.id)}><i className="bi bi-trash" /></button>
                </td>
              </tr>
            ))}{!products.length && <tr><td colSpan="6" className="text-center text-muted py-4">No hay productos registrados.</td></tr>}</tbody>
          </table>
        </div>
      </div>
    </DisenoAdministracion>
  );
}
