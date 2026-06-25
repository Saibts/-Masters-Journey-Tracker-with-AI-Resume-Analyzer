const fs = require('fs');
const path = require('path');

const srcElectron = path.join(__dirname, 'node_modules', 'electron', 'dist');
const destApp = path.join(__dirname, 'dist-desktop');

function build() {
  console.log('Starting manual desktop bundling...');
  
  // 1. Clean destination
  if (fs.existsSync(destApp)) {
    console.log('Cleaning old build...');
    fs.rmSync(destApp, { recursive: true, force: true });
  }
  
  // 2. Copy prebuilt Electron
  console.log('Copying prebuilt Electron...');
  fs.cpSync(srcElectron, destApp, { recursive: true });
  
  // 3. Rename executable
  console.log('Renaming executable...');
  fs.renameSync(
    path.join(destApp, 'electron.exe'),
    path.join(destApp, 'Masters Journey Tracker.exe')
  );
  
  // 4. Remove default app
  const defaultAppAsar = path.join(destApp, 'resources', 'default_app.asar');
  if (fs.existsSync(defaultAppAsar)) {
    fs.unlinkSync(defaultAppAsar);
  }
  
  // 5. Create app folder
  const appDir = path.join(destApp, 'resources', 'app');
  fs.mkdirSync(appDir, { recursive: true });
  
  // 6. Copy build files and packages
  console.log('Copying project assets...');
  fs.cpSync(path.join(__dirname, 'dist'), path.join(appDir, 'dist'), { recursive: true });
  fs.copyFileSync(path.join(__dirname, 'main.cjs'), path.join(appDir, 'main.cjs'));
  
  // Create a minimal package.json for Electron
  const pkg = {
    name: 'my-masters-journey-tracker',
    main: 'main.cjs',
    dependencies: {}
  };
  fs.writeFileSync(path.join(appDir, 'package.json'), JSON.stringify(pkg, null, 2));
  
  console.log('Desktop application successfully bundled in: dist-desktop/');
}

try {
  build();
} catch (err) {
  console.error('Failed to bundle desktop application:', err);
}
