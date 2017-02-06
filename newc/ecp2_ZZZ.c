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

/* AMCL Weierstrass elliptic curve functions over FP2 */
/* SU=m, m is Stack Usage */

#include "ecp2_ZZZ.h"

int ECP2_ZZZ_isinf(ECP2_ZZZ *P)
{
    return P->inf;
}

/* Set P=Q */
/* SU= 16 */
void ECP2_ZZZ_copy(ECP2_ZZZ *P,ECP2_ZZZ *Q)
{
    P->inf=Q->inf;
    FP2_YYY_copy(&(P->x),&(Q->x));
    FP2_YYY_copy(&(P->y),&(Q->y));
    FP2_YYY_copy(&(P->z),&(Q->z));
}

/* set P to Infinity */
/* SU= 8 */
void ECP2_ZZZ_inf(ECP2_ZZZ *P)
{
    P->inf=1;
    FP2_YYY_zero(&(P->x));
    FP2_YYY_zero(&(P->y));
    FP2_YYY_zero(&(P->z));
}

/* Conditional move Q to P dependant on d */
static void ECP2_ZZZ_cmove(ECP2_ZZZ *P,ECP2_ZZZ *Q,int d)
{
    FP2_YYY_cmove(&(P->x),&(Q->x),d);
    FP2_YYY_cmove(&(P->y),&(Q->y),d);
    FP2_YYY_cmove(&(P->z),&(Q->z),d);
    d=~(d-1);
    P->inf^=(P->inf^Q->inf)&d;
}

/* return 1 if b==c, no branching */
static int teq(sign32 b,sign32 c)
{
    sign32 x=b^c;
    x-=1;  // if x=0, x now -1
    return (int)((x>>31)&1);
}

/* Constant time select from pre-computed table */
static void ECP2_ZZZ_select(ECP2_ZZZ *P,ECP2_ZZZ W[],sign32 b)
{
    ECP2_ZZZ MP;
    sign32 m=b>>31;
    sign32 babs=(b^m)-m;

    babs=(babs-1)/2;

    ECP2_ZZZ_cmove(P,&W[0],teq(babs,0));  // conditional move
    ECP2_ZZZ_cmove(P,&W[1],teq(babs,1));
    ECP2_ZZZ_cmove(P,&W[2],teq(babs,2));
    ECP2_ZZZ_cmove(P,&W[3],teq(babs,3));
    ECP2_ZZZ_cmove(P,&W[4],teq(babs,4));
    ECP2_ZZZ_cmove(P,&W[5],teq(babs,5));
    ECP2_ZZZ_cmove(P,&W[6],teq(babs,6));
    ECP2_ZZZ_cmove(P,&W[7],teq(babs,7));

    ECP2_ZZZ_copy(&MP,P);
    ECP2_ZZZ_neg(&MP);  // minus P
    ECP2_ZZZ_cmove(P,&MP,(int)(m&1));
}

/* return 1 if P==Q, else 0 */
/* SU= 312 */
int ECP2_ZZZ_equals(ECP2_ZZZ *P,ECP2_ZZZ *Q)
{
    FP2_YYY pz2,qz2,a,b;
    if (P->inf && Q->inf) return 1;
    if (P->inf || Q->inf) return 0;

    FP2_YYY_sqr(&pz2,&(P->z));
    FP2_YYY_sqr(&qz2,&(Q->z));

    FP2_YYY_mul(&a,&(P->x),&qz2);
    FP2_YYY_mul(&b,&(Q->x),&pz2);
    if (!FP2_YYY_equals(&a,&b)) return 0;

    FP2_YYY_mul(&a,&(P->y),&qz2);
    FP2_YYY_mul(&a,&a,&(Q->z));
    FP2_YYY_mul(&b,&(Q->y),&pz2);
    FP2_YYY_mul(&b,&b,&(P->z));
    if (!FP2_YYY_equals(&a,&b)) return 0;
    return 1;
}

/* Make P affine (so z=1) */
/* SU= 232 */
void ECP2_ZZZ_affine(ECP2_ZZZ *P)
{
    FP2_YYY one,iz,izn;
    if (P->inf) return;

    FP2_YYY_one(&one);
    if (FP2_YYY_isunity(&(P->z)))
    {
        FP2_YYY_reduce(&(P->x));
        FP2_YYY_reduce(&(P->y));
        return;
    }

    FP2_YYY_inv(&iz,&(P->z));
    FP2_YYY_sqr(&izn,&iz);
    FP2_YYY_mul(&(P->x),&(P->x),&izn);
    FP2_YYY_mul(&izn,&izn,&iz);
    FP2_YYY_mul(&(P->y),&(P->y),&izn);

    FP2_YYY_reduce(&(P->x));
    FP2_YYY_reduce(&(P->y));
    FP2_YYY_copy(&(P->z),&one);
}

/* extract x, y from point P */
/* SU= 16 */
int ECP2_ZZZ_get(FP2_YYY *x,FP2_YYY *y,ECP2_ZZZ *P)
{
    if (P->inf) return -1;
    ECP2_ZZZ_affine(P);
    FP2_YYY_copy(y,&(P->y));
    FP2_YYY_copy(x,&(P->x));
    return 0;
}

/* SU= 152 */
/* Output point P */
void ECP2_ZZZ_output(ECP2_ZZZ *P)
{
    FP2_YYY x,y;
    if (P->inf)
    {
        printf("Infinity\n");
        return;
    }
    ECP2_ZZZ_get(&x,&y,P);
    printf("(");
    FP2_YYY_output(&x);
    printf(",");
    FP2_YYY_output(&y);
    printf(")\n");
}

/* SU= 232 */
void ECP2_ZZZ_outputxyz(ECP2_ZZZ *P)
{
    ECP2_ZZZ Q;
    if (P->inf)
    {
        printf("Infinity\n");
        return;
    }
    ECP2_ZZZ_copy(&Q,P);
    printf("(");
    FP2_YYY_output(&(Q.x));
    printf(",");
    FP2_YYY_output(&(Q.y));
    printf(",");
    FP2_YYY_output(&(Q.z));
    printf(")\n");
}

/* SU= 168 */
/* Convert Q to octet string */
void ECP2_ZZZ_toOctet(octet *W,ECP2_ZZZ *Q)
{
    FP2_YYY qx,qy;
    ECP2_ZZZ_get(&qx,&qy,Q);
    FP_YYY_redc(qx.a);
    FP_YYY_redc(qx.b);
    FP_YYY_redc(qy.a);
    FP_YYY_redc(qy.b);
    W->len=4*MODBYTES_XXX;

    BIG_XXX_toBytes(&(W->val[0]),qx.a);
    BIG_XXX_toBytes(&(W->val[MODBYTES_XXX]),qx.b);
    BIG_XXX_toBytes(&(W->val[2*MODBYTES_XXX]),qy.a);
    BIG_XXX_toBytes(&(W->val[3*MODBYTES_XXX]),qy.b);
}

/* SU= 176 */
/* restore Q from octet string */
int ECP2_ZZZ_fromOctet(ECP2_ZZZ *Q,octet *W)
{
    FP2_YYY qx,qy;
    BIG_XXX_fromBytes(qx.a,&(W->val[0]));
    BIG_XXX_fromBytes(qx.b,&(W->val[MODBYTES_XXX]));
    BIG_XXX_fromBytes(qy.a,&(W->val[2*MODBYTES_XXX]));
    BIG_XXX_fromBytes(qy.b,&(W->val[3*MODBYTES_XXX]));
    FP_YYY_nres(qx.a);
    FP_YYY_nres(qx.b);
    FP_YYY_nres(qy.a);
    FP_YYY_nres(qy.b);

    if (ECP2_ZZZ_set(Q,&qx,&qy)) return 1;
    return 0;
}

/* SU= 128 */
/* Calculate RHS of twisted curve equation x^3+B/i */
void ECP2_ZZZ_rhs(FP2_YYY *rhs,FP2_YYY *x)
{
    /* calculate RHS of elliptic curve equation */
    FP2_YYY t;
    BIG_XXX b;
    FP2_YYY_sqr(&t,x);

    FP2_YYY_mul(rhs,&t,x);

    /* Assuming CURVE_A=0 */

    BIG_XXX_rcopy(b,CURVE_B_ZZZ);

    FP2_YYY_from_BIG(&t,b);

    FP2_YYY_div_ip(&t);   /* IMPORTANT - here we use the SEXTIC twist of the curve */

    FP2_YYY_add(rhs,&t,rhs);
    FP2_YYY_reduce(rhs);
}


/* Set P=(x,y). Return 1 if (x,y) is on the curve, else return 0*/
/* SU= 232 */
int ECP2_ZZZ_set(ECP2_ZZZ *P,FP2_YYY *x,FP2_YYY *y)
{
    FP2_YYY one,rhs,y2;
    FP2_YYY_copy(&y2,y);

    FP2_YYY_sqr(&y2,&y2);
    ECP2_ZZZ_rhs(&rhs,x);

    if (!FP2_YYY_equals(&y2,&rhs))
    {

        P->inf=1;
        return 0;
    }

    P->inf=0;
    FP2_YYY_copy(&(P->x),x);
    FP2_YYY_copy(&(P->y),y);

    FP2_YYY_one(&one);
    FP2_YYY_copy(&(P->z),&one);
    return 1;
}

/* Set P=(x,y). Return 1 if (x,.) is on the curve, else return 0 */
/* SU= 232 */
int ECP2_ZZZ_setx(ECP2_ZZZ *P,FP2_YYY *x)
{
    FP2_YYY y;
    ECP2_ZZZ_rhs(&y,x);

    if (!FP2_YYY_sqrt(&y,&y))
    {
        P->inf=1;
        return 0;
    }

    P->inf=0;
    FP2_YYY_copy(&(P->x),x);
    FP2_YYY_copy(&(P->y),&y);
    FP2_YYY_one(&(P->z));
    return 1;
}

/* Set P=-P */
/* SU= 8 */
void ECP2_ZZZ_neg(ECP2_ZZZ *P)
{
    FP2_YYY_neg(&(P->y),&(P->y));
    FP2_YYY_norm(&(P->y));
}

/* R+=R */
/* return -1 for Infinity, 0 for addition, 1 for doubling */
/* SU= 448 */
int ECP2_ZZZ_dbl(ECP2_ZZZ *P)
{
    FP2_YYY w1,w7,w8,w2,w3;
    if (P->inf) return -1;

    if (FP2_YYY_iszilch(&(P->y)))
    {
        P->inf=1;
        return -1;
    }

    /* Assuming A=0 */
    FP2_YYY_sqr(&w1,&(P->x));
    FP2_YYY_imul(&w8,&w1,3);

    FP2_YYY_sqr(&w2,&(P->y));
    FP2_YYY_mul(&w3,&(P->x),&w2);
    FP2_YYY_imul(&w3,&w3,4);

    FP2_YYY_neg(&w1,&w3);

    FP2_YYY_norm(&w1);

    FP2_YYY_sqr(&(P->x),&w8);
    FP2_YYY_add(&(P->x),&(P->x),&w1);
    FP2_YYY_add(&(P->x),&(P->x),&w1);

    FP2_YYY_norm(&(P->x));

    if (FP2_YYY_isunity(&(P->z))) FP2_YYY_copy(&(P->z),&(P->y));
    else FP2_YYY_mul(&(P->z),&(P->z),&(P->y));
    FP2_YYY_add(&(P->z),&(P->z),&(P->z));

    FP2_YYY_add(&w7,&w2,&w2);
    FP2_YYY_sqr(&w2,&w7);

    FP2_YYY_add(&w2,&w2,&w2);
    FP2_YYY_sub(&w3,&w3,&(P->x));
    FP2_YYY_mul(&(P->y),&w8,&w3);
    FP2_YYY_sub(&(P->y),&(P->y),&w2);


    FP2_YYY_norm(&(P->y));
    FP2_YYY_norm(&(P->z));

    return 1;
}

/* Set P+=Q */
/* SU= 400 */
int ECP2_ZZZ_add(ECP2_ZZZ *P,ECP2_ZZZ *Q)
{
    int aff;
    FP2_YYY B,D,E,C,A;
    if (Q->inf) return 0;
    if (P->inf)
    {
        ECP2_ZZZ_copy(P,Q);
        return 0;
    }

    aff=1;
    if (!FP2_YYY_isunity(&(Q->z))) aff=0;

    if (!aff)
    {
        FP2_YYY_sqr(&A,&(Q->z));
        FP2_YYY_mul(&C,&A,&(Q->z));

        FP2_YYY_sqr(&B,&(P->z));
        FP2_YYY_mul(&D,&B,&(P->z));

        FP2_YYY_mul(&A,&(P->x),&A);
        FP2_YYY_mul(&C,&(P->y),&C);
    }
    else
    {
        FP2_YYY_copy(&A,&(P->x));
        FP2_YYY_copy(&C,&(P->y));

        FP2_YYY_sqr(&B,&(P->z));
        FP2_YYY_mul(&D,&B,&(P->z));
    }

    FP2_YYY_mul(&B,&(Q->x),&B);
    FP2_YYY_sub(&B,&B,&A); /* B=Qx.z^2-x.Qz^2 */
    FP2_YYY_mul(&D,&(Q->y),&D);
    FP2_YYY_sub(&D,&D,&C); /* D=Qy.z^3-y.Qz^3 */

    if (FP2_YYY_iszilch(&B))
    {
        if (FP2_YYY_iszilch(&D))
        {
            ECP2_ZZZ_dbl(P);
            return 1;
        }
        else
        {
            ECP2_ZZZ_inf(P);
            return -1;
        }
    }
    if (!aff) FP2_YYY_mul(&(P->z),&(P->z),&(Q->z));
    FP2_YYY_mul(&(P->z),&(P->z),&B);

    FP2_YYY_sqr(&E,&B);
    FP2_YYY_mul(&B,&B,&E);
    FP2_YYY_mul(&A,&A,&E);

    FP2_YYY_add(&E,&A,&A);
    FP2_YYY_add(&E,&E,&B);

    FP2_YYY_sqr(&(P->x),&D);
    FP2_YYY_sub(&(P->x),&(P->x),&E);

    FP2_YYY_sub(&A,&A,&(P->x));
    FP2_YYY_mul(&(P->y),&A,&D);
    FP2_YYY_mul(&C,&C,&B);
    FP2_YYY_sub(&(P->y),&(P->y),&C);

    FP2_YYY_norm(&(P->x));
    FP2_YYY_norm(&(P->y));
    FP2_YYY_norm(&(P->z));

    return 0;
}

/* Set P-=Q */
/* SU= 16 */
void ECP2_ZZZ_sub(ECP2_ZZZ *P,ECP2_ZZZ *Q)
{
    ECP2_ZZZ_neg(Q);
    ECP2_ZZZ_add(P,Q);
    ECP2_ZZZ_neg(Q);
}

/* normalises m-array of ECP2 points. Requires work vector of m FP2s */
/* SU= 200 */
static void ECP2_ZZZ_multiaffine(int m,ECP2_ZZZ *P,FP2_YYY *work)
{
    int i;
    FP2_YYY t1,t2;

    FP2_YYY_one(&work[0]);
    FP2_YYY_copy(&work[1],&(P[0].z));
    for (i=2; i<m; i++)
        FP2_YYY_mul(&work[i],&work[i-1],&(P[i-1].z));
    FP2_YYY_mul(&t1,&work[m-1],&(P[m-1].z));

    FP2_YYY_inv(&t1,&t1);

    FP2_YYY_copy(&t2,&(P[m-1].z));
    FP2_YYY_mul(&work[m-1],&work[m-1],&t1);

    for (i=m-2;; i--)
    {
        if (i==0)
        {
            FP2_YYY_mul(&work[0],&t1,&t2);
            break;
        }
        FP2_YYY_mul(&work[i],&work[i],&t2);
        FP2_YYY_mul(&work[i],&work[i],&t1);
        FP2_YYY_mul(&t2,&(P[i].z),&t2);
    }
    /* now work[] contains inverses of all Z coordinates */

    for (i=0; i<m; i++)
    {
        FP2_YYY_one(&(P[i].z));
        FP2_YYY_sqr(&t1,&work[i]);
        FP2_YYY_mul(&(P[i].x),&(P[i].x),&t1);
        FP2_YYY_mul(&t1,&work[i],&t1);
        FP2_YYY_mul(&(P[i].y),&(P[i].y),&t1);
    }
}

/* P*=e */
/* SU= 280 */
void ECP2_ZZZ_mul(ECP2_ZZZ *P,BIG_XXX e)
{
    /* fixed size windows */
    int i,nb,s,ns;
    BIG_XXX mt,t;
    ECP2_ZZZ Q,W[8],C;
    sign8 w[1+(NLEN_XXX*BASEBITS_XXX+3)/4];
    FP2_YYY work[8];

    if (ECP2_ZZZ_isinf(P)) return;
    ECP2_ZZZ_affine(P);


    /* precompute table */

    ECP2_ZZZ_copy(&Q,P);
    ECP2_ZZZ_dbl(&Q);
    ECP2_ZZZ_copy(&W[0],P);

    for (i=1; i<8; i++)
    {
        ECP2_ZZZ_copy(&W[i],&W[i-1]);
        ECP2_ZZZ_add(&W[i],&Q);
    }

    /* convert the table to affine */

    ECP2_ZZZ_multiaffine(8,W,work);

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
    ECP2_ZZZ_cmove(&Q,P,ns);
    ECP2_ZZZ_copy(&C,&Q);

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

    ECP2_ZZZ_copy(P,&W[(w[nb]-1)/2]);
    for (i=nb-1; i>=0; i--)
    {
        ECP2_ZZZ_select(&Q,W,w[i]);
        ECP2_ZZZ_dbl(P);
        ECP2_ZZZ_dbl(P);
        ECP2_ZZZ_dbl(P);
        ECP2_ZZZ_dbl(P);
        ECP2_ZZZ_add(P,&Q);
    }
    ECP2_ZZZ_sub(P,&C); /* apply correction */
    ECP2_ZZZ_affine(P);
}

/* Calculates q.P using Frobenius constant X */
/* SU= 96 */
void ECP2_ZZZ_frob(ECP2_ZZZ *P,FP2_YYY *X)
{
    FP2_YYY X2;
    if (P->inf) return;
    FP2_YYY_sqr(&X2,X);
    FP2_YYY_conj(&(P->x),&(P->x));
    FP2_YYY_conj(&(P->y),&(P->y));
    FP2_YYY_conj(&(P->z),&(P->z));
    FP2_YYY_reduce(&(P->z));

    FP2_YYY_mul(&(P->x),&X2,&(P->x));
    FP2_YYY_mul(&(P->y),&X2,&(P->y));
    FP2_YYY_mul(&(P->y),X,&(P->y));
}

void ECP2_ZZZ_mul4(ECP2_ZZZ *P,ECP2_ZZZ Q[4],BIG_XXX u[4])
{
    int i,j,a[4],nb;
    ECP2_ZZZ W[8],T,C;
    BIG_XXX mt,t[4];
    FP2_YYY work[8];
    sign8 w[NLEN_XXX*BASEBITS_XXX+1];

    for (i=0; i<4; i++)
    {
        BIG_XXX_copy(t[i],u[i]);
        ECP2_ZZZ_affine(&Q[i]);
    }

    /* precompute table */

    ECP2_ZZZ_copy(&W[0],&Q[0]);
    ECP2_ZZZ_sub(&W[0],&Q[1]);  /* P-Q */
    ECP2_ZZZ_copy(&W[1],&W[0]);
    ECP2_ZZZ_copy(&W[2],&W[0]);
    ECP2_ZZZ_copy(&W[3],&W[0]);
    ECP2_ZZZ_copy(&W[4],&Q[0]);
    ECP2_ZZZ_add(&W[4],&Q[1]);  /* P+Q */
    ECP2_ZZZ_copy(&W[5],&W[4]);
    ECP2_ZZZ_copy(&W[6],&W[4]);
    ECP2_ZZZ_copy(&W[7],&W[4]);

    ECP2_ZZZ_copy(&T,&Q[2]);
    ECP2_ZZZ_sub(&T,&Q[3]);       /* R-S */
    ECP2_ZZZ_sub(&W[1],&T);
    ECP2_ZZZ_add(&W[2],&T);
    ECP2_ZZZ_sub(&W[5],&T);
    ECP2_ZZZ_add(&W[6],&T);
    ECP2_ZZZ_copy(&T,&Q[2]);
    ECP2_ZZZ_add(&T,&Q[3]);      /* R+S */
    ECP2_ZZZ_sub(&W[0],&T);
    ECP2_ZZZ_add(&W[3],&T);
    ECP2_ZZZ_sub(&W[4],&T);
    ECP2_ZZZ_add(&W[7],&T);

    ECP2_ZZZ_multiaffine(8,W,work);

    /* if multiplier is even add 1 to multiplier, and add P to correction */
    ECP2_ZZZ_inf(&C);

    BIG_XXX_zero(mt);
    for (i=0; i<4; i++)
    {
        if (BIG_XXX_parity(t[i])==0)
        {
            BIG_XXX_inc(t[i],1);
            BIG_XXX_norm(t[i]);
            ECP2_ZZZ_add(&C,&Q[i]);
        }
        BIG_XXX_add(mt,mt,t[i]);
        BIG_XXX_norm(mt);
    }

    nb=1+BIG_XXX_nbits(mt);

    /* convert exponent to signed 1-bit window */
    for (j=0; j<nb; j++)
    {
        for (i=0; i<4; i++)
        {
            a[i]=BIG_XXX_lastbits(t[i],2)-2;
            BIG_XXX_dec(t[i],a[i]);
            BIG_XXX_norm(t[i]);
            BIG_XXX_fshr(t[i],1);
        }
        w[j]=8*a[0]+4*a[1]+2*a[2]+a[3];
    }
    w[nb]=8*BIG_XXX_lastbits(t[0],2)+4*BIG_XXX_lastbits(t[1],2)+2*BIG_XXX_lastbits(t[2],2)+BIG_XXX_lastbits(t[3],2);

    ECP2_ZZZ_copy(P,&W[(w[nb]-1)/2]);
    for (i=nb-1; i>=0; i--)
    {
        ECP2_ZZZ_select(&T,W,w[i]);
        ECP2_ZZZ_dbl(P);
        ECP2_ZZZ_add(P,&T);
    }
    ECP2_ZZZ_sub(P,&C); /* apply correction */

    ECP2_ZZZ_affine(P);
}

/*

int main()
{
	int i;
	ECP2_ZZZ G,P;
	ECP2_ZZZ *W;
	FP2_YYY x,y,w,z,f;
	BIG_XXX r,xa,xb,ya,yb;

	BIG_XXX_rcopy(xa,CURVE_Pxa_ZZZ);
	BIG_XXX_rcopy(xb,CURVE_Pxb_ZZZ);
	BIG_XXX_rcopy(ya,CURVE_Pya_ZZZ);
	BIG_XXX_rcopy(yb,CURVE_Pyb_ZZZ);

	FP2_YYY_from_BIGs(&x,xa,xb);
	FP2_YYY_from_BIGs(&y,ya,yb);
	ECP2_ZZZ_set(&G,&x,&y);
	if (G.inf) printf("Failed to set - point not on curve\n");
	else printf("set success\n");

	ECP2_ZZZ_output(&G);

//	BIG_XXX_copy(r,CURVE_Order_ZZZ);
	BIG_XXX_rcopy(r,Modulus_YYY);

	ECP2_ZZZ_copy(&P,&G);

	ECP2_ZZZ_mul(&P,r);

	ECP2_ZZZ_output(&P);

	FP2_YYY_gfc(&f,12);

	ECP2_ZZZ_frob(&G,&f);

	ECP2_ZZZ_output(&G);

	return 0;
}

*/
