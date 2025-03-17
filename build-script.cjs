// CommonJS build script for Vercel deployment
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Running custom build script for Vercel...');

// Function to patch a file with new content
function patchFile(filePath, searchContent, replaceContent) {
  if (fs.existsSync(filePath)) {
    console.log(`📝 Patching ${filePath}...`);
    
    // Create a backup
    fs.copyFileSync(filePath, `${filePath}.backup`);
    
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the content
    if (content.includes(searchContent)) {
      content = content.replace(searchContent, replaceContent);
      fs.writeFileSync(filePath, content);
      console.log(`✅ Successfully patched ${filePath}`);
      return true;
    } else {
      console.log(`⚠️ Could not find content to replace in ${filePath}`);
      return false;
    }
  } else {
    console.error(`❌ File not found: ${filePath}`);
    return false;
  }
}

// Patch Rollup's native.js file to use WASM
const rollupNativePath = path.resolve('./node_modules/rollup/dist/native.js');
if (fs.existsSync(rollupNativePath)) {
  console.log('📝 Patching Rollup native.js...');
  
  // Create a backup
  fs.copyFileSync(rollupNativePath, `${rollupNativePath}.backup`);
  
  // Replace the entire file with a simple wrapper around the WASM version
  const patchedContent = `
// PATCHED FOR VERCEL - Always use WebAssembly
const wasm = require('@rollup/wasm-node');

// Export all properties from the WASM module
for (const key in wasm) {
  if (Object.prototype.hasOwnProperty.call(wasm, key)) {
    exports[key] = wasm[key];
  }
}
`;
  
  fs.writeFileSync(rollupNativePath, patchedContent);
  console.log('✅ Rollup native.js patched successfully!');
} else {
  console.error('❌ Could not find Rollup native.js file!');
  process.exit(1);
}

// Also patch the ESM version if it exists
const rollupNativeEsmPath = path.resolve('./node_modules/rollup/dist/es/native.js');
if (fs.existsSync(rollupNativeEsmPath)) {
  console.log('📝 Patching Rollup ESM native.js...');
  
  // Create a backup
  fs.copyFileSync(rollupNativeEsmPath, `${rollupNativeEsmPath}.backup`);
  
  // Replace the entire file with a simple wrapper around the WASM version
  const patchedEsmContent = `
// PATCHED FOR VERCEL - Always use WebAssembly
import * as wasm from '@rollup/wasm-node';

// Re-export everything
export const parse = wasm.parse;
export const parseAsync = wasm.parseAsync;
export const getAvailableFeatures = wasm.getAvailableFeatures;
export const version = wasm.version;
export default wasm;
`;
  
  fs.writeFileSync(rollupNativeEsmPath, patchedEsmContent);
  console.log('✅ Rollup ESM native.js patched successfully!');
}

// Patch the parseAst.js file if needed
const parseAstPath = path.resolve('./node_modules/rollup/dist/es/shared/parseAst.js');
if (fs.existsSync(parseAstPath)) {
  console.log('📝 Checking parseAst.js...');
  
  // Create a backup
  fs.copyFileSync(parseAstPath, `${parseAstPath}.backup`);
  
  // Read the file content
  let content = fs.readFileSync(parseAstPath, 'utf8');
  
  // Check if it's importing from native.js
  if (content.includes("import { parse, parseAsync } from '../../native.js';")) {
    console.log('📝 Patching parseAst.js...');
    
    // Replace the import with a default import and destructuring
    content = content.replace(
      "import { parse, parseAsync } from '../../native.js';",
      "import pkg from '../../native.js'; const { parse, parseAsync } = pkg;"
    );
    
    fs.writeFileSync(parseAstPath, content);
    console.log('✅ parseAst.js patched successfully!');
  } else {
    console.log('⚠️ No matching import statement found in parseAst.js.');
  }
}

// Set environment variables for the build
process.env.ROLLUP_WASM = 'true';

// Run the build command
try {
  console.log('🏗️ Running build command...');
  execSync('vite build --outDir dist', { 
    stdio: 'inherit',
    env: { ...process.env, ROLLUP_WASM: 'true' }
  });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
} 