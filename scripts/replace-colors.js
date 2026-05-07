const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.join(__dirname, '..', 'src');

const replacements = [
  // Gradients
  ['from-amber-500 to-orange-600', 'from-emerald-600 to-emerald-700'],
  ['from-amber-500 to-orange-500', 'from-emerald-600 to-emerald-700'],
  ['from-amber-600 to-orange-600', 'from-emerald-700 to-emerald-800'],
  ['from-amber-500 to-yellow-500', 'from-emerald-500 to-yellow-500'],
  ['from-orange-500 to-red-500', 'from-yellow-500 to-amber-600'],
  ['from-amber-500 via-orange-500 to-red-500', 'from-emerald-600 via-yellow-500 to-amber-500'],
  ['from-amber-500 via-orange-500 to-red-500', 'from-emerald-600 via-yellow-500 to-amber-500'],
  
  // Gradient backgrounds
  ['from-amber-50 to-orange-50', 'from-emerald-50 to-yellow-50'],
  ['from-amber-100 to-orange-100', 'from-emerald-100 to-yellow-100'],
  ['from-amber-50 via-orange-50 to-white', 'from-emerald-50 via-yellow-50 to-white'],
  
  // Text colors
  ['text-amber-600', 'text-emerald-600'],
  ['text-amber-700', 'text-yellow-700'],
  ['text-amber-500', 'text-emerald-500'],
  ['text-amber-400', 'text-yellow-500'],
  ['text-amber-100', 'text-yellow-100'],
  ['text-amber-800', 'text-yellow-800'],
  
  // Hover text
  ['hover:text-amber-600', 'hover:text-emerald-600'],
  ['hover:text-amber-700', 'hover:text-emerald-700'],
  ['hover:text-amber-400', 'hover:text-yellow-500'],
  
  // Background colors
  ['bg-amber-50', 'bg-emerald-50'],
  ['bg-amber-100/80', 'bg-emerald-100/80'],
  ['bg-amber-500', 'bg-emerald-600'],
  ['bg-amber-200/30', 'bg-emerald-200/30'],
  ['bg-orange-200/30', 'bg-yellow-200/30'],
  
  // Border colors
  ['border-amber-200/50', 'border-emerald-200/50'],
  ['border-amber-100', 'border-emerald-100'],
  ['border-amber-200', 'border-emerald-200'],
  ['hover:border-amber-200', 'hover:border-emerald-200'],
  ['border-amber-100/50', 'border-emerald-100/50'],
  
  // Ring focus
  ['ring-amber-500/20', 'ring-emerald-600/20'],
  ['focus:ring-amber-500/20', 'focus:ring-emerald-600/20'],
  ['focus:border-amber-500', 'focus:border-emerald-600'],
  ['text-amber-500 focus:ring-amber-500', 'text-emerald-600 focus:ring-emerald-600'],
  
  // Shadows
  ['shadow-amber-500/20', 'shadow-emerald-600/20'],
  ['hover:shadow-amber-500/30', 'hover:shadow-emerald-600/30'],
  ['shadow-xl shadow-amber-500/20', 'shadow-xl shadow-emerald-600/20'],
  ['hover:shadow-2xl hover:shadow-amber-500/30', 'hover:shadow-2xl hover:shadow-emerald-600/30'],
  
  // Gradient text
  ['from-amber-600 to-orange-600', 'from-emerald-700 to-emerald-800'],
  
  // Amber A (for admin)
  ['bg-amber-50 text-amber-600', 'bg-emerald-50 text-emerald-600'],
  ['bg-amber-50 text-amber-700', 'bg-emerald-50 text-yellow-700'],
  ['hover:bg-amber-50 text-gray-400 hover:text-amber-600', 'hover:bg-emerald-50 text-gray-400 hover:text-emerald-600'],
  ['bg-amber-50 text-amber-700 border-amber-200', 'bg-emerald-50 text-yellow-700 border-emerald-200'],
  ['hover:bg-amber-100', 'hover:bg-emerald-100'],
  ['bg-amber-50 rounded-xl border border-amber-100', 'bg-emerald-50 rounded-xl border border-emerald-100'],
  
  // Shop filter buttons
  ['bg-amber-500 border-amber-500 text-white', 'bg-emerald-600 border-emerald-600 text-white'],
  ['bg-amber-500 text-white shadow-sm', 'bg-emerald-600 text-white shadow-sm'],
  
  // Amber chips
  ['bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-200', 'bg-emerald-50 text-yellow-700 rounded-full text-xs font-medium border border-emerald-200'],
  
  // Inline
  ['bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl', 'bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl'],
  ['bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg', 'bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg'],
  ['bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl', 'bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl'],
  
  // Gradient to transparent
  ['from-amber-300 to-transparent', 'from-emerald-300 to-transparent'],
  ['from-orange-300 to-transparent', 'from-yellow-300 to-transparent'],
  
  // from-amber-600 to-orange-600 in bg-gradient
  ['bg-gradient-to-br from-amber-600 to-orange-600', 'bg-gradient-to-br from-emerald-700 to-emerald-800'],
  
  // Stock text
  ['text-amber-600 :', 'text-yellow-600 :'], // special case for stock
  ['text-amber-600 }', 'text-yellow-600 }'],
  
  // remaining bg-amber-X
  ['bg-amber-50 ', 'bg-emerald-50 '],
  ['bg-amber-100 ', 'bg-emerald-100 '],
  
  // Final passes for any remaining
  ['amber-500', 'emerald-600'],
  ['amber-600', 'emerald-600'],
  ['amber-700', 'yellow-700'],
  ['amber-400', 'yellow-500'],
  ['amber-50', 'emerald-50'],
  ['amber-100', 'emerald-100'],
  ['amber-200', 'emerald-200'],
  ['amber-300', 'emerald-300'],
  ['orange-600', 'emerald-700'],
  ['orange-500', 'yellow-600'],
  ['orange-50', 'yellow-50'],
  ['orange-100', 'yellow-100'],
  ['orange-200', 'yellow-200'],
  ['orange-300', 'yellow-300'],
];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  for (const [oldStr, newStr] of replacements) {
    if (content.includes(oldStr)) {
      content = content.split(oldStr).join(newStr);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓ ${path.relative(srcDir, filePath)}`);
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.css')) {
      replaceInFile(fullPath);
    }
  }
}

console.log('Replacing amber/orange with emerald/yellow...');
walkDir(srcDir);
console.log('Done!');
