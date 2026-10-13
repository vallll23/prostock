# Pruebas de las vistas

Las pruebas de cada vista están separadas en `src/pruebas/vistas`, con un
archivo Jasmine `.spec.js` por vista. Los montajes compartidos y datos de
prueba están en `src/pruebas/utilidades/pruebasReact.js`.

## Ejecutar

Desde la raíz del proyecto:

```bash
npm test
```

Karma agrupa los archivos JSX de prueba mediante esbuild y ejecuta Jasmine en
Chrome Headless. Se requiere tener Google Chrome instalado.
El comando también genera un informe HTML de cobertura en
`coverage/html/index.html` y un resumen de texto en la consola. Los archivos
fuente con mapas de origen se incluyen para que el informe permita identificar
los módulos cubiertos.

Cada prueba prepara un `MemoryRouter` y limpia el almacenamiento local para
aislar los casos. Según la vista, se comprueban contenido renderizado,
propiedades, cambios de estado, formularios, navegación, almacenamiento y
eventos de usuario. Las llamadas HTTP se simulan reemplazando `fetch` con
`configurarMockApi`; los recursos estáticos también se sirven durante las
pruebas para evitar errores de carga de imágenes.
