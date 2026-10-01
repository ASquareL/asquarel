// ============================================================
// A Square L Innovate — Netlify Build Script
// Copies apps + packages into dist/ preserving structure.
// ============================================================

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// Clean dist
if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true, force: true });
}
fs.mkdirSync(DIST, { recursive: true });

// Copy folders into dist/
const foldersToCopy = [
    'apps',
    'packages',
];

for (const folder of foldersToCopy) {
    const src = path.join(ROOT, folder);
    const dest = path.join(DIST, folder);
    if (fs.existsSync(src)) {
        fs.cpSync(src, dest, { recursive: true });
        console.log(`✓ Copied ${folder}/`);
    }
}

// Copy _redirects into dist root (Netlify reads it from publish root)
const redirectsSrc = path.join(ROOT, 'scripts', '_redirects');
const redirectsDest = path.join(DIST, '_redirects');
if (fs.existsSync(redirectsSrc)) {
    fs.copyFileSync(redirectsSrc, redirectsDest);
    console.log('✓ Copied _redirects');
}

console.log('Build complete → dist/');