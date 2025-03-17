// Direct build script for Vercel that bypasses Rollup native dependencies
import { build } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting direct Vite build with WebAssembly Rollup...');

// Ensure we're using the WebAssembly version of Rollup
try {
  // Check if @rollup/wasm-node is installed
  const wasmNodePath = resolve(__dirname, 'node_modules/@rollup/wasm-node');
  if (!fs.existsSync(wasmNodePath)) {
    console.log('📦 Installing @rollup/wasm-node...');
    const { execSync } = await import('child_process');
    execSync('npm install @rollup/wasm-node --no-save', { stdio: 'inherit' });
  }

  // Monkey patch the Rollup resolution to force using WebAssembly
  const rollupPath = resolve(__dirname, 'node_modules/rollup/dist/es/rollup.js');
  if (fs.existsSync(rollupPath)) {
    console.log('🔧 Patching Rollup to use WebAssembly...');
    let rollupContent = fs.readFileSync(rollupPath, 'utf8');
    
    // Replace any native module imports with WebAssembly
    if (!rollupContent.includes('// PATCHED FOR VERCEL')) {
      rollupContent = '// PATCHED FOR VERCEL\n' + 
                     rollupContent.replace(
                       /require\(['"]@rollup\/rollup-[^'"]+['"]\)/g, 
                       "require('@rollup/wasm-node')"
                     );
      fs.writeFileSync(rollupPath, rollupContent);
    }
  }

  // Run the Vite build directly
  console.log('🏗️ Running Vite build...');
  await build();
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
} 