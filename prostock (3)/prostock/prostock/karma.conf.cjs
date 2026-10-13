const fs = require('fs/promises');
const esbuild = require('esbuild');
const { createInstrumenter } = require('istanbul-lib-instrument');

async function cargarParaCobertura({ path }) {
  const source = await fs.readFile(path, 'utf8');
  const inputMap = path.endsWith('.jsx')
    ? await esbuild.transform(source, {
      loader: 'jsx',
      jsx: 'automatic',
      sourcefile: path,
      sourcemap: 'external'
    })
    : null;
  const code = inputMap?.code || source;
  const instrumenter = createInstrumenter({ esModules: true, produceSourceMap: true });
  let instrumented = instrumenter.instrumentSync(code, path, inputMap?.map ? JSON.parse(inputMap.map) : undefined);
  const sourceMap = instrumenter.lastSourceMap();
  if (sourceMap) {
    instrumented += `\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(JSON.stringify(sourceMap)).toString('base64')}\n`;
  }
  return { contents: instrumented, loader: 'js' };
}

const istanbulPlugin = {
  name: 'istanbul',
  setup(build) {
    build.onLoad(
      { filter: /[\\/]src[\\/](componentes|paginas|servicios|utilidades)[\\/].*\.(js|jsx)$/ },
      cargarParaCobertura
    );
  }
};

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'src/pruebas/vistas/**/*.spec.js',
      { pattern: 'img/**/*', watched: false, included: false, served: true },
      { pattern: 'public/**/*', watched: false, included: false, served: true }
    ],
    preprocessors: {
      'src/pruebas/vistas/**/*.spec.js': ['esbuild']
    },
    esbuild: {
      loader: { '.js': 'jsx', '.jsx': 'jsx' },
      jsx: 'automatic',
      target: 'es2020',
      singleBundle: true,
      sourcemap: 'inline',
      plugins: [istanbulPlugin],
      define: {
        'import.meta.env': JSON.stringify({
          VITE_API_URL: 'http://localhost:8080',
          VITE_ADMIN_EMAILS: 'admin@duoc.cl'
        })
      }
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text-summary' }
      ]
    },
    proxies: {
      '/img/': '/base/img/',
      '/blog/': '/base/public/blog/'
    },
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
