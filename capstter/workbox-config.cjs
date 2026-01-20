module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{js,css,html,svg,png,ico,json}'
  ],
  swSrc: 'src/sw.js',
  swDest: 'dist/sw.js',
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024
};