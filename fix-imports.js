import fs from 'fs';
import path from 'path';

function fixImports(content) {
  let modified = false;

  // Fix static imports: import { xyz } from "./file" or "../file"
  const newContent1 = content.replace(/from\s+['"](\.[^'"]+)['"]/g, (match, p) => {
    if (p.endsWith('.js') || p.endsWith('.json') || p.endsWith('.ts')) return match;
    modified = true;
    return match.replace(p, `${p}.js`);
  });

  // Fix dynamic imports: await import("./file") or await import("../file")
  const finalContent = newContent1.replace(/import\(['"](\.[^'"]+)['"]\)/g, (match, p) => {
    if (p.endsWith('.js') || p.endsWith('.json') || p.endsWith('.ts')) return match;
    modified = true;
    return match.replace(p, `${p}.js`);
  });

  return { content: finalContent, modified };
}

function getFiles(dir, files = []) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) getFiles(fullPath, files);
    else if (fullPath.endsWith('.ts')) files.push(fullPath);
  }
  return files;
}

const files = getFiles('server');
let changedCount = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const { content: fixedContent, modified } = fixImports(content);

  if (modified && content !== fixedContent) {
    fs.writeFileSync(file, fixedContent);
    console.log('Fixed imports in', file);
    changedCount++;
  }
}

console.log(`Finished fixing imports. Modified ${changedCount} files.`);
