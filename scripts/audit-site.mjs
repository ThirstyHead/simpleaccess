import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
const ASSETS_DIR = path.join(ROOT, 'assets/ds');
const REQUIRED_ASSETS = ['simpleaccess.css', 'simpleaccess.js', 'tokens.json'];

const REQUIRED_MARKERS = [
  { id: 'lang', regex: /<html\s+lang="en"/i, msg: 'Missing <html lang="en">' },
  { id: 'viewport', regex: /<meta\s+name="viewport"\s+content="width=device-width,\s*initial-scale=1\.0"/i, msg: 'Missing viewport meta tag' },
  { id: 'css', regex: /<link\s+rel="stylesheet"\s+href="\/assets\/ds\/simpleaccess\.css"/i, msg: 'Missing link to /assets/ds/simpleaccess.css' },
  { id: 'js', regex: /<script\s+type="module"\s+src="\/assets\/ds\/simpleaccess\.js"\s+defer><\/script>/i, msg: 'Missing script to /assets/ds/simpleaccess.js' },
  { id: 'skip', regex: /<a\s+href="#main-content"\s+class="m-skip-link">Skip to main content<\/a>/i, msg: 'Missing skip link' },
  { id: 'main', regex: /<main\s+id="main-content"/i, msg: 'Missing <main id="main-content">' },
];

async function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const errors = [];

  // 1. Marker Checks
  for (const marker of REQUIRED_MARKERS) {
    if (!marker.regex.test(content)) {
      errors.push(marker.msg);
    }
  }

  // 2. Parsing Check & Link Check
  try {
    const dom = new JSDOM(content);
    const document = dom.window.document;
    const links = document.querySelectorAll('a[href]');

    for (const link of links) {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        continue;
      }

      // Resolve internal link
      let targetPath;
      if (href.startsWith('/')) {
        targetPath = path.join(ROOT, href);
      } else {
        targetPath = path.resolve(path.dirname(filePath), href);
      }

      // Handle directory links (append index.html)
      if (fs.existsSync(targetPath) && fs.lstatSync(targetPath).isDirectory()) {
        targetPath = path.join(targetPath, 'index.html');
      }

      if (!fs.existsSync(targetPath)) {
        errors.push(`Broken link: ${href} (resolved to ${targetPath})`);
      }
    }
  } catch (e) {
    errors.push(`HTML Parsing Error: ${e.message}`);
  }

  return errors;
}

function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      // Skip .git and .hermes
      if (file !== '.git' && file !== '.hermes') {
        getHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--smoke')) {
    console.log('Running smoke test...');
    let allExist = true;
    for (const asset of REQUIRED_ASSETS) {
      const assetPath = path.join(ASSETS_DIR, asset);
      if (!fs.existsSync(assetPath)) {
        console.error(`❌ Asset missing: ${assetPath}`);
        allExist = false;
      } else {
        console.log(`✓ Asset found: ${asset}`);
      }
    }
    if (!allExist) process.exit(1);
    console.log('Smoke test passed.');
    return;
  }

  let filesToAudit = [];

  if (args.includes('--all')) {
    filesToAudit = getHtmlFiles(ROOT);
  } else if (args[0] === '--file' && args[1]) {
    filesToAudit = [path.resolve(ROOT, args[1])];
  } else if (args[0] === '--dir' && args[1]) {
    const dirPath = path.resolve(ROOT, args[1]);
    if (fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()) {
      filesToAudit = getHtmlFiles(dirPath);
    } else {
      console.error(`Error: ${args[1]} is not a directory`);
      process.exit(1);
    }
  } else {
    console.log('Usage: node scripts/audit-site.mjs [--smoke | --all | --file <path> | --dir <path>]');
    process.exit(1);
  }

  let totalErrors = 0;
  let passedFiles = 0;

  for (const file of filesToAudit) {
    const relativePath = path.relative(ROOT, file);
    const errors = await auditFile(file);
    if (errors.length > 0) {
      console.error(`❌ ${relativePath}:`);
      errors.forEach(err => console.error(`  - ${err}`));
      totalErrors += errors.length;
    } else {
      passedFiles++;
    }
  }

  console.log(`\nAudit complete. ${passedFiles}/${filesToAudit.length} files passed. Total errors: ${totalErrors}`);
  if (totalErrors > 0) process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
