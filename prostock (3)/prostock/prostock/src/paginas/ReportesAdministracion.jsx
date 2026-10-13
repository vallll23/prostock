import { useEffect, useMemo, useState } from 'react';
import { DisenoAdministracion, usarAccesoAdministracion } from './CompartidoAdministracion.jsx';
import { formatearPrecio } from '../utilidades/almacenamiento.js';
import { listarClientes, listarProductos, listarTodasLasBoletas } from '../servicios/tienda.js';

export function ReportesAdministracion() {
  const ready = usarAccesoAdministracion();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return undefined;
    let activo = true;
    Promise.all([listarProductos(), listarClientes()])
      .then(async ([items, clients]) => {
        const boletas = await listarTodasLasBoletas(clients);
        if (!activo) return;
        setProducts(items);
        setUsers(clients);
        setOrders(boletas);
      })
      .catch(loadError => activo && setError(loadError.message))
      .finally(() => activo && setLoading(false));
    return () => {
      activo = false;
    };
  }, [ready]);

  const categoryReport = useMemo(() => {
    const totals = new Map();
    products.forEach(product => {
      const category = totals.get(product.categoria) || { nombre: product.categoria, cantidad: 0, unidades: 0 };
      category.cantidad += 1;
      category.unidades += product.stock;
      totals.set(product.categoria, category);
    });
    return [...totals.values()].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [products]);
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const monthly = useMemo(() => {
    const totals = new Map();
    orders.forEach(order => {
      const date = new Date(order.fechaOriginal);
      if (Number.isNaN(date.getTime())) return;
      const month = date.toLocaleDateString('es-CL', { year: 'numeric', month: 'long' });
      totals.set(month, (totals.get(month) || 0) + order.total);
    });
    return [...totals.entries()];
  }, [orders]);

  if (!ready) return null;
  return (
    <DisenoAdministracion activePage="reports">
      <h1 className="h3 mb-3">Reportes</h1>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {loading ? <p className="text-muted" role="status">Preparando reportes...</p> : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-xl-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><div className="text-muted">Ventas registradas</div><div className="fs-4 fw-bold">{formatearPrecio(totalSales)}</div></div></div></div>
            <div className="col-sm-6 col-xl-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><div className="text-muted">Boletas</div><div className="fs-4 fw-bold">{orders.length}</div></div></div></div>
            <div className="col-sm-6 col-xl-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><div className="text-muted">Productos</div><div className="fs-4 fw-bold">{products.length}</div></div></div></div>
            <div className="col-sm-6 col-xl-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><div className="text-muted">Usuarios registrados</div><div className="fs-4 fw-bold">{users.length}</div></div></div></div>
          </div>
          <section className="card border-0 shadow-sm mb-4">
            <div className="card-body"><h2 className="h5">Ventas por mes</h2>
              {monthly.length ? <div className="table-responsive"><table className="table table-sm mb-0"><thead><tr><th>Mes</th><th>Ventas</th></tr></thead><tbody>{monthly.map(([month, total]) => <tr key={month}><td>{month}</td><td>{formatearPrecio(total)}</td></tr>)}</tbody></table></div> : <p className="text-muted mb-0">Aún no hay fechas de órdenes válidas para agrupar.</p>}
            </div>
          </section>
          <section className="card border-0 shadow-sm">
            <div className="card-body"><h2 className="h5">Inventario por categoría</h2>
              <div className="table-responsive"><table className="table table-sm mb-0"><thead><tr><th>Categoría</th><th>Productos</th><th>Unidades en stock</th></tr></thead><tbody>{categoryReport.map(category => <tr key={category.nombre}><td>{category.nombre}</td><td>{category.cantidad}</td><td>{category.unidades}</td></tr>)}{!categoryReport.length && <tr><td colSpan="3" className="text-muted">No hay productos para reportar.</td></tr>}</tbody></table></div>
            </div>
          </section>
          <p className="small text-muted mt-3 mb-0">Las ventas representan boletas registradas; no implican procesamiento ni confirmación de pagos reales.</p>
        </>
      )}
    </DisenoAdministracion>
  );
}
