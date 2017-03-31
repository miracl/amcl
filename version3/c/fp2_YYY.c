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

/* AMCL Fp^2 functions */
/* SU=m, m is Stack Usage (no lazy )*/

/* FP2 elements are of the form a+ib, where i is sqrt(-1) */

#include "fp2_YYY.h"

/* test x==0 ? */
/* SU= 8 */
int FP2_YYY_iszilch(FP2_YYY *x)
{
    FP2_YYY_reduce(x);
    if (BIG_XXX_iszilch(x->a) && BIG_XXX_iszilch(x->b)) return 1;
    return 0;
}

/* Move b to a if d=1 */
void FP2_YYY_cmove(FP2_YYY *f,FP2_YYY *g,int d)
{
    BIG_XXX_cmove(f->a,g->a,d);
    BIG_XXX_cmove(f->b,g->b,d);
}

/* test x==1 ? */
/* SU= 48 */
int FP2_YYY_isunity(FP2_YYY *x)
{
    BIG_XXX one;
    FP_YYY_one(one);
    FP2_YYY_reduce(x);
    if (BIG_XXX_comp(x->a,one)==0 && BIG_XXX_iszilch(x->b)) return 1;
    return 0;
}

/* SU= 8 */
/* Fully reduce a and b mod Modulus */
void FP2_YYY_reduce(FP2_YYY *w)
{
    FP_YYY_reduce(w->a);
    FP_YYY_reduce(w->b);
}

/* return 1 if x==y, else 0 */
/* SU= 16 */
int FP2_YYY_equals(FP2_YYY *x,FP2_YYY *y)
{
    FP2_YYY_reduce(x);
    FP2_YYY_reduce(y);
    if (BIG_XXX_comp(x->a,y->a)==0 && BIG_XXX_comp(x->b,y->b)==0)
        return 1;
    return 0;
}

/* Create FP2 from two FPs */
/* SU= 16 */
void FP2_YYY_from_FPs(FP2_YYY *w,BIG_XXX x,BIG_XXX y)
{
    BIG_XXX_copy(w->a,x);
    BIG_XXX_copy(w->b,y);
}

/* Create FP2 from two BIGS */
/* SU= 16 */
void FP2_YYY_from_BIGs(FP2_YYY *w,BIG_XXX x,BIG_XXX y)
{
    BIG_XXX_copy(w->a,x);
    BIG_XXX_copy(w->b,y);
    FP_YYY_nres(w->a);
    FP_YYY_nres(w->b);
}

/* Create FP2 from FP */
/* SU= 8 */
void FP2_YYY_from_FP(FP2_YYY *w,BIG_XXX x)
{
    BIG_XXX_copy(w->a,x);
    BIG_XXX_zero(w->b);
}

/* Create FP2 from BIG */
/* SU= 8 */
void FP2_YYY_from_BIG(FP2_YYY *w,BIG_XXX x)
{
    BIG_XXX_copy(w->a,x);
    FP_YYY_nres(w->a);
    BIG_XXX_zero(w->b);
}

/* FP2 copy w=x */
/* SU= 16 */
void FP2_YYY_copy(FP2_YYY *w,FP2_YYY *x)
{
    if (w==x) return;
    BIG_XXX_copy(w->a,x->a);
    BIG_XXX_copy(w->b,x->b);
}

/* FP2 set w=0 */
/* SU= 8 */
void FP2_YYY_zero(FP2_YYY *w)
{
    BIG_XXX_zero(w->a);
    BIG_XXX_zero(w->b);
}

/* FP2 set w=1 */
/* SU= 48 */
void FP2_YYY_one(FP2_YYY *w)
{
    BIG_XXX one;
    FP_YYY_one(one);
    FP2_YYY_from_FP(w,one);
}

/* Set w=-x */
/* SU= 88 */
void FP2_YYY_neg(FP2_YYY *w,FP2_YYY *x)
{
    /* Just one neg! */
    BIG_XXX m,t;
    FP2_YYY_norm(x);
    FP_YYY_add(m,x->a,x->b);
    FP_YYY_neg(m,m);
    BIG_XXX_norm(m);
    FP_YYY_add(t,m,x->b);
    FP_YYY_add(w->b,m,x->a);
    BIG_XXX_copy(w->a,t);
}

/* Set w=conj(x) */
/* SU= 16 */
void FP2_YYY_conj(FP2_YYY *w,FP2_YYY *x)
{
    BIG_XXX_copy(w->a,x->a);
    FP_YYY_neg(w->b,x->b);
}

/* Set w=x+y */
/* SU= 16 */
void FP2_YYY_add(FP2_YYY *w,FP2_YYY *x,FP2_YYY *y)
{
    FP_YYY_add(w->a,x->a,y->a);
    FP_YYY_add(w->b,x->b,y->b);
}

/* Set w=x-y */
/* SU= 16 */
void FP2_YYY_sub(FP2_YYY *w,FP2_YYY *x,FP2_YYY *y)
{
    FP2_YYY m;
    FP2_YYY_neg(&m,y);
    FP2_YYY_add(w,x,&m);
}

/* Set w=s*x, where s is FP */
/* SU= 16 */
void FP2_YYY_pmul(FP2_YYY *w,FP2_YYY *x,BIG_XXX s)
{
    FP_YYY_mul(w->a,x->a,s);
    FP_YYY_mul(w->b,x->b,s);
}

/* SU= 16 */
/* Set w=s*x, where s is int */
void FP2_YYY_imul(FP2_YYY *w,FP2_YYY *x,int s)
{
    FP_YYY_imul(w->a,x->a,s);
    FP_YYY_imul(w->b,x->b,s);
}

/* Set w=x^2 */
/* SU= 128 */
void FP2_YYY_sqr(FP2_YYY *w,FP2_YYY *x)
{
    BIG_XXX w1,w3,mb;

    FP_YYY_mul(w3,x->a,x->b); /* norms x */
    FP_YYY_add(w1,x->a,x->b); /* w1#2 w1=2 */
    FP_YYY_neg(mb,x->b);      /* mb#2 mb=1 */
    FP_YYY_add(w->a,x->a,mb);   /* w2#3 w2=3 */
    FP_YYY_mul(w->a,w1,w->a);     /* w->a#2 w->a=1 w1&w2=6 w1*w2=2 */

    FP_YYY_add(w->b,w3,w3); /* w->b#4 w->b=2 */

    FP2_YYY_norm(w);

}


/* Set w=x*y */
/* SU= 168 */
void FP2_YYY_mul(FP2_YYY *w,FP2_YYY *x,FP2_YYY *y)
{
    BIG_XXX w1,w2,w5,mw;

    FP_YYY_mul(w1,x->a,y->a);  /* norms x  */
    FP_YYY_mul(w2,x->b,y->b);  /* and y */

    FP_YYY_add(w5,x->a,x->b);

    FP_YYY_add(w->b,y->a,y->b);

    FP_YYY_mul(w->b,w->b,w5);
    FP_YYY_add(mw,w1,w2);
    FP_YYY_neg(mw,mw);

    FP_YYY_add(w->b,w->b,mw);
    FP_YYY_add(mw,w1,mw);
    FP_YYY_add(w->a,w1,mw);

    FP2_YYY_norm(w);

}

/* output FP2 in hex format [a,b] */
/* SU= 16 */
void FP2_YYY_output(FP2_YYY *w)
{
    FP2_YYY_reduce(w);
    FP_YYY_redc(w->a);
    FP_YYY_redc(w->b);
    printf("[");
    BIG_XXX_output(w->a);
    printf(",");
    BIG_XXX_output(w->b);
    printf("]");
    FP_YYY_nres(w->a);
    FP_YYY_nres(w->b);
}

/* SU= 8 */
void FP2_YYY_rawoutput(FP2_YYY *w)
{
    printf("[");
    BIG_XXX_rawoutput(w->a);
    printf(",");
    BIG_XXX_rawoutput(w->b);
    printf("]");
}


/* Set w=1/x */
/* SU= 128 */
void FP2_YYY_inv(FP2_YYY *w,FP2_YYY *x)
{
    BIG_XXX m,w1,w2;
    BIG_XXX_rcopy(m,Modulus_YYY);
    FP2_YYY_norm(x);
    FP_YYY_sqr(w1,x->a);
    FP_YYY_sqr(w2,x->b);
    FP_YYY_add(w1,w1,w2);

    FP_YYY_redc(w1);
    BIG_XXX_invmodp(w1,w1,m);
    FP_YYY_nres(w1);
    FP_YYY_mul(w->a,x->a,w1);
    FP_YYY_neg(w1,w1);
    FP_YYY_mul(w->b,x->b,w1);
//	FP2_YYY_norm(w);
}


/* Set w=x/2 */
/* SU= 16 */
void FP2_YYY_div2(FP2_YYY *w,FP2_YYY *x)
{
    FP_YYY_div2(w->a,x->a);
    FP_YYY_div2(w->b,x->b);
}

/* Set w*=(1+sqrt(-1)) */
/* where X^2-(1+sqrt(-1)) is irreducible for FP4, assumes p=3 mod 8 */

/* SU= 128 */
void FP2_YYY_mul_ip(FP2_YYY *w)
{
    FP2_YYY t;
    BIG_XXX z;

    FP2_YYY_norm(w);
    FP2_YYY_copy(&t,w);

    BIG_XXX_copy(z,w->a);
    FP_YYY_neg(w->a,w->b);
    BIG_XXX_copy(w->b,z);

    FP2_YYY_add(w,&t,w);
    FP2_YYY_norm(w);
}

/* Set w/=(1+sqrt(-1)) */
/* SU= 88 */
void FP2_YYY_div_ip(FP2_YYY *w)
{
    FP2_YYY t;
    FP2_YYY_norm(w);
    FP_YYY_add(t.a,w->a,w->b);
    FP_YYY_sub(t.b,w->b,w->a);
    FP2_YYY_div2(w,&t);
}

/* SU= 8 */
/* normalise a and b components of w */
void FP2_YYY_norm(FP2_YYY *w)
{
    BIG_XXX_norm(w->a);
    BIG_XXX_norm(w->b);
}

/* Set w=a^b mod m */
/* SU= 208 */
void FP2_YYY_pow(FP2_YYY *r,FP2_YYY* a,BIG_XXX b)
{
    FP2_YYY w;
    BIG_XXX z,one,zilch;
    int bt;

    BIG_XXX_norm(b);
    BIG_XXX_copy(z,b);
    FP2_YYY_copy(&w,a);
    FP_YYY_one(one);
    BIG_XXX_zero(zilch);
    FP2_YYY_from_FP(r,one);
    while(1)
    {
        bt=BIG_XXX_parity(z);
        BIG_XXX_shr(z,1);
        if (bt) FP2_YYY_mul(r,r,&w);
        if (BIG_XXX_comp(z,zilch)==0) break;
        FP2_YYY_sqr(&w,&w);
    }
    FP2_YYY_reduce(r);
}

/* sqrt(a+ib) = sqrt(a+sqrt(a*a-n*b*b)/2)+ib/(2*sqrt(a+sqrt(a*a-n*b*b)/2)) */
/* returns true if u is QR */

int FP2_YYY_sqrt(FP2_YYY *w,FP2_YYY *u)
{
    BIG_XXX w1,w2,q;
    FP2_YYY_copy(w,u);
    if (FP2_YYY_iszilch(w)) return 1;

    BIG_XXX_rcopy(q,Modulus_YYY);
    FP_YYY_sqr(w1,w->b);
    FP_YYY_sqr(w2,w->a);
    FP_YYY_add(w1,w1,w2);
    if (!FP_YYY_qr(w1))
    {
        FP2_YYY_zero(w);
        return 0;
    }
    FP_YYY_sqrt(w1,w1);
    FP_YYY_add(w2,w->a,w1);
    FP_YYY_div2(w2,w2);
    if (!FP_YYY_qr(w2))
    {
        FP_YYY_sub(w2,w->a,w1);
        FP_YYY_div2(w2,w2);
        if (!FP_YYY_qr(w2))
        {
            FP2_YYY_zero(w);
            return 0;
        }
    }
    FP_YYY_sqrt(w2,w2);
    BIG_XXX_copy(w->a,w2);
    FP_YYY_add(w2,w2,w2);
    FP_YYY_redc(w2);
    BIG_XXX_invmodp(w2,w2,q);
    FP_YYY_nres(w2);
    FP_YYY_mul(w->b,w->b,w2);
    return 1;
}

/*
int main()
{
	int i;
	FP2_YYY w,z;
	BIG_XXX a,b,e;
	BIG_XXX pp1,pm1;
	BIG_XXX_unity(a); BIG_XXX_unity(b);
	FP2_YYY_from_BIGs(&w,a,b);
//	for (i=0;i<100;i++)
//	{
//		BIG_XXX_randomnum(a); BIG_XXX_randomnum(b);
//		BIG_XXX_mod(a,Modulus_YYY); BIG_XXX_mod(b,Modulus_YYY);
//		FP2_YYY_from_FPs(&w,a,b);
//		FP2_YYY_output(&w);
//		FP2_YYY_inv(&z,&w);
//				FP2_YYY_output(&z);
//		FP2_YYY_inv(&z,&z);
//				FP2_YYY_output(&z);
//				FP2_YYY_output(&w);
//		if (FP2_YYY_comp(&w,&z)!=1) printf("error \n");
//		else printf("OK \n");
//	}
//exit(0);
	printf("w= "); FP2_YYY_output(&w); printf("\n");
	BIG_XXX_zero(e); BIG_XXX_inc(e,27);
	FP2_YYY_pow(&w,&w,e);
	FP2_YYY_output(&w);
exit(0);
	BIG_XXX_rcopy(pp1,Modulus_YYY);
	BIG_XXX_rcopy(pm1,Modulus_YYY);
	BIG_XXX_inc(pp1,1);
	BIG_XXX_dec(pm1,1);
	BIG_XXX_norm(pp1);
	BIG_XXX_norm(pm1);
	FP2_YYY_pow(&w,&w,pp1);
	FP2_YYY_pow(&w,&w,pm1);
	FP2_YYY_output(&w);
}

*/
