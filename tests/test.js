const { expect } = require("chai");


describe("Maths tests", () => {
    it("Should equal 2", () => {
        expect(2).to.equal(1 + 1);
    });

    it.skip("Should NOT equal 2", () => {
        expect(3).to.equal(1 + 1);
    });
})