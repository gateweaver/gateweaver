import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/start-server.ts"],
  format: ["cjs", "esm"],
  dts: true,
});
