import fs from 'fs';
import path from 'path';

const addJsExtensionToFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/(from\s+['"]\.\/.*)(?<!\.js)(['"])/g, '$1.js$2');
  fs.writeFileSync(filePath, updatedContent, 'utf8');
};

const processDirectory = (dir) => {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (filePath.endsWith('.js')) {
      addJsExtensionToFile(filePath);
    }
  });
};

const distDir = path.join(process.cwd(), 'dist');
processDirectory(distDir);
console.log('Added .js extensions to imports.');
