import fs from "fs";
// @ts-expect-error - Need to investigate
import openapiTS, { astToString } from "openapi-typescript";
import { Config } from "../config/config.types";
import path from "path";

const isUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const generateTypes = async (config: Config): Promise<void> => {
  const { endpoints } = config;

  if (fs.existsSync("./types")) {
    fs.rmdirSync("./types", { recursive: true });
  }
  fs.mkdirSync("./types");

  endpoints.forEach(async (endpoint, index) => {
    if (endpoint.target.openapi) {
      const { openapi } = endpoint.target;

      let ast: unknown;
      if (isUrl(openapi)) {
        ast = await openapiTS(openapi);
      } else {
        const schemaPath = path.join(process.cwd(), openapi);
        const schemaContent = fs.readFileSync(schemaPath, "utf8");
        ast = await openapiTS(schemaContent);
      }

      const contents = astToString(ast);

      fs.writeFileSync(`./types/types-${index}.ts`, contents);
    }
  });
};
