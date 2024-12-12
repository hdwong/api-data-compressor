#!/usr/bin/env node
const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const { readFileSync } = require('fs');

// read package.json
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
const version = pkg.version;

const config = {
  bundle: true,
  minify: true,
  sourcemap: false,
  target: 'es2020',
  plugins: [nodeExternalsPlugin()],
  define: {
    'process.env.VERSION': JSON.stringify(version), // inject version
  }
}

const builds = [
  { entryPoints: ['src/index.ts'], format: 'esm', outfile: 'dist/index.esm.js', platform: 'browser' },
  { entryPoints: ['src/index.ts'], format: 'cjs', outfile: 'dist/index.js', platform: 'browser' },
]

builds.forEach((build) => {
  esbuild
    .build({ ...config, ...build })
    .then(() => console.log(`Built ${build.entryPoints} (${build.format})…`))
    .catch(() => process.exit(1))
})
