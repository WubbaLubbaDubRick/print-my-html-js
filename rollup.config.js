// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/print-my-html-js.js',
            format: 'umd',
            name: 'PrintMyHtmlJs',
            sourcemap: false,
            globals: {
                vue: 'Vue', // 这里指定 Vue 对应的全局变量名
            },
        },
        // {
        //     file: 'dist/print-my-html-js.esm.js',
        //     format: 'es',
        // },
        // {
        //     file: 'dist/print-my-html-js.common.js',
        //     format: 'cjs',
        // },
    ],
    plugins: [
        typescript(),
        nodeResolve(),
        vue(),
        isProduction && terser()
    ],
    external: ['vue'],
};
