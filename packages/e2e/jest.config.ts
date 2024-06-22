import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.env.ts", "<rootDir>/jest.setup.ts"],
  transform: {},
};

export default config;
