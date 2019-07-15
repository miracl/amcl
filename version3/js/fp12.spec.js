const { CTX } = require("./ctx");

function fromHex(hex) {
  const normalized = hex.replace(/\s+/g, "");
  if (normalized.length % 2 !== 0) throw new Error("Received odd number of characters");
  if (!normalized.match(/^[0-9a-fA-F]*$/)) throw new Error("Found invalid character");

  const out = new Array();
  for (let i = 0; i < normalized.length; i += 2) {
    out.push(Number.parseInt(normalized.slice(i, i + 2), 16));
  }
  return out;
}

describe("FP12", () => {
  // add, sub not yet implemented
  // https://github.com/miracl/amcl/issues/28

  describe("pow", () => {
    it("is compatible to external test data", () => {
      // Test data from https://github.com/miracl/amcl/issues/38#issuecomment-511470846
      const bls381Ctx = new CTX("BLS381");
      const pointData = fromHex(`
        1811d37042135ae36711af0e94840a8e6cd0ed34798b59eeb7ff78d4fa0b403ccba4d47349bf5a752f73d538a401e965
        001983adb8839bd27b143e7d0654326da08beca7935e54c2eb9dd00017287a8c80c1eb5c3a5d8c92beb83576f66f9232
        006fe1878077e3205e3d5e5c4b84dbd6526e8197bea0160ba3d8dc2eb1a2fbd0aa099b3c31071551c161a15862f6d45d
        0feb0e2c218b2e4f94b4e7a23d0c1dc0bc0821911c2aba96c5e5c23328ec7614dcaaa18fb735f63c864283c806d328f0
        05e9602f793c10bab1d76ac12032220d941e5413fedc298b260b7ff7743ecf6cd137c5599245bc0453b4d61d08d63e49
        0caa0ae7a81a27345d88da9f2065915ec6c758a4e1b8a18654f815937d4fa481e0f4399d6c066bf697420a031a608968
        10d3c6699f556470013d735a7cab4f8f96542698efe9fb34ffc0ca5f196e7d20756659bd25f13b2ba45cb1920f9e056b
        0b60d733670c44b2bf025364204d863b3428eb53878cc263609d507ac1623f0e169843c4ef1da4239db30f2abae678ce
        038c41e621383670986238f366560ab46a582328905c0e40191e133e2f3dfc0842d873cb6be936f67acc6f4c2b2881cc
        07531c8e0a1d902b22dea7d242cf57315951ee3eda2f3290723b4b118e4de9fb3a8c46ae3c9cd744b8598dc46483005d
        0303af33f147826e0ee2da56d5849fb4e84b76edb8f490e774dbdc7d4aa686448b4293d72ddc53ec4f9aa83c8192a856
        0f9e2f478175a5dfbfa4466c09016a88ef350d69f287f11ee61d979b42d90692f7be247e0a87d6a08657d59ed011f5ac
      `);
      const exponentData = fromHex(
        "00000000000000000000000000000000308e6a1f3447d6f8396e9852b014ac671b70b487026ee56fc703ac07d8cbcb2d"
      );
      const expectedData = fromHex(`
        03022c9299dbf5d3ef355510132ccfb7df519f3df0edec89b76981853eaa497d5ce050f3c5b2898b19682b443001c0c3
        0a256234d5f0398467f1cd5b4ac15214d9d6657731f9297a493204639e910b64fedb7a58c8712acb96d358e63c6d4e40
        056ce041cde136fcfdd4c5f15020b67d54d612ec01e20bc1e92db4e3861a27c90f6c776d5a09429d091c8a8a926d1410
        02fdb14f1d44f594b00c52e76ec5cb3475f73665dfb75f7ffb2212ea8648339077b7a7a236451718635097008bf2f6fc
        175d8be7433d680d749b19cd8703a225f62d3cd54758afdaa192af5a1e6859edf051cc42bae76e25f6f8560d3be7d70b
        0afb29f7d8ee46512ab2fc4e12250d692662fc96bed89df4fb4ce274f9463a7d2248fe70a76e08b28c33cc72793c37fc
        08f663ee2ae9ecc5d0599e8d547ee2d1744f9cd7bf9d278a0a5878fe89259cdeb18a2ceec9e7d11b84aad6eb4fc051ac
        1691d1819423fad024e2e4634a398f9e7034aa4c337d10ab9f0f9925e9f0ea5961c95dd9618f1ecaa0df9f1447caed80
        1843b6d22960d88929260189942731befe8e4b2d8ed226cf2be92c4285386af03278d064ea86a343473849ed418f0be0
        0370f7b04673a7feea7b4975405c6774ccc1b9669fcc6df757d7c05f785d7b39b13c61f8bfaa727002222eebe6fa248b
        01d2c9db0df63f559a0ea72b8c7cea2c111a95a54ec7dd03f2cecc29d9273750b65d87aa6262d48ee3e5cc43b9d36b87
        113757b5626f0b5488cc731f4ba0bbd7b1a289db1ef71aea0abf911fb51fd5270eaefa455adad378e8c89182d9df674c
      `);

      const point = bls381Ctx.FP12.fromBytes(pointData);
      const expectedPoint = bls381Ctx.FP12.fromBytes(expectedData);
      const exponent = bls381Ctx.BIG.fromBytes(exponentData);

      const result = point.pow(exponent);
      expect(result.equals(expectedPoint)).toEqual(true);
    });
  });
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
