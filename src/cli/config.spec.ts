import config from "./config";
import { cfg } from ".";

jest.mock(".");

const log = jest.spyOn(console, "log").mockImplementation(() => {});
const mockCfg = (cfg as any) as typeof import("./__mocks__").cfg;

afterAll(() => log.mockRestore());

describe("setting", () => {
  afterEach(() => (mockCfg.__data = {}));

  test("sets the license", () => {
    config({ license: "MIT" });
    expect(mockCfg.__data).toEqual({ license: "MIT" });
  });

  test("throws an error about invalid license", () => {
    expect(() => config({ license: "mit" })).toThrow(
      "license must be a valid SPDX identifier"
    );
  });

  test("sets the name", () => {
    config({ name: "Ovyerus" });
    expect(mockCfg.__data).toEqual({ name: "Ovyerus" });
  });

  test("sets the email", () => {
    config({ email: "john@example.com" });
    expect(mockCfg.__data).toEqual({ email: "john@example.com" });
  });
});

describe("getting", () => {
  afterEach(() => log.mockReset());

  test("logs nothing", () => {
    config({});
    expect(log).not.toHaveBeenCalled();
  });

  test("logs the license", () => {
    mockCfg.__data = { license: "MIT" };
    config({});

    expect(log).toHaveBeenCalledWith("license=MIT");
  });

  test("logs the name", () => {
    mockCfg.__data = { name: "Ovyerus" };
    config({});

    expect(log).toHaveBeenCalledWith("name=Ovyerus");
  });

  test("logs the email", () => {
    mockCfg.__data = { email: "john@example.com" };
    config({});

    expect(log).toHaveBeenCalledWith("email=john@example.com");
  });

  test("logs everything", () => {
    mockCfg.__data = {
      name: "Ovyerus",
      license: "MIT",
      email: "john@example.com"
    };
    config({});

    expect(log).toHaveBeenCalledTimes(3);
    expect(log.mock.calls).toEqual([
      ["name=Ovyerus"],
      ["license=MIT"],
      ["email=john@example.com"]
    ]);
  });
});
