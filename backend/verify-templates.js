const fs = require('fs');
const path = require('path');

console.log('Current working directory:', process.cwd());

// Paths to check
const paths = [
  // Current directory
  path.join(process.cwd(), 'invoice-template.html'),
  path.join(process.cwd(), 'invoice-styles.css'),
  
  // Parent directory
  path.join(process.cwd(), '..', 'invoice-template.html'),
  path.join(process.cwd(), '..', 'invoice-styles.css'),
  
  // Using __dirname
  path.join(__dirname, 'invoice-template.html'),
  path.join(__dirname, 'invoice-styles.css'),
  
  // Using __dirname with relative paths
  path.join(__dirname, '..', 'invoice-template.html'),
  path.join(__dirname, '..', 'invoice-styles.css'),
  
  // Using __dirname with the original relative path
  path.join(__dirname, '../../..', 'invoice-template.html'),
  path.join(__dirname, '../../..', 'invoice-styles.css')
];

// Check each path
paths.forEach(p => {
  try {
    if (fs.existsSync(p)) {
      console.log(`✅ File exists at: ${p}`);
      // Try to read the file
      try {
        const content = fs.readFileSync(p, 'utf8');
        console.log(`  Read ${content.length} characters from file`);
      } catch (readErr) {
        console.log(`  ❌ Could not read file: ${readErr.message}`);
      }
    } else {
      console.log(`❌ File NOT found at: ${p}`);
    }
  } catch (err) {
    console.log(`❌ Error checking path: ${p}`, err);
  }
});

// List all files in current directory
console.log('\nFiles in current directory:');
try {
  const files = fs.readdirSync(process.cwd());
  files.forEach(file => {
    const stats = fs.statSync(path.join(process.cwd(), file));
    console.log(`- ${file} (${stats.isDirectory() ? 'directory' : 'file'})`);
  });
} catch (err) {
  console.log('Error listing files:', err);
} 