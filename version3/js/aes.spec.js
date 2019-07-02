const { CTX } = require("./ctx");

describe("AES", () => {
  const ctx = new CTX("ED25519");

  it("can be constructed", () => {
    const aes = new ctx.AES();
    expect(aes).toBeTruthy();
  });

  describe("ecb_encrypt", () => {
    it("can encrypt a single block (Botan test vectors)", () => {
      const aes = new ctx.AES();

      // Test vectors from
      // https://github.com/randombit/botan/blob/2.10.0/src/tests/data/block/aes.vec

      // AES-128
      {
        const initOk = aes.init(
          ctx.AES.ECB,
          16,
          Buffer.from("000102030405060708090A0B0C0D0E0F", "hex"),
          null
        );
        expect(initOk).toBeUndefined();
        const data = Buffer.from("00112233445566778899AABBCCDDEEFF", "hex");
        aes.ecb_encrypt(data);
        expect(data).toEqual(Buffer.from("69C4E0D86A7B0430D8CDB78070B4C55A", "hex"));
      }

      // AES-192
      {
        const initOk = aes.init(
          ctx.AES.ECB,
          24,
          Buffer.from("000102030405060708090A0B0C0D0E0F1011121314151617", "hex"),
          null
        );
        expect(initOk).toBeUndefined();
        const data = Buffer.from("00112233445566778899AABBCCDDEEFF", "hex");
        aes.ecb_encrypt(data);
        expect(data).toEqual(Buffer.from("DDA97CA4864CDFE06EAF70A0EC0D7191", "hex"));
      }

      // AES-256
      {
        const initOk = aes.init(
          ctx.AES.ECB,
          32,
          Buffer.from("000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F", "hex"),
          null
        );
        expect(initOk).toBeUndefined();
        const data = Buffer.from("00112233445566778899AABBCCDDEEFF", "hex");
        aes.ecb_encrypt(data);
        expect(data).toEqual(Buffer.from("8EA2B7CA516745BFEAFC49904B496089", "hex"));
      }
    });

    it("can encrypt a single block (PasswordLib test vectors)", () => {
      const aes = new ctx.AES();

      // https://github.com/ircmaxell/quality-checker/blob/63e91ea/tmp/gh_18/PHP-PasswordLib-master/test/Data/Vectors/aes-ecb.test-vectors

      // AES-128 (vector 1-4)
      {
        const initOk = aes.init(
          ctx.AES.ECB,
          16,
          Buffer.from("2b7e151628aed2a6abf7158809cf4f3c", "hex"),
          null
        );
        expect(initOk).toBeUndefined();
        const data = Buffer.from("6bc1bee22e409f96e93d7e117393172a", "hex");
        aes.ecb_encrypt(data);
        expect(data).toEqual(Buffer.from("3ad77bb40d7a3660a89ecaf32466ef97", "hex"));
      }
      {
        const initOk = aes.init(
          ctx.AES.ECB,
          16,
          Buffer.from("2b7e151628aed2a6abf7158809cf4f3c", "hex"),
          null
        );
        expect(initOk).toBeUndefined();
        const data = Buffer.from("ae2d8a571e03ac9c9eb76fac45af8e51", "hex");
        aes.ecb_encrypt(data);
        expect(data).toEqual(Buffer.from("f5d3d58503b9699de785895a96fdbaaf", "hex"));
      }
      {
        const initOk = aes.init(
          ctx.AES.ECB,
          16,
          Buffer.from("2b7e151628aed2a6abf7158809cf4f3c", "hex"),
          null
        );
        expect(initOk).toBeUndefined();
        const data = Buffer.from("30c81c46a35ce411e5fbc1191a0a52ef", "hex");
        aes.ecb_encrypt(data);
        expect(data).toEqual(Buffer.from("43b1cd7f598ece23881b00e3ed030688", "hex"));
      }
      {
        const initOk = aes.init(
          ctx.AES.ECB,
          16,
          Buffer.from("2b7e151628aed2a6abf7158809cf4f3c", "hex"),
          null
        );
        expect(initOk).toBeUndefined();
        const data = Buffer.from("f69f2445df4f9b17ad2b417be66c3710", "hex");
        aes.ecb_encrypt(data);
        expect(data).toEqual(Buffer.from("7b0c785e27e8ad3f8223207104725dd4", "hex"));
      }

      // AES-192 (vector 1-4)
      {
        const initOk = aes.init(
          ctx.AES.ECB,
          24,
          Buffer.from("8e73b0f7da0e6452c810f32b809079e562f8ead2522c6b7b", "hex"),
          null
        );
        expect(initOk).toBeUndefined();
        const data = Buffer.from("6bc1bee22e409f96e93d7e117393172a", "hex");
        aes.ecb_encrypt(data);
        expect(data).toEqual(Buffer.from("bd334f1d6e45f25ff712a214571fa5cc", "hex"));
      }
      {
        const initOk = aes.init(
          ctx.AES.ECB,
          24,
          Buffer.from("8e73b0f7da0e6452c810f32b809079e562f8ead2522c6b7b", "hex"),
          null
        );
        expect(initOk).toBeUndefined();
        const data = Buffer.from("ae2d8a571e03ac9c9eb76fac45af8e51", "hex");
        aes.ecb_encrypt(data);
        expect(data).toEqual(Buffer.from("974104846d0ad3ad7734ecb3ecee4eef", "hex"));
      }
      {
        const initOk = aes.init(
          ctx.AES.ECB,
          24,
          Buffer.from("8e73b0f7da0e6452c810f32b809079e562f8ead2522c6b7b", "hex"),
          null
        );
        expect(initOk).toBeUndefined();
        const data = Buffer.from("30c81c46a35ce411e5fbc1191a0a52ef", "hex");
        aes.ecb_encrypt(data);
        expect(data).toEqual(Buffer.from("ef7afd2270e2e60adce0ba2face6444e", "hex"));
      }
      {
        const initOk = aes.init(
          ctx.AES.ECB,
          24,
          Buffer.from("8e73b0f7da0e6452c810f32b809079e562f8ead2522c6b7b", "hex"),
          null
        );
        expect(initOk).toBeUndefined();
        const data = Buffer.from("f69f2445df4f9b17ad2b417be66c3710", "hex");
        aes.ecb_encrypt(data);
        expect(data).toEqual(Buffer.from("9a4b41ba738d6c72fb16691603c18e0e", "hex"));
      }

      // AES-256 (vector 1-4)
      {
        const initOk = aes.init(
          ctx.AES.ECB,
          32,
          Buffer.from("603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4", "hex"),
          null
        );
        expect(initOk).toBeUndefined();
        const data = Buffer.from("6bc1bee22e409f96e93d7e117393172a", "hex");
        aes.ecb_encrypt(data);
        expect(data).toEqual(Buffer.from("f3eed1bdb5d2a03c064b5a7e3db181f8", "hex"));
      }
      {
        const initOk = aes.init(
          ctx.AES.ECB,
          32,
          Buffer.from("603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4", "hex"),
          null
        );
        expect(initOk).toBeUndefined();
        const data = Buffer.from("ae2d8a571e03ac9c9eb76fac45af8e51", "hex");
        aes.ecb_encrypt(data);
        expect(data).toEqual(Buffer.from("591ccb10d410ed26dc5ba74a31362870", "hex"));
      }
      {
        const initOk = aes.init(
          ctx.AES.ECB,
          32,
          Buffer.from("603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4", "hex"),
          null
        );
        expect(initOk).toBeUndefined();
        const data = Buffer.from("30c81c46a35ce411e5fbc1191a0a52ef", "hex");
        aes.ecb_encrypt(data);
        expect(data).toEqual(Buffer.from("b6ed21b99ca6f4f9f153e7b1beafed1d", "hex"));
      }
      {
        const initOk = aes.init(
          ctx.AES.ECB,
          32,
          Buffer.from("603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4", "hex"),
          null
        );
        expect(initOk).toBeUndefined();
        const data = Buffer.from("f69f2445df4f9b17ad2b417be66c3710", "hex");
        aes.ecb_encrypt(data);
        expect(data).toEqual(Buffer.from("23304b7a39f9f3ff067d8d8f9e24ecc7", "hex"));
      }
    });
  });

  describe("ecb_decrypt", () => {
    it("can decrypt a single block (Botan test vectors)", () => {
      const aes = new ctx.AES();

      // Test vectors from
      // https://github.com/randombit/botan/blob/2.10.0/src/tests/data/block/aes.vec

      // AES-128
      {
        const initOk = aes.init(
          ctx.AES.ECB,
          16,
          Buffer.from("000102030405060708090A0B0C0D0E0F", "hex"),
          null
        );
        expect(initOk).toBeUndefined();
        const data = Buffer.from("69C4E0D86A7B0430D8CDB78070B4C55A", "hex");
        aes.ecb_decrypt(data);
        expect(data).toEqual(Buffer.from("00112233445566778899AABBCCDDEEFF", "hex"));
      }

      // AES-192
      {
        const initOk = aes.init(
          ctx.AES.ECB,
          24,
          Buffer.from("000102030405060708090A0B0C0D0E0F1011121314151617", "hex"),
          null
        );
        expect(initOk).toBeUndefined();
        const data = Buffer.from("DDA97CA4864CDFE06EAF70A0EC0D7191", "hex");
        aes.ecb_decrypt(data);
        expect(data).toEqual(Buffer.from("00112233445566778899AABBCCDDEEFF", "hex"));
      }

      // AES-256
      {
        const initOk = aes.init(
          ctx.AES.ECB,
          32,
          Buffer.from("000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F", "hex"),
          null
        );
        expect(initOk).toBeUndefined();
        const data = Buffer.from("8EA2B7CA516745BFEAFC49904B496089", "hex");
        aes.ecb_decrypt(data);
        expect(data).toEqual(Buffer.from("00112233445566778899AABBCCDDEEFF", "hex"));
      }
    });
  });
});
