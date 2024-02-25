import crypto from "crypto";

const generateApiKey = (): string => {
  return crypto.randomUUID().replace(/-/g, "");
};

const generateApiKeyHash = (apiKey: string): string => {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
};

export const generateApiKeyAction = (): void => {
  try {
    const apiKey = generateApiKey();
    const apiKeyHash = generateApiKeyHash(apiKey);

    console.log("API Key:", apiKey);
    console.log("\nHashed API Key:", apiKeyHash);

    console.log(
      "\nPlease store the API Key securely and add the hashed API Key to your config file.",
    );
  } catch (error) {
    console.error("Error generating API key:", error);
  }
};
