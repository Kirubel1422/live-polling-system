const fs = require('fs');

const log = fs.readFileSync('tsc_errors.log', 'utf8');
const lines = log.split('\n');

const fixes = new Map(); // file -> map of line number -> list of types to fix

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const match = line.match(/^(.+?):(\d+):\d+ - error TS1484: '(.+?)' is a type/);
  if (match) {
    const [_, file, lineNum, typeName] = match;
    if (!fixes.has(file)) fixes.set(file, new Map());
    const fileFixes = fixes.get(file);
    if (!fileFixes.has(lineNum)) fileFixes.set(lineNum, []);
    fileFixes.get(lineNum).push(typeName);
  }
}

for (const [file, lineFixes] of fixes.entries()) {
  let content = fs.readFileSync(file, 'utf8').split('\n');
  
  for (const [lineNumStr, typeNames] of lineFixes.entries()) {
    const lineIndex = parseInt(lineNumStr, 10) - 1;
    let text = content[lineIndex];
    
    // Simplest fix: replace 'import {' with 'import type {'
    // If there are mixed imports, this might be overly aggressive, but let's check.
    // If it's a mixed import, typescript will then complain about values being imported as types, but we'll see!
    // Actually, replacing `import {` with `import type {` is the safest for TS1484 if ALL are types.
    if (text.includes('import {') && !text.includes('import type {') && !text.includes('import { type ')) {
      text = text.replace('import {', 'import type {');
    }
    
    content[lineIndex] = text;
  }
  
  fs.writeFileSync(file, content.join('\n'));
  console.log(`Fixed ${file}`);
}
