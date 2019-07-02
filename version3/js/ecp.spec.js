const { CTX } = require("./ctx");
const { makeGeneratorsPF12 } = require("./util.spec");

describe("ECP", () => {
  const ctx = new CTX("BN254CX");
  const { g1 } = makeGeneratorsPF12(ctx);

  describe("sum", () => {
    it("returns the same point when multiplying with infinity", () => {
      const a = g1.mul(new ctx.BIG(252525));
      const infinity = new ctx.ECP();

      expect(a.is_infinity()).toEqual(false);
      expect(infinity.is_infinity()).toEqual(true);

      const sum = new ctx.ECP();
      sum.copy(a);
      sum.add(infinity);

      expect(sum.equals(a)).toEqual(true);
    });
  });

  describe("mul", () => {
    it("does not mutate the instance", () => {
      const original = new ctx.ECP();
      original.copy(g1);

      const uut = new ctx.ECP();
      uut.copy(original);

      const product = uut.mul(new ctx.BIG(252525));

      expect(product.equals(original)).toEqual(false);
      expect(uut.equals(original)).toEqual(true);
    });

    it("returns infinity when multiplied by zero", () => {
      const P = g1.mul(new ctx.BIG(112233));
      expect(P.is_infinity()).toEqual(false);
      const product = P.mul(new ctx.BIG(0));
      expect(product.is_infinity()).toEqual(true);
    });
  });
});

describe("ECPStatic", () => {
  describe("new", () => {
    const ctx = new CTX("BN254CX");
    const { g1 } = makeGeneratorsPF12(ctx);

    it("constructs point at infinity by default", () => {
      const a = new ctx.ECP();
      expect(a.is_infinity()).toEqual(true);
    });

    it("can copy other point", () => {
      const other = g1.mul(new ctx.BIG(11223344));
      const a = new ctx.ECP(other);
      expect(a.is_infinity()).toEqual(false);
      expect(a.equals(other)).toEqual(true);
    });
  });

  describe("CURVETYPE", () => {
    it("Secp256k1 is of type Weierstrass", () => {
      const ctxSECP256K1 = new CTX("SECP256K1");
      expect(ctxSECP256K1.ECP.CURVETYPE).toEqual(ctxSECP256K1.ECP.WEIERSTRASS);
    });

    it("BNCX is of type Weierstrass", () => {
      const ctxBN254CX = new CTX("BN254CX");
      expect(ctxBN254CX.ECP.CURVETYPE).toEqual(ctxBN254CX.ECP.WEIERSTRASS);
    });

    it("Ed25519 is of type Edwards", () => {
      const ctxED25519 = new CTX("ED25519");
      expect(ctxED25519.ECP.CURVETYPE).toEqual(ctxED25519.ECP.EDWARDS);
    });

    it("Curve25519 is of type montgomery", () => {
      const ctxC25519 = new CTX("C25519");
      expect(ctxC25519.ECP.CURVETYPE).toEqual(ctxC25519.ECP.MONTGOMERY);
    });
  });

  describe("CURVE_PAIRING_TYPE", () => {
    it("Secp256k1 is not pairing friendly", () => {
      const ctxSECP256K1 = new CTX("SECP256K1");
      expect(ctxSECP256K1.ECP.CURVE_PAIRING_TYPE).toEqual(ctxSECP256K1.ECP.NOT);
    });

    it("Ed25519 is not pairing friendly", () => {
      const ctxED25519 = new CTX("ED25519");
      expect(ctxED25519.ECP.CURVE_PAIRING_TYPE).toEqual(ctxED25519.ECP.NOT);
    });

    it("Curve25519 is not pairing friendly", () => {
      const ctxC25519 = new CTX("C25519");
      expect(ctxC25519.ECP.CURVE_PAIRING_TYPE).toEqual(ctxC25519.ECP.NOT);
    });

    it("BNCX is BN pairing friendly", () => {
      const ctxBN254CX = new CTX("BN254CX");
      expect(ctxBN254CX.ECP.CURVE_PAIRING_TYPE).toEqual(ctxBN254CX.ECP.BN);
    });

    it("BLS383 is BLS pairing friendly", () => {
      const ctxBLS383 = new CTX("BLS383");
      expect(ctxBLS383.ECP.CURVE_PAIRING_TYPE).toEqual(ctxBLS383.ECP.BLS);
    });
  });
});
