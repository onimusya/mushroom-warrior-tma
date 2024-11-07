import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, transformWithEsbuild, loadEnv  } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import inject from '@rollup/plugin-inject'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  console.log(`[vite.config] mode:`, mode);
  console.log(`[vite.config] env:`, env);
  
  return {
    define: {
      'process.env': env
    },    
    plugins: [
      nodePolyfills({
        // Whether to polyfill specific globals.
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
          global: true,
          //process: true,
        },        
      }),
      {
        name: 'load+transform-js-files-as-jsx',
        async transform(code, id) {
          if (!id.match(/src\/.*\.js$/)) {
            return null;
          }
  
          // Use the exposed transform from vite, instead of directly
          // transforming with esbuild
          return transformWithEsbuild(code, id, {
            loader: 'jsx',
            jsx: 'automatic',
          });
        },
      },    
      react()
    ],
    optimizeDeps: {
      force: true,
      esbuildOptions: {        
        loader: {
          '.js': 'jsx',
        },
      },
    },  
    resolve: {
      alias: {
        '@': resolve(dirname(fileURLToPath(import.meta.url)), './src'),
      }
    },
    /*
    build: {
      rollupOptions: {
        plugins: [
          inject({ Buffer: ['buffer', 'Buffer'] })]
      }
    } 
    */     
  }
})
