const fs = require('fs');
const path = require('path');

const DOCS_DIR = './docs';
const IGNORE_FILES = ['index.html', '_sidebar.md', '_navbar.md'];

// Recursivamente busca archivos .md
function getMarkdownFiles(dir, basePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(getMarkdownFiles(fullPath, relativePath));
    } else if (
      entry.name.endsWith('.md') &&
      !IGNORE_FILES.includes(entry.name)
    ) {
      results.push(relativePath);
    }
  }

  console.log("Archivos encontrados:", results);  // Verifica qué archivos se están encontrando
  return results.sort();
}

function extractTitleFromFile(filePath) {
  const fullPath = path.join(DOCS_DIR, filePath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const lines = content.split('\n');

  for (const line of lines) {
    const match = line.match(/^# (.+)/);
    if (match) {
      return match[1].trim();
    }
  }

  // fallback si no hay título
  const base = path.basename(filePath, '.md');
  return base.charAt(0).toUpperCase() + base.slice(1).replace(/[-_]/g, ' ');
}

function generateSidebarContent(files) {
  let content = '- [Inicio](README.md)\n';

  for (const file of files) {
    const depth = file.split(path.sep).length - 1;
    const indent = '  '.repeat(depth);
    const title = extractTitleFromFile(file);
    content += `${indent}- [${title}](${file.replace(/\\/g, '/')})\n`;
  }

  console.log("Contenido del sidebar generado:\n", content);  // Verifica el contenido generado
  return content;
}

function writeSidebar(content) {
  const sidebarPath = path.join('_sidebar.md');
  try {
    fs.writeFileSync(sidebarPath, content);
    console.log('✅ _sidebar.md generado con títulos de los documentos.');
  } catch (error) {
    console.error("Error al escribir _sidebar.md:", error);
  }
}

const files = getMarkdownFiles(DOCS_DIR);
if (files.length > 0) {
  const sidebar = generateSidebarContent(files);
  writeSidebar(sidebar);
} else {
  console.log('No se encontraron archivos .md para generar el sidebar.');
}
