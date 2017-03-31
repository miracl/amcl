#ifndef FP_YYY_H
#define FP_YYY_H

#include "big_XXX.h"
#include "config_field_YYY.h"

/* Field Params - see rom.c */
extern const BIG_XXX Modulus_YYY;  /**< Actual Modulus set in romf_yyy.c */
extern const chunk MConst_YYY; /**< Montgomery only - 1/p mod 2^BASEBITS */


#define MODBITS_YYY MBITS_YYY
#define TBITS_YYY (MBITS_YYY%BASEBITS_XXX)                    /**< Number of active bits in top word */
#define TMASK_YYY (((chunk)1<<TBITS_YYY)-1)               /**< Mask for active bits in top word */
#define FEXCESS_YYY ((chunk)1<<(BASEBITS_XXX*NLEN_XXX-MBITS_YYY)) /**< 2^(BASEBITS*NLEN-MODBITS) - normalised BIG can be multiplied by more than this before reduction */
#define OMASK_YYY (-((chunk)(1)<<TBITS_YYY))              /**<  for masking out overflow bits */

/* catch field excesses */
#define EXCESS_YYY(a) ((a[NLEN_XXX-1]&OMASK_YYY)>>(TBITS_YYY)) /**< Field Excess */



/* FP prototypes */

/**	@brief Tests for BIG equal to zero mod Modulus
 *
	@param x BIG number to be tested
	@return 1 if zero, else returns 0
 */
extern int FP_YYY_iszilch(BIG_XXX x);
/**	@brief Converts from BIG integer to n-residue form mod Modulus
 *
	@param x BIG number to be converted
 */
extern void FP_YYY_nres(BIG_XXX x);
/**	@brief Converts from n-residue form back to BIG integer form
 *
	@param x BIG number to be converted
 */
extern void FP_YYY_redc(BIG_XXX x);
/**	@brief Sets BIG to representation of unity in n-residue form
 *
	@param x BIG number to be set equal to unity.
 */
extern void FP_YYY_one(BIG_XXX x);
/**	@brief Reduces DBIG to BIG exploiting special form of the modulus
 *
	This function comes in different flavours depending on the form of Modulus that is currently in use.
	@param r BIG number, on exit = d mod Modulus
	@param d DBIG number to be reduced
 */
extern void FP_YYY_mod(BIG_XXX r,DBIG_XXX d);
/**	@brief Fast Modular multiplication of two BIGs in n-residue form, mod Modulus
 *
	Uses appropriate fast modular reduction method
	@param x BIG number, on exit the modular product = y*z mod Modulus
	@param y BIG number, the multiplicand
	@param z BIG number, the multiplier
 */
extern void FP_YYY_mul(BIG_XXX x,BIG_XXX y,BIG_XXX z);
/**	@brief Fast Modular multiplication of a BIG in n-residue form, by a small integer, mod Modulus
 *
	@param x BIG number, on exit the modular product = y*i mod Modulus
	@param y BIG number, the multiplicand
	@param i a small number, the multiplier
 */
extern void FP_YYY_imul(BIG_XXX x,BIG_XXX y,int i);
/**	@brief Fast Modular squaring of a BIG in n-residue form, mod Modulus
 *
	Uses appropriate fast modular reduction method
	@param x BIG number, on exit the modular product = y^2 mod Modulus
	@param y BIG number, the number to be squared

 */
extern void FP_YYY_sqr(BIG_XXX x,BIG_XXX y);
/**	@brief Modular addition of two BIGs in n-residue form, mod Modulus
 *
	@param x BIG number, on exit the modular sum = y+z mod Modulus
	@param y BIG number
	@param z BIG number
 */
extern void FP_YYY_add(BIG_XXX x,BIG_XXX y,BIG_XXX z);
/**	@brief Modular subtraction of two BIGs in n-residue form, mod Modulus
 *
	@param x BIG number, on exit the modular difference = y-z mod Modulus
	@param y BIG number
	@param z BIG number
 */
extern void FP_YYY_sub(BIG_XXX x,BIG_XXX y,BIG_XXX z);
/**	@brief Modular division by 2 of a BIG in n-residue form, mod Modulus
 *
	@param x BIG number, on exit =y/2 mod Modulus
	@param y BIG number
 */
extern void FP_YYY_div2(BIG_XXX x,BIG_XXX y);
/**	@brief Fast Modular exponentiation of a BIG in n-residue form, to the power of a BIG, mod Modulus
 *
	@param x BIG number, on exit  = y^z mod Modulus
	@param y BIG number
	@param z Big number exponent
 */
extern void FP_YYY_pow(BIG_XXX x,BIG_XXX y,BIG_XXX z);
/**	@brief Fast Modular square root of a BIG in n-residue form, mod Modulus
 *
	@param x BIG number, on exit  = sqrt(y) mod Modulus
	@param y BIG number, the number whose square root is calculated

 */
extern void FP_YYY_sqrt(BIG_XXX x,BIG_XXX y);
/**	@brief Modular negation of a BIG in n-residue form, mod Modulus
 *
	@param x BIG number, on exit = -y mod Modulus
	@param y BIG number
 */
extern void FP_YYY_neg(BIG_XXX x,BIG_XXX y);
/**	@brief Outputs a BIG number that is in n-residue form to the console
 *
	Converts from n-residue form before output
	@param x a BIG number
 */
extern void FP_YYY_output(BIG_XXX x);
/**	@brief Outputs a BIG number that is in n-residue form to the console, in raw form
 *
	Converts from n-residue form before output
	@param x a BIG number
 */
extern void FP_YYY_rawoutput(BIG_XXX x);
/**	@brief Reduces possibly unreduced BIG mod Modulus
 *
	@param x BIG number, on exit reduced mod Modulus
 */
extern void FP_YYY_reduce(BIG_XXX x);
/**	@brief Tests for BIG a quadratic residue mod Modulus
 *
	@param x BIG number to be tested
	@return 1 if quadratic residue, else returns 0 if quadratic non-residue
 */
extern int FP_YYY_qr(BIG_XXX x);
/**	@brief Modular inverse of a BIG in n-residue form, mod Modulus
 *
	@param x BIG number, on exit = 1/y mod Modulus
	@param y BIG number
 */
extern void FP_YYY_inv(BIG_XXX x,BIG_XXX y);




#endif
