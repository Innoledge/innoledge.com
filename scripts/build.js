#!/usr/bin/env node

/**
 * Build Script for Innoledge.com2
 * Compiles templates and optimizes assets for production
 */

const fs = require('fs-extra');
const path = require('path');

// Configuration
const CONFIG = {
  sourceDir: '.',
  buildDir: 'dist',
  assetsDir: 'assets',
  templateDir: 'templates',
  componentDir: 'components',
  dataDir: 'data'
};

// Main build function
async function build() {
  console.log('🏗️  Building Innoledge.com2...\n');
  
  try {
    // Clean build directory
    await cleanBuildDir();
    
    // Copy static assets
    await copyAssets();
    
    // Generate pages
    await generatePages();
    
    // Create redirects and robots.txt
    await createMetaFiles();
    
    console.log('✅ Build completed successfully!\n');
    console.log('📁 Build output in:', path.resolve(CONFIG.buildDir));
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

/**
 * Clean build directory
 */
async function cleanBuildDir() {
  console.log('🧹 Cleaning build directory...');
  await fs.emptyDir(CONFIG.buildDir);
}

/**
 * Copy static assets
 */
async function copyAssets() {
  console.log('📁 Copying assets...');
  
  // Copy assets directory
  await fs.copy(CONFIG.assetsDir, path.join(CONFIG.buildDir, CONFIG.assetsDir));
  
  // Copy robots.txt if exists
  if (await fs.pathExists('robots.txt')) {
    await fs.copy('robots.txt', path.join(CONFIG.buildDir, 'robots.txt'));
  }
  
  // Copy CNAME if exists
  if (await fs.pathExists('CNAME')) {
    await fs.copy('CNAME', path.join(CONFIG.buildDir, 'CNAME'));
  }
}

/**
 * Generate all pages
 */
async function generatePages() {
  console.log('📄 Generating pages...');
  
  // Copy existing HTML files
  const htmlFiles = await findHtmlFiles('.');
  
  for (const file of htmlFiles) {
    const relativePath = path.relative('.', file);
    const outputPath = path.join(CONFIG.buildDir, relativePath);
    
    // Ensure output directory exists
    await fs.ensureDir(path.dirname(outputPath));
    
    // Copy HTML file
    await fs.copy(file, outputPath);
    
    console.log(`  ✓ ${relativePath}`);
  }
}

/**
 * Find all HTML files recursively
 */
async function findHtmlFiles(dir, files = []) {
  const items = await fs.readdir(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = await fs.stat(fullPath);
    
    if (stat.isDirectory()) {
      // Skip build directory and node_modules
      if (item !== CONFIG.buildDir && item !== 'node_modules' && !item.startsWith('.')) {
        await findHtmlFiles(fullPath, files);
      }
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Create meta files (robots.txt, redirects, etc.)
 */
async function createMetaFiles() {
  console.log('🔧 Creating meta files...');
  
  // Create robots.txt if it doesn't exist
  const robotsTxt = path.join(CONFIG.buildDir, 'robots.txt');
  if (!await fs.pathExists(robotsTxt)) {
    await fs.writeFile(robotsTxt, `User-agent: *
Allow: /

Sitemap: https://innoledge.com/sitemap.xml
`);
  }
  
  // Create .nojekyll for GitHub Pages
  await fs.writeFile(path.join(CONFIG.buildDir, '.nojekyll'), '');
  
  // Create 404.html
  const error404 = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found - Innoledge</title>
    <link rel="stylesheet" href="/assets/css/main.css">
    <link rel="stylesheet" href="/assets/css/components.css">
</head>
<body>
    <div class="error-page">
        <div class="container">
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/" class="btn btn-primary">Go Home</a>
        </div>
    </div>
</body>
</html>`;
  
  await fs.writeFile(path.join(CONFIG.buildDir, '404.html'), error404);
}

// Run build if this file is executed directly
if (require.main === module) {
  build();
}

module.exports = { build, CONFIG };