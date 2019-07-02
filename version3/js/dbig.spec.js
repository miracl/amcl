const { CTX } = require("./ctx");

describe("DBIGStatic", () => {
  const ctx = new CTX("ED25519");

  describe("new", () => {
    it("can be constructed with zero argument", () => {
      const a = new ctx.DBIG(0);
      expect(a).toBeTruthy();
      expect(a.w.every(word => word === 0)).toEqual(true);
    });

    it("can be constructed with non-zero argument", () => {
      const a = new ctx.DBIG(123);
      expect(a).toBeTruthy();
      expect(a.w[0]).toEqual(123);
      expect(a.w.slice(1).every(word => word === 0)).toEqual(true);
    });
  });
});
