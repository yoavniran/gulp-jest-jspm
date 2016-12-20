describe("jspmMappingReader tests", () => {
    "use strict";

    beforeAll(() => {
        jest.mock("../src/jspmConfigLoader", () =>
            jest.fn(() => ({})) //return empty object by default
                .mockImplementationOnce(() => ({ //return object with mappings the first time
                    map: {
                        actions: "src/actions/index",
                        axios: "npm:axios@0.15.2",
                        babel: "npm:babel-core@5.8.38",
                        hierarchy: {
                            something: "npm:something@1.1.1"
                        }
                    },
                    packages: {
                        "http://cinch.local:8084/consumer/jspm_packages/npm/readable-stream@2.2.2": {
                            map: {
                                "buffer": "github:jspm/nodelibs-buffer@0.1.0",
                                "buffer-shims": "npm:buffer-shims@1.0.0",
                                "core-util-is": "npm:core-util-is@1.0.2"
                            }
                        }
                    }
                }))
                .mockImplementationOnce(() => ({
                    map: {
                        actions: "src/actions/index",
                        axios: "npm:axios@0.15.2",
                        babel: "npm:babel-core@5.8.38"
                    },
                    packages: {}
                }))
                .mockImplementationOnce(() => ({
                    map: {
                        actions: "src/actions/index",
                        axios: "npm:axios@0.15.2",
                        more: {
                            axios: "npm:axios@0.15.2"
                        }
                    },
                    packages: {}
                }))
                .mockImplementationOnce(() => undefined));
    });


    it("should parse systemjs configuration correctly", () => {

        const testBasePath = "./bla",
            testOptions = {foo: "bar"},
            reader = require("../src/jspmMappingReader").default,
            result = reader(testBasePath, testOptions);

        const mockLoader = require("../src/jspmConfigLoader");

        expect(mockLoader).toHaveBeenCalledTimes(1);
        expect(mockLoader).toHaveBeenCalledWith(testBasePath, testOptions);

        expect(Object.keys(result)).toHaveLength(14);

        expect(result).toEqual({
            "^actions$": "<rootDir>/src/actions/index",
            "^actions/(.*)": "<rootDir>/src/actions/index/$1",
            "^axios$": "axios@0.15.2",
            "^axios/(.*)": "axios@0.15.2/$1",
            "^babel$": "babel-core@5.8.38",
            "^babel/(.*)": "babel-core@5.8.38/$1",
            "^something$": "something@1.1.1",
            "^something/(.*)": "something@1.1.1/$1",
            "^buffer$": "jspm/nodelibs-buffer@0.1.0",
            "^buffer/(.*)": "jspm/nodelibs-buffer@0.1.0/$1",
            "^buffer-shims$": "buffer-shims@1.0.0",
            "^buffer-shims/(.*)": "buffer-shims@1.0.0/$1",
            "^core-util-is$": "core-util-is@1.0.2",
            "^core-util-is/(.*)": "core-util-is@1.0.2/$1"
        });
    });

    it("should parse systemjs configuration correctly with empty packages", () => {

        const testBasePath = "./bla",
            testOptions = {foo: "bar"},
            reader = require("../src/jspmMappingReader").default,
            result = reader(testBasePath, testOptions);

        expect(result).toEqual({
            "^actions$": "<rootDir>/src/actions/index",
            "^actions/(.*)": "<rootDir>/src/actions/index/$1",
            "^axios$": "axios@0.15.2",
            "^axios/(.*)": "axios@0.15.2/$1",
            "^babel$": "babel-core@5.8.38",
            "^babel/(.*)": "babel-core@5.8.38/$1"
        });
    });

    it("should parse systemjs configuration correctly and avoid duplicates", () => {

        const testBasePath = "./bla",
            testOptions = {foo: "bar"},
            reader = require("../src/jspmMappingReader").default,
            result = reader(testBasePath, testOptions);

        expect(result).toEqual({
            "^actions$": "<rootDir>/src/actions/index",
            "^actions/(.*)": "<rootDir>/src/actions/index/$1",
            "^axios$": "axios@0.15.2",
            "^axios/(.*)": "axios@0.15.2/$1",
        });
    });

    it("should return empty result for undefined", () => {
        const reader = require("../src/jspmMappingReader").default,
            result = reader();

        expect(Object.keys(result)).toHaveLength(0);
    });

    it("should return empty result for empty config object", () => {
        const reader = require("../src/jspmMappingReader").default,
            result = reader();

        expect(Object.keys(result)).toHaveLength(0);
    });
});