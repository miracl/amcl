/* Test and benchmark elliptic curve and RSA functions
	First build amcl.a from build_ec batch file
	gcc -O3 benchtest_ec.c amcl.a -o benchtest_ec.exe
*/

#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#include "amcl.h"

#define MIN_TIME 10.0
#define MIN_ITERS 10 

/* generate an RSA key pair */

void rsa_key_pair(csprng *RNG,sign32 e,rsa_private_key *PRIV,rsa_public_key *PUB)
{ /* IEEE1363 A16.11/A16.12 more or less */
    BIG t[HFLEN],p1[HFLEN],q1[HFLEN];
    
	for (;;)
	{

		FF_random(PRIV->p,RNG,HFLEN);
		while (FF_lastbits(PRIV->p,2)!=3) FF_inc(PRIV->p,1,HFLEN);
		while (!FF_prime(PRIV->p,RNG,HFLEN))
			FF_inc(PRIV->p,4,HFLEN);
		
		FF_copy(p1,PRIV->p,HFLEN);
		FF_dec(p1,1,HFLEN);

		if (FF_cfactor(p1,e,HFLEN)) continue;
		break;
	}

	for (;;)
	{
		FF_random(PRIV->q,RNG,HFLEN);
		while (FF_lastbits(PRIV->q,2)!=3) FF_inc(PRIV->q,1,HFLEN);
		while (!FF_prime(PRIV->q,RNG,HFLEN))
			FF_inc(PRIV->q,4,HFLEN);

		FF_copy(q1,PRIV->q,HFLEN);	
		FF_dec(q1,1,HFLEN);
		if (FF_cfactor(q1,e,HFLEN)) continue;

		break;
	}

	FF_mul(PUB->n,PRIV->p,PRIV->q,HFLEN);
	PUB->e=e;

	FF_copy(t,p1,HFLEN);
	FF_shr(t,HFLEN);
	FF_init(PRIV->dp,e,HFLEN);
	FF_invmodp(PRIV->dp,PRIV->dp,t,HFLEN);
	if (FF_parity(PRIV->dp)==0) FF_add(PRIV->dp,PRIV->dp,t,HFLEN);
	FF_norm(PRIV->dp,HFLEN);

	FF_copy(t,q1,HFLEN);
	FF_shr(t,HFLEN);
	FF_init(PRIV->dq,e,HFLEN);
	FF_invmodp(PRIV->dq,PRIV->dq,t,HFLEN);
	if (FF_parity(PRIV->dq)==0) FF_add(PRIV->dq,PRIV->dq,t,HFLEN);
	FF_norm(PRIV->dq,HFLEN);

	FF_invmodp(PRIV->c,PRIV->p,PRIV->q,HFLEN);

	return;
}

/* RSA decryption with the private key */
void rsa_decrypt(rsa_private_key *PRIV,BIG g[])
{
	BIG t[FFLEN],jp[HFLEN],jq[HFLEN];
	
	FF_dmod(jp,g,PRIV->p,HFLEN);
	FF_dmod(jq,g,PRIV->q,HFLEN);

	FF_skpow(jp,jp,PRIV->dp,PRIV->p,HFLEN);
	FF_skpow(jq,jq,PRIV->dq,PRIV->q,HFLEN);


	FF_zero(g,FFLEN);
	FF_copy(g,jp,HFLEN);
	FF_mod(jp,PRIV->q,HFLEN);
	if (FF_comp(jp,jq,HFLEN)>0)
		FF_add(jq,jq,PRIV->q,HFLEN);
	FF_sub(jq,jq,jp,HFLEN);
	FF_norm(jq,HFLEN);

	FF_mul(t,PRIV->c,jq,HFLEN);
	FF_dmod(jq,t,PRIV->q,HFLEN);

	FF_mul(t,jq,PRIV->p,HFLEN);
	FF_add(g,t,g,FFLEN);
	FF_norm(g,FFLEN);

	return;
}

int main()
{
    csprng RNG;
	BIG s,r,x,y;
	ECP P,G;
	FP12 g;
    int i,iterations;
    clock_t start;
    double elapsed;
	char pr[10];
	unsigned long ran;
    rsa_public_key pub;
    rsa_private_key priv;
	BIG plain[FFLEN],cipher[FFLEN],clone[FFLEN];

#if CHOICE==NIST256 
	printf("NIST256 Curve\n");
#endif
#if CHOICE==C25519 
	printf("C25519 Curve\n");
#endif
#if CHOICE==BRAINPOOL
	printf("BRAINPOOL Curve\n");
#endif
#if CHOICE==ANSSI
	printf("ANSSI Curve\n");
#endif
#if CHOICE==MF254
	printf("MF254 Curve\n");
#endif
#if CHOICE==MS255
	printf("MS255 Curve\n");
#endif
#if CHOICE==MF256
	printf("MF256 Curve\n");
#endif
#if CHOICE==MS256
	printf("MS256 Curve\n");
#endif
#if CHOICE==HIFIVE
	printf("HIFIVE Curve\n");
#endif
#if CHOICE==GOLDILOCKS
	printf("GOLDILOCKS Curve\n");
#endif
#if CHOICE==NIST384
	printf("NIST384 Curve\n");
#endif
#if CHOICE==C41417
	printf("C41417 Curve\n");
#endif
#if CHOICE==NIST521
	printf("NIST521 Curve\n");
#endif

#if CHOICE==BN254
	printf("BN254 Curve\n");
#endif
#if CHOICE==BN454
	printf("BN454 Curve\n");	
#endif
#if CHOICE==BN646
	printf("BN646 Curve\n");	
#endif

#if CHOICE==BN254_CX 
	printf("BN254_CX Curve\n");	
#endif
#if CHOICE==BN254_T
	printf("BN254_T Curve\n");	
#endif	
#if CHOICE==BN254_T2 
	printf("BN254_T2 Curve\n");	
#endif
#if CHOICE==BLS455 
	printf("BLS455 Curve\n");	
#endif

#if CURVETYPE==WEIERSTRASS
	printf("Weierstrass parameterization\n");
#endif
#if CURVETYPE==EDWARDS
	printf("Edwards parameterization\n");
#endif
#if CURVETYPE==MONTGOMERY
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

	BIG_rcopy(x,CURVE_Gx);
#if CURVETYPE!=MONTGOMERY
	BIG_rcopy(y,CURVE_Gy);
    ECP_set(&G,x,y);
#else
    ECP_set(&G,x);
#endif
	
	BIG_rcopy(r,CURVE_Order);
	BIG_randomnum(s,r,&RNG);
	ECP_copy(&P,&G);
    ECP_mul(&P,r);

	if (!ECP_isinf(&P))
	{
		printf("FAILURE - rG!=O\n");
		return 0;
	}

	iterations=0;
    start=clock();
    do {
		ECP_copy(&P,&G);
		ECP_mul(&P,s);

		iterations++;
		elapsed=(clock()-start)/(double)CLOCKS_PER_SEC;
    } while (elapsed<MIN_TIME || iterations<MIN_ITERS);
    elapsed=1000.0*elapsed/iterations;
    printf("EC  mul - %8d iterations  ",iterations);
    printf(" %8.2lf ms per iteration\n",elapsed);
	
	printf("Generating %d-bit RSA public/private key pair\n",FFLEN*BIGBITS);

	iterations=0;
    start=clock();
    do {
		rsa_key_pair(&RNG,65537,&priv,&pub);
		iterations++;
		elapsed=(clock()-start)/(double)CLOCKS_PER_SEC;
    } while (elapsed<MIN_TIME || iterations<MIN_ITERS);
    elapsed=1000.0*elapsed/iterations;
    printf("RSA gen - %8d iterations  ",iterations);
    printf(" %8.2lf ms per iteration\n",elapsed);

    FF_randomnum(plain,pub.n,&RNG,FFLEN);

	iterations=0;
    start=clock();
    do {
		FF_power(cipher,plain,65537,pub.n,FFLEN);
		iterations++;
		elapsed=(clock()-start)/(double)CLOCKS_PER_SEC;
    } while (elapsed<MIN_TIME || iterations<MIN_ITERS);
    elapsed=1000.0*elapsed/iterations;
    printf("RSA enc - %8d iterations  ",iterations);
    printf(" %8.2lf ms per iteration\n",elapsed);

	FF_copy(clone,cipher,FFLEN);

	iterations=0;
    start=clock();
    do {
		FF_copy(cipher,clone,FFLEN);
		rsa_decrypt(&priv,cipher);
		iterations++;
		elapsed=(clock()-start)/(double)CLOCKS_PER_SEC;
    } while (elapsed<MIN_TIME || iterations<MIN_ITERS);
    elapsed=1000.0*elapsed/iterations;
    printf("RSA dec - %8d iterations  ",iterations);
    printf(" %8.2lf ms per iteration\n",elapsed);

	if (FF_comp(plain,cipher,FFLEN)!=0)
	{
		printf("FAILURE - RSA decryption\n");
		return 0;
	}

	printf("All tests pass\n");

	return 0;
}
