#include "arch.h"
#include "ecp_C25519.h"

/* Curve 25519 */

#if CHUNK==16

#error Not supported

#endif

#if CHUNK==32
const int CURVE_A_C25519=486662;
const BIG_256 CURVE_Order_C25519= {0x1CF5D3ED,0x9318D2,0x1DE73596,0x1DF3BD45,0x14D,0x0,0x0,0x0,0x100000};
const BIG_256 CURVE_Gx_C25519= {0x9};
#endif

#if CHUNK==64
const int CURVE_A_C25519=486662;
const BIG_256 CURVE_Order_C25519= {0x12631A5CF5D3ED,0xF9DEA2F79CD658,0x14DE,0x0,0x10000000};
const BIG_256 CURVE_Gx_C25519= {0x9};
#endif

