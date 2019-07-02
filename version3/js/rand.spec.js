const { CTX } = require("./ctx");

describe("RAND", () => {
  const ctx = new CTX();

  it("can be seeded", () => {
    const rng = new ctx.RAND();
    expect(rng).toBeTruthy();
    const entropy = new Uint8Array([0x00, 0x22, 0x44, 0x66, 0x88, 0xaa]);
    rng.seed(entropy.length, entropy);
  });

  it("can get bytes", () => {
    const rng = new ctx.RAND();
    const entropy = new Uint8Array([0x00, 0x22, 0x44, 0x66, 0x88, 0xaa]);
    rng.seed(entropy.length, entropy);
    const results = new Set();
    for (let i = 0; i < 500; ++i) {
      const result = rng.getByte();
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(255);
      results.add(result);
    }
    // a very bad entropy test that just prevents us from the most horrible failures
    expect(results.size).toBeGreaterThanOrEqual(200);
  });

  it("produces non-constant values", () => {
    const rng = new ctx.RAND();
    const entropy = new Uint8Array([0x00, 0x22, 0x44, 0x66, 0x88, 0xaa]);
    rng.seed(entropy.length, entropy);
    const values = [rng.getByte(), rng.getByte(), rng.getByte()];
    expect(values[0]).not.toEqual(values[1]);
    expect(values[1]).not.toEqual(values[2]);
    expect(values[2]).not.toEqual(values[0]);
  });

  it("is deterministic", () => {
    const rng1 = new ctx.RAND();
    const entropy1 = new Uint8Array([0x00, 0x11, 0x22]);
    rng1.seed(entropy1.length, entropy1);

    const rng2 = new ctx.RAND();
    const entropy2 = new Uint8Array([0x00, 0x11, 0x22]);
    rng2.seed(entropy2.length, entropy2);

    expect(rng1.getByte()).toEqual(rng2.getByte());
    expect(rng1.getByte()).toEqual(rng2.getByte());
    expect(rng1.getByte()).toEqual(rng2.getByte());
  });
});

describe("RANDStatic", () => {
  const ctx = new CTX();

  describe("new", () => {
    it("can be constructed", () => {
      const rng = new ctx.RAND();
      expect(rng).toBeTruthy();
    });
  });
});
