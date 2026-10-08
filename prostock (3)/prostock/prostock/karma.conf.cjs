module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: ['src/pruebas/vistas/**/*.spec.js'],
    preprocessors: {
      'src/pruebas/vistas/**/*.spec.js': ['esbuild']
    },
    esbuild: {
      loader: { '.js': 'jsx', '.jsx': 'jsx' },
      jsx: 'automatic',
      target: 'es2020',
      singleBundle: true
    },
    reporters: ['progress'],
    browsers: ['ChromeHeadlessSinSandbox'],
    customLaunchers: {
      ChromeHeadlessSinSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-dev-shm-usage']
      }
    },
    singleRun: true,
    client: {
      jasmine: {
        random: false
      }
    }
  });
};
