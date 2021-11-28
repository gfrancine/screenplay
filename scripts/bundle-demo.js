const esbuild = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");

esbuild
  .build({
    entryPoints: ["demo/index.ts"],
    bundle: true,
    minify: false,
    sourcemap: true,
    outfile: "demo/dist/bundle.js",
    plugins: [
      sassPlugin(),
    ],
  })
  .catch((e) => {throw e});
