import html from '@web/rollup-plugin-html';
import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"

import { terser } from "rollup-plugin-terser";
import { brotliCompressSync } from 'zlib'
import gzipPlugin from 'rollup-plugin-gzip'

export default [
  {
    external: ["@microsoft/fast-element"],
    input: "src/index.ts",
    output: [
      {
        name: "components",
        file: "dist/components.umd.js",
        format: "umd",
        sourcemap: true,
        exports: "named",
      },
      {
        file: "dist/components.module.js",
        format: "es",
        sourcemap: true,
      },
      {
        dir: "dist/components",
        format: "es",
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: "src"
      }
    ],
    plugins: basePlugins()
  },

  // Compressed
  {
    input: "src/index.ts",
    output: [
      {
        name: "components",
        file: "dist/components.umd.min.js",
        format: "umd",
        sourcemap: true,
        exports: "named"
      },
      {
        file: "dist/components.module.min.js",
        format: "es",
        sourcemap: true,
      }
    ],
    plugins: compressionPlugins(),
  },

  // for previews
  {
    input: 'index.html',
    output: { dir: 'demo' },
    plugins: [resolve(), html()],
    external: ["https://cdn.skypack.dev/hls.js", "Hls"],
  }
]

function basePlugins(tsconfig = "tsconfig.json") {
  return [
    resolve(),
    typescript({ tsconfig }),
  ]
}

function compressionPlugins(tsconfig = "tsconfig.json") {
  return [
    ...basePlugins(tsconfig),
    terser({
      compress: {
        passes: 10
      }
    }),
    // GZIP compression as .gz files
    gzipPlugin(),
    // Brotil compression as .br files
    gzipPlugin({
        customCompression: content =>
            brotliCompressSync(Buffer.from(content)),
        fileName: '.br',
    }),
  ]
}

