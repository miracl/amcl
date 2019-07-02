const { CTX } = require("./ctx");

describe("FP4", () => {
  const ctx = new CTX("BN254CX");

  describe("add", () => {
    it("does component-wise addition", () => {
      const a = new ctx.FP4(new ctx.FP2(10, 20), new ctx.FP2(30, 40));
      const b = new ctx.FP4(new ctx.FP2(1, 2), new ctx.FP2(3, 4));
      const expectedSum = new ctx.FP4(new ctx.FP2(11, 22), new ctx.FP2(33, 44));

      const sum = new ctx.FP4(a);
      sum.add(b);
      expect(sum.equals(expectedSum)).toEqual(true);
    });
  });

  describe("sub", () => {
    it("does component-wise subtraction", () => {
      const a = new ctx.FP4(new ctx.FP2(10, 20), new ctx.FP2(30, 40));
      const b = new ctx.FP4(new ctx.FP2(1, 2), new ctx.FP2(3, 4));
      const expectedDifference = new ctx.FP4(new ctx.FP2(9, 18), new ctx.FP2(27, 36));

      const difference = new ctx.FP4(a);
      difference.sub(b);
      expect(difference.equals(expectedDifference)).toEqual(true);
    });
  });
});

describe("FP4Static", () => {
  const ctx = new CTX("BN254CX");

  describe("new", () => {
    it("is zero when constructed without arguments", () => {
      const a = new ctx.FP4();
      expect(a.iszilch()).toEqual(true);
    });

    it("produces equal value and representation with undefined and 0", () => {
      const a = new ctx.FP4();
      const b = new ctx.FP4(new ctx.FP2(), new ctx.FP2());
      expect(a).toEqual(b);
    });

    it("can construct from a single number", () => {
      const x = new ctx.FP4(13);
      expect(x.a.a.equals(new ctx.FP(13))).toEqual(true);
      expect(x.a.b.iszilch()).toEqual(true);
      expect(x.b.a.iszilch()).toEqual(true);
      expect(x.b.b.iszilch()).toEqual(true);
    });

    it("can be copied", () => {
      const original = new ctx.FP4(new ctx.FP2(1, 2), new ctx.FP2(3, 4));
      const copy = new ctx.FP4(original);

      expect(copy.a.a.equals(new ctx.FP(1))).toEqual(true);
      expect(copy.a.b.equals(new ctx.FP(2))).toEqual(true);
      expect(copy.b.a.equals(new ctx.FP(3))).toEqual(true);
      expect(copy.b.b.equals(new ctx.FP(4))).toEqual(true);
    });
  });
});
