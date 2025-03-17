// CommonJS script to patch Rollup for Vercel deployment
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Running Vercel build fix script...');

// Install WebAssembly version of Rollup
console.log('📦 Installing @rollup/wasm-node...');
execSync('npm install @rollup/wasm-node --no-save', { stdio: 'inherit' });

// Create a completely new approach - modify the vite.config.ts to force WASM usage
try {
  console.log('📝 Updating vite.config.ts to force WASM usage...');
  
  // Set environment variable for this process
  process.env.ROLLUP_WASM = 'true';
  
  // Find vite.config.ts
  const viteConfigPath = path.resolve('./vite.config.ts');
  if (fs.existsSync(viteConfigPath)) {
    let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
    
    // Create a backup
    fs.writeFileSync(`${viteConfigPath}.backup`, viteConfig);
    
    // Make sure the ROLLUP_WASM environment variable is set
    if (!viteConfig.includes('process.env.ROLLUP_WASM = "true"')) {
      // Add the environment variable setting if it doesn't exist
      viteConfig = viteConfig.replace(
        'import { defineConfig } from "vite";',
        'import { defineConfig } from "vite";\n\n// Force using the WebAssembly version of Rollup for Vercel compatibility\nprocess.env.ROLLUP_WASM = "true";'
      );
      
      fs.writeFileSync(viteConfigPath, viteConfig);
      console.log('✅ vite.config.ts updated to force WASM usage');
    } else {
      console.log('✅ vite.config.ts already configured for WASM usage');
    }
  } else {
    console.error('❌ Could not find vite.config.ts!');
  }
  
  // Create a custom Rollup plugin to force WASM usage
  console.log('📝 Creating custom Rollup plugin to force WASM usage...');
  
  // Create a directory for our custom plugin if it doesn't exist
  const pluginsDir = path.resolve('./vercel-plugins');
  if (!fs.existsSync(pluginsDir)) {
    fs.mkdirSync(pluginsDir, { recursive: true });
  }
  
  // Create a custom plugin that will be loaded by Vite
  const pluginContent = `
// Custom plugin to force Rollup to use WASM
import wasm from '@rollup/wasm-node';

export function forceRollupWasm() {
  return {
    name: 'force-rollup-wasm',
    buildStart() {
      // This runs before the build starts
      console.log('🔧 Forcing Rollup to use WebAssembly version');
      
      // Set the environment variable
      process.env.ROLLUP_WASM = 'true';
    }
  };
}

export default forceRollupWasm;
`;
  
  fs.writeFileSync(path.join(pluginsDir, 'force-rollup-wasm.js'), pluginContent);
  console.log('✅ Custom Rollup plugin created');
  
  // Update vite.config.ts to use our custom plugin
  viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  
  if (!viteConfig.includes('force-rollup-wasm')) {
    // Add import for our custom plugin
    viteConfig = viteConfig.replace(
      'import path from "path";',
      'import path from "path";\nimport forceRollupWasm from "./vercel-plugins/force-rollup-wasm.js";'
    );
    
    // Add our plugin to the plugins array
    viteConfig = viteConfig.replace(
      'plugins: [react()],',
      'plugins: [react(), forceRollupWasm()],'
    );
    
    fs.writeFileSync(viteConfigPath, viteConfig);
    console.log('✅ vite.config.ts updated to use custom plugin');
  }
  
  // Create a .npmrc file to force using the WASM version
  console.log('📝 Creating .npmrc to force WASM usage...');
  fs.writeFileSync('.npmrc', 'rollup_wasm=true\n');
  console.log('✅ .npmrc created');
  
} catch (error) {
  console.error('❌ Error updating configuration:', error);
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