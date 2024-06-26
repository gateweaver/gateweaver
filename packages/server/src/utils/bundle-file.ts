import path from "path";
import { existsSync } from "fs";
import { build } from "tsup";
import { logger } from "./logger";

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
      silent: true,
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

    const relativeEntry = path.relative(process.cwd(), entry);
    const relativeBundlePath = path.relative(process.cwd(), bundlePath);
    logger.info(`Bundled ${relativeEntry} to ${relativeBundlePath}`);
  }

  return bundlePath;
};
