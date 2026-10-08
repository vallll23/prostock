import { CatalogoProductos } from './CatalogoProductos.jsx';
import { PieSitio } from '../componentes/PieSitio.jsx';
import { EncabezadoSitio } from '../componentes/EncabezadoSitio.jsx';

export function Productos() {
  return (
    <>
      <EncabezadoSitio activePage="products" />
      <main className="flex-grow-1">
        <CatalogoProductos />
      </main>
      <PieSitio />
    </>
  );
}
