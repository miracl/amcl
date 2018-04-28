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

//#include <iostream>
#include "ECP8_ZZZ.h"


int ECP8_ZZZ_isinf(ECP8_ZZZ *P)
{
	if (P->inf) return 1;
	P->inf=FP8_YYY_iszilch(&(P->x));
    return P->inf;
}

/* Set P=Q */
void ECP8_ZZZ_copy(ECP8_ZZZ *P,ECP8_ZZZ *Q)
{
    P->inf=Q->inf;
    FP8_YYY_copy(&(P->x),&(Q->x));
    FP8_YYY_copy(&(P->y),&(Q->y));
}

/* set P to Infinity */
void ECP8_ZZZ_inf(ECP8_ZZZ *P)
{
    P->inf=1;
    FP8_YYY_zero(&(P->x));
    FP8_YYY_one(&(P->y));
}

/* Conditional move Q to P dependant on d */
static void ECP8_ZZZ_cmove(ECP8_ZZZ *P,ECP8_ZZZ *Q,int d)
{
    FP8_YYY_cmove(&(P->x),&(Q->x),d);
    FP8_YYY_cmove(&(P->y),&(Q->y),d);
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
static void ECP8_ZZZ_select(ECP8_ZZZ *P,ECP8_ZZZ W[],sign32 b)
{
    ECP8_ZZZ MP;
    sign32 m=b>>31;
    sign32 babs=(b^m)-m;

    babs=(babs-1)/2;

    ECP8_ZZZ_cmove(P,&W[0],teq(babs,0));  // conditional move
    ECP8_ZZZ_cmove(P,&W[1],teq(babs,1));
    ECP8_ZZZ_cmove(P,&W[2],teq(babs,2));
    ECP8_ZZZ_cmove(P,&W[3],teq(babs,3));
    ECP8_ZZZ_cmove(P,&W[4],teq(babs,4));
    ECP8_ZZZ_cmove(P,&W[5],teq(babs,5));
    ECP8_ZZZ_cmove(P,&W[6],teq(babs,6));
    ECP8_ZZZ_cmove(P,&W[7],teq(babs,7));

    ECP8_ZZZ_copy(&MP,P);
    ECP8_ZZZ_neg(&MP);  // minus P
    ECP8_ZZZ_cmove(P,&MP,(int)(m&1));
}

/* return 1 if P==Q, else 0 */
/* SU= 312 */
int ECP8_ZZZ_equals(ECP8_ZZZ *P,ECP8_ZZZ *Q)
{
    if (ECP8_ZZZ_isinf(P) && ECP8_ZZZ_isinf(Q)) return 1;
    if (ECP8_ZZZ_isinf(P) || ECP8_ZZZ_isinf(Q)) return 0;

    if (!FP8_YYY_equals(&(P->x),&(Q->x))) return 0;
    if (!FP8_YYY_equals(&(P->y),&(Q->y))) return 0;
    return 1;
}

/* extract x, y from point P */
int ECP8_ZZZ_get(FP8_YYY *x,FP8_YYY *y,ECP8_ZZZ *P)
{
    if (P->inf) return -1;
    FP8_YYY_copy(y,&(P->y));
    FP8_YYY_copy(x,&(P->x));
    return 0;
}

/* Output point P */
void ECP8_ZZZ_output(ECP8_ZZZ *P)
{
    FP8_YYY x,y;
    if (P->inf)
    {
        printf("Infinity\n");
        return;
    }
    ECP8_ZZZ_get(&x,&y,P);
    printf("(");
    FP8_YYY_output(&x);
    printf(",");
    FP8_YYY_output(&y);
    printf(")\n");
}

/* Convert Q to octet string */
void ECP8_ZZZ_toOctet(octet *W,ECP8_ZZZ *Q)
{
	BIG_XXX b;
	FP8_YYY qx,qy;
	FP4_YYY qa,qb;
	FP2_YYY pa,pb;

    ECP8_ZZZ_get(&qx,&qy,Q);

	FP4_YYY_copy(&qa,&(qx.a));
	FP4_YYY_copy(&qb,&(qx.b));

	FP2_YYY_copy(&pa,&(qa.a));
	FP2_YYY_copy(&pb,&(qa.b));

	FP_YYY_redc(b,&(pa.a));
    BIG_XXX_toBytes(&(W->val[0]),b);
    FP_YYY_redc(b,&(pa.b));
    BIG_XXX_toBytes(&(W->val[MODBYTES_XXX]),b);
    FP_YYY_redc(b,&(pb.a));
    BIG_XXX_toBytes(&(W->val[2*MODBYTES_XXX]),b);
    FP_YYY_redc(b,&(pb.b));
    BIG_XXX_toBytes(&(W->val[3*MODBYTES_XXX]),b);

	FP2_YYY_copy(&pa,&(qb.a));
	FP2_YYY_copy(&pb,&(qb.b));

	FP_YYY_redc(b,&(pa.a));
    BIG_XXX_toBytes(&(W->val[4*MODBYTES_XXX]),b);
    FP_YYY_redc(b,&(pa.b));
    BIG_XXX_toBytes(&(W->val[5*MODBYTES_XXX]),b);
    FP_YYY_redc(b,&(pb.a));
    BIG_XXX_toBytes(&(W->val[6*MODBYTES_XXX]),b);
    FP_YYY_redc(b,&(pb.b));
    BIG_XXX_toBytes(&(W->val[7*MODBYTES_XXX]),b);


	FP4_YYY_copy(&qa,&(qy.a));
	FP4_YYY_copy(&qb,&(qy.b));

	FP2_YYY_copy(&pa,&(qa.a));
	FP2_YYY_copy(&pb,&(qa.b));

	FP_YYY_redc(b,&(pa.a));
    BIG_XXX_toBytes(&(W->val[8*MODBYTES_XXX]),b);
    FP_YYY_redc(b,&(pa.b));
    BIG_XXX_toBytes(&(W->val[9*MODBYTES_XXX]),b);
    FP_YYY_redc(b,&(pb.a));
    BIG_XXX_toBytes(&(W->val[10*MODBYTES_XXX]),b);
    FP_YYY_redc(b,&(pb.b));
    BIG_XXX_toBytes(&(W->val[11*MODBYTES_XXX]),b);

	FP2_YYY_copy(&pa,&(qb.a));
	FP2_YYY_copy(&pb,&(qb.b));

	FP_YYY_redc(b,&(pa.a));
    BIG_XXX_toBytes(&(W->val[12*MODBYTES_XXX]),b);
    FP_YYY_redc(b,&(pa.b));
    BIG_XXX_toBytes(&(W->val[13*MODBYTES_XXX]),b);
    FP_YYY_redc(b,&(pb.a));
    BIG_XXX_toBytes(&(W->val[14*MODBYTES_XXX]),b);
    FP_YYY_redc(b,&(pb.b));
    BIG_XXX_toBytes(&(W->val[15*MODBYTES_XXX]),b);


    W->len=16*MODBYTES_XXX;
}

/* restore Q from octet string */
int ECP8_ZZZ_fromOctet(ECP8_ZZZ *Q,octet *W)
{
	BIG_XXX b;
    FP8_YYY qx,qy;
	FP4_YYY qa,qb;
	FP2_YYY pa,pb;

    BIG_XXX_fromBytes(b,&(W->val[0]));
	FP_YYY_nres(&(pa.a),b);
    BIG_XXX_fromBytes(b,&(W->val[MODBYTES_XXX]));
    FP_YYY_nres(&(pa.b),b);
    BIG_XXX_fromBytes(b,&(W->val[2*MODBYTES_XXX]));
    FP_YYY_nres(&(pb.a),b);
    BIG_XXX_fromBytes(b,&(W->val[3*MODBYTES_XXX]));
    FP_YYY_nres(&(pb.b),b);

	FP2_YYY_copy(&(qa.a),&pa);
	FP2_YYY_copy(&(qa.b),&pb);

    BIG_XXX_fromBytes(b,&(W->val[4*MODBYTES_XXX]));
	FP_YYY_nres(&(pa.a),b);
    BIG_XXX_fromBytes(b,&(W->val[5*MODBYTES_XXX]));
    FP_YYY_nres(&(pa.b),b);
    BIG_XXX_fromBytes(b,&(W->val[6*MODBYTES_XXX]));
    FP_YYY_nres(&(pb.a),b);
    BIG_XXX_fromBytes(b,&(W->val[7*MODBYTES_XXX]));
    FP_YYY_nres(&(pb.b),b);

	FP2_YYY_copy(&(qb.a),&pa);
	FP2_YYY_copy(&(qb.b),&pb);

	FP4_YYY_copy(&(qx.a),&qa);
	FP4_YYY_copy(&(qx.b),&qb);


    BIG_XXX_fromBytes(b,&(W->val[8*MODBYTES_XXX]));
	FP_YYY_nres(&(pa.a),b);
    BIG_XXX_fromBytes(b,&(W->val[9*MODBYTES_XXX]));
    FP_YYY_nres(&(pa.b),b);
    BIG_XXX_fromBytes(b,&(W->val[10*MODBYTES_XXX]));
    FP_YYY_nres(&(pb.a),b);
    BIG_XXX_fromBytes(b,&(W->val[11*MODBYTES_XXX]));
    FP_YYY_nres(&(pb.b),b);

	FP2_YYY_copy(&(qa.a),&pa);
	FP2_YYY_copy(&(qa.b),&pb);

    BIG_XXX_fromBytes(b,&(W->val[12*MODBYTES_XXX]));
	FP_YYY_nres(&(pa.a),b);
    BIG_XXX_fromBytes(b,&(W->val[13*MODBYTES_XXX]));
    FP_YYY_nres(&(pa.b),b);
    BIG_XXX_fromBytes(b,&(W->val[14*MODBYTES_XXX]));
    FP_YYY_nres(&(pb.a),b);
    BIG_XXX_fromBytes(b,&(W->val[15*MODBYTES_XXX]));
    FP_YYY_nres(&(pb.b),b);

	FP2_YYY_copy(&(qb.a),&pa);
	FP2_YYY_copy(&(qb.b),&pb);

	FP4_YYY_copy(&(qy.a),&qa);
	FP4_YYY_copy(&(qy.b),&qb);


    if (ECP8_ZZZ_set(Q,&qx,&qy)) return 1;
    return 0;
}

/* Calculate RHS of twisted curve equation x^3+B/i or x^3+Bi*/
void ECP8_ZZZ_rhs(FP8_YYY *rhs,FP8_YYY *x)
{
    /* calculate RHS of elliptic curve equation */
    FP8_YYY t;
	FP4_YYY t4;
	FP2_YYY t2;
    BIG_XXX b;
    FP8_YYY_sqr(&t,x);

    FP8_YYY_mul(rhs,&t,x);

    /* Assuming CURVE_A=0 */

    BIG_XXX_rcopy(b,CURVE_B_ZZZ);

    FP2_YYY_from_BIG(&t2,b);
	FP4_YYY_from_FP2(&t4,&t2);
	FP8_YYY_from_FP4(&t,&t4);

#if SEXTIC_TWIST_ZZZ == D_TYPE	
    FP8_YYY_div_i(&t);   /* IMPORTANT - here we use the correct SEXTIC twist of the curve */
#endif

#if SEXTIC_TWIST_ZZZ == M_TYPE	
    FP8_YYY_times_i(&t);   /* IMPORTANT - here we use the correct SEXTIC twist of the curve */
#endif

    FP8_YYY_add(rhs,&t,rhs);
    FP8_YYY_reduce(rhs);
}

/* Set P=(x,y). Return 1 if (x,y) is on the curve, else return 0*/
/* SU= 232 */
int ECP8_ZZZ_set(ECP8_ZZZ *P,FP8_YYY *x,FP8_YYY *y)
{
    FP8_YYY rhs,y2;

    FP8_YYY_sqr(&y2,y);
    ECP8_ZZZ_rhs(&rhs,x);

    if (!FP8_YYY_equals(&y2,&rhs))
    {
        P->inf=1;
        return 0;
    }

    P->inf=0;
    FP8_YYY_copy(&(P->x),x);
    FP8_YYY_copy(&(P->y),y);
    return 1;
}

/* Set P=(x,y). Return 1 if (x,.) is on the curve, else return 0 */
/* SU= 232 */
int ECP8_ZZZ_setx(ECP8_ZZZ *P,FP8_YYY *x)
{
    FP8_YYY y;
    ECP8_ZZZ_rhs(&y,x);

    if (!FP8_YYY_sqrt(&y,&y))
    {
        P->inf=1;
        return 0;
    }

    P->inf=0;
    FP8_YYY_copy(&(P->x),x);
    FP8_YYY_copy(&(P->y),&y);

    return 1;
}

/* Set P=-P */
/* SU= 8 */
void ECP8_ZZZ_neg(ECP8_ZZZ *P)
{
//	if (ECP8_ZZZ_isinf(P)) return;
	FP8_YYY_norm(&(P->y));
    FP8_YYY_neg(&(P->y),&(P->y));
    FP8_YYY_norm(&(P->y));
}


int ECP8_ZZZ_dbl(ECP8_ZZZ *P)
{
	FP8_YYY lam;
	return ECP8_ZZZ_sdbl(P,&lam);
}

int ECP8_ZZZ_add(ECP8_ZZZ *P,ECP8_ZZZ *Q)
{
	FP8_YYY lam;
	return ECP8_ZZZ_sadd(P,Q,&lam);
}

/* R+=R */
/* return -1 for Infinity, 0 for addition, 1 for doubling */
int ECP8_ZZZ_sdbl(ECP8_ZZZ *P,FP8_YYY *lam)
{
    FP8_YYY t,t2;
    if (P->inf) return -1;
	if (FP8_YYY_iszilch(&(P->y)))
	{
		FP8_YYY_zero(&(P->x));
		P->inf=1;
		return -1;
	}

	FP8_YYY_sqr(lam,&(P->x));
	FP8_YYY_imul(lam,lam,3);

	FP8_YYY_add(&t,&(P->y),&(P->y));
	FP8_YYY_norm(&t);

	FP8_YYY_inv(&t,&t);
	FP8_YYY_mul(lam,lam,&t);

	FP8_YYY_copy(&t,&(P->x));
	FP8_YYY_add(&t2,&(P->x),&(P->x));
	FP8_YYY_sqr(&(P->x),lam);

	FP8_YYY_norm(&t2);
	FP8_YYY_sub(&(P->x),&(P->x),&t2);

	FP8_YYY_norm(&(P->x));	
	FP8_YYY_sub(&t,&t,&(P->x));
	FP8_YYY_norm(&t);

	FP8_YYY_mul(&t,&t,lam);
	FP8_YYY_sub(&t,&t,&(P->y));
	FP8_YYY_copy(&(P->y),&t);

	FP8_YYY_norm(&(P->y));	

    return 1;
}

/* Set P+=Q */

int ECP8_ZZZ_sadd(ECP8_ZZZ *P,ECP8_ZZZ *Q,FP8_YYY *lam)
{
    FP8_YYY t,t2;
    if (Q->inf) return 0;
    if (P->inf)
    {
        ECP8_ZZZ_copy(P,Q);
		FP8_YYY_zero(lam);
        return 0;
    }

	if (P==Q)
	{
		ECP8_ZZZ_sdbl(P,lam);
		return 1;
	}

	if (FP8_YYY_equals(&(P->x),&(Q->x)))
	{
		if (FP8_YYY_equals(&(P->y),&(Q->y)))
		{
			ECP8_ZZZ_copy(P,Q);
			ECP8_ZZZ_sdbl(P,lam);
			return 1;
		}
		else
		{
			FP8_YYY_zero(&(P->y));
			FP8_YYY_zero(&(P->x));
			P->inf=1;
			return -1;
		}
	}

	FP8_YYY_sub(lam,&(P->y),&(Q->y));
	FP8_YYY_norm(lam);
	FP8_YYY_sub(&t2,&(P->x),&(Q->x));
	FP8_YYY_norm(&t2);
	FP8_YYY_inv(&t2,&t2);
	FP8_YYY_mul(lam,lam,&t2);

	FP8_YYY_add(&(P->x),&(P->x),&(Q->x));
	FP8_YYY_sqr(&t,lam);

	FP8_YYY_norm(&(P->x));
	FP8_YYY_sub(&t,&t,&(P->x));

	FP8_YYY_copy(&(P->x),&t);
	FP8_YYY_norm(&(P->x));

	FP8_YYY_sub(&(P->y),&(Q->x),&(P->x));
	FP8_YYY_norm(&(P->y));

	FP8_YYY_mul(&(P->y),&(P->y),lam);
	FP8_YYY_sub(&(P->y),&(P->y),&(Q->y));

	FP8_YYY_norm(&(P->y));

    return 0;
}

/* Set P-=Q */
/* SU= 16 */
void ECP8_ZZZ_sub(ECP8_ZZZ *P,ECP8_ZZZ *Q)
{
    ECP8_ZZZ_neg(Q);
    ECP8_ZZZ_add(P,Q);
    ECP8_ZZZ_neg(Q);
}


void ECP8_ZZZ_reduce(ECP8_ZZZ *P)
{
	FP8_YYY_reduce(&(P->x));
	FP8_YYY_reduce(&(P->y));
}

/* P*=e */
/* SU= 280 */
void ECP8_ZZZ_mul(ECP8_ZZZ *P,BIG_XXX e)
{
    /* fixed size windows */
    int i,nb,s,ns;
    BIG_XXX mt,t;
    ECP8_ZZZ Q,W[8],C;
    sign8 w[1+(NLEN_XXX*BASEBITS_XXX+3)/4];

    if (ECP8_ZZZ_isinf(P)) return;

    /* precompute table */

    ECP8_ZZZ_copy(&Q,P);
    ECP8_ZZZ_dbl(&Q);
    ECP8_ZZZ_copy(&W[0],P);

    for (i=1; i<8; i++)
    {
        ECP8_ZZZ_copy(&W[i],&W[i-1]);
        ECP8_ZZZ_add(&W[i],&Q);
    }

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
    ECP8_ZZZ_cmove(&Q,P,ns);
    ECP8_ZZZ_copy(&C,&Q);

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

    ECP8_ZZZ_copy(P,&W[(w[nb]-1)/2]);
    for (i=nb-1; i>=0; i--)
    {
        ECP8_ZZZ_select(&Q,W,w[i]);
        ECP8_ZZZ_dbl(P);
        ECP8_ZZZ_dbl(P);
        ECP8_ZZZ_dbl(P);
        ECP8_ZZZ_dbl(P);
        ECP8_ZZZ_add(P,&Q);
    }
    ECP8_ZZZ_sub(P,&C); /* apply correction */
	ECP8_ZZZ_reduce(P);
}

void ECP8_ZZZ_frob_constants(FP2_YYY F[3])
{
    FP_YYY fx,fy;
	FP2_YYY X;

    FP_YYY_rcopy(&fx,Fra_YYY);
    FP_YYY_rcopy(&fy,Frb_YYY);
    FP2_YYY_from_FPs(&X,&fx,&fy);


	FP2_YYY_sqr(&F[0],&X);			// FF=F^2=(1+i)^(p-19)/12
	FP2_YYY_copy(&F[2],&F[0]);
	FP2_YYY_mul_ip(&F[2]);			// W=(1+i)^12/12.(1+i)^(p-19)/12 = (1+i)^(p-7)/12
	FP2_YYY_norm(&F[2]);
	FP2_YYY_sqr(&F[1],&F[2]);
	FP2_YYY_mul(&F[2],&F[2],&F[1]);	// W=(1+i)^(p-7)/4

	FP2_YYY_mul_ip(&F[2]);			// W=(1+i)^4/4.W=(1+i)^(p-7)/4 = (1+i)^(p-3)/4
	FP2_YYY_norm(&F[2]);

	FP2_YYY_copy(&F[1],&X);

#if SEXTIC_TWIST_ZZZ == M_TYPE	
	FP2_YYY_mul_ip(&F[1]);		// (1+i)^24/24.(1+i)^(p-19)/24 = (1+i)^(p+5)/24
	FP2_YYY_inv(&F[1],&F[1]);		// (1+i)^-(p+5)/24
	FP2_YYY_sqr(&F[0],&F[1]);		// (1+i)^-(p+5)/12
#endif


	FP2_YYY_mul_ip(&F[0]);		// FF=(1+i)^(p-19)/12.(1+i)^12/12 = (1+i)^(p-7)/12					// FF=(1+i)^12/12.(1+i)^-(p+5)/12 = (1+i)^-(p-7)/12
	FP2_YYY_norm(&F[0]);

	FP2_YYY_mul(&F[1],&F[1],&F[0]);  // (1+i)^(p-7)/12 . (1+i)^(p-19)/24 = (1+i)^(p-11)/8				// (1+i)^-(p-7)/12 . (1+i)^-(p+5)/24 = (1+i)^-(p-3)/8

}

/* Calculates q^n.P using Frobenius constant X */
void ECP8_ZZZ_frob(ECP8_ZZZ *P,FP2_YYY F[3],int n)
{
	int i;
	FP8_YYY X,Y;

    if (P->inf) return;

	ECP8_ZZZ_get(&X,&Y,P);		// F=(1+i)^(p-19)/24
/*
	FP2_YYY_sqr(&FF,F);			// FF=F^2=(1+i)^(p-19)/12
	FP2_YYY_copy(&W,&FF);
	FP2_YYY_mul_ip(&W);			// W=(1+i)^12/12.(1+i)^(p-19)/12 = (1+i)^(p-7)/12
	FP2_YYY_norm(&W);
	FP2_YYY_sqr(&FFF,&W);
	FP2_YYY_mul(&W,&W,&FFF);	// W=(1+i)^(p-7)/4

	FP2_YYY_mul_ip(&W);			// W=(1+i)^4/4.W=(1+i)^(p-7)/4 = (1+i)^(p-3)/4
	FP2_YYY_norm(&W);

	FP2_YYY_copy(&FFF,F);

#if SEXTIC_TWIST_ZZZ == M_TYPE	
	FP2_YYY_mul_ip(&FFF);		// (1+i)^24/24.(1+i)^(p-19)/24 = (1+i)^(p+5)/24
	FP2_YYY_inv(&FFF,&FFF);		// (1+i)^-(p+5)/24
	FP2_YYY_sqr(&FF,&FFF);		// (1+i)^-(p+5)/12
#endif


	FP2_YYY_mul_ip(&FF);		// FF=(1+i)^(p-19)/12.(1+i)^12/12 = (1+i)^(p-7)/12					// FF=(1+i)^12/12.(1+i)^-(p+5)/12 = (1+i)^-(p-7)/12
	FP2_YYY_norm(&FF);

	FP2_YYY_mul(&FFF,&FFF,&FF);  // (1+i)^(p-7)/12 . (1+i)^(p-19)/24 = (1+i)^(p-11)/8				// (1+i)^-(p-7)/12 . (1+i)^-(p+5)/24 = (1+i)^-(p-3)/8
*/
	for (i=0;i<n;i++)
	{
		FP8_YYY_frob(&X,&F[2]);		// X^p		
		FP8_YYY_qmul(&X,&X,&F[0]); 
#if SEXTIC_TWIST_ZZZ == M_TYPE			
		FP8_YYY_div_i2(&X);			// X^p.(1+i)^-(p-1)/12
#endif
#if SEXTIC_TWIST_ZZZ == D_TYPE			
		FP8_YYY_times_i2(&X);		// X^p.(1+i)^(p-1)/12
#endif

		FP8_YYY_frob(&Y,&F[2]);		// Y^p
		FP8_YYY_qmul(&Y,&Y,&F[1]); 
#if SEXTIC_TWIST_ZZZ == M_TYPE		
		FP8_YYY_div_i(&Y);			// Y^p.(1+i)^-(p-1)/8
#endif
#if SEXTIC_TWIST_ZZZ == D_TYPE
		FP8_YYY_times_i2(&Y); FP8_YYY_times_i2(&Y); FP8_YYY_times_i(&Y);  // Y^p.(1+i)^(p-1)/8
#endif

	}

	ECP8_ZZZ_set(P,&X,&Y);
}

/* Side channel attack secure */
// Bos & Costello https://eprint.iacr.org/2013/458.pdf
// Faz-Hernandez & Longa & Sanchez  https://eprint.iacr.org/2013/158.pdf

void ECP8_ZZZ_mul16(ECP8_ZZZ *P,ECP8_ZZZ Q[16],BIG_XXX u[16])
{
    int i,j,k,nb,pb1,pb2,pb3,pb4,bt;
	ECP8_ZZZ T1[8],T2[8],T3[8],T4[8],W;
    BIG_XXX mt,t[16];
    sign8 w1[NLEN_XXX*BASEBITS_XXX+1];
    sign8 s1[NLEN_XXX*BASEBITS_XXX+1];
    sign8 w2[NLEN_XXX*BASEBITS_XXX+1];
    sign8 s2[NLEN_XXX*BASEBITS_XXX+1];	
    sign8 w3[NLEN_XXX*BASEBITS_XXX+1];
    sign8 s3[NLEN_XXX*BASEBITS_XXX+1];
    sign8 w4[NLEN_XXX*BASEBITS_XXX+1];
    sign8 s4[NLEN_XXX*BASEBITS_XXX+1];	

	FP2_YYY X[3];
	ECP8_ZZZ_frob_constants(X);

    for (i=0; i<16; i++)
        BIG_XXX_copy(t[i],u[i]);

// Precomputed table
    ECP8_ZZZ_copy(&T1[0],&Q[0]); // Q[0]
    ECP8_ZZZ_copy(&T1[1],&T1[0]);
	ECP8_ZZZ_add(&T1[1],&Q[1]);	// Q[0]+Q[1]
    ECP8_ZZZ_copy(&T1[2],&T1[0]);
	ECP8_ZZZ_add(&T1[2],&Q[2]);	// Q[0]+Q[2]
	ECP8_ZZZ_copy(&T1[3],&T1[1]);
	ECP8_ZZZ_add(&T1[3],&Q[2]);	// Q[0]+Q[1]+Q[2]
	ECP8_ZZZ_copy(&T1[4],&T1[0]);
	ECP8_ZZZ_add(&T1[4],&Q[3]);  // Q[0]+Q[3]
	ECP8_ZZZ_copy(&T1[5],&T1[1]);
	ECP8_ZZZ_add(&T1[5],&Q[3]);	// Q[0]+Q[1]+Q[3]
	ECP8_ZZZ_copy(&T1[6],&T1[2]);
	ECP8_ZZZ_add(&T1[6],&Q[3]);	// Q[0]+Q[2]+Q[3]
	ECP8_ZZZ_copy(&T1[7],&T1[3]);
	ECP8_ZZZ_add(&T1[7],&Q[3]);	// Q[0]+Q[1]+Q[2]+Q[3]

//  Use Frobenius 

	for (i=0;i<8;i++)
	{
		ECP8_ZZZ_copy(&T2[i],&T1[i]);
		ECP8_ZZZ_frob(&T2[i],X,4);

		ECP8_ZZZ_copy(&T3[i],&T2[i]);
		ECP8_ZZZ_frob(&T3[i],X,4);

		ECP8_ZZZ_copy(&T4[i],&T3[i]);
		ECP8_ZZZ_frob(&T4[i],X,4);
	}

// Make them odd
	pb1=1-BIG_XXX_parity(t[0]);
	BIG_XXX_inc(t[0],pb1);
	BIG_XXX_norm(t[0]);

	pb2=1-BIG_XXX_parity(t[4]);
	BIG_XXX_inc(t[4],pb2);
	BIG_XXX_norm(t[4]);

	pb3=1-BIG_XXX_parity(t[8]);
	BIG_XXX_inc(t[8],pb3);
	BIG_XXX_norm(t[8]);

	pb4=1-BIG_XXX_parity(t[12]);
	BIG_XXX_inc(t[12],pb4);
	BIG_XXX_norm(t[12]);

// Number of bits
    BIG_XXX_zero(mt);
    for (i=0; i<16; i++)
    {
        BIG_XXX_add(mt,mt,t[i]);
        BIG_XXX_norm(mt);
    }
    nb=1+BIG_XXX_nbits(mt);

// Sign pivot 
	s1[nb-1]=1;
	s2[nb-1]=1;
	s3[nb-1]=1;
	s4[nb-1]=1;
	for (i=0;i<nb-1;i++)
	{
        BIG_XXX_fshr(t[0],1);
		s1[i]=2*BIG_XXX_parity(t[0])-1;
        BIG_XXX_fshr(t[4],1);
		s2[i]=2*BIG_XXX_parity(t[4])-1;
        BIG_XXX_fshr(t[8],1);
		s3[i]=2*BIG_XXX_parity(t[8])-1;
        BIG_XXX_fshr(t[12],1);
		s4[i]=2*BIG_XXX_parity(t[12])-1;
	}


// Recoded exponents
    for (i=0; i<nb; i++)
    {
		w1[i]=0;
		k=1;
		for (j=1; j<4; j++)
		{
			bt=s1[i]*BIG_XXX_parity(t[j]);
			BIG_XXX_fshr(t[j],1);

			BIG_XXX_dec(t[j],(bt>>1));
			BIG_XXX_norm(t[j]);
			w1[i]+=bt*k;
			k*=2;
        }

		w2[i]=0;
		k=1;
		for (j=5; j<8; j++)
		{
			bt=s2[i]*BIG_XXX_parity(t[j]);
			BIG_XXX_fshr(t[j],1);

			BIG_XXX_dec(t[j],(bt>>1));
			BIG_XXX_norm(t[j]);
			w2[i]+=bt*k;
			k*=2;
        }

		w3[i]=0;
		k=1;
		for (j=9; j<12; j++)
		{
			bt=s3[i]*BIG_XXX_parity(t[j]);
			BIG_XXX_fshr(t[j],1);

			BIG_XXX_dec(t[j],(bt>>1));
			BIG_XXX_norm(t[j]);
			w3[i]+=bt*k;
			k*=2;
        }

		w4[i]=0;
		k=1;
		for (j=13; j<16; j++)
		{
			bt=s4[i]*BIG_XXX_parity(t[j]);
			BIG_XXX_fshr(t[j],1);

			BIG_XXX_dec(t[j],(bt>>1));
			BIG_XXX_norm(t[j]);
			w4[i]+=bt*k;
			k*=2;
        }
    }	

// Main loop
	ECP8_ZZZ_select(P,T1,2*w1[nb-1]+1);
	ECP8_ZZZ_select(&W,T2,2*w2[nb-1]+1);
	ECP8_ZZZ_add(P,&W);
	ECP8_ZZZ_select(&W,T3,2*w3[nb-1]+1);
	ECP8_ZZZ_add(P,&W);
	ECP8_ZZZ_select(&W,T4,2*w4[nb-1]+1);
	ECP8_ZZZ_add(P,&W);

    for (i=nb-2; i>=0; i--)
    {
        ECP8_ZZZ_dbl(P);
        ECP8_ZZZ_select(&W,T1,2*w1[i]+s1[i]);
        ECP8_ZZZ_add(P,&W);
        ECP8_ZZZ_select(&W,T2,2*w2[i]+s2[i]);
        ECP8_ZZZ_add(P,&W);
        ECP8_ZZZ_select(&W,T3,2*w3[i]+s3[i]);
        ECP8_ZZZ_add(P,&W);
        ECP8_ZZZ_select(&W,T4,2*w4[i]+s4[i]);
        ECP8_ZZZ_add(P,&W);
    }

// apply corrections
	ECP8_ZZZ_copy(&W,P);   
	ECP8_ZZZ_sub(&W,&Q[0]);
	ECP8_ZZZ_cmove(P,&W,pb1);
	ECP8_ZZZ_copy(&W,P);   
	ECP8_ZZZ_sub(&W,&Q[4]);
	ECP8_ZZZ_cmove(P,&W,pb2);

	ECP8_ZZZ_copy(&W,P);   
	ECP8_ZZZ_sub(&W,&Q[8]);
	ECP8_ZZZ_cmove(P,&W,pb3);
	ECP8_ZZZ_copy(&W,P);   
	ECP8_ZZZ_sub(&W,&Q[12]);
	ECP8_ZZZ_cmove(P,&W,pb4);

	ECP8_ZZZ_reduce(P);
}

/*
void ECP8_ZZZ_mul16(ECP8_ZZZ *P,ECP8_ZZZ Q[16],BIG_XXX u[16])
{
    int i,j,a[4],nb,pb;
    ECP8_ZZZ W[8],Z[8],WW[8],ZZ[8],T,C;
    BIG_XXX mt,t[16];
    sign8 w[NLEN_XXX*BASEBITS_XXX+1];
    sign8 z[NLEN_XXX*BASEBITS_XXX+1];
    sign8 ww[NLEN_XXX*BASEBITS_XXX+1];
    sign8 zz[NLEN_XXX*BASEBITS_XXX+1];

    FP_YYY fx,fy;
	FP2_YYY X;

    FP_YYY_rcopy(&fx,Fra_YYY);
    FP_YYY_rcopy(&fy,Frb_YYY);
    FP2_YYY_from_FPs(&X,&fx,&fy);


    for (i=0; i<16; i++)
        BIG_XXX_copy(t[i],u[i]);

    // precompute tables 

// 12 add/subs 

    ECP8_ZZZ_copy(&W[0],&Q[0]);
    ECP8_ZZZ_sub(&W[0],&Q[1]);  // P-Q
    ECP8_ZZZ_copy(&W[1],&W[0]);
    ECP8_ZZZ_copy(&W[2],&W[0]);
    ECP8_ZZZ_copy(&W[3],&W[0]);
    ECP8_ZZZ_copy(&W[4],&Q[0]);
    ECP8_ZZZ_add(&W[4],&Q[1]);  // P+Q 
    ECP8_ZZZ_copy(&W[5],&W[4]);
    ECP8_ZZZ_copy(&W[6],&W[4]);
    ECP8_ZZZ_copy(&W[7],&W[4]);

    ECP8_ZZZ_copy(&T,&Q[2]);
    ECP8_ZZZ_sub(&T,&Q[3]);       // R-S 
    ECP8_ZZZ_sub(&W[1],&T);
    ECP8_ZZZ_add(&W[2],&T);
    ECP8_ZZZ_sub(&W[5],&T);
    ECP8_ZZZ_add(&W[6],&T);
    ECP8_ZZZ_copy(&T,&Q[2]);
    ECP8_ZZZ_add(&T,&Q[3]);      // R+S 
    ECP8_ZZZ_sub(&W[0],&T);
    ECP8_ZZZ_add(&W[3],&T);
    ECP8_ZZZ_sub(&W[4],&T);
    ECP8_ZZZ_add(&W[7],&T);


// Use Frobenius 

	for (i=0;i<8;i++)
	{
		ECP8_ZZZ_copy(&Z[i],&W[i]);
		ECP8_ZZZ_frob(&Z[i],&X,4);
	}

	for (i=0;i<8;i++)
	{
		ECP8_ZZZ_copy(&WW[i],&Z[i]);
		ECP8_ZZZ_frob(&WW[i],&X,4);
	}

	for (i=0;i<8;i++)
	{
		ECP8_ZZZ_copy(&ZZ[i],&WW[i]);
		ECP8_ZZZ_frob(&ZZ[i],&X,4);
	}

    // if multiplier is even add 1 to multiplier, and add P to correction 
    ECP8_ZZZ_inf(&C);

    BIG_XXX_zero(mt);
    for (i=0; i<16; i++)
    {
		pb=BIG_XXX_parity(t[i]);
		BIG_XXX_inc(t[i],1-pb);
		BIG_XXX_norm(t[i]);
		ECP8_ZZZ_copy(&T,&C);
		ECP8_ZZZ_add(&T,&Q[i]);
		ECP8_ZZZ_cmove(&C,&T,1-pb);


        BIG_XXX_add(mt,mt,t[i]);
        BIG_XXX_norm(mt);
    }

    nb=1+BIG_XXX_nbits(mt);

    // convert exponents to signed 1-bit windows 
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


    for (j=0; j<nb; j++)
    {
        for (i=0; i<4; i++)
        {
            a[i]=BIG_XXX_lastbits(t[i+4],2)-2;
            BIG_XXX_dec(t[i+4],a[i]);
            BIG_XXX_norm(t[i+4]);
            BIG_XXX_fshr(t[i+4],1);
        }
        z[j]=8*a[0]+4*a[1]+2*a[2]+a[3];
    }
    z[nb]=8*BIG_XXX_lastbits(t[4],2)+4*BIG_XXX_lastbits(t[5],2)+2*BIG_XXX_lastbits(t[6],2)+BIG_XXX_lastbits(t[7],2);


    for (j=0; j<nb; j++)
    {
        for (i=0; i<4; i++)
        {
            a[i]=BIG_XXX_lastbits(t[i+8],2)-2;
            BIG_XXX_dec(t[i+8],a[i]);
            BIG_XXX_norm(t[i+8]);
            BIG_XXX_fshr(t[i+8],1);
        }
        ww[j]=8*a[0]+4*a[1]+2*a[2]+a[3];
    }
    ww[nb]=8*BIG_XXX_lastbits(t[8],2)+4*BIG_XXX_lastbits(t[9],2)+2*BIG_XXX_lastbits(t[10],2)+BIG_XXX_lastbits(t[11],2);

    for (j=0; j<nb; j++)
    {
        for (i=0; i<4; i++)
        {
            a[i]=BIG_XXX_lastbits(t[i+12],2)-2;
            BIG_XXX_dec(t[i+12],a[i]);
            BIG_XXX_norm(t[i+12]);
            BIG_XXX_fshr(t[i+12],1);
        }
        zz[j]=8*a[0]+4*a[1]+2*a[2]+a[3];
    }
    zz[nb]=8*BIG_XXX_lastbits(t[12],2)+4*BIG_XXX_lastbits(t[13],2)+2*BIG_XXX_lastbits(t[14],2)+BIG_XXX_lastbits(t[15],2);

    ECP8_ZZZ_copy(P,&W[(w[nb]-1)/2]);
	ECP8_ZZZ_add(P,&Z[(z[nb]-1)/2]);
	ECP8_ZZZ_add(P,&WW[(ww[nb]-1)/2]);
	ECP8_ZZZ_add(P,&ZZ[(zz[nb]-1)/2]);
    for (i=nb-1; i>=0; i--)
    {
		ECP8_ZZZ_dbl(P);
        ECP8_ZZZ_select(&T,W,w[i]);
        ECP8_ZZZ_add(P,&T);
        ECP8_ZZZ_select(&T,Z,z[i]);
        ECP8_ZZZ_add(P,&T);
        ECP8_ZZZ_select(&T,WW,ww[i]);
        ECP8_ZZZ_add(P,&T);
        ECP8_ZZZ_select(&T,ZZ,zz[i]);
        ECP8_ZZZ_add(P,&T);

    }
    ECP8_ZZZ_sub(P,&C); // apply correction 
	ECP8_ZZZ_reduce(P);
}
*/
/* Map to hash value to point on G2 from random BIG_XXX */

void ECP8_ZZZ_mapit(ECP8_ZZZ *Q,octet *W)
{
    BIG_XXX q,one,x,hv;
	FP_YYY Fx,Fy;
    FP2_YYY T,X[3];
	FP4_YYY X4;
	FP8_YYY X8;

    ECP8_ZZZ xQ, x2Q, x3Q, x4Q , x5Q, x6Q, x7Q, x8Q;

	BIG_XXX_fromBytes(hv,W->val);
    BIG_XXX_rcopy(q,Modulus_YYY);
    BIG_XXX_one(one);
    BIG_XXX_mod(hv,q);

    for (;;)
    {
        FP2_YYY_from_BIGs(&T,one,hv);  /*******/
		FP4_YYY_from_FP2(&X4,&T);
		FP8_YYY_from_FP4(&X8,&X4);
        if (ECP8_ZZZ_setx(Q,&X8)) break;
        BIG_XXX_inc(hv,1); BIG_XXX_norm(hv);
    }

	ECP8_ZZZ_frob_constants(X);

    BIG_XXX_rcopy(x,CURVE_Bnx_ZZZ);

    // Efficient hash maps to G2 on BLS48 curves - Budroni, Pintore 
	// Q -> x8Q -x7Q -Q +  F(x7Q-x6Q) + F(F(x6Q-x5Q)) +F(F(F(x5Q-x4Q))) +F(F(F(F(x4Q-x3Q)))) + F(F(F(F(F(x3Q-x2Q))))) + F(F(F(F(F(F(x2Q-xQ)))))) + F(F(F(F(F(F(F(xQ-Q))))))) +F(F(F(F(F(F(F(F(2Q))))))))

	ECP8_ZZZ_copy(&xQ,Q);
	ECP8_ZZZ_mul(&xQ,x);
	ECP8_ZZZ_copy(&x2Q,&xQ);
	ECP8_ZZZ_mul(&x2Q,x);
	ECP8_ZZZ_copy(&x3Q,&x2Q);
	ECP8_ZZZ_mul(&x3Q,x);
	ECP8_ZZZ_copy(&x4Q,&x3Q);

	ECP8_ZZZ_mul(&x4Q,x);
	ECP8_ZZZ_copy(&x5Q,&x4Q);
	ECP8_ZZZ_mul(&x5Q,x);
	ECP8_ZZZ_copy(&x6Q,&x5Q);
	ECP8_ZZZ_mul(&x6Q,x);
	ECP8_ZZZ_copy(&x7Q,&x6Q);
	ECP8_ZZZ_mul(&x7Q,x);
	ECP8_ZZZ_copy(&x8Q,&x7Q);
	ECP8_ZZZ_mul(&x8Q,x);

#if SIGN_OF_X_ZZZ==NEGATIVEX
	ECP8_ZZZ_neg(&xQ);
	ECP8_ZZZ_neg(&x3Q);
	ECP8_ZZZ_neg(&x5Q);
	ECP8_ZZZ_neg(&x7Q);
#endif

	ECP8_ZZZ_sub(&x8Q,&x7Q);
	ECP8_ZZZ_sub(&x8Q,Q);

	ECP8_ZZZ_sub(&x7Q,&x6Q);
	ECP8_ZZZ_frob(&x7Q,X,1);

	ECP8_ZZZ_sub(&x6Q,&x5Q);
	ECP8_ZZZ_frob(&x6Q,X,2);
	
	ECP8_ZZZ_sub(&x5Q,&x4Q);
	ECP8_ZZZ_frob(&x5Q,X,3);
	
	ECP8_ZZZ_sub(&x4Q,&x3Q);
	ECP8_ZZZ_frob(&x4Q,X,4);

	ECP8_ZZZ_sub(&x3Q,&x2Q);
	ECP8_ZZZ_frob(&x3Q,X,5);

	ECP8_ZZZ_sub(&x2Q,&xQ);
	ECP8_ZZZ_frob(&x2Q,X,6);

	ECP8_ZZZ_sub(&xQ,Q);
	ECP8_ZZZ_frob(&xQ,X,7);

	ECP8_ZZZ_dbl(Q);
	ECP8_ZZZ_frob(Q,X,8);


	ECP8_ZZZ_add(Q,&x8Q);
	ECP8_ZZZ_add(Q,&x7Q);
	ECP8_ZZZ_add(Q,&x6Q);
	ECP8_ZZZ_add(Q,&x5Q);

	ECP8_ZZZ_add(Q,&x4Q);
	ECP8_ZZZ_add(Q,&x3Q);
	ECP8_ZZZ_add(Q,&x2Q);
	ECP8_ZZZ_add(Q,&xQ);

	ECP8_ZZZ_reduce(Q);

}

// ECP$ Get Group Generator

void ECP8_ZZZ_generator(ECP8_ZZZ *G)
{
	BIG_XXX a,b;
	FP2_YYY Aa,Bb;
	FP4_YYY A,B;
	FP8_YYY X,Y;

	BIG_XXX_rcopy(a,CURVE_Pxaaa_ZZZ);
	BIG_XXX_rcopy(b,CURVE_Pxaab_ZZZ);
	FP2_YYY_from_BIGs(&Aa,a,b);

	BIG_XXX_rcopy(a,CURVE_Pxaba_ZZZ);
	BIG_XXX_rcopy(b,CURVE_Pxabb_ZZZ);
	FP2_YYY_from_BIGs(&Bb,a,b);

	FP4_YYY_from_FP2s(&A,&Aa,&Bb);

	BIG_XXX_rcopy(a,CURVE_Pxbaa_ZZZ);
	BIG_XXX_rcopy(b,CURVE_Pxbab_ZZZ);
	FP2_YYY_from_BIGs(&Aa,a,b);

	BIG_XXX_rcopy(a,CURVE_Pxbba_ZZZ);
	BIG_XXX_rcopy(b,CURVE_Pxbbb_ZZZ);
	FP2_YYY_from_BIGs(&Bb,a,b);

	FP4_YYY_from_FP2s(&B,&Aa,&Bb);

	FP8_YYY_from_FP4s(&X,&A,&B);

	BIG_XXX_rcopy(a,CURVE_Pyaaa_ZZZ);
	BIG_XXX_rcopy(b,CURVE_Pyaab_ZZZ);
	FP2_YYY_from_BIGs(&Aa,a,b);

	BIG_XXX_rcopy(a,CURVE_Pyaba_ZZZ);
	BIG_XXX_rcopy(b,CURVE_Pyabb_ZZZ);
	FP2_YYY_from_BIGs(&Bb,a,b);

	FP4_YYY_from_FP2s(&A,&Aa,&Bb);

	BIG_XXX_rcopy(a,CURVE_Pybaa_ZZZ);
	BIG_XXX_rcopy(b,CURVE_Pybab_ZZZ);
	FP2_YYY_from_BIGs(&Aa,a,b);

	BIG_XXX_rcopy(a,CURVE_Pybba_ZZZ);
	BIG_XXX_rcopy(b,CURVE_Pybbb_ZZZ);
	FP2_YYY_from_BIGs(&Bb,a,b);

	FP4_YYY_from_FP2s(&B,&Aa,&Bb);

	FP8_YYY_from_FP4s(&Y,&A,&B);

	ECP8_ZZZ_set(G,&X,&Y);
}


// g++ -O2 ecp8_BLS48.cpp fp8_BLS48.cpp fp4_BLS48.cpp fp2_BLS48.cpp fp_BLS48.cpp big_B560_29.cpp rand.cpp hash.cpp rom_field_BLS48.cpp rom_curve_BLS48.cpp oct.cpp -o ecp8_BLS48.exe
/*
int main()
{
	int i;
	ECP8 G,P;
	FP2 Aa,Bb,f;
	FP8_YYY X,Y;
	BIG a,b,r,p;
	char w[100];
	octet W= {0,sizeof(w),w};

	ECP8_generator(&G);

	BIG_rcopy(a,Fra_YYY);
    BIG_rcopy(b,Frb_YYY);
	FP2_from_BIGs(&f,a,b);

	if (G.inf) cout << "Failed to set - point not on curve" << endl;
	else cout << "set success" << endl;

	ECP8_output(&G);
	ECP8_copy(&P,&G);

	BIG_rcopy(r,CURVE_Order);
	BIG_rcopy(p,Modulus);

	BIG_output(r);
	cout << endl;

	ECP8_mul(&G,r);
	ECP8_output(&G);
	cout << endl;

	ECP8_copy(&G,&P);

	cout << "pG = ";
	ECP8_mul(&G,p);
	ECP8_output(&G);
	cout << endl;

	cout << "G^p= ";
	ECP8_frob(&P,&f,1);
	ECP8_output(&P);
	cout << endl;


	for (i=0;i<MODBYTES_XXX;i++)
	{
		W.val[i]=i+11;
	}
	W.len=MODBYTES_XXX;

	printf("W= ");
	OCT_output(&W);
	printf("\n");

	ECP8_mapit(&P,&W);

	cout << "Hash to P= ";
	ECP8_output(&P);
	cout << endl;

	ECP8_mul(&P,r);

	cout << "rP= ";
	ECP8_output(&P);
	cout << endl;



//	ECP8_dbl(&G);
//	ECP8_output(&G);
//	ECP8_reduce(&G);
//	cout << endl;
//	ECP8_add(&G,&P);
//	ECP8_output(&G);
//	cout << endl;


	return 0;
}
*/

