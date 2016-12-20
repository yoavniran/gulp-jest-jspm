describe("jspmConfigLoader tests", () => {
    "use strict";

    const loaderResult = {foo: "bar"};

    beforeAll(() => {

    });

    beforeEach(() => {
        jest.mock("../src/utils", () => ({
            getModuleFromAbsBasePath: jest.fn()
        }));

        const mockUtils = require("../src/utils");
        mockUtils.getModuleFromAbsBasePath.mockClear();

        mockUtils.getModuleFromAbsBasePath
            .mockImplementationOnce(() => ({getConfig: () => loaderResult}))
            .mockImplementationOnce(() => "sysjs-config")
    });

    it("should return system js config object from config file", () => {

        const basePath = "./bla",
            options = {
                loadSjsConfFile: true,
                systemJs: "sysjs",
                sjsConfigFile: "sjsConf"
            },
            result = require("../src/jspmConfigLoader").default(basePath, options);

        const mockGetModule = require("../src/utils").getModuleFromAbsBasePath;

        expect(mockGetModule).toHaveBeenCalledTimes(2);
        expect(mockGetModule.mock.calls[0]).toEqual([basePath, options.systemJs]);
        expect(mockGetModule.mock.calls[1]).toEqual([basePath, options.sjsConfigFile]);
        expect(result).toEqual(loaderResult);
    });

    it("should return system js config object without config file", () => {
        const basePath = "./bla",
            options = {
                loadSjsConfFile: false,
                systemJs: "sysjs",
            },
            result = require("../src/jspmConfigLoader").default(basePath, options);

        const mockGetModule = require("../src/utils").getModuleFromAbsBasePath;

        expect(mockGetModule).toHaveBeenCalledTimes(1);
        expect(mockGetModule.mock.calls[0]).toEqual([basePath, options.systemJs]);
        expect(result).toEqual(loaderResult);
    });
});
