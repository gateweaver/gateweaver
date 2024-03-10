import crypto from "crypto";
import { hashApiKey } from "@gateweaver/utils";

const generateApiKey = (): string => {
  return crypto.randomUUID().replace(/-/g, "");
};

export const generateApiKeyAction = (): void => {
  try {
    const apiKey = generateApiKey();
    const apiKeyHash = hashApiKey(apiKey);

    console.log("API Key:", apiKey);
    console.log("\nHashed API Key:", apiKeyHash);

    console.log(
      "\nPlease store the API Key securely and add the hashed API Key to your config file.",
    );
  } catch (error) {
    console.error("Error generating API key:", error);
  }
};
