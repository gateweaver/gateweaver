import { Command } from "commander";
import { generateApiKey, hashApiKey } from "@gateweaver/policies";

export const generateApiKeyCommand = (program: Command) => {
  program
    .command("generate-api-key")
    .description("Generate a new API key and hash")
    .action(() => {
      try {
        const apiKey = generateApiKey();
        const apiKeyHash = hashApiKey(apiKey);

        console.log("API Key:", apiKey);
        console.log("\nHashed API Key:", apiKeyHash);

        console.log(
          "\nPlease store the API Key securely and add the hashed API Key to your config file.", // TODO: add link to docs
        );
      } catch (error) {
        console.error(error);
      }
    });
};
