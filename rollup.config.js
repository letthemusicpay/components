import { nodeResolve } from '@rollup/plugin-node-resolve';
import html from '@web/rollup-plugin-html';

export default {
  input: 'index.html',
  output: { dir: 'demo' },
  plugins: [nodeResolve(), html()],
  external: ["https://cdn.skypack.dev/hls.js", "Hls"],
};
