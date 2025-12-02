#!/usr/bin/env node

// Suppress noisy baseline-browser-mapping warnings from Next's bundled browserslist.
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('[baseline-browser-mapping]')) {
    return;
  }
  originalWarn(...args);
};

// Pass through to Next CLI with original arguments.
const [, , ...rest] = process.argv;
process.argv = ['node', 'next', ...rest];
require('next/dist/bin/next');
