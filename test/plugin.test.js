describe("plugin tests", () => {
    "use strict";

    let mockTestResultType = "";
    let mockThroughObjResult = {"who": "stream"};

    beforeAll(() => {

        jest.mock("through2", () => ({
            obj: jest.fn(() => mockThroughObjResult)
        }));

        const mockTestResults = {
            "notFound": false,
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
            jest.fn(() => mockTestResults[mockTestResultType ]));

        jest.mock("../src/utils", () => ({
            getModuleFromAbsBasePath: jest.fn()
                .mockImplementationOnce(() => ({"verbose": true})) //json config
                .mockImplementationOnce(() => () => ({"debug": true})), //function config
            isString: jest.fn(() => false),
            isFunction: jest.fn()
                .mockImplementationOnce(() => false)
                .mockImplementationOnce(() => true),
            showWarning: jest.fn()
        }));
    });

    beforeEach(() => {
        const mockMappingReader = require("../src/jspmMappingReader");
        mockMappingReader.mockClear();
    });

    it("should return valid jest config for defaults", () => {
	    mockTestResultType  = "valid";

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
	    mockTestResultType  = "validShort";

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

    it("should return valid jest config augmenting configured jest file as json", () => {
	    mockTestResultType  = "validShort";

        const utils = require("../src/utils");

        utils.isString.mockImplementationOnce(() => true); //make it load the jest conf "from file"

        const testBasePath = "./bla",
            jestConfigPath = "./path/to/jest/config",
            testOptions = {
                jestConfig: jestConfigPath,
                loadSjsConfFile: false,
                systemJs: "./jspm_packages/system-test",
                sjsConfigFile: "./config-test",
                jspmPackages: "jspm_packages-test",
                nodeModules: "node_modules-test",
            },
            result = require("../src/index").getJestConfig(testBasePath, testOptions);

        expect(utils.getModuleFromAbsBasePath).toHaveBeenCalledWith(testBasePath, jestConfigPath);

        expect(result).toEqual({
            verbose: true,
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

    it("should return valid jest config augmenting configured jest file as exported function", () => {
	    mockTestResultType  = "validShort";

        require("../src/utils").isString.mockImplementationOnce(() => true);  //make it load the jest conf "from file"

        const testBasePath = "./bla",
            jestConfigPath = "./path/to/jest/config",
            testOptions = {
                jestConfig: jestConfigPath,
                loadSjsConfFile: false,
                systemJs: "./jspm_packages/system-test",
                sjsConfigFile: "./config-test",
                jspmPackages: "jspm_packages-test",
                nodeModules: "node_modules-test",
            },
            result = require("../src/index").getJestConfig(testBasePath, testOptions);

        expect(result).toEqual({
            debug: true,
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

    it("should return valid jest config augmenting configured jest object", () => {
	    mockTestResultType  = "validShort";

        const testBasePath = "./bla",
            testOptions = {
                jestConfig: {verbose: true, debug: true},
                loadSjsConfFile: false,
                systemJs: "./jspm_packages/system-test",
                sjsConfigFile: "./config-test",
                jspmPackages: "jspm_packages-test",
                nodeModules: "node_modules-test",
            },
            result = require("../src/index").getJestConfig(testBasePath, testOptions);

        expect(result).toEqual({
            debug: true,
            verbose: true,
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
	    mockTestResultType  = "empty";

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

    it("should return valid jest config for not found jspm ", () => {
	    mockTestResultType  = "notFound";

        const testBasePath = "./bla",
            result = require("../src/index").getJestConfig(testBasePath, {displayWarnings: true});

        expect(require("../src/utils").showWarning).toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            moduleNameMapper: {
                '^npm:(.*)': '<rootDir>/jspm_packages/npm/$1',
                '^github:(.*)': '<rootDir>/jspm_packages/github/$1'
            },
            moduleDirectories: ["node_modules", "jspm_packages/npm", "jspm_packages/github"],
            rootDir: testBasePath
        })
    });

    it("should return through object for plugin call", () => {
        const result = require("../src/index").default();
        expect(result).toEqual(mockThroughObjResult);
    });
});