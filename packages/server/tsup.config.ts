import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/main.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
});
