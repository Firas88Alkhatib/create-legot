import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  esbuild: {
    jsxInject: "import { jsxTransform } from 'legot';"
  },
  plugins: [tsconfigPaths()]
});
