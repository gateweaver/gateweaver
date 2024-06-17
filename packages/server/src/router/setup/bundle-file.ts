import path from "path";
import { build } from "tsup";

export const bundleFile = async (
  filePath: string,
  outDirPath: string,
): Promise<string> => {
  const entry = path.resolve(filePath);

  const outDir = path.resolve(outDirPath);

  await build({
    entry: [entry],
    outDir,
    format: ["cjs"],
    target: "node20",
    clean: true,
    outExtension() {
      return {
        js: `.cjs`,
      };
    },
  });

  const bundlePath = path.join(
    outDir,
    path.basename(filePath).replace(/\.[jt]s?$/, ".cjs"),
  );
  return bundlePath;
};
