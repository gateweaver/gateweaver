import fs from "fs";
import { parseConfig } from "./parse-config";
import { validateConfig } from "./validate-config";
import { InvalidConfigError } from "../utils/errors";

jest.mock("fs");
jest.mock("./validate-config");

describe("parseConfig", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.TEST_VAR = "test value";
  });

  const configPath = "config.yml";

  it("should correctly identify and parse a file with .yaml extension", () => {
    const fileContent = "endpoints: value";
    const mockConfig = {
      endpoints: "value",
      policyDefinitions: {
        cors: {},
        rateLimit: {},
      },
    };

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(fileContent);
    (validateConfig as jest.Mock).mockReturnValue(mockConfig);

    const result = parseConfig(configPath);

    expect(fs.existsSync).toHaveBeenCalledWith(configPath);
    expect(fs.readFileSync).toHaveBeenCalledWith(configPath, "utf8");
    expect(result).toEqual(mockConfig);
  });

  it("should throw an error if the config file does not exist", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    expect(() => parseConfig("missingConfig.yml")).toThrow(
      "Gateweaver config file not found at path: missingConfig.yml",
    );
  });

  it("should replace environment variables in the file content before validating", () => {
    const fileContent = "endpoints: ${TEST_VAR}";
    const mockConfig = {
      endpoints: "test value",
      policyDefinitions: {
        cors: {},
        rateLimit: {},
      },
    };

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

    parseConfig(configPath);

    expect(fs.readFileSync).toHaveBeenCalledWith(configPath, "utf8");
    expect(validateConfig).toHaveBeenCalledWith(mockConfig);
  });

  it("should throw an InvalidConfigError if an environment variable is not found", () => {
    const fileContent = "endpoints: ${MISSING_VAR}";

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

    expect(() => parseConfig(configPath)).toThrow(InvalidConfigError);
  });
});
