import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DisenoAdministracion, usarAccesoAdministracion, usarInventarioProductos } from './CompartidoAdministracion.jsx';

export function ProductosCriticos() {
  const ready = usarAccesoAdministracion();
  const { products, loading, error } = usarInventarioProductos();
  const [threshold, setThreshold] = useState(5);
  const critical = useMemo(() => products.filter(product => product.stock <= threshold).sort((a, b) => a.stock - b.stock), [products, threshold]);

  if (!ready) return null;
  return (
    <DisenoAdministracion activePage="critical">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-3">
        <div><h1 className="h3 mb-1">Productos con stock crítico</h1><p className="text-muted mb-0">Se muestran productos con stock menor o igual al umbral elegido.</p></div>
        <div><label className="form-label" htmlFor="critical-threshold">Umbral de stock</label><input id="critical-threshold" className="form-control" type="number" min="0" step="1" value={threshold} onChange={event => setThreshold(Math.max(0, Number(event.target.value) || 0))} /></div>
      </div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="alert alert-info">El umbral inicial es 5 unidades y puede ajustarse para revisar el inventario.</div>
      <div className="card border-0 shadow-sm"><div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-dark"><tr><th>Producto</th><th>Categoría</th><th>Stock</th><th>Acción</th></tr></thead>
          <tbody>{critical.map(product => <tr key={product.id}><td>{product.nombre}</td><td>{product.categoria}</td><td><span className={`badge ${product.stock === 0 ? 'bg-danger' : 'bg-warning text-dark'}`}>{product.stock}</span></td><td><Link className="btn btn-sm btn-outline-primary" to={`/admin/producto?id=${product.id}`}>Editar inventario</Link></td></tr>)}
            {!critical.length && <tr><td colSpan="4" className="text-center text-muted py-4">{loading ? 'Cargando inventario...' : 'No hay productos bajo el umbral.'}</td></tr>}
          </tbody>
        </table>
      </div></div>
    </DisenoAdministracion>
  );
}
