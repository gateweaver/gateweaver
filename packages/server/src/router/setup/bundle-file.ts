import path from "path";
import { existsSync } from "fs";
import { build } from "tsup";

export const bundleFile = async (
  filePath: string,
  outDirPath: string,
): Promise<string> => {
  const entry = path.resolve(filePath);

  const outDir = path.resolve(outDirPath);

  const bundlePath = path.join(
    outDir,
    path.basename(filePath).replace(/\.[jt]s?$/, ".cjs"),
  );

  if (!existsSync(bundlePath)) {
    await build({
      entry: [entry],
      outDir,
      format: ["cjs"],
      target: "node20",
      clean: false,
      outExtension() {
        return {
          js: `.cjs`,
        };
      },
    });
  }

  return bundlePath;
};
