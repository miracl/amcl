/*
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

/* Fixed Data in ROM - Field and Curve parameters */

var ROM_FIELD_25519,
  ROM_FIELD_256PM,
  ROM_FIELD_384PM,
  ROM_FIELD_512PM,
  ROM_FIELD_ANSSI,
  ROM_FIELD_BLS383,
  ROM_FIELD_BLS24,
  ROM_FIELD_BLS48,
  ROM_FIELD_BLS381,
  ROM_FIELD_BLS461,
  ROM_FIELD_FP256BN,
  ROM_FIELD_FP512BN,
  ROM_FIELD_BN254,
  ROM_FIELD_BN254CX,
  ROM_FIELD_BRAINPOOL,
  ROM_FIELD_C41417,
  ROM_FIELD_GOLDILOCKS,
  ROM_FIELD_HIFIVE,
  ROM_FIELD_NIST256,
  ROM_FIELD_NIST384,
  ROM_FIELD_NIST521,
  ROM_FIELD_SECP256K1;

ROM_FIELD_25519 = function() {
  "use strict";

  var ROM_FIELD_25519 = {
    // 25519 Curve Modulus
    Modulus: [
      0xffffed,
      0xffffff,
      0xffffff,
      0xffffff,
      0xffffff,
      0xffffff,
      0xffffff,
      0xffffff,
      0xffffff,
      0xffffff,
      0x7fff,
    ],
    R2modp: [0xa40000, 0x5, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
    MConst: 0x13,
  };
  return ROM_FIELD_25519;
};

ROM_FIELD_256PM = function() {
  "use strict";
  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_256PM = {
    // NUMS256 Curve Modulus
    // Base Bits= 24
    Modulus: [
      0xffff43,
      0xffffff,
      0xffffff,
      0xffffff,
      0xffffff,
      0xffffff,
      0xffffff,
      0xffffff,
      0xffffff,
      0xffffff,
      0xffff,
    ],
    R2modp: [0x890000, 0x8b, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
    MConst: 0xbd,
  };
  return ROM_FIELD_256PM;
};

ROM_FIELD_384PM = function() {
  "use strict";
  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_384PM = {
    // NUMS384 Curve Modulus
    // Base Bits= 23
    Modulus: [
      0x7ffec3,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0xffff,
    ],
    R2modp: [
      0x224000,
      0xc4,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
    ],
    MConst: 0x13d,
  };
  return ROM_FIELD_384PM;
};

ROM_FIELD_512PM = function() {
  "use strict";
  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_512PM = {
    // NUMS512 Curve Modulus
    // Base Bits= 23
    Modulus: [
      0x7ffdc7,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x3f,
    ],
    R2modp: [
      0x0,
      0x58800,
      0x4f,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
    ],
    MConst: 0x239,
  };
  return ROM_FIELD_512PM;
};

ROM_FIELD_ANSSI = function() {
  "use strict";
  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_ANSSI = {
    // ANSSI modulus
    // Base Bits= 24
    Modulus: [
      0x6e9c03,
      0xf353d8,
      0x6de8fc,
      0xabc8ca,
      0x61adbc,
      0x435b39,
      0xe8ce42,
      0x10126d,
      0x3ad58f,
      0x178c0b,
      0xf1fd,
    ],
    R2modp: [
      0xacece3,
      0x924166,
      0xb10fce,
      0x6cfbb6,
      0x87ec2,
      0x3de43d,
      0xd2cf67,
      0xa67dde,
      0xad30f2,
      0xbcaae,
      0xdf98,
    ],
    MConst: 0x4e1155,
  };
  return ROM_FIELD_ANSSI;
};

ROM_FIELD_BLS383 = function() {
  "use strict";
  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_BLS383 = {
    // BLS383 Modulus
    // Base Bits= 23
    Modulus: [
      0x2ab0ab,
      0x3ac90b,
      0x2f68dc,
      0x532429,
      0x43f298,
      0x1e8f51,
      0x5a5849,
      0x18dc00,
      0x2511ac,
      0x59e6cb,
      0x2b518,
      0x549425,
      0x5c41fe,
      0x340db5,
      0x2adbad,
      0x2b4ab2,
      0x5565,
    ],
    R2modp: [
      0x250a44,
      0x68f66f,
      0xe3c74,
      0x791772,
      0x3525e3,
      0xe1e15,
      0x356616,
      0x54f624,
      0x508069,
      0x272663,
      0x4a4cb0,
      0x359293,
      0x5b6573,
      0x9f27f,
      0x5ea3b4,
      0x60fd2d,
      0x5167,
    ],
    MConst: 0x3435fd,
    Fra: [
      0x11dac1,
      0x2e5a66,
      0x614b,
      0x733b9f,
      0x13480f,
      0x19146d,
      0x395436,
      0x2b3a25,
      0x1a8682,
      0x247f74,
      0x3931b3,
      0x5a9788,
      0x7c2c11,
      0x67173,
      0x1fda2f,
      0x6adf81,
      0x22ac,
    ],
    Frb: [
      0x18d5ea,
      0xc6ea5,
      0x2f0791,
      0x5fe88a,
      0x30aa88,
      0x57ae4,
      0x210413,
      0x6da1db,
      0xa8b29,
      0x356757,
      0x498365,
      0x79fc9c,
      0x6015ec,
      0x2d9c41,
      0xb017e,
      0x406b31,
      0x32b8,
    ],
  };

  return ROM_FIELD_BLS383;
};

ROM_FIELD_BLS24 = function() {
  "use strict";
  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_BLS24 = {
    // BLS24 Modulus
    // Base Bits= 23

    Modulus: [
      0x6152b,
      0x2ce94,
      0x6be113,
      0x416986,
      0x2ffe2e,
      0x36d4c8,
      0x47172f,
      0x1945b7,
      0x5f068a,
      0xe6441,
      0x110186,
      0x4f0f9,
      0x33568e,
      0x4a0f2e,
      0x306ea0,
      0x173bf2,
      0x6e803f,
      0x735d8,
      0x3316ea,
      0x3c01e,
      0x555c0,
    ],
    R2modp: [
      0x22d6fa,
      0x7aa299,
      0x4c307e,
      0x68e711,
      0x7da4ae,
      0x383cc3,
      0x12048c,
      0x11b7d,
      0x3ca412,
      0x2ce421,
      0x4932ac,
      0x27a306,
      0x340b6a,
      0x666e,
      0x3f6575,
      0x2f823c,
      0xa0de6,
      0x137ec5,
      0x37d4bc,
      0x48a54e,
      0x4c28b,
    ],
    MConst: 0x15fe7d,
    Fra: [
      0x796f1d,
      0x4e9577,
      0x6eb572,
      0x68637f,
      0x41ff8b,
      0x46e8d3,
      0x7a7898,
      0x7c72a4,
      0x248407,
      0x6e79d9,
      0x56499e,
      0x4eb47f,
      0x27cbd6,
      0x33c662,
      0x4e9746,
      0xc2798,
      0x397549,
      0x4a5b1b,
      0x5c90b6,
      0x3dca73,
      0x4bbc8,
    ],
    Frb: [
      0xca60e,
      0x34391c,
      0x7d2ba0,
      0x590606,
      0x6dfea2,
      0x6febf4,
      0x4c9e96,
      0x1cd312,
      0x3a8282,
      0x1fea68,
      0x3ab7e7,
      0x363c79,
      0xb8ab7,
      0x1648cc,
      0x61d75a,
      0xb1459,
      0x350af6,
      0x3cdabd,
      0x568633,
      0x45f5aa,
      0x99f7,
    ],
  };

  return ROM_FIELD_BLS24;
};

ROM_FIELD_BLS48 = function() {
  "use strict";
  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_BLS48 = {
    // BLS48 Modulus
    // Base Bits= 23

    Modulus: [
      0x76ac0b,
      0x4c1ff9,
      0x67bbdb,
      0x5330ef,
      0x167009,
      0x450805,
      0x61c350,
      0x609bd4,
      0x76b2e,
      0x40410d,
      0x169054,
      0x353e01,
      0x141301,
      0x66f371,
      0x3b355a,
      0x6d4a85,
      0x36f405,
      0x28840a,
      0x454ab3,
      0x2b6433,
      0x29047a,
      0xb646e,
      0xbff3f,
      0x68bec2,
      0xf,
    ],
    R2modp: [
      0x5f42c2,
      0x596e88,
      0x2ed8fa,
      0x15c970,
      0x2518b4,
      0x2a75e7,
      0x62ce53,
      0x431c50,
      0x3cf507,
      0x620e44,
      0xd6fcd,
      0x21a7d,
      0x1fda3f,
      0x6a099,
      0x53487,
      0x53eebf,
      0x54e2d0,
      0x48437d,
      0x2233d8,
      0x63296f,
      0x21ee21,
      0x611417,
      0x619d35,
      0x13a61a,
      0xb,
    ],
    MConst: 0x5a805d,
    Fra: [
      0x25bf89,
      0x79fb26,
      0x56f988,
      0x399a14,
      0x507ea3,
      0x77995,
      0x3ee83a,
      0x52eca9,
      0x3e3474,
      0x5f1e13,
      0x2e7cb0,
      0x255f3d,
      0x3ae7f8,
      0x2e4ef6,
      0x3bde94,
      0x7b05a,
      0x13c83c,
      0x7bf664,
      0x1ff27f,
      0x6fe082,
      0x3b36ce,
      0x138113,
      0x6e2002,
      0x4c5c03,
      0x2,
    ],
    Frb: [
      0x25bf89,
      0x79fb26,
      0x56f988,
      0x399a14,
      0x507ea3,
      0x77995,
      0x3ee83a,
      0x52eca9,
      0x3e3474,
      0x5f1e13,
      0x2e7cb0,
      0x255f3d,
      0x3ae7f8,
      0x2e4ef6,
      0x3bde94,
      0x7b05a,
      0x13c83c,
      0x7bf664,
      0x1ff27f,
      0x6fe082,
      0x3b36ce,
      0x138113,
      0x6e2002,
      0x4c5c03,
      0x2,
    ],
  };

  return ROM_FIELD_BLS48;
};

ROM_FIELD_BLS381 = function() {
  "use strict";
  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_BLS381 = {
    // BLS381 Modulus
    // Base Bits= 23

    Modulus: [
      0x7faaab,
      0x7fffff,
      0x7ee7fb,
      0xa9fff,
      0x3fffeb,
      0x4483d5,
      0x3dac3d,
      0x186950,
      0x12bf67,
      0x9e70a,
      0x11dd2e,
      0x5d66bb,
      0x7b6434,
      0x496374,
      0x5ff9a6,
      0x8f51c,
      0x1a01,
    ],
    R2modp: [
      0x40c6e6,
      0xe1a28,
      0x3d1c6c,
      0x6d2448,
      0x1bb111,
      0x4eafa8,
      0x229c8c,
      0x4cee55,
      0x46d2ad,
      0x7ba87c,
      0x708835,
      0x2413d1,
      0x6702e3,
      0x390116,
      0xd9e3f,
      0x4bd65c,
      0x9a3,
    ],
    MConst: 0x7cfffd,
    Fra: [
      0x235fb8,
      0x6bdb24,
      0x76341d,
      0x1f3c09,
      0x6a53d6,
      0x389ecf,
      0x612eae,
      0x1221eb,
      0x5f4f7b,
      0x7a797a,
      0x3f580f,
      0x6068f8,
      0x6b4202,
      0x784637,
      0x2ec199,
      0x69df81,
      0x1904,
    ],
    Frb: [
      0x5c4af3,
      0x1424db,
      0x8b3de,
      0x6b63f6,
      0x55ac14,
      0xbe505,
      0x5c7d8f,
      0x64764,
      0x336fec,
      0xf6d8f,
      0x52851e,
      0x7cfdc2,
      0x102231,
      0x511d3d,
      0x31380c,
      0x1f159b,
      0xfc,
    ],
  };

  return ROM_FIELD_BLS381;
};

ROM_FIELD_BLS461 = function() {
  "use strict";
  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_BLS461 = {
    // BLS461 Modulus
    // Base Bits= 23
    Modulus: [
      0x2aaaab,
      0x155,
      0x2aaab0,
      0x2aaa55,
      0x55,
      0x80004,
      0x555fc0,
      0x135548,
      0x1cc00f,
      0x3ff4b8,
      0x2d0aa3,
      0x58a424,
      0x2cca47,
      0x465b17,
      0x6f5bc7,
      0xa49af,
      0x55d694,
      0x34aab4,
      0x155535,
      0x2aaaaa,
      0x1,
    ],
    R2modp: [
      0x621498,
      0x3b585f,
      0x41688,
      0x6f780d,
      0x17c239,
      0x158d8a,
      0x491a92,
      0x737df1,
      0x22a06,
      0x460263,
      0x275ff2,
      0x5496c3,
      0x6d4ad2,
      0x3a7b46,
      0x3a6323,
      0x1723b1,
      0x76204b,
      0x66fd26,
      0x4e743e,
      0x1be66e,
      0x0,
    ],
    MConst: 0x7ffffd,
    Fra: [
      0x12a3a,
      0x2f7f37,
      0x3dc4,
      0x52cce2,
      0x1c6308,
      0xb7f14,
      0x4381d4,
      0x52d328,
      0x58d45f,
      0x359c90,
      0x1dc2cc,
      0x616582,
      0x7c61eb,
      0x6b11c5,
      0x64341c,
      0x421b30,
      0x4dfefa,
      0x3cabc4,
      0x12dfda,
      0x172028,
      0x1,
    ],
    Frb: [
      0x298071,
      0x50821e,
      0x2a6ceb,
      0x57dd73,
      0x639d4c,
      0x7c80ef,
      0x11ddeb,
      0x408220,
      0x43ebaf,
      0xa5827,
      0xf47d7,
      0x773ea2,
      0x30685b,
      0x5b4951,
      0xb27aa,
      0x482e7f,
      0x7d799,
      0x77fef0,
      0x2755a,
      0x138a82,
      0x0,
    ],
  };

  return ROM_FIELD_BLS461;
};

ROM_FIELD_FP256BN = function() {
  "use strict";
  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_FP256BN = {
    // FP256BN Modulus
    // Base Bits= 24
    Modulus: [
      0xd33013,
      0x2ddbae,
      0x82d329,
      0x12980a,
      0xdc65fb,
      0xa49f0c,
      0x5eee71,
      0x46e5f2,
      0xfcf0cd,
      0xffffff,
      0xffff,
    ],
    R2modp: [
      0x2f4801,
      0xf779d1,
      0x3e7f6e,
      0xb42a3a,
      0xc919c9,
      0xc26c08,
      0x1bb715,
      0xca2ed6,
      0x54293e,
      0xe578e,
      0x78ea,
    ],
    MConst: 0x37e5e5,
    Fra: [
      0x943106,
      0x328af,
      0x8f7476,
      0x1e3ab2,
      0xa17151,
      0x67cf39,
      0x8ddb08,
      0x2d1a6e,
      0x786f35,
      0x7662ca,
      0x3d61,
    ],
    Frb: [
      0x3eff0d,
      0x2ab2ff,
      0xf35eb3,
      0xf45d57,
      0x3af4a9,
      0x3ccfd3,
      0xd11369,
      0x19cb83,
      0x848198,
      0x899d35,
      0xc29e,
    ],
  };

  return ROM_FIELD_FP256BN;
};

ROM_FIELD_FP512BN = function() {
  "use strict";

  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_FP512BN = {
    // FP512BN Modulus
    // Base Bits= 23
    Modulus: [
      0x2def33,
      0x501245,
      0x1ed3ac,
      0x7a6323,
      0x255ce5,
      0x7c322d,
      0x2ac8db,
      0x4632ef,
      0x18b8e4,
      0x3d597d,
      0x451b3c,
      0x77a2a,
      0x3c111b,
      0x78177c,
      0x32d4c1,
      0x5d0ec,
      0x7f01c6,
      0x7ff3d8,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x3f,
    ],
    R2modp: [
      0x23e65d,
      0x575a37,
      0x411cd0,
      0x295fb3,
      0x640669,
      0x375c69,
      0x92395,
      0x738492,
      0x780d6d,
      0x1bcd9d,
      0x417caa,
      0x2dc6fb,
      0x7eacfb,
      0x327043,
      0x7f2fc7,
      0xf268c,
      0x73d733,
      0x2147c9,
      0x2accd3,
      0x32eaf8,
      0x3b2c1e,
      0xd46a2,
      0x30,
    ],
    MConst: 0x4c5c05,
    Fra: [
      0x373ab2,
      0x2f63e9,
      0x47d258,
      0x101576,
      0x1514f6,
      0x503c2e,
      0x34ef61,
      0x4fb040,
      0x2cbbb5,
      0x553d0a,
      0x63a7e2,
      0x10341c,
      0x48cf2e,
      0x3564d7,
      0x25bde4,
      0x50c529,
      0x468b4e,
      0x2d518f,
      0x6de46,
      0x7c84ad,
      0x1cf5bb,
      0x5ee355,
      0x7,
    ],
    Frb: [
      0x76b481,
      0x20ae5b,
      0x570154,
      0x6a4dac,
      0x1047ef,
      0x2bf5ff,
      0x75d97a,
      0x7682ae,
      0x6bfd2e,
      0x681c72,
      0x617359,
      0x77460d,
      0x7341ec,
      0x42b2a4,
      0xd16dd,
      0x350bc3,
      0x387677,
      0x52a249,
      0x7921b9,
      0x37b52,
      0x630a44,
      0x211caa,
      0x38,
    ],
  };

  return ROM_FIELD_FP512BN;
};

ROM_FIELD_BN254 = function() {
  "use strict";
  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_BN254 = {
    // BN254 Modulus
    // Base Bits= 24
    Modulus: [0x13, 0x0, 0x13a700, 0x0, 0x210000, 0x861, 0x800000, 0xba344d, 0x1, 0x648240, 0x2523],
    R2modp: [
      0x2f2aa7,
      0x537047,
      0xf8f174,
      0xc3e364,
      0xab8c1c,
      0x3c2035,
      0x69549,
      0x379287,
      0x3be629,
      0x75617a,
      0x1f47,
    ],
    MConst: 0x9435e5,
    Fra: [
      0x2a6de9,
      0xe6c06f,
      0xc2e17d,
      0x4d3f77,
      0x97492,
      0x953f85,
      0x50a846,
      0xb6499b,
      0x2e7c8c,
      0x761921,
      0x1b37,
    ],
    Frb: [
      0xd5922a,
      0x193f90,
      0x50c582,
      0xb2c088,
      0x178b6d,
      0x6ac8dc,
      0x2f57b9,
      0x3eab2,
      0xd18375,
      0xee691e,
      0x9eb,
    ],
  };

  return ROM_FIELD_BN254;
};

ROM_FIELD_BN254CX = function() {
  "use strict";
  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_BN254CX = {
    // BN254CX Modulus
    // Base Bits= 24
    Modulus: [
      0x1b55b3,
      0x23ef5c,
      0xe1be66,
      0x18093e,
      0x3fd6ee,
      0x66d324,
      0x647a63,
      0xb0bddf,
      0x702a0d,
      0x8,
      0x2400,
    ],
    R2modp: [
      0x8ee63d,
      0x721fde,
      0xcc0891,
      0x10c28b,
      0xd4f5a,
      0x4c18fb,
      0x9036fa,
      0x3f845f,
      0xa507e4,
      0x78eb29,
      0x1587,
    ],
    MConst: 0x789e85,
    Fra: [
      0xc80ea3,
      0x83355,
      0x215bd9,
      0xf173f8,
      0x677326,
      0x189868,
      0x8aaca7,
      0xafe18b,
      0x3a0164,
      0x82fa6,
      0x1359,
    ],
    Frb: [
      0x534710,
      0x1bbc06,
      0xc0628d,
      0x269546,
      0xd863c7,
      0x4e3abb,
      0xd9cdbc,
      0xdc53,
      0x3628a9,
      0xf7d062,
      0x10a6,
    ],
  };

  return ROM_FIELD_BN254CX;
};

ROM_FIELD_BRAINPOOL = function() {
  "use strict";
  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_BRAINPOOL = {
    // Brainpool modulus
    // Base Bits= 24
    Modulus: [
      0x6e5377,
      0x481d1f,
      0x282013,
      0xd52620,
      0x3bf623,
      0x8d726e,
      0x909d83,
      0x3e660a,
      0xeea9bc,
      0x57dba1,
      0xa9fb,
    ],
    R2modp: [
      0x35b819,
      0xb03428,
      0xecaf0f,
      0x3854a4,
      0x4a0ed5,
      0x2421ea,
      0xaa562c,
      0xf9c45,
      0xddae58,
      0x4350fd,
      0x52b8,
    ],
    MConst: 0xfd89b9,
  };
  return ROM_FIELD_BRAINPOOL;
};

ROM_FIELD_C41417 = function() {
  "use strict";
  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_C41417 = {
    // C41417 modulus
    // Base Bits= 2
    Modulus: [
      0x3fffef,
      0x3fffff,
      0x3fffff,
      0x3fffff,
      0x3fffff,
      0x3fffff,
      0x3fffff,
      0x3fffff,
      0x3fffff,
      0x3fffff,
      0x3fffff,
      0x3fffff,
      0x3fffff,
      0x3fffff,
      0x3fffff,
      0x3fffff,
      0x3fffff,
      0x3fffff,
      0x3ffff,
    ],
    R2modp: [
      0x12100,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
    ],
    MConst: 0x11,
  };
  return ROM_FIELD_C41417;
};

ROM_FIELD_GOLDILOCKS = function() {
  "use strict";
  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_GOLDILOCKS = {
    // GOLDILOCKS modulus
    // Base Bits= 23
    Modulus: [
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7dffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7ff,
    ],
    R2modp: [
      0x0,
      0x4,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0xc0000,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
    ],
    MConst: 0x1,
  };
  return ROM_FIELD_GOLDILOCKS;
};

ROM_FIELD_HIFIVE = function() {
  "use strict";
  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_HIFIVE = {
    // HIFIVE modulus
    // Base Bits= 23
    Modulus: [
      0x7ffffd,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x3fff,
    ],
    R2modp: [0x240000, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
    MConst: 0x3,
  };
  return ROM_FIELD_HIFIVE;
};

ROM_FIELD_NIST256 = function() {
  "use strict";
  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_NIST256 = {
    // NIST256 Modulus
    // Base Bits= 24
    Modulus: [0xffffff, 0xffffff, 0xffffff, 0xffffff, 0x0, 0x0, 0x0, 0x0, 0x1, 0xffff00, 0xffff],
    R2modp: [
      0x30000,
      0x0,
      0x0,
      0xffff00,
      0xfbffff,
      0xffffff,
      0xfffffe,
      0xffffff,
      0xfdffff,
      0xffffff,
      0x4,
    ],
    MConst: 0x1,
  };
  return ROM_FIELD_NIST256;
};

ROM_FIELD_NIST384 = function() {
  "use strict";
  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_NIST384 = {
    // NIST384 modulus
    // Base Bits= 23
    Modulus: [
      0x7fffff,
      0x1ff,
      0x0,
      0x0,
      0x7ffff0,
      0x7fdfff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0xffff,
    ],
    R2modp: [
      0x4000,
      0x0,
      0x7ffffe,
      0x1ff,
      0x80000,
      0x0,
      0x0,
      0x7fc000,
      0x3fffff,
      0x0,
      0x200,
      0x20000,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
    ],
    MConst: 0x1,
  };
  return ROM_FIELD_NIST384;
};

ROM_FIELD_NIST521 = function() {
  "use strict";
  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_NIST521 = {
    // NIST521 modulus
    // Base Bits= 23
    Modulus: [
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fffff,
      0x7fff,
    ],
    R2modp: [
      0x10000,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
      0x0,
    ],
    MConst: 0x1,
  };
  return ROM_FIELD_NIST521;
};

ROM_FIELD_SECP256K1 = function() {
  "use strict";
  /* Fixed Data in ROM - Field and Curve parameters */

  var ROM_FIELD_SECP256K1 = {
    // SECP256K1 modulus
    // Base Bits= 24
    Modulus: [
      0xfffc2f,
      0xfffeff,
      0xffffff,
      0xffffff,
      0xffffff,
      0xffffff,
      0xffffff,
      0xffffff,
      0xffffff,
      0xffffff,
      0xffff,
    ],
    R2modp: [0xa10000, 0xe90, 0x7a2, 0x100, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
    MConst: 0x253531,
  };
  return ROM_FIELD_SECP256K1;
};

// CommonJS module exports
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports.ROM_FIELD_25519 = ROM_FIELD_25519;
  module.exports.ROM_FIELD_256PM = ROM_FIELD_256PM;
  module.exports.ROM_FIELD_384PM = ROM_FIELD_384PM;
  module.exports.ROM_FIELD_512PM = ROM_FIELD_512PM;
  module.exports.ROM_FIELD_ANSSI = ROM_FIELD_ANSSI;
  module.exports.ROM_FIELD_BLS383 = ROM_FIELD_BLS383;
  module.exports.ROM_FIELD_BLS24 = ROM_FIELD_BLS24;
  module.exports.ROM_FIELD_BLS48 = ROM_FIELD_BLS48;
  module.exports.ROM_FIELD_BLS381 = ROM_FIELD_BLS381;
  module.exports.ROM_FIELD_BLS461 = ROM_FIELD_BLS461;
  module.exports.ROM_FIELD_FP256BN = ROM_FIELD_FP256BN;
  module.exports.ROM_FIELD_FP512BN = ROM_FIELD_FP512BN;
  module.exports.ROM_FIELD_BN254 = ROM_FIELD_BN254;
  module.exports.ROM_FIELD_BN254CX = ROM_FIELD_BN254CX;
  module.exports.ROM_FIELD_BRAINPOOL = ROM_FIELD_BRAINPOOL;
  module.exports.ROM_FIELD_C41417 = ROM_FIELD_C41417;
  module.exports.ROM_FIELD_GOLDILOCKS = ROM_FIELD_GOLDILOCKS;
  module.exports.ROM_FIELD_HIFIVE = ROM_FIELD_HIFIVE;
  module.exports.ROM_FIELD_NIST256 = ROM_FIELD_NIST256;
  module.exports.ROM_FIELD_NIST384 = ROM_FIELD_NIST384;
  module.exports.ROM_FIELD_NIST521 = ROM_FIELD_NIST521;
  module.exports.ROM_FIELD_SECP256K1 = ROM_FIELD_SECP256K1;
}
