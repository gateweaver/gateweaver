import { config } from "dotenv";
config({ path: ".env.gateweaver" });
import { getDefaultConfigPath } from "./config/get-default-config-path";
import { startServer } from "./server";
import { handleServerError } from "./utils/errors";

const main = async () => {
  try {
    const filePath = getDefaultConfigPath();
    await startServer(filePath, true);
  } catch (error) {
    handleServerError(error);
  }
};

main();
