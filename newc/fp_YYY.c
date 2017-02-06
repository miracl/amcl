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

/* AMCL mod p functions */
/* Small Finite Field arithmetic */
/* SU=m, SU is Stack Usage (NOT_SPECIAL Modulus) */

#include "fp_YYY.h"

/* Fast Modular Reduction Methods */

/* r=d mod m */
/* d MUST be normalised */
/* Products must be less than pR in all cases !!! */
/* So when multiplying two numbers, their product *must* be less than MODBITS+BASEBITS*NLEN */
/* Results *may* be one bit bigger than MODBITS */

#if MODTYPE_YYY == PSEUDO_MERSENNE
/* r=d mod m */

/* Converts from BIG integer to n-residue form mod Modulus */
void FP_YYY_nres(BIG_XXX a)
{
    BIG_XXX tmp;
    BIG_XXX_rcopy(tmp,a);
}

/* Converts from n-residue form back to BIG integer form */
void FP_YYY_redc(BIG_XXX a)
{
    BIG_XXX tmp;
    BIG_XXX_rcopy(tmp,a);
}

/* reduce a DBIG to a BIG exploiting the special form of the modulus */
void FP_YYY_mod(BIG_XXX r,DBIG_XXX d)
{
    BIG_XXX t,b;
    chunk v,tw;
    BIG_XXX_split(t,b,d,MODBITS_YYY);

    /* Note that all of the excess gets pushed into t. So if squaring a value with a 4-bit excess, this results in
       t getting all 8 bits of the excess product! So products must be less than pR which is Montgomery compatible */

    if (MConst_YYY < NEXCESS_XXX)
    {
        BIG_XXX_imul(t,t,MConst_YYY);

        BIG_XXX_norm(t);
        tw=t[NLEN_XXX-1];
        t[NLEN_XXX-1]&=TMASK_YYY;
        t[0]+=MConst_YYY*((tw>>TBITS_YYY));
    }
    else
    {
        v=BIG_XXX_pmul(t,t,MConst_YYY);
        tw=t[NLEN_XXX-1];
        t[NLEN_XXX-1]&=TMASK_YYY;
#if CHUNK == 16
        t[1]+=muladd_XXX(MConst_YYY,((tw>>TBITS_YYY)+(v<<(BASEBITS_XXX-TBITS_YYY))),0,&t[0]);
#else
        t[0]+=MConst_YYY*((tw>>TBITS_YYY)+(v<<(BASEBITS_XXX-TBITS_YYY)));
#endif
    }
    BIG_XXX_add(r,t,b);
    BIG_XXX_norm(r);
}
#endif

/* This only applies to Curve C448, so specialised (for now) */
#if MODTYPE_YYY == GENERALISED_MERSENNE

/* Converts from BIG integer to n-residue form mod Modulus */
void FP_YYY_nres(BIG_XXX a)
{
    BIG_XXX tmp;
    BIG_XXX_rcopy(tmp,a);
}

/* Converts from n-residue form back to BIG integer form */
void FP_YYY_redc(BIG_XXX a)
{
    BIG_XXX tmp;
    BIG_XXX_rcopy(tmp,a);
}

/* reduce a DBIG to a BIG exploiting the special form of the modulus */
void FP_YYY_mod(BIG_XXX r,DBIG_XXX d)
{
    BIG_XXX t,b;
    chunk carry;
    BIG_XXX_split(t,b,d,MBITS_YYY);

    BIG_XXX_add(r,t,b);

    BIG_XXX_dscopy(d,t);
    BIG_XXX_dshl(d,MBITS_YYY/2);

    BIG_XXX_split(t,b,d,MBITS_YYY);

    BIG_XXX_add(r,r,t);
    BIG_XXX_add(r,r,b);
    BIG_XXX_norm(r);
    BIG_XXX_shl(t,MBITS_YYY/2);

    BIG_XXX_add(r,r,t);

    carry=r[NLEN_XXX-1]>>TBITS_YYY;

    r[NLEN_XXX-1]&=TMASK_YYY;
    r[0]+=carry;

    r[224/BASEBITS_XXX]+=carry<<(224%BASEBITS_XXX); /* need to check that this falls mid-word */
    BIG_XXX_norm(r);

}

#endif

#if MODTYPE_YYY == MONTGOMERY_FRIENDLY

/* convert to Montgomery n-residue form */
void FP_YYY_nres(BIG_XXX a)
{
    DBIG_XXX d;
    BIG_XXX m;
    BIG_XXX_rcopy(m,Modulus_YYY);
    BIG_XXX_dscopy(d,a);
    BIG_XXX_dshl(d,NLEN_XXX*BASEBITS_XXX);
    BIG_XXX_dmod(a,d,m);
}

/* convert back to regular form */
void FP_YYY_redc(BIG_XXX a)
{
    DBIG_XXX d;
    BIG_XXX_dzero(d);
    BIG_XXX_dscopy(d,a);
    FP_YYY_mod(a,d);
}

/* fast modular reduction from DBIG to BIG exploiting special form of the modulus */
void FP_YYY_mod(BIG_XXX a,DBIG_XXX d)
{
    int i;

    for (i=0; i<NLEN_XXX; i++)
        d[NLEN_XXX+i]+=muladd_XXX(d[i],MConst_YYY-1,d[i],&d[NLEN_XXX+i-1]);

    BIG_XXX_sducopy(a,d);
    BIG_XXX_norm(a);
}

#endif

#if MODTYPE_YYY == NOT_SPECIAL

/* convert BIG a to Montgomery n-residue form */
/* SU= 120 */
void FP_YYY_nres(BIG_XXX a)
{
    DBIG_XXX d;
    BIG_XXX m;
    BIG_XXX_rcopy(m,Modulus_YYY);
    BIG_XXX_dscopy(d,a);
    BIG_XXX_dshl(d,NLEN_XXX*BASEBITS_XXX);
    BIG_XXX_dmod(a,d,m);
}

/* SU= 80 */
/* convert back to regular form */
void FP_YYY_redc(BIG_XXX a)
{
    DBIG_XXX d;
    BIG_XXX_dzero(d);
    BIG_XXX_dscopy(d,a);
    FP_YYY_mod(a,d);
}

/* reduce a DBIG to a BIG using Montgomery's no trial division method */
/* d is expected to be dnormed before entry */
/* SU= 112 */
void FP_YYY_mod(BIG_XXX a,DBIG_XXX d)
{
    int i,k;
    BIG_XXX md;

#ifdef dchunk
    dchunk t,c,s;
    dchunk dd[NLEN_XXX];
    chunk v[NLEN_XXX];
#endif

    BIG_XXX_rcopy(md,Modulus_YYY);

#ifdef COMBA

#ifdef UNWOUND

    /* Insert output of faster.c here */

#else

    t=d[0];
    v[0]=((chunk)t*MConst_YYY)&BMASK_XXX;
    t+=(dchunk)v[0]*md[0];
    c=(t>>BASEBITS_XXX)+d[1];
    s=0;

    for (k=1; k<NLEN_XXX; k++)
    {
        t=c+s+(dchunk)v[0]*md[k];
        for (i=k-1; i>k/2; i--) t+=(dchunk)(v[k-i]-v[i])*(md[i]-md[k-i]);
        v[k]=((chunk)t*MConst_YYY)&BMASK_XXX;
        t+=(dchunk)v[k]*md[0];
        c=(t>>BASEBITS_XXX)+d[k+1];
        dd[k]=(dchunk)v[k]*md[k];
        s+=dd[k];
    }
    for (k=NLEN_XXX; k<2*NLEN_XXX-1; k++)
    {
        t=c+s;
        for (i=NLEN_XXX-1; i>=1+k/2; i--) t+=(dchunk)(v[k-i]-v[i])*(md[i]-md[k-i]);
        a[k-NLEN_XXX]=(chunk)t&BMASK_XXX;
        c=(t>>BASEBITS_XXX)+d[k+1];
        s-=dd[k-NLEN_XXX+1];
    }
    a[NLEN_XXX-1]=(chunk)c&BMASK_XXX;

#endif

#ifdef DEBUG_NORM
    a[NLEN_XXX]=0;
#endif

#else
    int j;
    chunk m,carry;
    for (i=0; i<NLEN_XXX; i++)
    {
        if (MConst_YYY==-1) m=(-d[i])&BMASK_XXX;
        else
        {
            if (MConst_YYY==1) m=d[i];
            else m=(MConst_YYY*d[i])&BMASK_XXX;
        }
        carry=0;
        for (j=0; j<NLEN_XXX; j++)
            carry=muladd_XXX(m,md[j],carry,&d[i+j]);
        d[NLEN_XXX+i]+=carry;
    }
    BIG_XXX_sducopy(a,d);
    BIG_XXX_norm(a);

#endif
}

#endif

/* test x==0 ? */
/* SU= 48 */
int FP_YYY_iszilch(BIG_XXX x)
{
    BIG_XXX m;
    BIG_XXX_rcopy(m,Modulus_YYY);
    BIG_XXX_mod(x,m);
    return BIG_XXX_iszilch(x);
}

/* output FP */
/* SU= 48 */
void FP_YYY_output(BIG_XXX r)
{
    BIG_XXX c;
    BIG_XXX_copy(c,r);
    FP_YYY_redc(c);
    BIG_XXX_output(c);
}

void FP_YYY_rawoutput(BIG_XXX r)
{
    BIG_XXX_rawoutput(r);
}

#ifdef GET_STATS
int tsqr=0,rsqr=0,tmul=0,rmul=0;
int tadd=0,radd=0,tneg=0,rneg=0;
int tdadd=0,rdadd=0,tdneg=0,rdneg=0;
#endif

/* r=a*b mod Modulus */
/* product must be less that p.R - and we need to know this in advance! */
/* SU= 88 */
void FP_YYY_mul(BIG_XXX r,BIG_XXX a,BIG_XXX b)
{
    DBIG_XXX d;
    chunk ea,eb;
    BIG_XXX_norm(a);
    BIG_XXX_norm(b);
    ea=EXCESS_YYY(a);
    eb=EXCESS_YYY(b);

#ifdef dchunk
    if ((dchunk)(ea+1)*(eb+1)>(dchunk)FEXCESS_YYY)
#else
    if ((ea+1)>FEXCESS_YYY/(eb+1))
#endif
    {
#ifdef DEBUG_REDUCE
        printf("Product too large - reducing it %d %d %d\n",ea,eb,FEXCESS_YYY);
#endif
        FP_YYY_reduce(a);  /* it is sufficient to fully reduce just one of them < p */
#ifdef GET_STATS
        rmul++;
    }

    tmul++;
#else
    }
#endif

    BIG_XXX_mul(d,a,b);
    FP_YYY_mod(r,d);
}

/* multiplication by an integer, r=a*c */
/* SU= 136 */
void FP_YYY_imul(BIG_XXX r,BIG_XXX a,int c)
{
    DBIG_XXX d;
    BIG_XXX m;
    int s=0;
    chunk afx;
    BIG_XXX_norm(a);
    if (c<0)
    {
        c=-c;
        s=1;
    }
    afx=(EXCESS_YYY(a)+1)*(c+1)+1;
    if (c<NEXCESS_XXX && afx<FEXCESS_YYY)
        BIG_XXX_imul(r,a,c);
    else
    {
        if (afx<FEXCESS_YYY)
        {
            BIG_XXX_pmul(r,a,c);
        }
        else
        {
            BIG_XXX_rcopy(m,Modulus_YYY);
            BIG_XXX_pxmul(d,a,c);
            BIG_XXX_dmod(r,d,m);
        }
    }
    if (s) FP_YYY_neg(r,r);
    BIG_XXX_norm(r);
}

/* Set r=a^2 mod m */
/* SU= 88 */
void FP_YYY_sqr(BIG_XXX r,BIG_XXX a)
{
    DBIG_XXX d;
    chunk ea;
    BIG_XXX_norm(a);
    ea=EXCESS_YYY(a);
#ifdef dchunk
    if ((dchunk)(ea+1)*(ea+1)>(dchunk)FEXCESS_YYY)
#else
    if ((ea+1)>FEXCESS_YYY/(ea+1))
#endif
    {
#ifdef DEBUG_REDUCE
        printf("Product too large - reducing it %d\n",ea);
#endif
        FP_YYY_reduce(a);
#ifdef GET_STATS
        rsqr++;
    }
    tsqr++;
#else
    }
#endif

    BIG_XXX_sqr(d,a);
    FP_YYY_mod(r,d);
}

/* SU= 16 */
/* Set r=a+b */
void FP_YYY_add(BIG_XXX r,BIG_XXX a,BIG_XXX b)
{
    BIG_XXX_add(r,a,b);
    if (EXCESS_YYY(r)+2>=FEXCESS_YYY)  /* +2 because a and b not normalised */
    {
#ifdef DEBUG_REDUCE
        printf("Sum too large - reducing it %d\n",EXCESS_YYY(r));
#endif
        FP_YYY_reduce(r);
#ifdef GET_STATS
        radd++;
    }
    tadd++;
#else
    }
#endif
}

/* Set r=a-b mod m */
/* SU= 56 */
void FP_YYY_sub(BIG_XXX r,BIG_XXX a,BIG_XXX b)
{
    BIG_XXX n;
    FP_YYY_neg(n,b);
    FP_YYY_add(r,a,n);
}

/* SU= 48 */
/* Fully reduce a mod Modulus */
void FP_YYY_reduce(BIG_XXX a)
{
    BIG_XXX m;
    BIG_XXX_rcopy(m,Modulus_YYY);
    BIG_XXX_mod(a,m);
}

// https://graphics.stanford.edu/~seander/bithacks.html
// constant time log to base 2 (or number of bits in)

static int logb2(unsign32 v)
{
    int r;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;

    v = v - ((v >> 1) & 0x55555555);
    v = (v & 0x33333333) + ((v >> 2) & 0x33333333);
    r = (((v + (v >> 4)) & 0xF0F0F0F) * 0x1010101) >> 24;
    return r+1;
}

/* Set r=-a mod Modulus */
/* SU= 64 */
void FP_YYY_neg(BIG_XXX r,BIG_XXX a)
{
    int sb;
//    chunk ov;
    BIG_XXX m;

    BIG_XXX_rcopy(m,Modulus_YYY);
    BIG_XXX_norm(a);

    sb=logb2((unsign32)EXCESS_YYY(a));
    /*
        ov=EXCESS_YYY(a);
        sb=1;
        while(ov!=0)
        {
            sb++;    // only unpredictable branch
            ov>>=1;
        }
    */
    BIG_XXX_fshl(m,sb);
    BIG_XXX_sub(r,m,a);

    if (EXCESS_YYY(r)>=FEXCESS_YYY)
    {
#ifdef DEBUG_REDUCE
        printf("Negation too large -  reducing it %d\n",EXCESS_YYY(r));
#endif
        FP_YYY_reduce(r);
#ifdef GET_STATS
        rneg++;
    }
    tneg++;
#else
    }
#endif

}

/* Set r=a/2. */
/* SU= 56 */
void FP_YYY_div2(BIG_XXX r,BIG_XXX a)
{
    BIG_XXX m;
    BIG_XXX_rcopy(m,Modulus_YYY);
    BIG_XXX_norm(a);
    if (BIG_XXX_parity(a)==0)
    {
        BIG_XXX_copy(r,a);
        BIG_XXX_fshr(r,1);
    }
    else
    {
        BIG_XXX_add(r,a,m);
        BIG_XXX_norm(r);
        BIG_XXX_fshr(r,1);
    }
}

/* set w=1/x */
void FP_YYY_inv(BIG_XXX w,BIG_XXX x)
{
    BIG_XXX m;
    BIG_XXX_rcopy(m,Modulus_YYY);
    BIG_XXX_copy(w,x);
    FP_YYY_redc(w);

    BIG_XXX_invmodp(w,w,m);
    FP_YYY_nres(w);
}

/* SU=8 */
/* set n=1 */
void FP_YYY_one(BIG_XXX n)
{
    BIG_XXX_one(n);
    FP_YYY_nres(n);
}

/* Set r=a^b mod Modulus */
/* SU= 136 */
void FP_YYY_pow(BIG_XXX r,BIG_XXX a,BIG_XXX b)
{
    BIG_XXX w,z,zilch;
    int bt;
    BIG_XXX_zero(zilch);

    BIG_XXX_norm(b);
    BIG_XXX_copy(z,b);
    BIG_XXX_copy(w,a);
    FP_YYY_one(r);
    while(1)
    {
        bt=BIG_XXX_parity(z);
        BIG_XXX_fshr(z,1);
        if (bt) FP_YYY_mul(r,r,w);
        if (BIG_XXX_comp(z,zilch)==0) break;
        FP_YYY_sqr(w,w);
    }
    FP_YYY_reduce(r);
}

/* is r a QR? */
int FP_YYY_qr(BIG_XXX r)
{
    int j;
    BIG_XXX m;
    BIG_XXX_rcopy(m,Modulus_YYY);
    FP_YYY_redc(r);
    j=BIG_XXX_jacobi(r,m);
    FP_YYY_nres(r);
    if (j==1) return 1;
    return 0;

}

/* Set a=sqrt(b) mod Modulus */
/* SU= 160 */
void FP_YYY_sqrt(BIG_XXX r,BIG_XXX a)
{
    BIG_XXX v,i,b;
    BIG_XXX m;
    BIG_XXX_rcopy(m,Modulus_YYY);
    BIG_XXX_mod(a,m);
    BIG_XXX_copy(b,m);
    if (MOD8_YYY==5)
    {
        BIG_XXX_dec(b,5);
        BIG_XXX_norm(b);
        BIG_XXX_fshr(b,3); /* (p-5)/8 */
        BIG_XXX_copy(i,a);
        BIG_XXX_fshl(i,1);
        FP_YYY_pow(v,i,b);
        FP_YYY_mul(i,i,v);
        FP_YYY_mul(i,i,v);
        BIG_XXX_dec(i,1);
        FP_YYY_mul(r,a,v);
        FP_YYY_mul(r,r,i);
        BIG_XXX_mod(r,m);
    }
    if (MOD8_YYY==3 || MOD8_YYY==7)
    {
        BIG_XXX_inc(b,1);
        BIG_XXX_norm(b);
        BIG_XXX_fshr(b,2); /* (p+1)/4 */
        FP_YYY_pow(r,a,b);
    }
}

/*
int main()
{

	BIG_XXX r;

	FP_YYY_one(r);
	FP_YYY_sqr(r,r);

	BIG_XXX_output(r);

	int i,carry;
	DBIG_XXX c={0,0,0,0,0,0,0,0};
	BIG_XXX a={1,2,3,4};
	BIG_XXX b={3,4,5,6};
	BIG_XXX r={11,12,13,14};
	BIG_XXX s={23,24,25,15};
	BIG_XXX w;

//	printf("NEXCESS_XXX= %d\n",NEXCESS_XXX);
//	printf("MConst_YYY= %d\n",MConst_YYY);

	BIG_XXX_copy(b,Modulus_YYY);
	BIG_XXX_dec(b,1);
	BIG_XXX_norm(b);

	BIG_XXX_randomnum(r); BIG_XXX_norm(r); BIG_XXX_mod(r,Modulus_YYY);
//	BIG_XXX_randomnum(s); norm(s); BIG_XXX_mod(s,Modulus_YYY);

//	BIG_XXX_output(r);
//	BIG_XXX_output(s);

	BIG_XXX_output(r);
	FP_YYY_nres(r);
	BIG_XXX_output(r);
	BIG_XXX_copy(a,r);
	FP_YYY_redc(r);
	BIG_XXX_output(r);
	BIG_XXX_dscopy(c,a);
	FP_YYY_mod(r,c);
	BIG_XXX_output(r);


//	exit(0);

//	copy(r,a);
	printf("r=   "); BIG_XXX_output(r);
	BIG_XXX_modsqr(r,r,Modulus_YYY);
	printf("r^2= "); BIG_XXX_output(r);

	FP_YYY_nres(r);
	FP_YYY_sqrt(r,r);
	FP_YYY_redc(r);
	printf("r=   "); BIG_XXX_output(r);
	BIG_XXX_modsqr(r,r,Modulus_YYY);
	printf("r^2= "); BIG_XXX_output(r);


//	for (i=0;i<100000;i++) FP_YYY_sqr(r,r);
//	for (i=0;i<100000;i++)
		FP_YYY_sqrt(r,r);

	BIG_XXX_output(r);
}
*/
