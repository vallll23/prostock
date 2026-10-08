import { PieSitio } from '../componentes/PieSitio.jsx';
import { EncabezadoSitio } from '../componentes/EncabezadoSitio.jsx';

export function AcercaDeNosotros() {
  const values = [
    { icon: 'bi-bullseye', title: 'Misión', text: 'Proveer soluciones integrales de oficina y estudio con rapidez, entregando productos de alta calidad a precios competitivos.' },
    { icon: 'bi-eye', title: 'Visión', text: 'Ser el distribuidor líder en insumos de oficina a nivel nacional, reconocidos por la excelencia de servicio y constante innovación digital.' },
    { icon: 'bi-award', title: 'Valores', text: 'Puntualidad, transparencia en inventarios, compromiso con el cliente y responsabilidad en cada entrega.' }
  ];
  const team = [
    { name: 'Valentina', role: 'Co-Fundadora & Gestión Operativa', bio: 'Encargada de la supervisión de inventario, logística y aseguramiento de calidad en cada uno de los envíos.' },
    { name: 'Javiera', role: 'Co-Fundadora & Experiencia de Cliente', bio: 'Especialista en relaciones con clientes, alianzas estratégicas y optimización de la plataforma digital.' }
  ];

  return (
    <>
      <EncabezadoSitio activePage="about" />
      <header className="bg-dark text-white text-center py-5 mb-5 shadow-sm">
        <div className="container py-3">
          <h1 className="display-5 fw-bold">Sobre Prostock</h1>
          <p className="lead text-light mb-0">Líderes en distribución de papelería, útiles e insumos de oficina.</p>
        </div>
      </header>
      <main className="container my-4 flex-grow-1">
        <section className="row align-items-center mb-5 g-4">
          <div className="col-md-6">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" className="img-fluid rounded shadow-sm object-fit-cover w-100" alt="Oficina Prostock" style={{ maxHeight: 350 }} />
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold">Nuestra Historia</h2>
            <p className="text-muted">Prostock nació bajo el liderazgo de <strong>Valentina</strong> y <strong>Javiera</strong> con el compromiso firme de entregar un servicio ágil, transparente y eficiente para empresas, instituciones educativas y clientes particulares.</p>
            <p className="text-muted">Nos especializamos en garantizar el abastecimiento continuo de productos esenciales para la operación diaria, combinando calidad en cada despacho con una atención cercana y personalizada.</p>
          </div>
        </section>
        <section className="row text-center g-4 my-5" aria-label="Misión, visión y valores">
          {values.map(value => (
            <article className="col-md-4" key={value.title}>
              <div className="card h-100 border-0 shadow-sm p-4">
                <div className="fs-1 text-primary mb-3"><i className={`bi ${value.icon}`} /></div>
                <h2 className="h4 fw-bold">{value.title}</h2>
                <p className="text-muted mb-0">{value.text}</p>
              </div>
            </article>
          ))}
        </section>
        <section className="my-5 pt-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Liderazgo &amp; Equipo</h2>
            <p className="text-muted">Las mentes detrás de la gestión y crecimiento de Prostock.</p>
          </div>
          <div className="row justify-content-center g-4">
            {team.map(person => (
              <article className="col-md-5 col-lg-4" key={person.name}>
                <div className="card border-0 shadow-sm text-center h-100 p-3">
                  <div className="card-body">
                    <i className="bi bi-person-circle display-1 text-primary" />
                    <h3 className="h4 card-title fw-bold">{person.name}</h3>
                    <span className="badge bg-primary mb-3">{person.role}</span>
                    <p className="card-text text-muted small">{person.bio}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <PieSitio />
    </>
  );
}
