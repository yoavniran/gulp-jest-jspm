describe("plugin tests", () => {
    "use strict";

    let mockThroughObjResult = {"who": "stream"};

    beforeAll(() => {

        jest.mock("through2", () => ({
            obj: jest.fn(() => mockThroughObjResult)
        }));
    });

    it("should return through object for plugin call", () => {
        const result = require("../src/index").default();
        expect(result).toEqual(mockThroughObjResult);
    });
});