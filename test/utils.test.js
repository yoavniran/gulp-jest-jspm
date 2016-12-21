describe("utils tests", () => {
    "use strict";

    let utils;

    beforeAll(() => {
        jest.mock("path", () => ({
            join: jest.fn(() => "fs")
        }));

        utils = require("../src/utils");
    });

    it("isString() should return true for string", () => {
        expect(utils.isString("test")).toBeTruthy();
    });

    it("isString() should return false for null", () => {
        expect(utils.isString(null)).toBeFalsy();
    });

    it("isString() should return false for undefined", () => {
        expect(utils.isString(undefined)).toBeFalsy();
    });

    it("isString() should return false for object", () => {
        expect(utils.isString({})).toBeFalsy();
    });

    it("isString() should return false for number", () => {
        expect(utils.isString(0)).toBeFalsy();
    });

    it("isFunction() should return true for function", () => {
        expect(utils.isFunction(() => ({}))).toBeTruthy();
    });

    it("isFunction() should return true for generator function", () => {
        expect(utils.isFunction(function* test() {
            yield 1;
        })).toBeTruthy();
    });

    it("isFunction() should return false for undefined", () => {
        expect(utils.isFunction(undefined)).toBeFalsy();
    });

    it("isFunction() should return false for object", () => {
        expect(utils.isFunction({})).toBeFalsy();
    });

    it("isFunction() should return false for number", () => {
        expect(utils.isFunction(0)).toBeFalsy();
    });

    it("showWarning() should just work", () => {
        const orgConsoleWarn = console.warn;
        console.warn = jest.fn();
        utils.showWarning("test");
        utils.showWarning();

	    expect(console.warn).toHaveBeenCalledTimes(2);

        console.warn = orgConsoleWarn;
    });

    it("getModuleFromAbsBasePath() should return require result for given paths", () => {

        const result = utils.getModuleFromAbsBasePath("base", "module");
        expect(require("path").join).toHaveBeenCalledWith("base", "module");

        expect(result.access).toBeDefined();
        expect(result.read).toBeDefined();
    });
});