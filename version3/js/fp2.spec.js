const { CTX } = require("./ctx");

describe("FP2", () => {
  const ctx = new CTX("BN254CX");

  describe("add", () => {
    it("does component-wise addition", () => {
      const a = new ctx.FP2(10, 20);
      const b = new ctx.FP2(1, 2);
      const expectedSum = new ctx.FP2(11, 22);

      const sum = new ctx.FP2(a);
      sum.add(b);
      expect(sum.equals(expectedSum)).toEqual(true);
    });
  });

  describe("sub", () => {
    it("does component-wise subtraction", () => {
      const a = new ctx.FP2(10, 20);
      const b = new ctx.FP2(1, 2);
      const expectedDifference = new ctx.FP2(9, 18);

      const difference = new ctx.FP2(a);
      difference.sub(b);
      expect(difference.equals(expectedDifference)).toEqual(true);
    });
  });
});

describe("FP2Static", () => {
  const ctx = new CTX("BN254CX");

  describe("new", () => {
    it("is zero when constructed without arguments", () => {
      const a = new ctx.FP2();
      expect(a.iszilch()).toEqual(true);
    });

    it("produces equal value and representation with undefined and 0", () => {
      const a = new ctx.FP2();
      const b = new ctx.FP2(0, 0);
      expect(a).toEqual(b);
    });

    it("can construct from a single number", () => {
      const x = new ctx.FP2(13);
      expect(x.a.equals(new ctx.FP(13))).toEqual(true);
      expect(x.b.iszilch()).toEqual(true);
    });

    it("can be copied", () => {
      const original = new ctx.FP2(1, 2);
      const copy = new ctx.FP2(original);

      expect(copy.a.equals(new ctx.FP(1))).toEqual(true);
      expect(copy.b.equals(new ctx.FP(2))).toEqual(true);
    });
  });
});
