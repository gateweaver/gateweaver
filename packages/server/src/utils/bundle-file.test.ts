import path from "path";
import fs from "fs";
import * as tsup from "tsup";
import { logger } from "./logger";
import { bundleFile } from "./bundle-file";

jest.mock("fs");
jest.mock("tsup");
jest.mock("./logger");

describe("bundleFile", () => {
  const mockOutDirPath = "/path/to/output";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the bundle path if the file already exists", async () => {
    const mockFilePath = "/path/to/source/file.ts";
    const mockBundlePath = "/path/to/output/file.cjs";
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    const result = await bundleFile(mockFilePath, mockOutDirPath);

    expect(result).toBe(mockBundlePath);
    expect(fs.existsSync).toHaveBeenCalledWith(mockBundlePath);
    expect(tsup.build).not.toHaveBeenCalled();
    expect(logger.info).not.toHaveBeenCalled();
  });

  it("should bundle the file and return the bundle path if the file does not exist", async () => {
    const mockFilePath = "/path/to/source/file.js";
    const mockBundlePath = "/path/to/output/file.cjs";
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (tsup.build as jest.Mock).mockResolvedValue(undefined);

    const result = await bundleFile(mockFilePath, mockOutDirPath);

    expect(result).toBe(mockBundlePath);
    expect(fs.existsSync).toHaveBeenCalledWith(mockBundlePath);
    expect(tsup.build).toHaveBeenCalledWith({
      silent: true,
      entry: [path.resolve(mockFilePath)],
      outDir: path.resolve(mockOutDirPath),
      format: ["cjs"],
      target: "node20",
      clean: false,
      outExtension: expect.any(Function),
    });
    expect(logger.info).toHaveBeenCalledWith(
      `Bundled ${path.resolve(mockFilePath)} to ${mockBundlePath}`,
    );
  });

  it("should handle .ts and .js file extensions correctly", async () => {
    const testCases = [
      { input: "file.ts", expected: "file.cjs" },
      { input: "file.js", expected: "file.cjs" },
    ];

    for (const { input, expected } of testCases) {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (tsup.build as jest.Mock).mockResolvedValue(undefined);

      const result = await bundleFile(input, mockOutDirPath);
      const expectedPath = path.join(path.resolve(mockOutDirPath), expected);

      expect(result).toBe(expectedPath);
    }
  });

  it("should throw an error if the build fails", async () => {
    const mockFilePath = "/path/to/source/file.ts";
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (tsup.build as jest.Mock).mockRejectedValue(new Error("Build failed"));

    await expect(bundleFile(mockFilePath, mockOutDirPath)).rejects.toThrow(
      "Build failed",
    );
  });
});
