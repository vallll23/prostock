import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DisenoFormularioAdministracion, usarAccesoAdministracion } from './CompartidoAdministracion.jsx';
import { guardarProducto, listarCategorias, obtenerProducto } from '../servicios/tienda.js';

export function FormularioProductoAdministracion() {
  const navigate = useNavigate();
  const ready = usarAccesoAdministracion();
  const productId = new URLSearchParams(window.location.search).get('id');
  const [form, setForm] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [alert, setAlert] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ready) return undefined;
    let activo = true;

    listarCategorias()
      .then(cats => activo && setCategoriesList(cats))
      .catch(() => {});

    if (!productId) {
      setForm({ nombre: '', descripcion: '', categoriaId: '', precio: '', stock: '', imagen: '' });
      return undefined;
    }

    obtenerProducto(productId)
      .then(existing => activo && setForm({
        nombre: existing.nombre,
        descripcion: existing.descripcion,
        categoriaId: existing.categoriaApi?.id ? String(existing.categoriaApi.id) : '',
        categoriaNombre: existing.categoria || '',
        precio: String(existing.precio ?? ''),
        stock: String(existing.stock ?? ''),
        imagen: existing.imagen
      }))
      .catch(loadError => activo && setError(loadError.message));

    return () => {
      activo = false;
    };
  }, [productId, ready]);

  if (!ready) return null;
  if (!form) return <DisenoFormularioAdministracion><p role="status">{error ? '' : 'Cargando producto...'}</p>{error && <p className="text-danger">{error}</p>}</DisenoFormularioAdministracion>;

  const updateField = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async event => {
    event.preventDefault();
    const name = form.nombre.trim();
    const price = Number(form.precio);
    const stock = Number(form.stock);
    const image = form.imagen.trim();
    const catId = Number(form.categoriaId);

    if (!name || !Number.isInteger(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
      setAlert('Ingresa un nombre, un precio entero mayor a cero y un stock válido.');
      return;
    }
    if (!catId) {
      setAlert('Debes seleccionar una categoría válida existente.');
      return;
    }
    if (!image) {
      setAlert('Debes ingresar una imagen.');
      return;
    }
    setSaving(true);
    try {
      await guardarProducto({
        nombre: name,
        descripcion: form.descripcion.trim(),
        tipoCategoria: { id: catId },
        precio: price,
        stock,
        imagen: image
      }, productId);
      navigate('/admin/productos');
    } catch (saveError) {
      setAlert(saveError.message);
      setSaving(false);
    }
  };

  return (
    <DisenoFormularioAdministracion>
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h1 className="h4 mb-4">Administrar Producto</h1>
          {(error || alert) && <div className="alert alert-danger" role="alert">{alert || error}</div>}
          <form onSubmit={submit}>
            <div className="mb-3"><label className="form-label" htmlFor="product-name">Nombre del Producto</label><input id="product-name" name="nombre" className="form-control" required placeholder="Ej: Resma Papel A4" value={form.nombre} onChange={updateField} /></div>
            <div className="mb-3">
              <label className="form-label" htmlFor="product-category">Categoría</label>
              <select id="product-category" name="categoriaId" className="form-select" required value={form.categoriaId} onChange={updateField}>
                <option value="">Seleccione...</option>
                {categoriesList.map(category => (
                  <option key={category.id} value={category.id}>{category.nombre}</option>
                ))}
              </select>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3"><label className="form-label" htmlFor="product-price">Precio ($)</label><input id="product-price" name="precio" type="number" min="1" className="form-control" required value={form.precio} onChange={updateField} /></div>
              <div className="col-md-6 mb-3"><label className="form-label" htmlFor="product-stock">Stock</label><input id="product-stock" name="stock" type="number" min="0" className="form-control" required value={form.stock} onChange={updateField} /></div>
            </div>
            <div className="mb-3"><label className="form-label" htmlFor="product-description">Descripción</label><textarea id="product-description" name="descripcion" className="form-control" rows="3" value={form.descripcion} onChange={updateField} /></div>
            <div className="mb-3"><label className="form-label" htmlFor="product-image">Imagen del producto</label><input id="product-image" name="imagen" className="form-control" required placeholder="https://ejemplo.com/foto.jpg" value={form.imagen} onChange={updateField} /></div>
            <div className="d-flex justify-content-between pt-2"><Link to="/admin/productos" className="btn btn-outline-secondary">Cancelar</Link><button type="submit" className="btn btn-success" disabled={saving}>{saving ? 'Guardando...' : 'Guardar Producto'}</button></div>
          </form>
        </div>
      </div>
    </DisenoFormularioAdministracion>
  );
}
