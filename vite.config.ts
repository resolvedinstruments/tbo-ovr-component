import { defineConfig } from "vite"
import preact from "@preact/preset-vite"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), vanillaExtractPlugin(), cssInjectedByJsPlugin()],
  build: {
    lib: {
      entry: "src/component.js",
      name: "tbo-ovr-component",
      formats: ["umd"],
      fileName: (format) => `tbo-ovr-component.${format}.js`,
    },
  },
})
