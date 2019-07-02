const { CTX } = require("./ctx");

describe("UInt64", () => {
  const ctx = new CTX("ED25519");

  describe("add", () => {
    it("can add", () => {
      // only bot
      {
        const a = new ctx.UInt64(0, 1);
        a.add(new ctx.UInt64(0, 2));
        expect(a.top).toEqual(0);
        expect(a.bot).toEqual(3);
      }
      // only top
      {
        const a = new ctx.UInt64(1, 0);
        a.add(new ctx.UInt64(2, 0));
        expect(a.top).toEqual(3);
        expect(a.bot).toEqual(0);
      }
      // top, bot
      {
        const a = new ctx.UInt64(1, 5);
        a.add(new ctx.UInt64(2, 4));
        expect(a.top).toEqual(3);
        expect(a.bot).toEqual(9);
      }
      // overflow in bot
      {
        const uint32Max = 2 ** 32 - 1;
        const a = new ctx.UInt64(0, uint32Max);
        a.add(new ctx.UInt64(0, 1));
        expect(a.top).toEqual(1);
        expect(a.bot).toEqual(0);
      }
    });
  });

  describe("copy", () => {
    it("can copy", () => {
      const a = new ctx.UInt64(1, 2);
      const b = a.copy();
      expect(b.top).toEqual(1);
      expect(b.bot).toEqual(2);
    });
  });

  describe("shlb", () => {
    it("can shift left 8 bit", () => {
      {
        const a = new ctx.UInt64(0, 1);
        a.shlb();
        expect(a.top).toEqual(0);
        expect(a.bot).toEqual(1 << 8);
      }
      {
        const a = new ctx.UInt64(1, 0);
        a.shlb();
        expect(a.top).toEqual(1 << 8);
        expect(a.bot).toEqual(0);
      }
      {
        const a = new ctx.UInt64(0x00000000, 0xffffffff);
        a.shlb();
        expect(a.top).toEqual(0x000000ff << 0);
        expect(a.bot).toEqual(0xffffff00 << 0);
      }
      {
        const a = new ctx.UInt64(0x000000aa, 0xbbccddee);
        a.shlb();
        expect(a.top).toEqual(0x0000aabb << 0);
        expect(a.bot).toEqual(0xccddee00 << 0);
      }
    });
  });
});

describe("UInt64Static", () => {
  const ctx = new CTX("ED25519");

  describe("new", () => {
    it("can be constructed", () => {
      const a = new ctx.UInt64(17, 4);
      expect(a).toBeTruthy();
      expect(a.top).toEqual(17);
      expect(a.bot).toEqual(4);
    });
  });
});
