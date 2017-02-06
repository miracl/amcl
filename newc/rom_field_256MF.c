#include "arch.h"
#include "fp_256MF.h"

/* MF256 NUMS Curve - EDWARDS */

/* Montgomery-Friendly NUMS curves http://eprint.iacr.org/2014/130 */

/* p=k.2^n-1 where n is multiple of BASEBITS - but k can be adjusted. */
/* Here p=2^240(2^14-127)-1 = 2^232(2^22-256.127)-1 where 8*29=232 and (2^22-256.127)=0x3F8100 */
/* or = 2^224(2^30-65536.127)-1 where 4*56=224 and (2^30-65536.127) = 0x3F810000 */



/* Montgomery-Friendly NUMS curves http://eprint.iacr.org/2014/130 */

#if CHUNK==32
const BIG_256 Modulus_256MF= {0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0xFFA7FF};
const chunk MConst_256MF=0xFFA800;
#endif

#if CHUNK==64
const BIG_256 Modulus_256MF= {0xFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFF,0xFFA7FFFF};
const chunk MConst_256MF=0xFFA80000;
#endif
