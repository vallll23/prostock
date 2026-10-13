import { useCallback, useEffect, useState } from 'react';
import { DisenoAdministracion, usarAccesoAdministracion } from './CompartidoAdministracion.jsx';
import { eliminarCategoria, guardarCategoria, listarCategorias } from '../servicios/tienda.js';

export function CategoriasAdministracion() {
  const ready = usarAccesoAdministracion();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listarCategorias();
      setCategories(data);
      setError('');
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    cargar();
  }, [cargar, ready]);

  if (!ready) return null;

  const abrirCrear = () => {
    setEditingCategory(null);
    setFormData({ nombre: '', descripcion: '' });
    setFeedback({ type: '', message: '' });
    setModalOpen(true);
  };

  const abrirEditar = (cat) => {
    setEditingCategory(cat);
    setFormData({ nombre: cat.nombre, descripcion: cat.descripcion || '' });
    setFeedback({ type: '', message: '' });
    setModalOpen(true);
  };

  const cerrarModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingCategory(null);
    setFormData({ nombre: '', descripcion: '' });
  };

  const guardar = async (e) => {
    e.preventDefault();
    const nombre = formData.nombre.trim();
    if (!nombre) {
      setFeedback({ type: 'danger', message: 'El nombre de la categoría es obligatorio.' });
      return;
    }

    setSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      await guardarCategoria({ nombre, descripcion: formData.descripcion.trim() }, editingCategory?.id);
      setModalOpen(false);
      setFeedback({
        type: 'success',
        message: editingCategory ? 'Categoría actualizada con éxito.' : 'Categoría creada con éxito.'
      });
      await cargar();
    } catch (saveError) {
      if (saveError.status === 409) {
        setFeedback({
          type: 'danger',
          message: saveError.message || 'Conflicto: Ya existe una categoría con ese nombre.'
        });
      } else {
        setFeedback({
          type: 'danger',
          message: saveError.message || 'Error al guardar la categoría.'
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const borrar = async (cat) => {
    if (!window.confirm(`¿Estás seguro de eliminar la categoría "${cat.nombre}"?`)) {
      return;
    }

    setDeletingId(cat.id);
    setFeedback({ type: '', message: '' });

    try {
      await eliminarCategoria(cat.id);
      setFeedback({ type: 'success', message: `Categoría "${cat.nombre}" eliminada correctamente.` });
      await cargar();
    } catch (deleteError) {
      if (deleteError.status === 409) {
        setFeedback({
          type: 'danger',
          message: deleteError.message || 'No se puede eliminar la categoría porque tiene productos asociados o existe un conflicto.'
        });
      } else {
        setFeedback({
          type: 'danger',
          message: deleteError.message || 'Error al eliminar la categoría.'
        });
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DisenoAdministracion activePage="categories">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 m-0">Gestión de Categorías</h1>
        <button type="button" className="btn btn-primary" onClick={abrirCrear}>
          <i className="bi bi-plus-circle me-1" /> Nueva Categoría
        </button>
      </div>

      {feedback.message && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show`} role="alert">
          {feedback.message}
          <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setFeedback({ type: '', message: '' })} />
        </div>
      )}

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th style={{ width: '150px' }} className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>#{cat.id}</td>
                  <td className="fw-semibold">{cat.nombre}</td>
                  <td className="text-muted small">{cat.descripcion || 'Sin descripción'}</td>
                  <td className="text-end text-nowrap">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-warning me-1"
                      aria-label={`Editar categoría ${cat.nombre}`}
                      onClick={() => abrirEditar(cat)}
                      disabled={deletingId === cat.id}
                    >
                      <i className="bi bi-pencil" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      aria-label={`Eliminar categoría ${cat.nombre}`}
                      onClick={() => borrar(cat)}
                      disabled={deletingId === cat.id}
                    >
                      {deletingId === cat.id ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                      ) : (
                        <i className="bi bi-trash" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {!categories.length && (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    {loading ? 'Cargando categorías...' : 'No hay categorías registradas.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <>
          <div className="modal-backdrop fade show" onClick={cerrarModal} />
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title fs-5">
                    {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                  </h2>
                  <button type="button" className="btn-close" aria-label="Cerrar" onClick={cerrarModal} disabled={saving} />
                </div>
                <form onSubmit={guardar}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="cat-nombre">
                        Nombre de la categoría <span className="text-danger">*</span>
                      </label>
                      <input
                        id="cat-nombre"
                        type="text"
                        className="form-control"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        disabled={saving}
                        placeholder="Ej: Insumos de Oficina"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="cat-desc">
                        Descripción
                      </label>
                      <textarea
                        id="cat-desc"
                        rows="3"
                        className="form-control"
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        disabled={saving}
                        placeholder="Detalles sobre esta categoría..."
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={cerrarModal} disabled={saving}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? 'Guardando...' : (editingCategory ? 'Actualizar' : 'Crear')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </DisenoAdministracion>
  );
}
