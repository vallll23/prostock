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

Cada prueba prepara un `MemoryRouter` y limpia el almacenamiento local para
aislar los casos. Según la vista, se comprueban contenido renderizado,
propiedades, cambios de estado, formularios, navegación, almacenamiento y
eventos de usuario.
