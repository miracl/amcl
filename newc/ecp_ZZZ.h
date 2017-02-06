#ifndef ECP_ZZZ_H
#define ECP_ZZZ_H

#include "fp_YYY.h"
#include "config_curve_ZZZ.h"

/* Curve Params - see rom_zzz.c */
extern const int CURVE_A_ZZZ;     /**< Elliptic curve A parameter */
extern const BIG_XXX CURVE_B_ZZZ;     /**< Elliptic curve B parameter */
extern const BIG_XXX CURVE_Order_ZZZ; /**< Elliptic curve group order */
extern const BIG_XXX CURVE_Cof_ZZZ;   /**< Elliptic curve cofactor */

/* Generator point on G1 */
extern const BIG_XXX CURVE_Gx_ZZZ; /**< x-coordinate of generator point in group G1  */
extern const BIG_XXX CURVE_Gy_ZZZ; /**< y-coordinate of generator point in group G1  */


/* For Pairings only */

/* Generator point on G2 */
extern const BIG_XXX CURVE_Pxa_ZZZ; /**< real part of x-coordinate of generator point in group G2 */
extern const BIG_XXX CURVE_Pxb_ZZZ; /**< imaginary part of x-coordinate of generator point in group G2 */
extern const BIG_XXX CURVE_Pya_ZZZ; /**< real part of y-coordinate of generator point in group G2 */
extern const BIG_XXX CURVE_Pyb_ZZZ; /**< imaginary part of y-coordinate of generator point in group G2 */

extern const BIG_XXX CURVE_Bnx_ZZZ; /**< BN curve x parameter */

extern const BIG_XXX CURVE_Cru_ZZZ; /**< BN curve Cube Root of Unity */

extern const BIG_XXX CURVE_Fra_ZZZ; /**< real part of BN curve Frobenius Constant */
extern const BIG_XXX CURVE_Frb_ZZZ; /**< imaginary part of BN curve Frobenius Constant */


extern const BIG_XXX CURVE_W_ZZZ[2];	 /**< BN curve constant for GLV decomposition */
extern const BIG_XXX CURVE_SB_ZZZ[2][2]; /**< BN curve constant for GLV decomposition */
extern const BIG_XXX CURVE_WB_ZZZ[4];	 /**< BN curve constant for GS decomposition */
extern const BIG_XXX CURVE_BB_ZZZ[4][4]; /**< BN curve constant for GS decomposition */


/**
	@brief ECP structure - Elliptic Curve Point over base field
*/

typedef struct
{
#if CURVETYPE_ZZZ!=EDWARDS
    int inf; /**< Infinity Flag - not needed for Edwards representation */
#endif
    BIG_XXX x; /**< x-coordinate of point */
#if CURVETYPE_ZZZ!=MONTGOMERY
    BIG_XXX y; /**< y-coordinate of point. Not needed for Montgomery representation */
#endif
    BIG_XXX z;/**< z-coordinate of point */
} ECP_ZZZ;


/* ECP E(Fp) prototypes */
/**	@brief Tests for ECP point equal to infinity
 *
	@param P ECP point to be tested
	@return 1 if infinity, else returns 0
 */
extern int ECP_ZZZ_isinf(ECP_ZZZ *P);
/**	@brief Tests for equality of two ECPs
 *
	@param P ECP instance to be compared
	@param Q ECP instance to be compared
	@return 1 if P=Q, else returns 0
 */
extern int ECP_ZZZ_equals(ECP_ZZZ *P,ECP_ZZZ *Q);
/**	@brief Copy ECP point to another ECP point
 *
	@param P ECP instance, on exit = Q
	@param Q ECP instance to be copied
 */
extern void ECP_ZZZ_copy(ECP_ZZZ *P,ECP_ZZZ *Q);
/**	@brief Negation of an ECP point
 *
	@param P ECP instance, on exit = -P
 */
extern void ECP_ZZZ_neg(ECP_ZZZ *P);
/**	@brief Set ECP to point-at-infinity
 *
	@param P ECP instance to be set to infinity
 */
extern void ECP_ZZZ_inf(ECP_ZZZ *P);
/**	@brief Calculate Right Hand Side of curve equation y^2=f(x)
 *
	Function f(x) depends on form of elliptic curve, Weierstrass, Edwards or Montgomery.
	Used internally.
	@param r BIG n-residue value of f(x)
	@param x BIG n-residue x
 */
extern void ECP_ZZZ_rhs(BIG_XXX r,BIG_XXX x);
/**	@brief Set ECP to point(x,y) given just x and sign of y
 *
	Point P set to infinity if no such point on the curve. If x is on the curve then y is calculated from the curve equation.
	The correct y value (plus or minus) is selected given its sign s.
	@param P ECP instance to be set (x,[y])
	@param x BIG x coordinate of point
	@param s an integer representing the "sign" of y, in fact its least significant bit.
 */
extern int ECP_ZZZ_setx(ECP_ZZZ *P,BIG_XXX x,int s);

#if CURVETYPE_ZZZ==MONTGOMERY
/**	@brief Set ECP to point(x,[y]) given x
 *
	Point P set to infinity if no such point on the curve. Note that y coordinate is not needed.
	@param P ECP instance to be set (x,[y])
	@param x BIG x coordinate of point
	@return 1 if point exists, else 0
 */
extern int ECP_ZZZ_set(ECP_ZZZ *P,BIG_XXX x);
/**	@brief Extract x coordinate of an ECP point P
 *
	@param x BIG on exit = x coordinate of point
	@param P ECP instance (x,[y])
	@return -1 if P is point-at-infinity, else 0
 */
extern int ECP_ZZZ_get(BIG_XXX x,ECP_ZZZ *P);
/**	@brief Adds ECP instance Q to ECP instance P, given difference D=P-Q
 *
	Differential addition of points on a Montgomery curve
	@param P ECP instance, on exit =P+Q
	@param Q ECP instance to be added to P
	@param D Difference between P and Q
 */
extern void ECP_ZZZ_add(ECP_ZZZ *P,ECP_ZZZ *Q,ECP_ZZZ *D);
#else
/**	@brief Set ECP to point(x,y) given x and y
 *
	Point P set to infinity if no such point on the curve.
	@param P ECP instance to be set (x,y)
	@param x BIG x coordinate of point
	@param y BIG y coordinate of point
	@return 1 if point exists, else 0
 */
extern int ECP_ZZZ_set(ECP_ZZZ *P,BIG_XXX x,BIG_XXX y);
/**	@brief Extract x and y coordinates of an ECP point P
 *
	If x=y, returns only x
	@param x BIG on exit = x coordinate of point
	@param y BIG on exit = y coordinate of point (unless x=y)
	@param P ECP instance (x,y)
	@return sign of y, or -1 if P is point-at-infinity
 */
extern int ECP_ZZZ_get(BIG_XXX x,BIG_XXX y,ECP_ZZZ *P);
/**	@brief Adds ECP instance Q to ECP instance P
 *
	@param P ECP instance, on exit =P+Q
	@param Q ECP instance to be added to P
 */
extern void ECP_ZZZ_add(ECP_ZZZ *P,ECP_ZZZ *Q);
/**	@brief Subtracts ECP instance Q from ECP instance P
 *
	@param P ECP instance, on exit =P-Q
	@param Q ECP instance to be subtracted from P
 */
extern void ECP_ZZZ_sub(ECP_ZZZ *P,ECP_ZZZ *Q);
#endif
/**	@brief Converts an ECP point from Projective (x,y,z) coordinates to affine (x,y) coordinates
 *
	@param P ECP instance to be converted to affine form
 */
extern void ECP_ZZZ_affine(ECP_ZZZ *P);
/**	@brief Formats and outputs an ECP point to the console, in projective coordinates
 *
	@param P ECP instance to be printed
 */
extern void ECP_ZZZ_outputxyz(ECP_ZZZ *P);
/**	@brief Formats and outputs an ECP point to the console, converted to affine coordinates
 *
	@param P ECP instance to be printed
 */
extern void ECP_ZZZ_output(ECP_ZZZ * P);
/**	@brief Formats and outputs an ECP point to an octet string
 *
	The octet string is created in the standard form 04|x|y, except for Montgomery curve in which case it is 06|x
	Here x (and y) are the x and y coordinates in big-endian base 256 form.
	@param S output octet string
	@param P ECP instance to be converted to an octet string
 */
extern void ECP_ZZZ_toOctet(octet *S,ECP_ZZZ *P);
/**	@brief Creates an ECP point from an octet string
 *
	The octet string is in the standard form 0x04|x|y, except for Montgomery curve in which case it is 0x06|x
	Here x (and y) are the x and y coordinates in left justified big-endian base 256 form.
	@param P ECP instance to be created from the octet string
	@param S input octet string
	return 1 if octet string corresponds to a point on the curve, else 0
 */
extern int ECP_ZZZ_fromOctet(ECP_ZZZ *P,octet *S);
/**	@brief Doubles an ECP instance P
 *
	@param P ECP instance, on exit =2*P
 */
extern void ECP_ZZZ_dbl(ECP_ZZZ *P);
/**	@brief Multiplies an ECP instance P by a small integer, side-channel resistant
 *
	@param P ECP instance, on exit =i*P
	@param i small integer multiplier
	@param b maximum number of bits in multiplier
 */
extern void ECP_ZZZ_pinmul(ECP_ZZZ *P,int i,int b);
/**	@brief Multiplies an ECP instance P by a BIG, side-channel resistant
 *
	Uses Montgomery ladder for Montgomery curves, otherwise fixed sized windows.
	@param P ECP instance, on exit =b*P
	@param b BIG number multiplier

 */
extern void ECP_ZZZ_mul(ECP_ZZZ *P,BIG_XXX b);
/**	@brief Calculates double multiplication P=e*P+f*Q, side-channel resistant
 *
	@param P ECP instance, on exit =e*P+f*Q
	@param Q ECP instance
	@param e BIG number multiplier
	@param f BIG number multiplier
 */
extern void ECP_ZZZ_mul2(ECP_ZZZ *P,ECP_ZZZ *Q,BIG_XXX e,BIG_XXX f);

#endif
