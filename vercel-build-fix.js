// CommonJS script to patch Rollup for Vercel deployment
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Running Vercel build fix script...');

// Install WebAssembly version of Rollup
console.log('📦 Installing @rollup/wasm-node...');
execSync('npm install @rollup/wasm-node --no-save', { stdio: 'inherit' });

// Patch the Rollup native.js file
const nativePath = path.resolve('./node_modules/rollup/dist/native.js');
if (fs.existsSync(nativePath)) {
  console.log('📝 Patching Rollup native.js...');
  
  // Create a backup
  fs.copyFileSync(nativePath, `${nativePath}.backup`);
  
  // Replace the content with a version that always uses WebAssembly
  const patchedContent = `
// PATCHED FOR VERCEL - Always use WebAssembly
const wasm = require('@rollup/wasm-node');
module.exports = wasm;
`;
  
  fs.writeFileSync(nativePath, patchedContent);
  console.log('✅ Rollup patched successfully!');
} else {
  console.error('❌ Could not find Rollup native.js file!');
  process.exit(1);
} 