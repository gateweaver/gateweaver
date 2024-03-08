import { parseConfigYaml } from "./parse";
import fs from "fs";
import { validateConfig } from "./validate";

jest.mock("fs");
jest.mock("./validate");

describe("parseConfigYaml", () => {
  const mockEnv = { TEST_VAR: "value" };

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...mockEnv }; // Reset environment variables for each test
  });

  it("should correctly identify and parse a file with .yaml extension", () => {
    const configPath = "config";
    const fullPath = `${configPath}.yml`;
    const mockConfig = { endpoints: "value" };

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue("endpoints: value");
    (validateConfig as jest.Mock).mockReturnValue(mockConfig);

    const result = parseConfigYaml(configPath);

    expect(fs.existsSync).toHaveBeenCalledWith(fullPath);
    expect(fs.readFileSync).toHaveBeenCalledWith(fullPath, "utf8");
    expect(validateConfig).toHaveBeenCalledWith(mockConfig);
    expect(result).toEqual(mockConfig);
  });

  it("should throw an error if the config file does not exist", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    expect(() => parseConfigYaml("missingConfig")).toThrow(
      /not found with .yml or .yaml extension/,
    );
  });

  it("should replace environment variables in the file content before validating", () => {
    const configPath = "config";
    const fullPath = `${configPath}.yml`;
    const mockConfig = { endpoints: "value" };

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue("endpoints: ${TEST_VAR}");

    parseConfigYaml(configPath);

    expect(fs.readFileSync).toHaveBeenCalledWith(fullPath, "utf8");
    expect(validateConfig).toHaveBeenCalledWith(mockConfig);
  });
});
