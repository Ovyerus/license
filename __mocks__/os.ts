const os: typeof import("os") = jest.genMockFromModule("os");

os.homedir = () => "/usr";

export = os;
