const { CTX } = require("./ctx");

describe("FP24", () => {
  // add, sub not yet implemented
  // https://github.com/miracl/amcl/issues/28
});

describe("FP24Static", () => {
  const ctx = new CTX("BLS24");

  describe("new", () => {
    it("is zero when constructed without arguments", () => {
      const a = new ctx.FP24();
      expect(a.iszilch()).toEqual(true);
    });

    it("produces equal value with undefined and 0", () => {
      const a = new ctx.FP24();
      const b = new ctx.FP24(0);
      expect(a.equals(b)).toEqual(true);
    });

    it("can construct from a single number 0", () => {
      const x = new ctx.FP24(0);
      expect(x.iszilch()).toEqual(true);
      expect(x.stype).toEqual(ctx.FP.ZERO);
    });

    it("can construct from a single number 1", () => {
      const x = new ctx.FP24(1);
      expect(x.isunity()).toEqual(true);
      expect(x.stype).toEqual(ctx.FP.ONE);
    });

    it("can construct from a single number", () => {
      const x = new ctx.FP24(13);
      expect(x.a.a.a.a.equals(new ctx.FP(13))).toEqual(true);
      expect(x.a.a.a.b.iszilch()).toEqual(true);
      expect(x.a.a.b.a.iszilch()).toEqual(true);
      expect(x.a.a.b.b.iszilch()).toEqual(true);
      expect(x.a.b.a.a.iszilch()).toEqual(true);
      expect(x.a.b.a.b.iszilch()).toEqual(true);
      expect(x.a.b.b.a.iszilch()).toEqual(true);
      expect(x.a.b.b.b.iszilch()).toEqual(true);
      expect(x.b.a.a.a.iszilch()).toEqual(true);
      expect(x.b.a.a.b.iszilch()).toEqual(true);
      expect(x.b.a.b.a.iszilch()).toEqual(true);
      expect(x.b.a.b.b.iszilch()).toEqual(true);
      expect(x.b.b.a.a.iszilch()).toEqual(true);
      expect(x.b.b.a.b.iszilch()).toEqual(true);
      expect(x.b.b.b.a.iszilch()).toEqual(true);
      expect(x.b.b.b.b.iszilch()).toEqual(true);
      expect(x.c.a.a.a.iszilch()).toEqual(true);
      expect(x.c.a.a.b.iszilch()).toEqual(true);
      expect(x.c.a.b.a.iszilch()).toEqual(true);
      expect(x.c.a.b.b.iszilch()).toEqual(true);
      expect(x.c.b.a.a.iszilch()).toEqual(true);
      expect(x.c.b.a.b.iszilch()).toEqual(true);
      expect(x.c.b.b.a.iszilch()).toEqual(true);
      expect(x.c.b.b.b.iszilch()).toEqual(true);
      expect(x.stype).toEqual(ctx.FP.SPARSER);
    });

    it("can construct from a single FP8", () => {
      const x = new ctx.FP24(new ctx.FP8(14));
      expect(x.a.a.a.a.equals(new ctx.FP(14))).toEqual(true);
      expect(x.a.a.a.b.iszilch()).toEqual(true);
      expect(x.a.a.b.a.iszilch()).toEqual(true);
      expect(x.a.a.b.b.iszilch()).toEqual(true);
      expect(x.a.b.a.a.iszilch()).toEqual(true);
      expect(x.a.b.a.b.iszilch()).toEqual(true);
      expect(x.a.b.b.a.iszilch()).toEqual(true);
      expect(x.a.b.b.b.iszilch()).toEqual(true);
      expect(x.b.a.a.a.iszilch()).toEqual(true);
      expect(x.b.a.a.b.iszilch()).toEqual(true);
      expect(x.b.a.b.a.iszilch()).toEqual(true);
      expect(x.b.a.b.b.iszilch()).toEqual(true);
      expect(x.b.b.a.a.iszilch()).toEqual(true);
      expect(x.b.b.a.b.iszilch()).toEqual(true);
      expect(x.b.b.b.a.iszilch()).toEqual(true);
      expect(x.b.b.b.b.iszilch()).toEqual(true);
      expect(x.c.a.a.a.iszilch()).toEqual(true);
      expect(x.c.a.a.b.iszilch()).toEqual(true);
      expect(x.c.a.b.a.iszilch()).toEqual(true);
      expect(x.c.a.b.b.iszilch()).toEqual(true);
      expect(x.c.b.a.a.iszilch()).toEqual(true);
      expect(x.c.b.a.b.iszilch()).toEqual(true);
      expect(x.c.b.b.a.iszilch()).toEqual(true);
      expect(x.c.b.b.b.iszilch()).toEqual(true);
      expect(x.stype).toEqual(ctx.FP.SPARSER);
    });

    it("can be copied", () => {
      const original = new ctx.FP24(
        new ctx.FP8(
          new ctx.FP4(new ctx.FP2(1, 2), new ctx.FP2(3, 4)),
          new ctx.FP4(new ctx.FP2(5, 6), new ctx.FP2(7, 8))
        ),
        new ctx.FP8(
          new ctx.FP4(new ctx.FP2(9, 10), new ctx.FP2(11, 12)),
          new ctx.FP4(new ctx.FP2(13, 14), new ctx.FP2(15, 16))
        ),
        new ctx.FP8(
          new ctx.FP4(new ctx.FP2(17, 18), new ctx.FP2(19, 20)),
          new ctx.FP4(new ctx.FP2(21, 22), new ctx.FP2(23, 24))
        )
      );
      const copy = new ctx.FP24(original);

      expect(copy.a.a.a.a.equals(new ctx.FP(1))).toEqual(true);
      expect(copy.a.a.a.b.equals(new ctx.FP(2))).toEqual(true);
      expect(copy.a.a.b.a.equals(new ctx.FP(3))).toEqual(true);
      expect(copy.a.a.b.b.equals(new ctx.FP(4))).toEqual(true);
      expect(copy.a.b.a.a.equals(new ctx.FP(5))).toEqual(true);
      expect(copy.a.b.a.b.equals(new ctx.FP(6))).toEqual(true);
      expect(copy.a.b.b.a.equals(new ctx.FP(7))).toEqual(true);
      expect(copy.a.b.b.b.equals(new ctx.FP(8))).toEqual(true);
      expect(copy.b.a.a.a.equals(new ctx.FP(9))).toEqual(true);
      expect(copy.b.a.a.b.equals(new ctx.FP(10))).toEqual(true);
      expect(copy.b.a.b.a.equals(new ctx.FP(11))).toEqual(true);
      expect(copy.b.a.b.b.equals(new ctx.FP(12))).toEqual(true);
      expect(copy.b.b.a.a.equals(new ctx.FP(13))).toEqual(true);
      expect(copy.b.b.a.b.equals(new ctx.FP(14))).toEqual(true);
      expect(copy.b.b.b.a.equals(new ctx.FP(15))).toEqual(true);
      expect(copy.b.b.b.b.equals(new ctx.FP(16))).toEqual(true);
      expect(copy.c.a.a.a.equals(new ctx.FP(17))).toEqual(true);
      expect(copy.c.a.a.b.equals(new ctx.FP(18))).toEqual(true);
      expect(copy.c.a.b.a.equals(new ctx.FP(19))).toEqual(true);
      expect(copy.c.a.b.b.equals(new ctx.FP(20))).toEqual(true);
      expect(copy.c.b.a.a.equals(new ctx.FP(21))).toEqual(true);
      expect(copy.c.b.a.b.equals(new ctx.FP(22))).toEqual(true);
      expect(copy.c.b.b.a.equals(new ctx.FP(23))).toEqual(true);
      expect(copy.c.b.b.b.equals(new ctx.FP(24))).toEqual(true);
    });
  });
});
