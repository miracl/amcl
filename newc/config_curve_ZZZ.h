#ifndef CONFIG_CURVE_ZZZ_H
#define CONFIG_CURVE_ZZZ_H

#include"amcl.h"
#include"config_field_YYY.h"

// ECP stuff

#define CURVETYPE_ZZZ @CT@  

#define PAIRING_FRIENDLY_ZZZ @PF@

#if PAIRING_FRIENDLY_ZZZ != NOT
#define USE_GLV_ZZZ	  /**< Note this method is patented (GLV), so maybe you want to comment this out */
#define USE_GS_G2_ZZZ /**< Well we didn't patent it :) But may be covered by GLV patent :( */
#define USE_GS_GT_ZZZ /**< Not patented, so probably safe to always use this */
#endif

#endif