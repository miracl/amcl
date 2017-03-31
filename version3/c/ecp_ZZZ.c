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

/* AMCL Elliptic Curve Functions */
/* SU=m, SU is Stack Usage (Weierstrass Curves) */

//#define HAS_MAIN

#include "ecp_ZZZ.h"

/* test for P=O point-at-infinity */
int ECP_ZZZ_isinf(ECP_ZZZ *P)
{
#if CURVETYPE_ZZZ==EDWARDS
    FP_YYY_reduce(P->x);
    FP_YYY_reduce(P->y);
    FP_YYY_reduce(P->z);
    return (BIG_XXX_iszilch(P->x) && BIG_XXX_comp(P->y,P->z)==0);
#else
    return P->inf;
#endif
}

/* Conditional swap of P and Q dependant on d */
static void ECP_ZZZ_cswap(ECP_ZZZ *P,ECP_ZZZ *Q,int d)
{
    BIG_XXX_cswap(P->x,Q->x,d);
#if CURVETYPE_ZZZ!=MONTGOMERY
    BIG_XXX_cswap(P->y,Q->y,d);
#endif
    BIG_XXX_cswap(P->z,Q->z,d);
#if CURVETYPE_ZZZ!=EDWARDS
    d=~(d-1);
    d=d&(P->inf^Q->inf);
    P->inf^=d;
    Q->inf^=d;
#endif
}

#if CURVETYPE_ZZZ!=MONTGOMERY
/* Conditional move Q to P dependant on d */
static void ECP_ZZZ_cmove(ECP_ZZZ *P,ECP_ZZZ *Q,int d)
{
    BIG_XXX_cmove(P->x,Q->x,d);
#if CURVETYPE_ZZZ!=MONTGOMERY
    BIG_XXX_cmove(P->y,Q->y,d);
#endif
    BIG_XXX_cmove(P->z,Q->z,d);
#if CURVETYPE_ZZZ!=EDWARDS
    d=~(d-1);
    P->inf^=(P->inf^Q->inf)&d;
#endif
}

/* return 1 if b==c, no branching */
static int teq(sign32 b,sign32 c)
{
    sign32 x=b^c;
    x-=1;  // if x=0, x now -1
    return (int)((x>>31)&1);
}
#endif // CURVETYPE_ZZZ!=MONTGOMERY

#if CURVETYPE_ZZZ!=MONTGOMERY
/* Constant time select from pre-computed table */
static void ECP_ZZZ_select(ECP_ZZZ *P,ECP_ZZZ W[],sign32 b)
{
    ECP_ZZZ MP;
    sign32 m=b>>31;
    sign32 babs=(b^m)-m;

    babs=(babs-1)/2;

    ECP_ZZZ_cmove(P,&W[0],teq(babs,0));  // conditional move
    ECP_ZZZ_cmove(P,&W[1],teq(babs,1));
    ECP_ZZZ_cmove(P,&W[2],teq(babs,2));
    ECP_ZZZ_cmove(P,&W[3],teq(babs,3));
    ECP_ZZZ_cmove(P,&W[4],teq(babs,4));
    ECP_ZZZ_cmove(P,&W[5],teq(babs,5));
    ECP_ZZZ_cmove(P,&W[6],teq(babs,6));
    ECP_ZZZ_cmove(P,&W[7],teq(babs,7));

    ECP_ZZZ_copy(&MP,P);
    ECP_ZZZ_neg(&MP);  // minus P
    ECP_ZZZ_cmove(P,&MP,(int)(m&1));
}
#endif

/* Test P == Q */
/* SU=168 */
int ECP_ZZZ_equals(ECP_ZZZ *P,ECP_ZZZ *Q)
{
#if CURVETYPE_ZZZ==WEIERSTRASS
    BIG_XXX pz2,qz2,a,b;
    if (ECP_ZZZ_isinf(P) && ECP_ZZZ_isinf(Q)) return 1;
    if (ECP_ZZZ_isinf(P) || ECP_ZZZ_isinf(Q)) return 0;

    FP_YYY_sqr(pz2,P->z);
    FP_YYY_sqr(qz2,Q->z);

    FP_YYY_mul(a,P->x,qz2);
    FP_YYY_mul(b,Q->x,pz2);
    FP_YYY_reduce(a);
    FP_YYY_reduce(b);
    if (BIG_XXX_comp(a,b)!=0) return 0;

    FP_YYY_mul(a,P->y,qz2);
    FP_YYY_mul(a,a,Q->z);
    FP_YYY_mul(b,Q->y,pz2);
    FP_YYY_mul(b,b,P->z);
    FP_YYY_reduce(a);
    FP_YYY_reduce(b);
    if (BIG_XXX_comp(a,b)!=0) return 0;
    return 1;
#else
    BIG_XXX a,b;
    if (ECP_ZZZ_isinf(P) && ECP_ZZZ_isinf(Q)) return 1;
    if (ECP_ZZZ_isinf(P) || ECP_ZZZ_isinf(Q)) return 0;

    FP_YYY_mul(a,P->x,Q->z);
    FP_YYY_mul(b,Q->x,P->z);
    FP_YYY_reduce(a);
    FP_YYY_reduce(b);
    if (BIG_XXX_comp(a,b)!=0) return 0;

#if CURVETYPE_ZZZ==EDWARDS
    FP_YYY_mul(a,P->y,Q->z);
    FP_YYY_mul(b,Q->y,P->z);
    FP_YYY_reduce(a);
    FP_YYY_reduce(b);
    if (BIG_XXX_comp(a,b)!=0) return 0;
#endif

    return 1;
#endif
}

/* Set P=Q */
/* SU=16 */
void ECP_ZZZ_copy(ECP_ZZZ *P,ECP_ZZZ *Q)
{
#if CURVETYPE_ZZZ!=EDWARDS
    P->inf=Q->inf;
#endif
    BIG_XXX_copy(P->x,Q->x);
#if CURVETYPE_ZZZ!=MONTGOMERY
    BIG_XXX_copy(P->y,Q->y);
#endif
    BIG_XXX_copy(P->z,Q->z);
}

/* Set P=-Q */
#if CURVETYPE_ZZZ!=MONTGOMERY
/* SU=8 */
void ECP_ZZZ_neg(ECP_ZZZ *P)
{
    if (ECP_ZZZ_isinf(P)) return;
#if CURVETYPE_ZZZ==WEIERSTRASS
    FP_YYY_neg(P->y,P->y);
    BIG_XXX_norm(P->y);
#else
    FP_YYY_neg(P->x,P->x);
    BIG_XXX_norm(P->x);
#endif

}
#endif

/* Set P=O */
void ECP_ZZZ_inf(ECP_ZZZ *P)
{
#if CURVETYPE_ZZZ==EDWARDS
    BIG_XXX_zero(P->x);
    FP_YYY_one(P->y);
    FP_YYY_one(P->z);
#else
    P->inf=1;
#endif
}

/* Calculate right Hand Side of curve equation y^2=RHS */
/* SU=56 */
void ECP_ZZZ_rhs(BIG_XXX v,BIG_XXX x)
{
#if CURVETYPE_ZZZ==WEIERSTRASS
    /* x^3+Ax+B */
    BIG_XXX t;
    FP_YYY_sqr(t,x);
    FP_YYY_mul(t,t,x);

    if (CURVE_A_ZZZ==-3)
    {
        FP_YYY_neg(v,x);
        BIG_XXX_norm(v);
        BIG_XXX_imul(v,v,-CURVE_A_ZZZ);
        BIG_XXX_norm(v);
        FP_YYY_add(v,t,v);
    }
    else BIG_XXX_copy(v,t);

    BIG_XXX_rcopy(t,CURVE_B_ZZZ);
    FP_YYY_nres(t);
    FP_YYY_add(v,t,v);
    FP_YYY_reduce(v);
#endif

#if CURVETYPE_ZZZ==EDWARDS
    /* (Ax^2-1)/(Bx^2-1) */
    BIG_XXX t,m,one;
    BIG_XXX_rcopy(m,Modulus_YYY);
    FP_YYY_sqr(v,x);
    FP_YYY_one(one);
    BIG_XXX_rcopy(t,CURVE_B_ZZZ);
    FP_YYY_nres(t);
    FP_YYY_mul(t,v,t);
    FP_YYY_sub(t,t,one);
    if (CURVE_A_ZZZ==1) FP_YYY_sub(v,v,one);

    if (CURVE_A_ZZZ==-1)
    {
        FP_YYY_add(v,v,one);
        FP_YYY_neg(v,v);
    }
    FP_YYY_redc(v);
    FP_YYY_redc(t);
    BIG_XXX_moddiv(v,v,t,m);
    FP_YYY_nres(v);
#endif

#if CURVETYPE_ZZZ==MONTGOMERY
    /* x^3+Ax^2+x */
    BIG_XXX x2,x3;
    FP_YYY_sqr(x2,x);
    FP_YYY_mul(x3,x2,x);
    BIG_XXX_copy(v,x);
    FP_YYY_imul(x2,x2,CURVE_A_ZZZ);
    FP_YYY_add(v,v,x2);
    FP_YYY_add(v,v,x3);
    FP_YYY_reduce(v);
#endif
}

/* Set P=(x,y) */

#if CURVETYPE_ZZZ==MONTGOMERY

/* Set P=(x,{y}) */

int ECP_ZZZ_set(ECP_ZZZ *P,BIG_XXX x)
{
    BIG_XXX m,rhs;
    BIG_XXX_rcopy(m,Modulus_YYY);
    BIG_XXX_copy(rhs,x);
    FP_YYY_nres(rhs);
    ECP_ZZZ_rhs(rhs,rhs);
    FP_YYY_redc(rhs);

    if (BIG_XXX_jacobi(rhs,m)!=1)
    {
        ECP_ZZZ_inf(P);
        return 0;
    }
    P->inf=0;
    BIG_XXX_copy(P->x,x);
    FP_YYY_nres(P->x);
    FP_YYY_one(P->z);
    return 1;
}

/* Extract x coordinate as BIG */
int ECP_ZZZ_get(BIG_XXX x,ECP_ZZZ *P)
{
    if (ECP_ZZZ_isinf(P)) return -1;
    ECP_ZZZ_affine(P);
    BIG_XXX_copy(x,P->x);
    FP_YYY_redc(x);
    return 0;
}


#else
/* Extract (x,y) and return sign of y. If x and y are the same return only x */
/* SU=16 */
int ECP_ZZZ_get(BIG_XXX x,BIG_XXX y,ECP_ZZZ *P)
{
    int s;
#if CURVETYPE_ZZZ!=EDWARDS
    if (ECP_ZZZ_isinf(P)) return -1;
#endif
    ECP_ZZZ_affine(P);

    BIG_XXX_copy(y,P->y);
    FP_YYY_redc(y);

    s=BIG_XXX_parity(y);

    BIG_XXX_copy(x,P->x);
    FP_YYY_redc(x);

    return s;
}

/* Set P=(x,{y}) */
/* SU=96 */
int ECP_ZZZ_set(ECP_ZZZ *P,BIG_XXX x,BIG_XXX y)
{
    BIG_XXX rhs,y2;
    BIG_XXX_copy(y2,y);

    FP_YYY_nres(y2);
    FP_YYY_sqr(y2,y2);
    FP_YYY_reduce(y2);

    BIG_XXX_copy(rhs,x);
    FP_YYY_nres(rhs);

    ECP_ZZZ_rhs(rhs,rhs);

    if (BIG_XXX_comp(y2,rhs)!=0)
    {
        ECP_ZZZ_inf(P);
        return 0;
    }
#if CURVETYPE_ZZZ==WEIERSTRASS
    P->inf=0;
#endif
    BIG_XXX_copy(P->x,x);
    FP_YYY_nres(P->x);
    BIG_XXX_copy(P->y,y);
    FP_YYY_nres(P->y);
    FP_YYY_one(P->z);
    return 1;
}

/* Set P=(x,y), where y is calculated from x with sign s */
/* SU=136 */
int ECP_ZZZ_setx(ECP_ZZZ *P,BIG_XXX x,int s)
{
    BIG_XXX t,rhs,m;
    BIG_XXX_rcopy(m,Modulus_YYY);

    BIG_XXX_copy(rhs,x);
    FP_YYY_nres(rhs);
    ECP_ZZZ_rhs(rhs,rhs);
    BIG_XXX_copy(t,rhs);
    FP_YYY_redc(t);
    if (BIG_XXX_jacobi(t,m)!=1)
    {
        ECP_ZZZ_inf(P);
        return 0;
    }
#if CURVETYPE_ZZZ==WEIERSTRASS
    P->inf=0;
#endif
    BIG_XXX_copy(P->x,x);
    FP_YYY_nres(P->x);

    FP_YYY_sqrt(P->y,rhs);
    BIG_XXX_copy(rhs,P->y);
    FP_YYY_redc(rhs);
    if (BIG_XXX_parity(rhs)!=s)
        FP_YYY_neg(P->y,P->y);
    FP_YYY_reduce(P->y);
    FP_YYY_one(P->z);
    return 1;
}

#endif

/* Convert P to Affine, from (x,y,z) to (x,y) */
/* SU=160 */
void ECP_ZZZ_affine(ECP_ZZZ *P)
{
    BIG_XXX one,iz,m;
#if CURVETYPE_ZZZ==WEIERSTRASS
    BIG_XXX izn;
    if (ECP_ZZZ_isinf(P)) return;
    FP_YYY_one(one);
    if (BIG_XXX_comp(P->z,one)==0) return;
    BIG_XXX_rcopy(m,Modulus_YYY);

    FP_YYY_redc(P->z);
    BIG_XXX_invmodp(iz,P->z,m);
    FP_YYY_nres(iz);

    FP_YYY_sqr(izn,iz);
    FP_YYY_mul(P->x,P->x,izn);
    FP_YYY_mul(izn,izn,iz);
    FP_YYY_mul(P->y,P->y,izn);
    FP_YYY_reduce(P->y);

#endif
#if CURVETYPE_ZZZ==EDWARDS
    FP_YYY_one(one);
    if (BIG_XXX_comp(P->z,one)==0) return;
    BIG_XXX_rcopy(m,Modulus_YYY);

    FP_YYY_redc(P->z);
    BIG_XXX_invmodp(iz,P->z,m);
    FP_YYY_nres(iz);

    FP_YYY_mul(P->x,P->x,iz);
    FP_YYY_mul(P->y,P->y,iz);
    FP_YYY_reduce(P->y);

#endif
#if CURVETYPE_ZZZ==MONTGOMERY
    if (ECP_ZZZ_isinf(P)) return;
    FP_YYY_one(one);
    if (BIG_XXX_comp(P->z,one)==0) return;

    BIG_XXX_rcopy(m,Modulus_YYY);

    FP_YYY_redc(P->z);
    BIG_XXX_invmodp(iz,P->z,m);
    FP_YYY_nres(iz);

    FP_YYY_mul(P->x,P->x,iz);

#endif
    FP_YYY_reduce(P->x);
    BIG_XXX_copy(P->z,one);
}

/* SU=120 */
void ECP_ZZZ_outputxyz(ECP_ZZZ *P)
{
    BIG_XXX x,z;
    if (ECP_ZZZ_isinf(P))
    {
        printf("Infinity\n");
        return;
    }
    BIG_XXX_copy(x,P->x);
    FP_YYY_reduce(x);
    FP_YYY_redc(x);
    BIG_XXX_copy(z,P->z);
    FP_YYY_reduce(z);
    FP_YYY_redc(z);

#if CURVETYPE_ZZZ!=MONTGOMERY
    BIG_XXX y;
    BIG_XXX_copy(y,P->y);
    FP_YYY_reduce(y);
    FP_YYY_redc(y);
    printf("(");
    BIG_XXX_output(x);
    printf(",");
    BIG_XXX_output(y);
    printf(",");
    BIG_XXX_output(z);
    printf(")\n");

#else
    printf("(");
    BIG_XXX_output(x);
    printf(",");
    BIG_XXX_output(z);
    printf(")\n");
#endif
}

/* SU=16 */
/* Output point P */
void ECP_ZZZ_output(ECP_ZZZ *P)
{
    if (ECP_ZZZ_isinf(P))
    {
        printf("Infinity\n");
        return;
    }
    ECP_ZZZ_affine(P);
#if CURVETYPE_ZZZ!=MONTGOMERY
    FP_YYY_redc(P->x);
    FP_YYY_redc(P->y);
    printf("(");
    BIG_XXX_output(P->x);
    printf(",");
    BIG_XXX_output(P->y);
    printf(")\n");
    FP_YYY_nres(P->x);
    FP_YYY_nres(P->y);
#else
    FP_YYY_redc(P->x);
    printf("(");
    BIG_XXX_output(P->x);
    printf(")\n");
    FP_YYY_nres(P->x);
#endif
}


/* SU=88 */
/* Convert P to octet string */
void ECP_ZZZ_toOctet(octet *W,ECP_ZZZ *P)
{
#if CURVETYPE_ZZZ==MONTGOMERY
    BIG_XXX x;
    ECP_ZZZ_get(x,P);
    W->len=MODBYTES_XXX+1;
    W->val[0]=6;
    BIG_XXX_toBytes(&(W->val[1]),x);
#else
    BIG_XXX x,y;
    ECP_ZZZ_get(x,y,P);
    W->len=2*MODBYTES_XXX+1;
    W->val[0]=4;
    BIG_XXX_toBytes(&(W->val[1]),x);
    BIG_XXX_toBytes(&(W->val[MODBYTES_XXX+1]),y);
#endif
}

/* SU=88 */
/* Restore P from octet string */
int ECP_ZZZ_fromOctet(ECP_ZZZ *P,octet *W)
{
#if CURVETYPE_ZZZ==MONTGOMERY
    BIG_XXX x;
    BIG_XXX_fromBytes(x,&(W->val[1]));
    if (ECP_ZZZ_set(P,x)) return 1;
    return 0;
#else
    BIG_XXX x,y;
    BIG_XXX_fromBytes(x,&(W->val[1]));
    BIG_XXX_fromBytes(y,&(W->val[MODBYTES_XXX+1]));
    if (ECP_ZZZ_set(P,x,y)) return 1;
    return 0;
#endif
}


/* Set P=2P */
/* SU=272 */
void ECP_ZZZ_dbl(ECP_ZZZ *P)
{
#if CURVETYPE_ZZZ==WEIERSTRASS
    BIG_XXX one;
    BIG_XXX w1,w7,w8,w2,w3,w6;
    if (ECP_ZZZ_isinf(P)) return;

    if (BIG_XXX_iszilch(P->y))
    {
        P->inf=1;
        return;
    }
    FP_YYY_one(one);
    BIG_XXX_zero(w6);

    if (CURVE_A_ZZZ==-3)
    {
        if (BIG_XXX_comp(P->z,one)==0) BIG_XXX_copy(w6,one);
        else FP_YYY_sqr(w6,P->z);
        FP_YYY_neg(w1,w6);
        FP_YYY_add(w3,P->x,w1);
        FP_YYY_add(w8,P->x,w6);
        FP_YYY_mul(w3,w3,w8);
        BIG_XXX_imul(w8,w3,3);
    }
    else
    {
        /* assuming A=0 */
        FP_YYY_sqr(w1,P->x);
        BIG_XXX_imul(w8,w1,3);
    }

    FP_YYY_sqr(w2,P->y);
    FP_YYY_mul(w3,P->x,w2);

    BIG_XXX_imul(w3,w3,4);
    FP_YYY_neg(w1,w3);

    BIG_XXX_norm(w1);

    FP_YYY_sqr(P->x,w8);
    FP_YYY_add(P->x,P->x,w1);
    FP_YYY_add(P->x,P->x,w1);

    BIG_XXX_norm(P->x);

    if (BIG_XXX_comp(P->z,one)==0) BIG_XXX_copy(P->z,P->y);
    else FP_YYY_mul(P->z,P->z,P->y);
    FP_YYY_add(P->z,P->z,P->z);


    FP_YYY_add(w7,w2,w2);
    FP_YYY_sqr(w2,w7);

    FP_YYY_add(w2,w2,w2);
    FP_YYY_sub(w3,w3,P->x);
    FP_YYY_mul(P->y,w8,w3);

    FP_YYY_sub(P->y,P->y,w2);

    BIG_XXX_norm(P->y);
    BIG_XXX_norm(P->z);

#endif

#if CURVETYPE_ZZZ==EDWARDS
    /* Not using square for multiplication swap, as (1) it needs more adds, and (2) it triggers more reductions */
    BIG_XXX B,C,D,E,F,H,J;

    FP_YYY_mul(B,P->x,P->y);
    FP_YYY_add(B,B,B);
    FP_YYY_sqr(C,P->x);
    FP_YYY_sqr(D,P->y);
    if (CURVE_A_ZZZ==1) BIG_XXX_copy(E,C);
    if (CURVE_A_ZZZ==-1) FP_YYY_neg(E,C);
    FP_YYY_add(F,E,D);

    BIG_XXX_norm(F);

    FP_YYY_sqr(H,P->z);
    FP_YYY_add(H,H,H);
    FP_YYY_sub(J,F,H);
    FP_YYY_mul(P->x,B,J);
    FP_YYY_sub(E,E,D);
    FP_YYY_mul(P->y,F,E);
    FP_YYY_mul(P->z,F,J);

    BIG_XXX_norm(P->x);
    BIG_XXX_norm(P->y);
    BIG_XXX_norm(P->z);

#endif

#if CURVETYPE_ZZZ==MONTGOMERY
    BIG_XXX A,B,AA,BB,C;
    if (ECP_ZZZ_isinf(P)) return;

    FP_YYY_add(A,P->x,P->z);
    FP_YYY_sqr(AA,A);
    FP_YYY_sub(B,P->x,P->z);
    FP_YYY_sqr(BB,B);
    FP_YYY_sub(C,AA,BB);

    FP_YYY_mul(P->x,AA,BB);
    FP_YYY_imul(A,C,(CURVE_A_ZZZ+2)/4);
    FP_YYY_add(BB,BB,A);
    FP_YYY_mul(P->z,BB,C);

    BIG_XXX_norm(P->x);
    BIG_XXX_norm(P->z);
#endif
}

#if CURVETYPE_ZZZ==MONTGOMERY

/* Set P+=Q. W is difference between P and Q and is affine */
void ECP_ZZZ_add(ECP_ZZZ *P,ECP_ZZZ *Q,ECP_ZZZ *W)
{
    BIG_XXX A,B,C,D,DA,CB;

    FP_YYY_add(A,P->x,P->z);
    FP_YYY_sub(B,P->x,P->z);

    FP_YYY_add(C,Q->x,Q->z);
    FP_YYY_sub(D,Q->x,Q->z);

    FP_YYY_mul(DA,D,A);
    FP_YYY_mul(CB,C,B);

    FP_YYY_add(A,DA,CB);
    FP_YYY_sqr(A,A);
    FP_YYY_sub(B,DA,CB);
    FP_YYY_sqr(B,B);

    BIG_XXX_copy(P->x,A);
    FP_YYY_mul(P->z,W->x,B);

    FP_YYY_reduce(P->z);
    if (BIG_XXX_iszilch(P->z)) P->inf=1;
    else P->inf=0;

    BIG_XXX_norm(P->x);
}


#else

/* Set P+=Q */
/* SU=248 */
void ECP_ZZZ_add(ECP_ZZZ *P,ECP_ZZZ *Q)
{
#if CURVETYPE_ZZZ==WEIERSTRASS
    int aff;
    BIG_XXX one,B,D,E,C,A;
    if (ECP_ZZZ_isinf(Q)) return;
    if (ECP_ZZZ_isinf(P))
    {
        ECP_ZZZ_copy(P,Q);
        return;
    }

    FP_YYY_one(one);
    aff=1;
    if (BIG_XXX_comp(Q->z,one)!=0) aff=0;

    if (!aff)
    {
        FP_YYY_sqr(A,Q->z);
        FP_YYY_mul(C,A,Q->z);

        FP_YYY_sqr(B,P->z);
        FP_YYY_mul(D,B,P->z);

        FP_YYY_mul(A,P->x,A);
        FP_YYY_mul(C,P->y,C);
    }
    else
    {
        BIG_XXX_copy(A,P->x);
        BIG_XXX_copy(C,P->y);

        FP_YYY_sqr(B,P->z);
        FP_YYY_mul(D,B,P->z);
    }

    FP_YYY_mul(B,Q->x,B);
    FP_YYY_sub(B,B,A); /* B=Qx.z^2-x.Qz^2 */
    FP_YYY_mul(D,Q->y,D);
    FP_YYY_sub(D,D,C); /* D=Qy.z^3-y.Qz^3 */

    FP_YYY_reduce(B);
    if (BIG_XXX_iszilch(B))
    {
        FP_YYY_reduce(D);
        if (BIG_XXX_iszilch(D))
        {
            ECP_ZZZ_dbl(P);
            return;
        }
        else
        {
            ECP_ZZZ_inf(P);
            return;
        }
    }
    if (!aff) FP_YYY_mul(P->z,P->z,Q->z);
    FP_YYY_mul(P->z,P->z,B);

    FP_YYY_sqr(E,B);
    FP_YYY_mul(B,B,E);
    FP_YYY_mul(A,A,E);

    FP_YYY_add(E,A,A);
    FP_YYY_add(E,E,B);

    FP_YYY_sqr(P->x,D);
    FP_YYY_sub(P->x,P->x,E);

    FP_YYY_sub(A,A,P->x);
    FP_YYY_mul(P->y,A,D);
    FP_YYY_mul(C,C,B);
    FP_YYY_sub(P->y,P->y,C);

    BIG_XXX_norm(P->x);
    BIG_XXX_norm(P->y);
    BIG_XXX_norm(P->z);

#else
    BIG_XXX b,A,B,C,D,E,F,G;

    BIG_XXX_rcopy(b,CURVE_B_ZZZ);
    FP_YYY_nres(b);
    FP_YYY_mul(A,P->z,Q->z);

    FP_YYY_sqr(B,A);
    FP_YYY_mul(C,P->x,Q->x);
    FP_YYY_mul(D,P->y,Q->y);
    FP_YYY_mul(E,C,D);
    FP_YYY_mul(E,E,b);

    FP_YYY_sub(F,B,E);
    FP_YYY_add(G,B,E);

    if (CURVE_A_ZZZ==1) FP_YYY_sub(E,D,C);
    FP_YYY_add(C,C,D);

    FP_YYY_add(B,P->x,P->y);
    FP_YYY_add(D,Q->x,Q->y);
    FP_YYY_mul(B,B,D);
    FP_YYY_sub(B,B,C);
    FP_YYY_mul(B,B,F);
    FP_YYY_mul(P->x,A,B);


    if (CURVE_A_ZZZ==1) FP_YYY_mul(C,E,G);
    if (CURVE_A_ZZZ==-1)FP_YYY_mul(C,C,G);

    FP_YYY_mul(P->y,A,C);
    FP_YYY_mul(P->z,F,G);

    BIG_XXX_norm(P->x);
    BIG_XXX_norm(P->y);
    BIG_XXX_norm(P->z);

#endif
}

/* Set P-=Q */
/* SU=16 */
void  ECP_ZZZ_sub(ECP_ZZZ *P,ECP_ZZZ *Q)
{
    ECP_ZZZ_neg(Q);
    ECP_ZZZ_add(P,Q);
    ECP_ZZZ_neg(Q);
}

#endif


#if CURVETYPE_ZZZ==WEIERSTRASS
/* normalises array of points. Assumes P[0] is normalised already */

static void ECP_ZZZ_multiaffine(int m,ECP_ZZZ P[],BIG_XXX work[])
{
    int i;
    BIG_XXX t1,t2;

    FP_YYY_one(work[0]);
    BIG_XXX_copy(work[1],P[0].z);
    for (i=2; i<m; i++)
        FP_YYY_mul(work[i],work[i-1],P[i-1].z);

    FP_YYY_mul(t1,work[m-1],P[m-1].z);
    FP_YYY_inv(t1,t1);

    BIG_XXX_copy(t2,P[m-1].z);
    FP_YYY_mul(work[m-1],work[m-1],t1);

    for (i=m-2;; i--)
    {
        if (i==0)
        {
            FP_YYY_mul(work[0],t1,t2);
            break;
        }
        FP_YYY_mul(work[i],work[i],t2);
        FP_YYY_mul(work[i],work[i],t1);
        FP_YYY_mul(t2,P[i].z,t2);
    }
    /* now work[] contains inverses of all Z coordinates */

    for (i=0; i<m; i++)
    {
        FP_YYY_one(P[i].z);
        FP_YYY_sqr(t1,work[i]);
        FP_YYY_mul(P[i].x,P[i].x,t1);
        FP_YYY_mul(t1,work[i],t1);
        FP_YYY_mul(P[i].y,P[i].y,t1);
    }
}

#endif

#if CURVETYPE_ZZZ!=MONTGOMERY
/* constant time multiply by small integer of length bts - use ladder */
void ECP_ZZZ_pinmul(ECP_ZZZ *P,int e,int bts)
{
    int i,b;
    ECP_ZZZ R0,R1;

    ECP_ZZZ_affine(P);
    ECP_ZZZ_inf(&R0);
    ECP_ZZZ_copy(&R1,P);

    for (i=bts-1; i>=0; i--)
    {
        b=(e>>i)&1;
        ECP_ZZZ_copy(P,&R1);
        ECP_ZZZ_add(P,&R0);
        ECP_ZZZ_cswap(&R0,&R1,b);
        ECP_ZZZ_copy(&R1,P);
        ECP_ZZZ_dbl(&R0);
        ECP_ZZZ_cswap(&R0,&R1,b);
    }
    ECP_ZZZ_copy(P,&R0);
    ECP_ZZZ_affine(P);
}
#endif

/* Set P=r*P */
/* SU=424 */
void ECP_ZZZ_mul(ECP_ZZZ *P,BIG_XXX e)
{
#if CURVETYPE_ZZZ==MONTGOMERY
    /* Montgomery ladder */
    int nb,i,b;
    ECP_ZZZ R0,R1,D;
    if (ECP_ZZZ_isinf(P)) return;
    if (BIG_XXX_iszilch(e))
    {
        ECP_ZZZ_inf(P);
        return;
    }
    ECP_ZZZ_affine(P);

    ECP_ZZZ_copy(&R0,P);
    ECP_ZZZ_copy(&R1,P);
    ECP_ZZZ_dbl(&R1);
    ECP_ZZZ_copy(&D,P);

    nb=BIG_XXX_nbits(e);
    for (i=nb-2; i>=0; i--)
    {
        b=BIG_XXX_bit(e,i);
        ECP_ZZZ_copy(P,&R1);
        ECP_ZZZ_add(P,&R0,&D);
        ECP_ZZZ_cswap(&R0,&R1,b);
        ECP_ZZZ_copy(&R1,P);
        ECP_ZZZ_dbl(&R0);
        ECP_ZZZ_cswap(&R0,&R1,b);
    }
    ECP_ZZZ_copy(P,&R0);

#else
    /* fixed size windows */
    int i,nb,s,ns;
    BIG_XXX mt,t;
    ECP_ZZZ Q,W[8],C;
    sign8 w[1+(NLEN_XXX*BASEBITS_XXX+3)/4];
#if CURVETYPE_ZZZ==WEIERSTRASS
    BIG_XXX work[8];
#endif
    if (ECP_ZZZ_isinf(P)) return;
    if (BIG_XXX_iszilch(e))
    {
        ECP_ZZZ_inf(P);
        return;
    }

    ECP_ZZZ_affine(P);

    /* precompute table */

    ECP_ZZZ_copy(&Q,P);
    ECP_ZZZ_dbl(&Q);

//printf("Q= ");ECP_output(&Q); printf("\n");

    ECP_ZZZ_copy(&W[0],P);

    for (i=1; i<8; i++)
    {
        ECP_ZZZ_copy(&W[i],&W[i-1]);
        ECP_ZZZ_add(&W[i],&Q);
    }

//printf("W[1]= ");ECP_output(&W[1]); printf("\n");

    /* convert the table to affine */
#if CURVETYPE_ZZZ==WEIERSTRASS
    ECP_ZZZ_multiaffine(8,W,work);
#endif

    /* make exponent odd - add 2P if even, P if odd */
    BIG_XXX_copy(t,e);
    s=BIG_XXX_parity(t);
    BIG_XXX_inc(t,1);
    BIG_XXX_norm(t);
    ns=BIG_XXX_parity(t);
    BIG_XXX_copy(mt,t);
    BIG_XXX_inc(mt,1);
    BIG_XXX_norm(mt);
    BIG_XXX_cmove(t,mt,s);
    ECP_ZZZ_cmove(&Q,P,ns);
    ECP_ZZZ_copy(&C,&Q);

    nb=1+(BIG_XXX_nbits(t)+3)/4;

    /* convert exponent to signed 4-bit window */
    for (i=0; i<nb; i++)
    {
        w[i]=BIG_XXX_lastbits(t,5)-16;
        BIG_XXX_dec(t,w[i]);
        BIG_XXX_norm(t);
        BIG_XXX_fshr(t,4);
    }
    w[nb]=BIG_XXX_lastbits(t,5);

    ECP_ZZZ_copy(P,&W[(w[nb]-1)/2]);
    for (i=nb-1; i>=0; i--)
    {
        ECP_ZZZ_select(&Q,W,w[i]);
        ECP_ZZZ_dbl(P);
        ECP_ZZZ_dbl(P);
        ECP_ZZZ_dbl(P);
        ECP_ZZZ_dbl(P);
        ECP_ZZZ_add(P,&Q);
    }
    ECP_ZZZ_sub(P,&C); /* apply correction */
#endif
    ECP_ZZZ_affine(P);
}

#if CURVETYPE_ZZZ!=MONTGOMERY
/* Set P=eP+fQ double multiplication */
/* constant time - as useful for GLV method in pairings */
/* SU=456 */

void ECP_ZZZ_mul2(ECP_ZZZ *P,ECP_ZZZ *Q,BIG_XXX e,BIG_XXX f)
{
    BIG_XXX te,tf,mt;
    ECP_ZZZ S,T,W[8],C;
    sign8 w[1+(NLEN_XXX*BASEBITS_XXX+1)/2];
    int i,a,b,s,ns,nb;
#if CURVETYPE_ZZZ==WEIERSTRASS
    BIG_XXX work[8];
#endif

    ECP_ZZZ_affine(P);
    ECP_ZZZ_affine(Q);

    BIG_XXX_copy(te,e);
    BIG_XXX_copy(tf,f);

    /* precompute table */
    ECP_ZZZ_copy(&W[1],P);
    ECP_ZZZ_sub(&W[1],Q);  /* P+Q */
    ECP_ZZZ_copy(&W[2],P);
    ECP_ZZZ_add(&W[2],Q);  /* P-Q */
    ECP_ZZZ_copy(&S,Q);
    ECP_ZZZ_dbl(&S);  /* S=2Q */
    ECP_ZZZ_copy(&W[0],&W[1]);
    ECP_ZZZ_sub(&W[0],&S);
    ECP_ZZZ_copy(&W[3],&W[2]);
    ECP_ZZZ_add(&W[3],&S);
    ECP_ZZZ_copy(&T,P);
    ECP_ZZZ_dbl(&T); /* T=2P */
    ECP_ZZZ_copy(&W[5],&W[1]);
    ECP_ZZZ_add(&W[5],&T);
    ECP_ZZZ_copy(&W[6],&W[2]);
    ECP_ZZZ_add(&W[6],&T);
    ECP_ZZZ_copy(&W[4],&W[5]);
    ECP_ZZZ_sub(&W[4],&S);
    ECP_ZZZ_copy(&W[7],&W[6]);
    ECP_ZZZ_add(&W[7],&S);

#if CURVETYPE_ZZZ==WEIERSTRASS
    ECP_ZZZ_multiaffine(8,W,work);
#endif

    /* if multiplier is odd, add 2, else add 1 to multiplier, and add 2P or P to correction */

    s=BIG_XXX_parity(te);
    BIG_XXX_inc(te,1);
    BIG_XXX_norm(te);
    ns=BIG_XXX_parity(te);
    BIG_XXX_copy(mt,te);
    BIG_XXX_inc(mt,1);
    BIG_XXX_norm(mt);
    BIG_XXX_cmove(te,mt,s);
    ECP_ZZZ_cmove(&T,P,ns);
    ECP_ZZZ_copy(&C,&T);

    s=BIG_XXX_parity(tf);
    BIG_XXX_inc(tf,1);
    BIG_XXX_norm(tf);
    ns=BIG_XXX_parity(tf);
    BIG_XXX_copy(mt,tf);
    BIG_XXX_inc(mt,1);
    BIG_XXX_norm(mt);
    BIG_XXX_cmove(tf,mt,s);
    ECP_ZZZ_cmove(&S,Q,ns);
    ECP_ZZZ_add(&C,&S);

    BIG_XXX_add(mt,te,tf);
    BIG_XXX_norm(mt);
    nb=1+(BIG_XXX_nbits(mt)+1)/2;

    /* convert exponent to signed 2-bit window */
    for (i=0; i<nb; i++)
    {
        a=BIG_XXX_lastbits(te,3)-4;
        BIG_XXX_dec(te,a);
        BIG_XXX_norm(te);
        BIG_XXX_fshr(te,2);
        b=BIG_XXX_lastbits(tf,3)-4;
        BIG_XXX_dec(tf,b);
        BIG_XXX_norm(tf);
        BIG_XXX_fshr(tf,2);
        w[i]=4*a+b;
    }
    w[nb]=(4*BIG_XXX_lastbits(te,3)+BIG_XXX_lastbits(tf,3));

    ECP_ZZZ_copy(P,&W[(w[nb]-1)/2]);
    for (i=nb-1; i>=0; i--)
    {
        ECP_ZZZ_select(&T,W,w[i]);
        ECP_ZZZ_dbl(P);
        ECP_ZZZ_dbl(P);
        ECP_ZZZ_add(P,&T);
    }
    ECP_ZZZ_sub(P,&C); /* apply correction */
    ECP_ZZZ_affine(P);
}

#endif


#ifdef HAS_MAIN

int main()
{
    int i;
    ECP_ZZZ G,P;
    csprng RNG;
    BIG_XXX r,s,x,y,b,m,w,q;
    BIG_XXX_rcopy(x,CURVE_Gx);
#if CURVETYPE_ZZZ!=MONTGOMERY
    BIG_XXX_rcopy(y,CURVE_Gy);
#endif
    BIG_XXX_rcopy(m,Modulus_YYY);

    printf("x= ");
    BIG_XXX_output(x);
    printf("\n");
#if CURVETYPE_ZZZ!=MONTGOMERY
    printf("y= ");
    BIG_XXX_output(y);
    printf("\n");
#endif
    RNG_seed(&RNG,3,"abc");

#if CURVETYPE_ZZZ!=MONTGOMERY
    ECP_ZZZ_set(&G,x,y);
#else
    ECP_ZZZ_set(&G,x);
#endif
    if (ECP_ZZZ_isinf(&G)) printf("Failed to set - point not on curve\n");
    else printf("set success\n");

    ECP_ZZZ_output(&G);

    BIG_XXX_rcopy(r,CURVE_Order); //BIG_dec(r,7);
    printf("r= ");
    BIG_XXX_output(r);
    printf("\n");

    ECP_ZZZ_copy(&P,&G);

    ECP_ZZZ_mul(&P,r);

    ECP_ZZZ_output(&P);
//exit(0);
    BIG_XXX_randomnum(w,&RNG);
    BIG_XXX_mod(w,r);

    ECP_ZZZ_copy(&P,&G);
    ECP_ZZZ_mul(&P,w);

    ECP_ZZZ_output(&P);

    return 0;
}

#endif
