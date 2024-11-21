#!/usr/bin/env node
const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

const config = {
  bundle: true,
  minify: true,
  sourcemap: false,
  target: 'es2020',
  plugins: [nodeExternalsPlugin()],
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
