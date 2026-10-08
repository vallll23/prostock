import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: [
        'index.html',
        'productos.html',
        'nosotros.html',
        'blogs.html',
        'detalle-blog.html',
        'detalle-producto.html',
        'contacto.html',
        'carrito.html',
        'login.html',
        'registro.html',
        'perfil.html',
        'admin/index.html',
        'admin/productos-listar.html',
        'admin/producto-form.html',
        'admin/usuarios-listar.html',
        'admin/usuario-form.html',
        'admin/mensajes-listar.html'
      ]
    }
  }
});
