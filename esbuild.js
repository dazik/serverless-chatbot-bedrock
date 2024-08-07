const esbuild = require('esbuild');
const glob = require('glob');

// Define your source directory and glob pattern
const srcDir = 'src';
const outDir = 'dist';
const tsPattern = `${srcDir}/**/*.ts`;

// Find TypeScript files using glob
const entryPoints = glob.sync(tsPattern);

esbuild.build({
  entryPoints,
  outdir: outDir,
  bundle: true,             // Bundle dependencies
  platform: 'node',         // Platform for AWS Lambda
  target: 'node20',         // Adjust to your Node.js version
  sourcemap: true,          // Generate source maps
  minify: false,            // Minification is optional
  logLevel: 'info',         // Log level
  external: ['@aws-sdk'],    // Exclude aws-sdk from the bundle
}).catch(() => process.exit(1));
