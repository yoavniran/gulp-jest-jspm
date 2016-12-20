describe("plugin tests", () => {
    "use strict";

    let testResultType = "";

    beforeAll(() => {

        const testResults = {
            "empty": {},
            "valid": {
                "^actions$": "<rootDir>/src/actions/index",
                "^actions/(.*)": "<rootDir>/src/actions/index/$1",
                "^axios$": "axios@0.15.2",
                "^axios/(.*)": "axios@0.15.2/$1",
                "^babel$": "babel-core@5.8.38",
                "^babel/(.*)": "babel-core@5.8.38/$1",
                "^buffer$": "jspm/nodelibs-buffer@0.1.0",
                "^buffer/(.*)": "jspm/nodelibs-buffer@0.1.0/$1",
                "^buffer-shims$": "buffer-shims@1.0.0",
                "^buffer-shims/(.*)": "buffer-shims@1.0.0/$1",
                "^core-util-is$": "core-util-is@1.0.2",
                "^core-util-is/(.*)": "core-util-is@1.0.2/$1"
            },
            "validShort": {
                "^actions$": "<rootDir>/src/actions/index",
                "^actions/(.*)": "<rootDir>/src/actions/index/$1",
                "^axios$": "axios@0.15.2",
                "^axios/(.*)": "axios@0.15.2/$1",
            }
        };

        jest.mock("../src/jspmMappingReader", () =>
            jest.fn(() => testResults[testResultType]));
    });

    beforeEach(() => {
        const mockMappingReader = require("../src/jspmMappingReader");
        mockMappingReader.mockClear();
    });

    it("should return valid jest config for defaults", () => {
        testResultType = "valid";

        const testBasePath = "./bla",
            testOptions = {foo: "bar"},
            result = require("../src/index").getJestConfig(testBasePath, testOptions);

        const mockMappingReader = require("../src/jspmMappingReader");

        expect(mockMappingReader).toHaveBeenCalledTimes(1);
        expect(mockMappingReader).toHaveBeenCalledWith(testBasePath, {
            ...{
                loadSjsConfFile: true,
                systemJs: "./jspm_packages/system",
                sjsConfigFile: "./config",
                jspmPackages: "jspm_packages",
                nodeModules: "node_modules"
            }, ...testOptions
        });

        expect(result).toEqual({
            moduleNameMapper: {
                "^actions$": "<rootDir>/src/actions/index",
                "^actions/(.*)": "<rootDir>/src/actions/index/$1",
                "^axios$": "axios@0.15.2",
                "^axios/(.*)": "axios@0.15.2/$1",
                "^babel$": "babel-core@5.8.38",
                "^babel/(.*)": "babel-core@5.8.38/$1",
                "^buffer$": "jspm/nodelibs-buffer@0.1.0",
                "^buffer/(.*)": "jspm/nodelibs-buffer@0.1.0/$1",
                "^buffer-shims$": "buffer-shims@1.0.0",
                "^buffer-shims/(.*)": "buffer-shims@1.0.0/$1",
                "^core-util-is$": "core-util-is@1.0.2",
                "^core-util-is/(.*)": "core-util-is@1.0.2/$1",
                "^npm:(.*)": "<rootDir>/jspm_packages/npm/$1",
                "^github:(.*)": "<rootDir>/jspm_packages/github/$1"
            },
            moduleDirectories: ["node_modules", "jspm_packages/npm", "jspm_packages/github"],
            rootDir: testBasePath
        });
    });

    it("should return valid jest config for non-defaults", () => {
        testResultType = "validShort";

        const testBasePath = "./bla",
            testOptions = {
                loadSjsConfFile: false,
                systemJs: "./jspm_packages/system-test",
                sjsConfigFile: "./config-test",
                jspmPackages: "jspm_packages-test",
                nodeModules: "node_modules-test",
            },
            result = require("../src/index").getJestConfig(testBasePath, testOptions);

        const mockMappingReader = require("../src/jspmMappingReader");

        expect(mockMappingReader).toHaveBeenCalledTimes(1);
        expect(mockMappingReader).toHaveBeenCalledWith(testBasePath, testOptions);

        expect(result).toEqual({
            moduleNameMapper: {
                "^actions$": "<rootDir>/src/actions/index",
                "^actions/(.*)": "<rootDir>/src/actions/index/$1",
                "^axios$": "axios@0.15.2",
                "^axios/(.*)": "axios@0.15.2/$1",
                '^npm:(.*)': '<rootDir>/jspm_packages-test/npm/$1',
                '^github:(.*)': '<rootDir>/jspm_packages-test/github/$1'
            },
            moduleDirectories: ["node_modules-test", "jspm_packages-test/npm", "jspm_packages-test/github"],
            rootDir: testBasePath
        });
    });

    it("should return valid jest config for no jspm results", () => {
        testResultType = "empty";

        const testBasePath = "./bla",
            result = require("../src/index").getJestConfig(testBasePath, {});

        expect(result).toEqual({
            moduleNameMapper: {
                '^npm:(.*)': '<rootDir>/jspm_packages/npm/$1',
                '^github:(.*)': '<rootDir>/jspm_packages/github/$1'
            },
            moduleDirectories: ["node_modules", "jspm_packages/npm", "jspm_packages/github"],
            rootDir: testBasePath
        })
    });




});

