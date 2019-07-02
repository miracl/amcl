const { CTX } = require("./ctx");

describe("FP8", () => {
  const ctx = new CTX("BLS24");

  describe("add", () => {
    it("does component-wise addition", () => {
      const a = new ctx.FP8(
        new ctx.FP4(new ctx.FP2(10, 20), new ctx.FP2(30, 40)),
        new ctx.FP4(new ctx.FP2(50, 60), new ctx.FP2(70, 80))
      );
      const b = new ctx.FP8(
        new ctx.FP4(new ctx.FP2(1, 2), new ctx.FP2(3, 4)),
        new ctx.FP4(new ctx.FP2(5, 6), new ctx.FP2(7, 8))
      );
      const expectedSum = new ctx.FP8(
        new ctx.FP4(new ctx.FP2(11, 22), new ctx.FP2(33, 44)),
        new ctx.FP4(new ctx.FP2(55, 66), new ctx.FP2(77, 88))
      );

      const sum = new ctx.FP8(a);
      sum.add(b);
      expect(sum.equals(expectedSum)).toEqual(true);
    });
  });

  describe("sub", () => {
    it("does component-wise subtraction", () => {
      const a = new ctx.FP8(
        new ctx.FP4(new ctx.FP2(10, 20), new ctx.FP2(30, 40)),
        new ctx.FP4(new ctx.FP2(50, 60), new ctx.FP2(70, 80))
      );
      const b = new ctx.FP8(
        new ctx.FP4(new ctx.FP2(1, 2), new ctx.FP2(3, 4)),
        new ctx.FP4(new ctx.FP2(5, 6), new ctx.FP2(7, 8))
      );
      const expectedDifference = new ctx.FP8(
        new ctx.FP4(new ctx.FP2(9, 18), new ctx.FP2(27, 36)),
        new ctx.FP4(new ctx.FP2(45, 54), new ctx.FP2(63, 72))
      );

      const difference = new ctx.FP8(a);
      difference.sub(b);
      expect(difference.equals(expectedDifference)).toEqual(true);
    });
  });
});

describe("FP8Static", () => {
  const ctx = new CTX("BLS24");

  describe("new", () => {
    it("is zero when constructed without arguments", () => {
      const a = new ctx.FP8();
      expect(a.iszilch()).toEqual(true);
    });

    it("produces equal value and representation with undefined and 0", () => {
      const a = new ctx.FP8();
      const b = new ctx.FP8(new ctx.FP4(), new ctx.FP4());
      expect(a).toEqual(b);
    });

    it("can construct from a single number", () => {
      const x = new ctx.FP8(13);
      expect(x.a.a.a.equals(new ctx.FP(13))).toEqual(true);
      expect(x.a.a.b.iszilch()).toEqual(true);
      expect(x.a.b.a.iszilch()).toEqual(true);
      expect(x.a.b.b.iszilch()).toEqual(true);
      expect(x.b.a.a.iszilch()).toEqual(true);
      expect(x.b.a.b.iszilch()).toEqual(true);
      expect(x.b.b.a.iszilch()).toEqual(true);
      expect(x.b.b.b.iszilch()).toEqual(true);
    });

    it("can be copied", () => {
      const original = new ctx.FP8(
        new ctx.FP4(new ctx.FP2(1, 2), new ctx.FP2(3, 4)),
        new ctx.FP4(new ctx.FP2(5, 6), new ctx.FP2(7, 8))
      );
      const copy = new ctx.FP8(original);

      expect(copy.a.a.a.equals(new ctx.FP(1))).toEqual(true);
      expect(copy.a.a.b.equals(new ctx.FP(2))).toEqual(true);
      expect(copy.a.b.a.equals(new ctx.FP(3))).toEqual(true);
      expect(copy.a.b.b.equals(new ctx.FP(4))).toEqual(true);
      expect(copy.b.a.a.equals(new ctx.FP(5))).toEqual(true);
      expect(copy.b.a.b.equals(new ctx.FP(6))).toEqual(true);
      expect(copy.b.b.a.equals(new ctx.FP(7))).toEqual(true);
      expect(copy.b.b.b.equals(new ctx.FP(8))).toEqual(true);
    });
  });
});
