const fs = require('fs');
const path = require('path');

// Path to the controller file
const filePath = path.join(__dirname, 'src/controllers/invoice.controller.ts');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Count original occurrences
const originalCount = (content.match(/console\.log/g) || []).length;

// Replace various debug log patterns but keep error logs
const patterns = [
  // Standard debug logs
  /console\.log\s*\(\s*(['"`])\[DEBUG\][^;]*\);/g,
  
  // Debug logs that span multiple lines
  /console\.log\s*\(\s*(['"`])\[DEBUG\][^;]*\n[^;]*\);/g,
  
  // Page console event handler
  /page\.on\(\s*['"]console['"]\s*,[^;]*\);/g,
  
  // Request failed logs that aren't errors
  /console\.log\s*\(\s*[`'"]?\[REQUEST FAILED\][^;]*\);/g,
  
  // Line-specific patterns
  /console\.log\s*\(\s*[`'"]Generated cache key[^;]*\);/g,
  /console\.log\s*\(\s*[`'"]Cache invalid[^;]*\);/g,
  /console\.log\s*\(\s*[`'"]Cache metadata missing[^;]*\);/g,
  /console\.log\s*\(\s*[`'"]Using valid cached[^;]*\);/g,
  /console\.log\s*\(\s*[`'"]Removed invalid cache[^;]*\);/g,
  /console\.log\s*\(\s*[`'"]Cached PDF and metadata[^;]*\);/g,
  /console\.log\s*\(\s*[`'"]Generating new PDF[^;]*\);/g,
  /console\.log\s*\(\s*[`'"]Found \${invoices\.length[^;]*\);/g,
  /console\.log\s*\(\s*[`'"]User \${req\.user\._id[^;]*\);/g
];

// Apply all patterns
patterns.forEach(pattern => {
  content = content.replace(pattern, '');
});

// Manually handle complex multi-line patterns
content = content.replace(/console\.log\s*\(\s*['"`]\[DEBUG\] Template data structure:['"`],\s*JSON\.stringify\([^)]*\)\s*\);/g, '');
content = content.replace(/console\.log\s*\(\s*['"`]\[DEBUG\] Invoice structure:['"`],\s*JSON\.stringify\([^)]*\)\s*\);/g, '');
content = content.replace(/console\.log\s*\(\s*['"`]\[DEBUG\] Invoice date information:['"`],[^;]*\);/g, '');

// Count remaining console.log occurrences
const remainingCount = (content.match(/console\.log/g) || []).length;
const removedCount = originalCount - remainingCount;

// Write the file back
fs.writeFileSync(filePath, content);

console.log(`Removed ${removedCount} of ${originalCount} console.log statements`);
console.log(`Remaining logs: ${remainingCount} (should be only error logs)`);
console.log('Debug logs cleaned up successfully!'); 