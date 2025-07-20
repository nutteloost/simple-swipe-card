import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

// Determine build mode
const isProduction = process.env.NODE_ENV === 'production';
const shouldMinify = process.env.MINIFY === 'true';

console.log(`Building in ${isProduction ? 'production' : 'development'} mode${shouldMinify ? ' with minification' : ''}`);

export default {
  input: 'src/index.js',
  output: {
    file: 'build/simple-swipe-card.js',
    format: 'es',
    sourcemap: process.env.SOURCEMAP === 'true' // Only create maps when explicitly requested
  },
  plugins: [
    nodeResolve({
      browser: true,  // Optimize for browser environment
      preferBuiltins: false
    }),
    
    // Apply terser only when explicitly requested via MINIFY=true
    shouldMinify && terser({
      // Preserve essential function/class names for debugging
      mangle: {
        reserved: ['SimpleSwipeCard', 'SimpleSwipeCardEditor'],
        properties: {
          regex: /^_/  // Mangle private properties starting with underscore
        }
      },
      
      // Compression settings
      compress: {
        // Remove console.log statements in minified builds (keeps console.error/warn)
        drop_console: ['log', 'debug'],
        drop_debugger: true,
        
        // Safe optimizations
        dead_code: true,
        unused: true,
        evaluate: true,
        reduce_vars: true,
        collapse_vars: true,
        
        // Preserve Home Assistant compatibility
        keep_fnames: /^(setConfig|connectedCallback|disconnectedCallback)$/,
        keep_classnames: true
      },
      
      // Output formatting
      format: {
        comments: /^!/,  // Keep comments starting with !
        preserve_annotations: true  // Keep @license comments
      },
      
      // Source map options
      sourceMap: !isProduction
    })
  ].filter(Boolean)  // Remove falsy plugins
};