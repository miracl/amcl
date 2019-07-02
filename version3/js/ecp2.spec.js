const { CTX } = require("./ctx");
const { makeGeneratorsPF12 } = require("./util.spec");

describe("ECP2Static", () => {
  const ctx = new CTX("BN254CX");
  const { g2 } = makeGeneratorsPF12(ctx);

  describe("new", () => {
    it("constructs point at infinity by default", () => {
      const a = new ctx.ECP2();
      expect(a.is_infinity()).toEqual(true);
    });

    it("can copy other point", () => {
      const other = g2.mul(new ctx.BIG(11223344));
      const a = new ctx.ECP2(other);
      expect(a.is_infinity()).toEqual(false);
      expect(a.equals(other)).toEqual(true);
    });
  });
});
