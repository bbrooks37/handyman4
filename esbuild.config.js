const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.jsx'], // Update this to your entry point
  bundle: true,
  outfile: 'dist/bundle.js',
  loader: {
    '.js': 'jsx', // Add this line to enable JSX syntax in .js files
  },
}).catch(() => process.exit(1));
