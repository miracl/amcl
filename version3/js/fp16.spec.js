const { CTX } = require("./ctx");

describe("FP16", () => {
  const ctx = new CTX("BLS48");

  describe("add", () => {
    it("does component-wise addition", () => {
      const a = new ctx.FP16(
        new ctx.FP8(
          new ctx.FP4(new ctx.FP2(100, 200), new ctx.FP2(300, 400)),
          new ctx.FP4(new ctx.FP2(500, 600), new ctx.FP2(700, 800))
        ),
        new ctx.FP8(
          new ctx.FP4(new ctx.FP2(900, 1000), new ctx.FP2(1100, 1200)),
          new ctx.FP4(new ctx.FP2(1300, 1400), new ctx.FP2(1500, 1600))
        )
      );
      const b = new ctx.FP16(
        new ctx.FP8(
          new ctx.FP4(new ctx.FP2(1, 2), new ctx.FP2(3, 4)),
          new ctx.FP4(new ctx.FP2(5, 6), new ctx.FP2(7, 8))
        ),
        new ctx.FP8(
          new ctx.FP4(new ctx.FP2(9, 10), new ctx.FP2(11, 12)),
          new ctx.FP4(new ctx.FP2(13, 14), new ctx.FP2(15, 16))
        )
      );
      const expectedSum = new ctx.FP16(
        new ctx.FP8(
          new ctx.FP4(new ctx.FP2(101, 202), new ctx.FP2(303, 404)),
          new ctx.FP4(new ctx.FP2(505, 606), new ctx.FP2(707, 808))
        ),
        new ctx.FP8(
          new ctx.FP4(new ctx.FP2(909, 1010), new ctx.FP2(1111, 1212)),
          new ctx.FP4(new ctx.FP2(1313, 1414), new ctx.FP2(1515, 1616))
        )
      );

      const sum = new ctx.FP16(a);
      sum.add(b);
      expect(sum.equals(expectedSum)).toEqual(true);
    });
  });

  describe("sub", () => {
    it("does component-wise subtraction", () => {
      const a = new ctx.FP16(
        new ctx.FP8(
          new ctx.FP4(new ctx.FP2(100, 200), new ctx.FP2(300, 400)),
          new ctx.FP4(new ctx.FP2(500, 600), new ctx.FP2(700, 800))
        ),
        new ctx.FP8(
          new ctx.FP4(new ctx.FP2(900, 1000), new ctx.FP2(1100, 1200)),
          new ctx.FP4(new ctx.FP2(1300, 1400), new ctx.FP2(1500, 1600))
        )
      );
      const b = new ctx.FP16(
        new ctx.FP8(
          new ctx.FP4(new ctx.FP2(1, 2), new ctx.FP2(3, 4)),
          new ctx.FP4(new ctx.FP2(5, 6), new ctx.FP2(7, 8))
        ),
        new ctx.FP8(
          new ctx.FP4(new ctx.FP2(9, 10), new ctx.FP2(11, 12)),
          new ctx.FP4(new ctx.FP2(13, 14), new ctx.FP2(15, 16))
        )
      );
      const expectedDifference = new ctx.FP16(
        new ctx.FP8(
          new ctx.FP4(new ctx.FP2(99, 198), new ctx.FP2(297, 396)),
          new ctx.FP4(new ctx.FP2(495, 594), new ctx.FP2(693, 792))
        ),
        new ctx.FP8(
          new ctx.FP4(new ctx.FP2(891, 990), new ctx.FP2(1089, 1188)),
          new ctx.FP4(new ctx.FP2(1287, 1386), new ctx.FP2(1485, 1584))
        )
      );

      const difference = new ctx.FP16(a);
      difference.sub(b);
      expect(difference.equals(expectedDifference)).toEqual(true);
    });
  });
});

describe("FP16Static", () => {
  const ctx = new CTX("BLS48");

  describe("new", () => {
    it("is zero when constructed without arguments", () => {
      const a = new ctx.FP16();
      expect(a.iszilch()).toEqual(true);
    });

    it("produces equal value with undefined and 0", () => {
      const a = new ctx.FP16();
      const b = new ctx.FP16(0);
      const c = new ctx.FP16(0, 0);
      expect(a.equals(b)).toEqual(true);
      expect(a.equals(c)).toEqual(true);
    });

    it("can construct from a single number", () => {
      const x = new ctx.FP16(13);
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
    });

    it("can construct from multiple numbers", () => {
      const x = new ctx.FP16(13, 14);

      expect(x.a.a.a.a.equals(new ctx.FP(13))).toEqual(true);
      expect(x.a.a.a.b.iszilch()).toEqual(true);
      expect(x.a.a.b.a.iszilch()).toEqual(true);
      expect(x.a.a.b.b.iszilch()).toEqual(true);
      expect(x.a.b.a.a.iszilch()).toEqual(true);
      expect(x.a.b.a.b.iszilch()).toEqual(true);
      expect(x.a.b.b.a.iszilch()).toEqual(true);
      expect(x.a.b.b.b.iszilch()).toEqual(true);
      expect(x.b.a.a.a.equals(new ctx.FP(14))).toEqual(true);
      expect(x.b.a.a.b.iszilch()).toEqual(true);
      expect(x.b.a.b.a.iszilch()).toEqual(true);
      expect(x.b.a.b.b.iszilch()).toEqual(true);
      expect(x.b.b.a.a.iszilch()).toEqual(true);
      expect(x.b.b.a.b.iszilch()).toEqual(true);
      expect(x.b.b.b.a.iszilch()).toEqual(true);
      expect(x.b.b.b.b.iszilch()).toEqual(true);
    });

    it("can be copied", () => {
      const original = new ctx.FP16(
        new ctx.FP8(
          new ctx.FP4(new ctx.FP2(1, 2), new ctx.FP2(3, 4)),
          new ctx.FP4(new ctx.FP2(5, 6), new ctx.FP2(7, 8))
        ),
        new ctx.FP8(
          new ctx.FP4(new ctx.FP2(9, 10), new ctx.FP2(11, 12)),
          new ctx.FP4(new ctx.FP2(13, 14), new ctx.FP2(15, 16))
        )
      );
      const copy = new ctx.FP16(original);

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
    });
  });
});
