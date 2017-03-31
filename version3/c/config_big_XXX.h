#ifndef CONFIG_BIG_XXX_H
#define CONFIG_BIG_XXX_H

#include"amcl.h"

// BIG stuff

#define MODBYTES_XXX @NB@  
#if CHUNK==16
#define BASEBITS_XXX @B16@ 
#endif
#if CHUNK==32
#define BASEBITS_XXX @B32@
#endif
#if CHUNK==64
#define BASEBITS_XXX @B64@
#endif


#endif
