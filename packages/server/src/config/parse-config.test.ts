import fs from "fs";
import { InvalidConfigError } from "../errors";
import { parseConfig } from "./parse-config";
import { validateConfig } from "./validate-config";

jest.mock("fs");
jest.mock("./validate-config");

describe("parseConfig", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.TEST_VAR = "test value";
  });

  it("should correctly identify and parse a file with .yaml extension", () => {
    const configPath = "config.yml";
    const mockConfig = { endpoints: "value" };

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue("endpoints: value");
    (validateConfig as jest.Mock).mockReturnValue(mockConfig);

    const result = parseConfig(configPath);

    expect(fs.existsSync).toHaveBeenCalledWith(configPath);
    expect(fs.readFileSync).toHaveBeenCalledWith(configPath, "utf8");
    expect(validateConfig).toHaveBeenCalledWith(mockConfig);
    expect(result).toEqual(mockConfig);
  });

  it("should throw an error if the config file does not exist", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    expect(() => parseConfig("missingConfig.yml")).toThrow(
      "Gateweaver config file not found at path: missingConfig.yml",
    );
  });

  it("should replace environment variables in the file content before validating", () => {
    const configPath = "config.yml";
    const mockConfig = { endpoints: "test value" };

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue("endpoints: ${TEST_VAR}");

    parseConfig(configPath);

    expect(fs.readFileSync).toHaveBeenCalledWith(configPath, "utf8");
    expect(validateConfig).toHaveBeenCalledWith(mockConfig);
  });

  it("should throw an InvalidConfigError if an environment variable is not found", () => {
    const configPath = "config";

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue("endpoints: ${MISSING_VAR}");

    expect(() => parseConfig(configPath)).toThrow(InvalidConfigError);
  });
});
