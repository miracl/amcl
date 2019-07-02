const { CTX } = require("./ctx");

describe("FP", () => {
  const ctx = new CTX("BN254CX");

  describe("add", () => {
    it("does component-wise addition", () => {
      const a = new ctx.FP(10);
      const b = new ctx.FP(1);
      const expectedSum = new ctx.FP(11);

      const sum = new ctx.FP(a);
      sum.add(b);
      expect(sum.equals(expectedSum)).toEqual(true);
    });
  });

  describe("sub", () => {
    it("does component-wise subtraction", () => {
      const a = new ctx.FP(10);
      const b = new ctx.FP(1);
      const expectedDifference = new ctx.FP(9);

      const difference = new ctx.FP(a);
      difference.sub(b);
      expect(difference.equals(expectedDifference)).toEqual(true);
    });
  });
});

describe("FPStatic", () => {
  const ctx = new CTX("BN254CX");

  describe("MODTYPE", () => {
    it("has no special modtype", () => {
      expect(ctx.FP.MODTYPE).toEqual(ctx.FP.NOT_SPECIAL);
    });
  });

  describe("new", () => {
    it("is zero when constructed without arguments", () => {
      const a = new ctx.FP();
      expect(a.iszilch()).toEqual(true);
    });

    it("produces equal value and representation with undefined and 0", () => {
      const a = new ctx.FP();
      const b = new ctx.FP(0);
      expect(a.equals(b)).toEqual(true);
    });
  });
});
