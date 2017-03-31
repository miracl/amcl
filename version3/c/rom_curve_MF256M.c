#include "arch.h"
#include "ecp_MF256M.h"

/* MF256 NUMS Curve - MONTGOMERY */

/* Montgomery-Friendly NUMS curves http://eprint.iacr.org/2014/130 */

/* p=k.2^n-1 where n is multiple of BASEBITS - but k can be adjusted. */
/* Here p=2^240(2^14-127)-1 = 2^232(2^22-256.127)-1 where 8*29=232 and (2^22-256.127)=0x3F8100 */
/* or = 2^224(2^30-65536.127)-1 where 4*56=224 and (2^30-65536.127) = 0x3F810000 */

/* Montgomery-Friendly NUMS curves http://eprint.iacr.org/2014/130 */


#if CHUNK==32
const int CURVE_A_MF256M=-54314;
const BIG_256 CURVE_Order_MF256M= {0x18EC7BAB,0x16C976F6,0x19CCF259,0x9775F70,0x1FFFFB15,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x3FE9FF};
const BIG_256 CURVE_Gx_MF256M= {0x8};
#endif

#if CHUNK==64
const int CURVE_A_MF256M=-54314;
const BIG_256 CURVE_Order_MF256M= {0xD92EDED8EC7BAB,0xBBAFB86733C966,0xFFFFFFFFFFB154,0xFFFFFFFFFFFFFF,0x3FE9FFFF};
const BIG_256 CURVE_Gx_MF256M= {0x8};
#endif
