const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const docsDir = path.join(__dirname, '../src/content/docs');
const outputFile = path.join(__dirname, '../public/llms.txt');
const baseUrl = 'https://docs.kuzudb.com';

// Node structure for the directory tree
function TreeNode(name, isDir, filePath = null, title = null) {
  return {
    name,
    isDir,
    filePath,
    title,
    children: [],
  };
}

// Build a tree from file paths
function buildTree(files) {
  const root = TreeNode('root', true);
  files.forEach(file => {
    const relativePath = path.relative(docsDir, file);
    const parts = relativePath.split(path.sep);
    let current = root;

    // Traverse or create directories
    for (let i = 0; i < parts.length - 1; i++) {
      let child = current.children.find(c => c.name === parts[i] && c.isDir);
      if (!child) {
        child = TreeNode(parts[i], true);
        current.children.push(child);
      }
      current = child;
    }

    // Add the file
    const data = fs.readFileSync(file, 'utf8');
    const matterResult = matter(data);
    const title = matterResult.data.title || path.basename(file, path.extname(file));
    const fileNode = TreeNode(parts[parts.length - 1], false, file, title);
    current.children.push(fileNode);
  });

  // Sort children: directories first, then files, both alphabetically
  function sortNode(node) {
    node.children.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    node.children.forEach(sortNode);
  }
  sortNode(root);

  return root;
}

// Generate Markdown with sections and links
function generateMarkdown(node, depth = 0) {
  let content = '';

  // Process the current node (skip root)
  if (depth === 1 && node.isDir && node.name !== 'root') {
    // Capitalize and replace hyphens with spaces for section name
    const sectionName = node.name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    content += `## ${sectionName}\n\n`;
  } else if (depth === 0 && node.name === 'root') {
    // Add Root section for top-level files
    content += `## Root\n\n`;
  }

  // Process children
  node.children.forEach(child => {
    if (child.isDir) {
      // Recurse into directories
      content += generateMarkdown(child, depth + 1);
    } else {
      // Output file as a Markdown link
      const relativePath = path.relative(docsDir, child.filePath);
      const urlPath = relativePath.replace(/\.(md|mdx)$/, '');
      const fullUrl = `${baseUrl}/${urlPath}`;
      content += `- [${child.title}](${fullUrl}): ${child.title}\n`;
    }
  });

  return content;
}

// Get all Markdown files
function getMarkdownFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getMarkdownFiles(filePath));
    } else if (file.endsWith('.md') || fileEndsWith('.mdx')) {
      results.push(filePath);
    }
  });
  return results;
}

// Main execution
if (!fs.existsSync(docsDir)) {
  console.error('Documentation directory does not exist:', docsDir);
  process.exit(1);
}

const mdFiles = getMarkdownFiles(docsDir);
if (mdFiles.length === 0) {
  console.warn('No Markdown files found in:', docsDir);
  fs.writeFileSync(outputFile, '');
  process.exit(0);
}

const tree = buildTree(mdFiles);
const content = generateMarkdown(tree);
fs.writeFileSync(outputFile, content);