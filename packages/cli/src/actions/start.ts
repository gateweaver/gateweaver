import { startServer } from "@gateweaver/server/utils";

export const startAction = (configPath: string) => {
  try {
    startServer(configPath);
  } catch (error) {
    console.error(error);
  }
};
