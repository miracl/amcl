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

/**
 * @file config_curve_ZZZ.h
 * @author Mike Scott
 * @date January 2017
 * @brief Auxiliary values for elliptic curves
 *
 *
 */

#ifndef CONFIG_CURVE_ZZZ_H
#define CONFIG_CURVE_ZZZ_H

#include"amcl.h"
#include"config_field_YYY.h"

// ECP stuff

#define CURVETYPE_ZZZ @CT@			/**< Type of the representation of curve, can be Weiestrass, Montgomery or Edwards */
#define PAIRING_FRIENDLY_ZZZ @PF@	/**< True if the curve is pairing friendly */

/*
#define CURVETYPE_ZZZ EDWARDS
#define PAIRING_FRIENDLY_ZZZ NOT
*/

#if PAIRING_FRIENDLY_ZZZ != NOT
#define USE_GLV_ZZZ	  /**< Note this method is patented (GLV), so maybe you want to comment this out */
#define USE_GS_G2_ZZZ /**< Well we didn't patent it :) But may be covered by GLV patent :( */
#define USE_GS_GT_ZZZ /**< Not patented, so probably safe to always use this */
#endif

#endif
