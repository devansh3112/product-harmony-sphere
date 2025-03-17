// Custom build script for Vercel
import { execSync } from 'child_process';

console.log('🔧 Starting custom Vercel build process...');

// Force using WebAssembly version of Rollup
process.env.ROLLUP_WASM = 'true';

try {
  // Install WebAssembly version of Rollup explicitly
  console.log('📦 Installing WebAssembly version of Rollup...');
  execSync('npm install @rollup/wasm-node --no-save', { stdio: 'inherit' });
  
  // Run the build
  console.log('🏗️ Building the application...');
  execSync('vite build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      ROLLUP_WASM: 'true',
      ROLLUP_SKIP_NODE_RESOLVE: 'true'
    }
  });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
} 