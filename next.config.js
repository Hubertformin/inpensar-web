/** @type {import('next').NextConfig} */
const path = require('path');
const runtimeCaching = require('next-pwa/cache');
const isDev = process.env.NODE_ENV === 'development';
const removeImports = require('next-remove-imports')();

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDev,
  runtimeCaching
});

module.exports = withPWA(removeImports({
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}));
