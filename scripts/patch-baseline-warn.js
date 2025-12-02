#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const targets = [
  path.join(__dirname, '..', 'node_modules', 'baseline-browser-mapping', 'dist', 'index.js'),
  path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'compiled', 'browserslist', 'index.js'),
];

// Match the timestamp guard Next adds plus the console.warn call
const guardedPattern = /\d+<\(new Date\)\.setMonth\(\(new Date\)\.getMonth\(\)-2\)&&console\.warn\("[^"]*baseline-browser-mapping[^"]*"\);?/g;
// Fallback: any plain console.warn with the baseline-browser-mapping text
const warnPattern = /console\.warn\(["'`][^"'`]*baseline-browser-mapping[^"'`]*["'`]\);?/g;

for (const file of targets) {
  if (!fs.existsSync(file)) continue;
  const contents = fs.readFileSync(file, 'utf8');
  const hasGuarded = guardedPattern.test(contents);
  const hasWarn = warnPattern.test(contents);
  if (hasGuarded || hasWarn) {
    const updated = contents.replace(guardedPattern, '').replace(warnPattern, '');
    fs.writeFileSync(file, updated);
    console.log(`[patch-baseline-warn] Patched ${file}`);
  }
}
