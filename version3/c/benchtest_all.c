/* Test and benchmark elliptic curve and RSA functions
	First build amcl.a from build_ec batch file
	gcc -O3 benchtest_ec.c amcl.a -o benchtest_ec.exe
*/

#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#include "rsa_2048.h"
#include "ecp_ED25519.h"
#include "pair_BN254.h"

#define MIN_TIME 10.0
#define MIN_ITERS 10 

int main()
{
    csprng RNG;
	BIG_256 s,r,x,y;
	ECP_ED25519 EP,EG;
	ECP_BN254 P,G;
	ECP2_BN254 Q,W;
	FP12_BN254 g,w;
	FP4_BN254 cm;
	FP2_BN254 wx,wy;
    int i,iterations;
    clock_t start;
    double elapsed;
	char pr[10];
	unsigned long ran;
    rsa_public_key_2048 pub;
    rsa_private_key_2048 priv;
    char m[RFS_2048],d[RFS_2048],c[RFS_2048];
    octet M= {0,sizeof(m),m};
    octet D= {0,sizeof(d),d};
    octet C= {0,sizeof(c),c};

	printf("Testing/Timing ED25519 ECC\n");

#if CURVETYPE_ED25519==WEIERSTRASS
	printf("Weierstrass parameterization\n");
#endif
#if CURVETYPE_ED25519==EDWARDS
	printf("Edwards parameterization\n");
#endif
#if CURVETYPE_ED25519==MONTGOMERY
	printf("Montgomery parameterization\n");
#endif

#if CHUNK==16
	printf("16-bit Build\n");
#endif
#if CHUNK==32
	printf("32-bit Build\n");
#endif
#if CHUNK==64
	printf("64-bit Build\n");
#endif

	time((time_t *)&ran);
	pr[0]=ran;
	pr[1]=ran>>8;
	pr[2]=ran>>16;
	pr[3]=ran>>24;
	for (i=4;i<10;i++) pr[i]=i;
    RAND_seed(&RNG,10,pr);

	BIG_256_rcopy(x,CURVE_Gx_ED25519);
#if CURVETYPE_ED25519!=MONTGOMERY
	BIG_256_rcopy(y,CURVE_Gy_ED25519);
    ECP_ED25519_set(&EG,x,y);
#else
    ECP_ED25519_set(&EG,x);
#endif
	
	BIG_256_rcopy(r,CURVE_Order_ED25519);
	BIG_256_randomnum(s,r,&RNG);
	ECP_ED25519_copy(&EP,&EG);
    ECP_ED25519_mul(&EP,r);

	if (!ECP_ED25519_isinf(&EP))
	{
		printf("FAILURE - rG!=O\n");
		return 0;
	}

	iterations=0;
    start=clock();
    do {
		ECP_ED25519_copy(&EP,&EG);
		ECP_ED25519_mul(&EP,s);

		iterations++;
		elapsed=(clock()-start)/(double)CLOCKS_PER_SEC;
    } while (elapsed<MIN_TIME || iterations<MIN_ITERS);
    elapsed=1000.0*elapsed/iterations;
    printf("EC  mul - %8d iterations  ",iterations);
    printf(" %8.2lf ms per iteration\n",elapsed);
	


	printf("\nTesting/Timing BN254 Pairings\n");

	BIG_256_rcopy(x,CURVE_Gx_BN254);

	BIG_256_rcopy(y,CURVE_Gy_BN254);
    ECP_BN254_set(&G,x,y);

	
	BIG_256_rcopy(r,CURVE_Order_BN254);
	BIG_256_randomnum(s,r,&RNG);
	ECP_BN254_copy(&P,&G);
    PAIR_BN254_G1mul(&P,r);

	if (!ECP_BN254_isinf(&P))
	{
		printf("FAILURE - rG!=O\n");
		return 0;
	}
	
	iterations=0;
    start=clock();
    do {
		ECP_BN254_copy(&P,&G);
		PAIR_BN254_G1mul(&P,s);

		iterations++;
		elapsed=(clock()-start)/(double)CLOCKS_PER_SEC;
    } while (elapsed<MIN_TIME || iterations<MIN_ITERS);
    elapsed=1000.0*elapsed/iterations;
    printf("G1 mul              - %8d iterations  ",iterations);
    printf(" %8.2lf ms per iteration\n",elapsed);

    
    BIG_256_rcopy(wx.a,CURVE_Pxa_BN254); FP_BN254_nres(wx.a);
    BIG_256_rcopy(wx.b,CURVE_Pxb_BN254); FP_BN254_nres(wx.b);
    BIG_256_rcopy(wy.a,CURVE_Pya_BN254); FP_BN254_nres(wy.a);
    BIG_256_rcopy(wy.b,CURVE_Pyb_BN254); FP_BN254_nres(wy.b);    
	ECP2_BN254_set(&W,&wx,&wy);

	ECP2_BN254_copy(&Q,&W);
    ECP2_BN254_mul(&Q,r);

	if (!ECP2_BN254_isinf(&Q))
	{
		printf("FAILURE - rQ!=O\n");
		return 0;
	}

	iterations=0;
    start=clock();
    do {
		ECP2_BN254_copy(&Q,&W);
		PAIR_BN254_G2mul(&Q,s);

		iterations++;
		elapsed=(clock()-start)/(double)CLOCKS_PER_SEC;
    } while (elapsed<MIN_TIME || iterations<MIN_ITERS);
    elapsed=1000.0*elapsed/iterations;
    printf("G2 mul              - %8d iterations  ",iterations);
    printf(" %8.2lf ms per iteration\n",elapsed);

	PAIR_BN254_ate(&w,&Q,&P);
	PAIR_BN254_fexp(&w);

	FP12_BN254_copy(&g,&w);

	PAIR_BN254_GTpow(&g,r);

	if (!FP12_BN254_isunity(&g))
	{
		printf("FAILURE - g^r!=1\n");
		return 0;
	}

	iterations=0;
    start=clock();
    do {
		FP12_BN254_copy(&g,&w);
		PAIR_BN254_GTpow(&g,s);

		iterations++;
		elapsed=(clock()-start)/(double)CLOCKS_PER_SEC;
    } while (elapsed<MIN_TIME || iterations<MIN_ITERS);
    elapsed=1000.0*elapsed/iterations;
    printf("GT pow              - %8d iterations  ",iterations);
    printf(" %8.2lf ms per iteration\n",elapsed);

	FP12_BN254_copy(&g,&w);

	iterations=0;
    start=clock();
    do {
		FP12_BN254_compow(&cm,&g,s,r);
		iterations++;
		elapsed=(clock()-start)/(double)CLOCKS_PER_SEC;
    } while (elapsed<MIN_TIME || iterations<MIN_ITERS);
    elapsed=1000.0*elapsed/iterations;
    printf("GT pow (compressed) - %8d iterations  ",iterations);
    printf(" %8.2lf ms per iteration\n",elapsed);

	iterations=0;
    start=clock();
    do {
		PAIR_BN254_ate(&w,&Q,&P);
		iterations++;
		elapsed=(clock()-start)/(double)CLOCKS_PER_SEC;
    } while (elapsed<MIN_TIME || iterations<MIN_ITERS);
    elapsed=1000.0*elapsed/iterations;
    printf("PAIRing ATE         - %8d iterations  ",iterations);
    printf(" %8.2lf ms per iteration\n",elapsed);

	iterations=0;
    start=clock();
    do {
		FP12_BN254_copy(&g,&w);
		PAIR_BN254_fexp(&g);
		iterations++;
		elapsed=(clock()-start)/(double)CLOCKS_PER_SEC;
    } while (elapsed<MIN_TIME || iterations<MIN_ITERS);
    elapsed=1000.0*elapsed/iterations;
    printf("PAIRing FEXP        - %8d iterations  ",iterations);
    printf(" %8.2lf ms per iteration\n",elapsed);

	ECP_BN254_copy(&P,&G);	
	ECP2_BN254_copy(&Q,&W);

	PAIR_BN254_G1mul(&P,s);
	PAIR_BN254_ate(&g,&Q,&P);
	PAIR_BN254_fexp(&g);

	ECP_BN254_copy(&P,&G);

	PAIR_BN254_G2mul(&Q,s);
	PAIR_BN254_ate(&w,&Q,&P);
	PAIR_BN254_fexp(&w);

	if (!FP12_BN254_equals(&g,&w))
	{
		printf("FAILURE - e(sQ,p)!=e(Q,sP) \n");
		return 0;
	}

	ECP2_BN254_copy(&Q,&W);
	PAIR_BN254_ate(&g,&Q,&P);
	PAIR_BN254_fexp(&g);

	PAIR_BN254_GTpow(&g,s);

	if (!FP12_BN254_equals(&g,&w))
	{
		printf("FAILURE - e(sQ,p)!=e(Q,P)^s \n");
		return 0;
	}



	printf("\nTesting/Timing 2048-bit RSA\n");

	printf("Generating 2048-bit RSA public/private key pair\n");

	iterations=0;
    start=clock();
    do {
		RSA_2048_KEY_PAIR(&RNG,65537,&priv,&pub,NULL,NULL);
		iterations++;
		elapsed=(clock()-start)/(double)CLOCKS_PER_SEC;
    } while (elapsed<MIN_TIME || iterations<MIN_ITERS);
    elapsed=1000.0*elapsed/iterations;
    printf("RSA gen - %8d iterations  ",iterations);
    printf(" %8.2lf ms per iteration\n",elapsed);

	M.len=RFS_2048;
	for (i=0;i<RFS_2048;i++) M.val[i]=i%128;

	iterations=0;
    start=clock();
    do {
		RSA_2048_ENCRYPT(&pub,&M,&C);
		iterations++;
		elapsed=(clock()-start)/(double)CLOCKS_PER_SEC;
    } while (elapsed<MIN_TIME || iterations<MIN_ITERS);
    elapsed=1000.0*elapsed/iterations;
    printf("RSA enc - %8d iterations  ",iterations);
    printf(" %8.2lf ms per iteration\n",elapsed);

	iterations=0;
    start=clock();
    do {
		RSA_2048_DECRYPT(&priv,&C,&D);
		iterations++;
		elapsed=(clock()-start)/(double)CLOCKS_PER_SEC;
    } while (elapsed<MIN_TIME || iterations<MIN_ITERS);
    elapsed=1000.0*elapsed/iterations;
    printf("RSA dec - %8d iterations  ",iterations);
    printf(" %8.2lf ms per iteration\n",elapsed);

	for (i=0;i<RFS_2048;i++)
	{
		if (M.val[i]!=D.val[i])
		{
			printf("FAILURE - RSA decryption\n");
			return 0;
		}
	}

	printf("All tests pass\n");

	return 0;
}
