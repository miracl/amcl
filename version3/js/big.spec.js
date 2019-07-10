const { randomBytes } = require("crypto");

const { CTX } = require("./ctx");

describe("BIG", () => {
  const ctx = new CTX("ED25519");

  describe("zero", () => {
    it("sets value to 0 and returns this", () => {
      const a = new ctx.BIG(42);
      expect(a.zero()).toBe(a);
      expect(a.w.every(word => word === 0)).toEqual(true);
    });
  });

  describe("one", () => {
    it("sets value to 1 and returns this", () => {
      const a = new ctx.BIG(42);
      expect(a.one()).toBe(a);
      expect(a.w.slice(1).every(word => word === 0)).toEqual(true);
      expect(a.w[0]).toEqual(1);
    });
  });

  describe("copy", () => {});
  describe("hcopy", () => {});
  describe("rcopy", () => {});

  describe("nbits", () => {
    it("works", () => {
      expect(new ctx.BIG(0b000000).nbits()).toEqual(0);

      expect(new ctx.BIG(0b000001).nbits()).toEqual(1);
      expect(new ctx.BIG(0b000010).nbits()).toEqual(2);
      expect(new ctx.BIG(0b000100).nbits()).toEqual(3);
      expect(new ctx.BIG(0b001000).nbits()).toEqual(4);
      expect(new ctx.BIG(0b010000).nbits()).toEqual(5);

      expect(new ctx.BIG(0b000001).nbits()).toEqual(1);
      expect(new ctx.BIG(0b000011).nbits()).toEqual(2);
      expect(new ctx.BIG(0b000111).nbits()).toEqual(3);
      expect(new ctx.BIG(0b001111).nbits()).toEqual(4);
      expect(new ctx.BIG(0b011111).nbits()).toEqual(5);
    });
  });

  describe("invmodp", () => {
    const p = new ctx.BIG(7);

    it("works", () => {
      {
        const a = new ctx.BIG(1);
        a.invmodp(p);
        expect(ctx.BIG.comp(a, new ctx.BIG(1))).toEqual(0);
      }
      {
        const a = new ctx.BIG(2);
        a.invmodp(p);
        expect(ctx.BIG.comp(a, new ctx.BIG(4))).toEqual(0);
      }
      {
        const a = new ctx.BIG(3);
        a.invmodp(p);
        expect(ctx.BIG.comp(a, new ctx.BIG(5))).toEqual(0);
      }
    });

    it("errors when called on zero", () => {
      const a = new ctx.BIG(0);
      a.invmodp(p);
      // In this case the value 0 indicates an error case. This is valid since 0
      // is not an element of the multiplactive group.
      // See https://github.com/miracl/amcl/issues/34#issuecomment-509573252
      expect(a.iszilch()).toEqual(true);
    });
  });
});

describe("BIGStatic", () => {
  const ctx = new CTX("ED25519");

  it("has corect static values", () => {
    expect(ctx.BIG.NLEN).toEqual(11);
    expect(ctx.BIG.DNLEN).toEqual(22);
  });

  describe("fromBytes", () => {
    const tenZeros = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    it("does not work for unpadded bytes", () => {
      const a = ctx.BIG.fromBytes([13]);
      expect(ctx.BIG.comp(a, new ctx.BIG(13))).not.toEqual(0);
    });

    it("works for padded bytes", () => {
      const a = ctx.BIG.fromBytes([...tenZeros, ...tenZeros, ...tenZeros, 0, 13]);
      expect(ctx.BIG.comp(a, new ctx.BIG(13))).toEqual(0);
    });

    it("decodes big endian", () => {
      const a = ctx.BIG.fromBytes([...tenZeros, ...tenZeros, ...tenZeros, 0x11, 0x22]);
      expect(ctx.BIG.comp(a, new ctx.BIG(0x1122))).toEqual(0);
    });

    it("ignores trailing data beyond BIG.MODBYTES bytes", () => {
      const a = ctx.BIG.fromBytes([...tenZeros, ...tenZeros, ...tenZeros, 0x11, 0x22, 0xaa]);
      expect(ctx.BIG.comp(a, new ctx.BIG(0x1122))).toEqual(0);
    });
  });

  describe("comp", () => {
    it("works for a == b", () => {
      const a = new ctx.BIG(5);
      const b = new ctx.BIG(5);
      expect(ctx.BIG.comp(a, b)).toEqual(0);
    });

    it("works for a < b", () => {
      const a = new ctx.BIG(4);
      const b = new ctx.BIG(5);
      expect(ctx.BIG.comp(a, b)).toEqual(-1);
    });

    it("works for a > b", () => {
      const a = new ctx.BIG(6);
      const b = new ctx.BIG(5);
      expect(ctx.BIG.comp(a, b)).toEqual(1);
    });
  });

  describe("randomnum", () => {
    it("works", () => {
      const rng = new ctx.RAND();
      const q = new ctx.BIG(123);
      const a = ctx.BIG.randomnum(q, rng);
      expect(a).toBeInstanceOf(ctx.BIG);
      expect(ctx.BIG.comp(a, new ctx.BIG(123))).toEqual(-1);
    });

    it("works for different limits", () => {
      const rng = new ctx.RAND();
      expect(ctx.BIG.comp(ctx.BIG.randomnum(new ctx.BIG(100), rng), new ctx.BIG(100))).toEqual(-1);
      expect(ctx.BIG.comp(ctx.BIG.randomnum(new ctx.BIG(10), rng), new ctx.BIG(10))).toEqual(-1);
      expect(ctx.BIG.comp(ctx.BIG.randomnum(new ctx.BIG(1), rng), new ctx.BIG(1))).toEqual(-1);
      // the following line will cause an infinite loop
      // expect(ctx.BIG.comp(ctx.BIG.randomnum(new ctx.BIG(0), rng), new ctx.BIG(0))).toEqual(-1);
    });

    // A very basic distribution test that only prevents the most horrible bugs
    it("leads to uniform distribution", () => {
      const seed = randomBytes(16);
      const rng = new ctx.RAND();
      rng.seed(seed.length, seed);

      const q = new ctx.BIG(10); // a 4 bit value
      const counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const iterations = 70000;
      for (let i = 0; i < iterations; ++i) {
        const a = ctx.BIG.randomnum(q, rng); // a is in [0, 1, 2, ..., 9]
        const lowWord = a.w[0];
        counts[lowWord] += 1;
      }
      const proportions = counts.map(count => count / counts.reduce((a, b) => a + b, 0));
      // console.log(proportions);
      expect(proportions[0]).toBeCloseTo(1 / 10);
      expect(proportions[1]).toBeCloseTo(1 / 10);
      expect(proportions[2]).toBeCloseTo(1 / 10);
      expect(proportions[3]).toBeCloseTo(1 / 10);
      expect(proportions[4]).toBeCloseTo(1 / 10);
      expect(proportions[5]).toBeCloseTo(1 / 10);
      expect(proportions[6]).toBeCloseTo(1 / 10);
      expect(proportions[7]).toBeCloseTo(1 / 10);
      expect(proportions[8]).toBeCloseTo(1 / 10);
      expect(proportions[9]).toBeCloseTo(1 / 10);
    });
  });

  describe("new", () => {
    it("can be constructed with no argument", () => {
      const a = new ctx.BIG();
      expect(a).toBeTruthy();
      expect(a.w.every(word => word === 0)).toEqual(true);
    });

    it("can be constructed with zero argument", () => {
      const a = new ctx.BIG(0);
      expect(a).toBeTruthy();
      expect(a.w.every(word => word === 0)).toEqual(true);
    });

    it("can be constructed with non-zero argument", () => {
      const a = new ctx.BIG(123);
      expect(a).toBeTruthy();
      expect(a.w[0]).toEqual(123);
      expect(a.w.slice(1).every(word => word === 0)).toEqual(true);
    });
  });
});
