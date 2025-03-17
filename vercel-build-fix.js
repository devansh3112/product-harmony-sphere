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

// Handle SWC issues by ensuring we're using @vitejs/plugin-react instead of @vitejs/plugin-react-swc
try {
  console.log('🔍 Checking for SWC dependencies...');
  
  // Check if @vitejs/plugin-react-swc is installed
  const swcPackagePath = path.resolve('./node_modules/@vitejs/plugin-react-swc');
  const reactPluginPath = path.resolve('./node_modules/@vitejs/plugin-react');
  
  if (fs.existsSync(swcPackagePath) && !fs.existsSync(reactPluginPath)) {
    console.log('📦 Replacing @vitejs/plugin-react-swc with @vitejs/plugin-react...');
    execSync('npm uninstall @vitejs/plugin-react-swc && npm install @vitejs/plugin-react --save-dev', { stdio: 'inherit' });
    
    // Update vite.config.ts if it exists
    const viteConfigPath = path.resolve('./vite.config.ts');
    if (fs.existsSync(viteConfigPath)) {
      console.log('📝 Updating vite.config.ts...');
      let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
      
      // Replace import statement
      viteConfig = viteConfig.replace(
        /import react from ['"]@vitejs\/plugin-react-swc['"]/g,
        'import react from \'@vitejs/plugin-react\''
      );
      
      fs.writeFileSync(viteConfigPath, viteConfig);
      console.log('✅ vite.config.ts updated successfully!');
    }
  } else {
    console.log('✅ SWC dependency check passed.');
  }
} catch (error) {
  console.error('⚠️ Error handling SWC dependencies:', error);
  // Continue execution even if SWC handling fails
}

console.log('✅ Build fix script completed successfully!'); 