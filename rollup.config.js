// rollup.config.js
import vue from 'rollup-plugin-vue';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'index.js',
    output: [
        {
            file: 'dist/print-my-html-js.esm.js',
            format: 'es',
        },
        {
            file: 'dist/print-my-html-js.common.js',
            format: 'cjs',
        },
    ],
    plugins: [
        vue({
            css: true
        }),
        nodeResolve(),
        terser()
    ],
    external: ['vue'],
};
