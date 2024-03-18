import { parseConfig, InvalidConfigError } from "@gateweaver/server/utils";

export const validateAction = (configPath: string) => {
  try {
    parseConfig(configPath);
    console.log("✅ Config file is valid");
  } catch (error) {
    if (error instanceof InvalidConfigError) {
      const validationErrors = error.message.split("\n");

      console.error("❌ Config file validation errors:");
      validationErrors.map((error) => console.error(`- ${error}`));
    } else {
      console.error((error as Error).message);
    }
  }
};
