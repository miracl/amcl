#include "arch.h"
#include "fp_25519.h"

/* Curve 25519 */

#if CHUNK==16

#error Not supported

#endif

#if CHUNK==32
const chunk MConst_25519=19;
const BIG_256 Modulus_25519= {0x1FFFFFED,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x7FFFFF};
#endif

#if CHUNK==64
const chunk MConst_25519=19;
const BIG_256 Modulus_25519= {0xFFFFFFFFFFFFED,0xFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFF,0x7FFFFFFF};
#endif

