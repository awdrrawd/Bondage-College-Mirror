const path = require("path");
const { createModRollupConfig, parseEnv } = require("./utils/rollupUtils.cjs");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const terser = require("@rollup/plugin-terser");
const { defineConfig } = require("rollup");
const fs = require("fs");

const packageJSON = require(path.join(process.cwd(), "package.json"));

const banner = (() => {
    const repo = (() => {
        let url = packageJSON.repository?.url;
        if (!url) return "";

        if (url.startsWith("git+")) {
            url = url.slice(4);
        }
        if (url.endsWith(".git")) {
            url = url.slice(0, -4);
        }
        return url;
    })();
    return `/*\n${fs.readFileSync("LICENSE")}\n\n${repo}\n@preserve\n*/`;
})();

/**
 * @param {ReturnType<parseEnv>} param0
 */
function createTranslationConfig({ destDir, beta = false, debug = false }) {
    return defineConfig({
        input: `${__dirname}/translation/index.js`,
        output: {
            file: `${destDir}${beta ? "/beta" : ""}/translation.js`,
            format: "es",
            sourcemap: debug ? "inline" : true,
            banner,
        },
        treeshake: true,
        plugins: [commonjs(), resolve({ browser: true }), ...(debug ? [] : [terser({ sourceMap: true })])],
    });
}

module.exports = async (cliArgs) => {
    const env = parseEnv(__dirname, cliArgs);
    return await createModRollupConfig({
        env,
        packageJSON,
        banner,
        output: {
            file: undefined,
            dir: env.destDir,
            format: "esm",
            chunkFileNames: "[name]-[hash].js",
        },
    });
};
