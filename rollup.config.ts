import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy-assets'

export default {
    input: 'src/index.tsx',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
        },
        {
            file: pkg.module,
            format: 'es',
        },
    ],
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
        typescript({
            typescript: require('typescript'),
        }),
        postcss({
            modules: true,
            namedExports: true
        }),
        copy({
            assets: [
                "src/assets/images"
            ]
        })
    ],
}