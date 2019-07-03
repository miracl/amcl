const { CTX } = require("./ctx");

describe("FP12", () => {
  // add, sub not yet implemented
  // https://github.com/miracl/amcl/issues/28
});

describe("FP12Static", () => {
  const ctx = new CTX("BN254CX");

  describe("new", () => {
    it("is zero when constructed without arguments", () => {
      const a = new ctx.FP12();
      expect(a.iszilch()).toEqual(true);
    });

    it("produces equal value with undefined and 0", () => {
      const a = new ctx.FP12();
      const b = new ctx.FP12(0);
      expect(a.equals(b)).toEqual(true);
    });

    it("can construct from a single number 0", () => {
      const x = new ctx.FP12(0);
      expect(x.iszilch()).toEqual(true);
      expect(x.stype).toEqual(ctx.FP.ZERO);
    });

    it("can construct from a single number 1", () => {
      const x = new ctx.FP12(1);
      expect(x.isunity()).toEqual(true);
      expect(x.stype).toEqual(ctx.FP.ONE);
    });

    it("can construct from a single number", () => {
      const x = new ctx.FP12(13);
      expect(x.a.a.a.equals(new ctx.FP(13))).toEqual(true);
      expect(x.a.a.b.iszilch()).toEqual(true);
      expect(x.a.b.a.iszilch()).toEqual(true);
      expect(x.a.b.b.iszilch()).toEqual(true);
      expect(x.b.a.a.iszilch()).toEqual(true);
      expect(x.b.a.b.iszilch()).toEqual(true);
      expect(x.b.b.a.iszilch()).toEqual(true);
      expect(x.b.b.b.iszilch()).toEqual(true);
      expect(x.c.a.a.iszilch()).toEqual(true);
      expect(x.c.a.b.iszilch()).toEqual(true);
      expect(x.c.b.a.iszilch()).toEqual(true);
      expect(x.c.b.b.iszilch()).toEqual(true);
      expect(x.stype).toEqual(ctx.FP.SPARSER);
    });

    it("can construct from a single FP4", () => {
      const x = new ctx.FP12(new ctx.FP4(14));
      expect(x.a.a.a.equals(new ctx.FP(14))).toEqual(true);
      expect(x.a.a.b.iszilch()).toEqual(true);
      expect(x.a.b.a.iszilch()).toEqual(true);
      expect(x.a.b.b.iszilch()).toEqual(true);
      expect(x.b.a.a.iszilch()).toEqual(true);
      expect(x.b.a.b.iszilch()).toEqual(true);
      expect(x.b.b.a.iszilch()).toEqual(true);
      expect(x.b.b.b.iszilch()).toEqual(true);
      expect(x.c.a.a.iszilch()).toEqual(true);
      expect(x.c.a.b.iszilch()).toEqual(true);
      expect(x.c.b.a.iszilch()).toEqual(true);
      expect(x.c.b.b.iszilch()).toEqual(true);
      expect(x.stype).toEqual(ctx.FP.SPARSER);
    });

    it("can be copied", () => {
      const original = new ctx.FP12(new ctx.FP4(13), new ctx.FP4(14), new ctx.FP4(15));
      const copy = new ctx.FP12(original);

      expect(copy.a.a.a.equals(new ctx.FP(13))).toEqual(true);
      expect(copy.a.a.b.iszilch()).toEqual(true);
      expect(copy.a.b.a.iszilch()).toEqual(true);
      expect(copy.a.b.b.iszilch()).toEqual(true);
      expect(copy.b.a.a.equals(new ctx.FP(14))).toEqual(true);
      expect(copy.b.a.b.iszilch()).toEqual(true);
      expect(copy.b.b.a.iszilch()).toEqual(true);
      expect(copy.b.b.b.iszilch()).toEqual(true);
      expect(copy.c.a.a.equals(new ctx.FP(15))).toEqual(true);
      expect(copy.c.a.b.iszilch()).toEqual(true);
      expect(copy.c.b.a.iszilch()).toEqual(true);
      expect(copy.c.b.b.iszilch()).toEqual(true);
    });
  });
});
