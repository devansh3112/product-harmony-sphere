// Script to patch Rollup to use WebAssembly instead of native modules
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Patching Rollup to use WebAssembly...');

// Install WebAssembly version of Rollup
console.log('📦 Installing @rollup/wasm-node...');
execSync('npm install @rollup/wasm-node --no-save', { stdio: 'inherit' });

// Patch the Rollup native.js file
const nativePath = path.resolve(__dirname, 'node_modules/rollup/dist/native.js');
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