import crypto from "crypto";

export const generateApiKey = (): string => {
  return crypto.randomUUID().replace(/-/g, "");
};

export const hashApiKey = (apiKey: string): string => {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
};

export const isValidApiKey = (
  apiKey: string | string[],
  apiKeyHashes: string[],
): boolean => {
  if (typeof apiKey !== "string") return false;

  const apiKeyHash = hashApiKey(apiKey);
  return apiKeyHashes.includes(apiKeyHash);
};
