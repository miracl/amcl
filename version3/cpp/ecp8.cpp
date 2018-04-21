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

using namespace std;
using namespace XXX;
using namespace YYY;

int ZZZ::ECP8_isinf(ECP8 *P)
{
	if (P->inf) return 1;
	P->inf=FP8_iszilch(&(P->x));
    return P->inf;
}

/* Set P=Q */
void ZZZ::ECP8_copy(ECP8 *P,ECP8 *Q)
{
    P->inf=Q->inf;
    FP8_copy(&(P->x),&(Q->x));
    FP8_copy(&(P->y),&(Q->y));
}

/* set P to Infinity */
void ZZZ::ECP8_inf(ECP8 *P)
{
    P->inf=1;
    FP8_zero(&(P->x));
    FP8_one(&(P->y));
}

/* Conditional move Q to P dependant on d */
static void ECP8_cmove(ZZZ::ECP8 *P,ZZZ::ECP8 *Q,int d)
{
    FP8_cmove(&(P->x),&(Q->x),d);
    FP8_cmove(&(P->y),&(Q->y),d);
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
static void ECP8_select(ZZZ::ECP8 *P,ZZZ::ECP8 W[],sign32 b)
{
    ZZZ::ECP8 MP;
    sign32 m=b>>31;
    sign32 babs=(b^m)-m;

    babs=(babs-1)/2;

    ECP8_cmove(P,&W[0],teq(babs,0));  // conditional move
    ECP8_cmove(P,&W[1],teq(babs,1));
    ECP8_cmove(P,&W[2],teq(babs,2));
    ECP8_cmove(P,&W[3],teq(babs,3));
    ECP8_cmove(P,&W[4],teq(babs,4));
    ECP8_cmove(P,&W[5],teq(babs,5));
    ECP8_cmove(P,&W[6],teq(babs,6));
    ECP8_cmove(P,&W[7],teq(babs,7));

    ECP8_copy(&MP,P);
    ECP8_neg(&MP);  // minus P
    ECP8_cmove(P,&MP,(int)(m&1));
}

/* return 1 if P==Q, else 0 */
/* SU= 312 */
int ZZZ::ECP8_equals(ECP8 *P,ECP8 *Q)
{
    if (ECP8_isinf(P) && ECP8_isinf(Q)) return 1;
    if (ECP8_isinf(P) || ECP8_isinf(Q)) return 0;

    if (!FP8_equals(&(P->x),&(Q->x))) return 0;
    if (!FP8_equals(&(P->y),&(Q->y))) return 0;
    return 1;
}

/* extract x, y from point P */
int ZZZ::ECP8_get(FP8 *x,FP8 *y,ECP8 *P)
{
    if (P->inf) return -1;
    FP8_copy(y,&(P->y));
    FP8_copy(x,&(P->x));
    return 0;
}

/* Output point P */
void ZZZ::ECP8_output(ECP8 *P)
{
    FP8 x,y;
    if (P->inf)
    {
        printf("Infinity\n");
        return;
    }
    ECP8_get(&x,&y,P);
    printf("(");
    FP8_output(&x);
    printf(",");
    FP8_output(&y);
    printf(")\n");
}

/* Convert Q to octet string */
void ZZZ::ECP8_toOctet(octet *W,ECP8 *Q)
{
	BIG b;
	FP8 qx,qy;
	FP4 qa,qb;
	FP2 pa,pb;

    ECP8_get(&qx,&qy,Q);

	FP4_copy(&qa,&(qx.a));
	FP4_copy(&qb,&(qx.b));

	FP2_copy(&pa,&(qa.a));
	FP2_copy(&pb,&(qa.b));

	FP_redc(b,&(pa.a));
    BIG_toBytes(&(W->val[0]),b);
    FP_redc(b,&(pa.b));
    BIG_toBytes(&(W->val[MODBYTES_XXX]),b);
    FP_redc(b,&(pb.a));
    BIG_toBytes(&(W->val[2*MODBYTES_XXX]),b);
    FP_redc(b,&(pb.b));
    BIG_toBytes(&(W->val[3*MODBYTES_XXX]),b);

	FP2_copy(&pa,&(qb.a));
	FP2_copy(&pb,&(qb.b));

	FP_redc(b,&(pa.a));
    BIG_toBytes(&(W->val[4*MODBYTES_XXX]),b);
    FP_redc(b,&(pa.b));
    BIG_toBytes(&(W->val[5*MODBYTES_XXX]),b);
    FP_redc(b,&(pb.a));
    BIG_toBytes(&(W->val[6*MODBYTES_XXX]),b);
    FP_redc(b,&(pb.b));
    BIG_toBytes(&(W->val[7*MODBYTES_XXX]),b);


	FP4_copy(&qa,&(qy.a));
	FP4_copy(&qb,&(qy.b));

	FP2_copy(&pa,&(qa.a));
	FP2_copy(&pb,&(qa.b));

	FP_redc(b,&(pa.a));
    BIG_toBytes(&(W->val[8*MODBYTES_XXX]),b);
    FP_redc(b,&(pa.b));
    BIG_toBytes(&(W->val[9*MODBYTES_XXX]),b);
    FP_redc(b,&(pb.a));
    BIG_toBytes(&(W->val[10*MODBYTES_XXX]),b);
    FP_redc(b,&(pb.b));
    BIG_toBytes(&(W->val[11*MODBYTES_XXX]),b);

	FP2_copy(&pa,&(qb.a));
	FP2_copy(&pb,&(qb.b));

	FP_redc(b,&(pa.a));
    BIG_toBytes(&(W->val[12*MODBYTES_XXX]),b);
    FP_redc(b,&(pa.b));
    BIG_toBytes(&(W->val[13*MODBYTES_XXX]),b);
    FP_redc(b,&(pb.a));
    BIG_toBytes(&(W->val[14*MODBYTES_XXX]),b);
    FP_redc(b,&(pb.b));
    BIG_toBytes(&(W->val[15*MODBYTES_XXX]),b);


    W->len=16*MODBYTES_XXX;
}

/* restore Q from octet string */
int ZZZ::ECP8_fromOctet(ECP8 *Q,octet *W)
{
	BIG b;
    FP8 qx,qy;
	FP4 qa,qb;
	FP2 pa,pb;

    BIG_fromBytes(b,&(W->val[0]));
	FP_nres(&(pa.a),b);
    BIG_fromBytes(b,&(W->val[MODBYTES_XXX]));
    FP_nres(&(pa.b),b);
    BIG_fromBytes(b,&(W->val[2*MODBYTES_XXX]));
    FP_nres(&(pb.a),b);
    BIG_fromBytes(b,&(W->val[3*MODBYTES_XXX]));
    FP_nres(&(pb.b),b);

	FP2_copy(&(qa.a),&pa);
	FP2_copy(&(qa.b),&pb);

    BIG_fromBytes(b,&(W->val[4*MODBYTES_XXX]));
	FP_nres(&(pa.a),b);
    BIG_fromBytes(b,&(W->val[5*MODBYTES_XXX]));
    FP_nres(&(pa.b),b);
    BIG_fromBytes(b,&(W->val[6*MODBYTES_XXX]));
    FP_nres(&(pb.a),b);
    BIG_fromBytes(b,&(W->val[7*MODBYTES_XXX]));
    FP_nres(&(pb.b),b);

	FP2_copy(&(qb.a),&pa);
	FP2_copy(&(qb.b),&pb);

	FP4_copy(&(qx.a),&qa);
	FP4_copy(&(qx.b),&qb);


    BIG_fromBytes(b,&(W->val[8*MODBYTES_XXX]));
	FP_nres(&(pa.a),b);
    BIG_fromBytes(b,&(W->val[9*MODBYTES_XXX]));
    FP_nres(&(pa.b),b);
    BIG_fromBytes(b,&(W->val[10*MODBYTES_XXX]));
    FP_nres(&(pb.a),b);
    BIG_fromBytes(b,&(W->val[11*MODBYTES_XXX]));
    FP_nres(&(pb.b),b);

	FP2_copy(&(qa.a),&pa);
	FP2_copy(&(qa.b),&pb);

    BIG_fromBytes(b,&(W->val[12*MODBYTES_XXX]));
	FP_nres(&(pa.a),b);
    BIG_fromBytes(b,&(W->val[13*MODBYTES_XXX]));
    FP_nres(&(pa.b),b);
    BIG_fromBytes(b,&(W->val[14*MODBYTES_XXX]));
    FP_nres(&(pb.a),b);
    BIG_fromBytes(b,&(W->val[15*MODBYTES_XXX]));
    FP_nres(&(pb.b),b);

	FP2_copy(&(qb.a),&pa);
	FP2_copy(&(qb.b),&pb);

	FP4_copy(&(qy.a),&qa);
	FP4_copy(&(qy.b),&qb);


    if (ECP8_set(Q,&qx,&qy)) return 1;
    return 0;
}

/* Calculate RHS of twisted curve equation x^3+B/i or x^3+Bi*/
void ZZZ::ECP8_rhs(FP8 *rhs,FP8 *x)
{
    /* calculate RHS of elliptic curve equation */
    FP8 t;
	FP4 t4;
	FP2 t2;
    BIG b;
    FP8_sqr(&t,x);

    FP8_mul(rhs,&t,x);

    /* Assuming CURVE_A=0 */

    BIG_rcopy(b,CURVE_B);

    FP2_from_BIG(&t2,b);
	FP4_from_FP2(&t4,&t2);
	FP8_from_FP4(&t,&t4);

#if SEXTIC_TWIST_ZZZ == D_TYPE	
    FP8_div_i(&t);   /* IMPORTANT - here we use the correct SEXTIC twist of the curve */
#endif

#if SEXTIC_TWIST_ZZZ == M_TYPE	
    FP8_times_i(&t);   /* IMPORTANT - here we use the correct SEXTIC twist of the curve */
#endif

    FP8_add(rhs,&t,rhs);
    FP8_reduce(rhs);
}

/* Set P=(x,y). Return 1 if (x,y) is on the curve, else return 0*/
/* SU= 232 */
int ZZZ::ECP8_set(ECP8 *P,FP8 *x,FP8 *y)
{
    FP8 rhs,y2;

    FP8_sqr(&y2,y);
    ECP8_rhs(&rhs,x);

    if (!FP8_equals(&y2,&rhs))
    {
        P->inf=1;
        return 0;
    }

    P->inf=0;
    FP8_copy(&(P->x),x);
    FP8_copy(&(P->y),y);
    return 1;
}

/* Set P=(x,y). Return 1 if (x,.) is on the curve, else return 0 */
/* SU= 232 */
int ZZZ::ECP8_setx(ECP8 *P,FP8 *x)
{
    FP8 y;
    ECP8_rhs(&y,x);

    if (!FP8_sqrt(&y,&y))
    {
        P->inf=1;
        return 0;
    }

    P->inf=0;
    FP8_copy(&(P->x),x);
    FP8_copy(&(P->y),&y);

    return 1;
}

/* Set P=-P */
/* SU= 8 */
void ZZZ::ECP8_neg(ECP8 *P)
{
//	if (ECP8_isinf(P)) return;
	FP8_norm(&(P->y));
    FP8_neg(&(P->y),&(P->y));
    FP8_norm(&(P->y));
}


int ZZZ::ECP8_dbl(ECP8 *P)
{
	FP8 lam;
	return ECP8_sdbl(P,&lam);
}

int ZZZ::ECP8_add(ECP8 *P,ECP8 *Q)
{
	FP8 lam;
	return ECP8_sadd(P,Q,&lam);
}

/* R+=R */
/* return -1 for Infinity, 0 for addition, 1 for doubling */
int ZZZ::ECP8_sdbl(ECP8 *P,FP8 *lam)
{
    FP8 t,t2;
    if (P->inf) return -1;
	if (FP8_iszilch(&(P->y)))
	{
		FP8_zero(&(P->x));
		P->inf=1;
		return -1;
	}

	FP8_sqr(lam,&(P->x));
	FP8_imul(lam,lam,3);

	FP8_add(&t,&(P->y),&(P->y));
	FP8_norm(&t);

	FP8_inv(&t,&t);
	FP8_mul(lam,lam,&t);

	FP8_copy(&t,&(P->x));
	FP8_add(&t2,&(P->x),&(P->x));
	FP8_sqr(&(P->x),lam);

	FP8_norm(&t2);
	FP8_sub(&(P->x),&(P->x),&t2);

	FP8_norm(&(P->x));	
	FP8_sub(&t,&t,&(P->x));
	FP8_norm(&t);

	FP8_mul(&t,&t,lam);
	FP8_sub(&t,&t,&(P->y));
	FP8_copy(&(P->y),&t);

	FP8_norm(&(P->y));	

    return 1;
}

/* Set P+=Q */

int ZZZ::ECP8_sadd(ECP8 *P,ECP8 *Q,FP8 *lam)
{
    FP8 t,t2;
	int b3=3*CURVE_B_I;
    if (Q->inf) return 0;
    if (P->inf)
    {
        ECP8_copy(P,Q);
		FP8_zero(lam);
        return 0;
    }

	if (P==Q)
	{
		ECP8_sdbl(P,lam);
		return 1;
	}

	if (FP8_equals(&(P->x),&(Q->x)))
	{
		if (FP8_equals(&(P->y),&(Q->y)))
		{
			ECP8_copy(P,Q);
			ECP8_sdbl(P,lam);
			return 1;
		}
		else
		{
			FP8_zero(&(P->y));
			FP8_zero(&(P->x));
			P->inf=1;
			return -1;
		}
	}

	FP8_sub(lam,&(P->y),&(Q->y));
	FP8_norm(lam);
	FP8_sub(&t2,&(P->x),&(Q->x));
	FP8_norm(&t2);
	FP8_inv(&t2,&t2);
	FP8_mul(lam,lam,&t2);

	FP8_add(&(P->x),&(P->x),&(Q->x));
	FP8_sqr(&t,lam);

	FP8_norm(&(P->x));
	FP8_sub(&t,&t,&(P->x));

	FP8_copy(&(P->x),&t);
	FP8_norm(&(P->x));

	FP8_sub(&(P->y),&(Q->x),&(P->x));
	FP8_norm(&(P->y));

	FP8_mul(&(P->y),&(P->y),lam);
	FP8_sub(&(P->y),&(P->y),&(Q->y));

	FP8_norm(&(P->y));

    return 0;
}

/* Set P-=Q */
/* SU= 16 */
void ZZZ::ECP8_sub(ECP8 *P,ECP8 *Q)
{
    ECP8_neg(Q);
    ECP8_add(P,Q);
    ECP8_neg(Q);
}


void ZZZ::ECP8_reduce(ECP8 *P)
{
	FP8_reduce(&(P->x));
	FP8_reduce(&(P->y));
}

/* P*=e */
/* SU= 280 */
void ZZZ::ECP8_mul(ECP8 *P,BIG e)
{
    /* fixed size windows */
    int i,nb,s,ns;
    BIG mt,t;
    ECP8 Q,W[8],C;
    sign8 w[1+(NLEN_XXX*BASEBITS_XXX+3)/4];

    if (ECP8_isinf(P)) return;

    /* precompute table */

    ECP8_copy(&Q,P);
    ECP8_dbl(&Q);
    ECP8_copy(&W[0],P);

    for (i=1; i<8; i++)
    {
        ECP8_copy(&W[i],&W[i-1]);
        ECP8_add(&W[i],&Q);
    }

    /* make exponent odd - add 2P if even, P if odd */
    BIG_copy(t,e);
    s=BIG_parity(t);
    BIG_inc(t,1);
    BIG_norm(t);
    ns=BIG_parity(t);
    BIG_copy(mt,t);
    BIG_inc(mt,1);
    BIG_norm(mt);
    BIG_cmove(t,mt,s);
    ECP8_cmove(&Q,P,ns);
    ECP8_copy(&C,&Q);

    nb=1+(BIG_nbits(t)+3)/4;

    /* convert exponent to signed 4-bit window */
    for (i=0; i<nb; i++)
    {
        w[i]=BIG_lastbits(t,5)-16;
        BIG_dec(t,w[i]);
        BIG_norm(t);
        BIG_fshr(t,4);
    }
    w[nb]=BIG_lastbits(t,5);

    ECP8_copy(P,&W[(w[nb]-1)/2]);
    for (i=nb-1; i>=0; i--)
    {
        ECP8_select(&Q,W,w[i]);
        ECP8_dbl(P);
        ECP8_dbl(P);
        ECP8_dbl(P);
        ECP8_dbl(P);
        ECP8_add(P,&Q);
    }
    ECP8_sub(P,&C); /* apply correction */
	ECP8_reduce(P);
}

/* Calculates q^n.P using Frobenius constant X */
void ZZZ::ECP8_frob(ECP8 *P,FP2 *F,int n)
{
	int i;
	FP8 X,Y;
	//FP4 F4,F8;
    FP2 FFF,FF,W;
    if (P->inf) return;

	ECP8_get(&X,&Y,P);		// F=(1+i)^(p-19)/24

	FP2_sqr(&FF,F);			// FF=F^2=(1+i)^(p-19)/12
	FP2_copy(&W,&FF);
	FP2_mul_ip(&W);			// W=(1+i)^12/12.(1+i)^(p-19)/12 = (1+i)^(p-7)/12
	FP2_norm(&W);
	FP2_sqr(&FFF,&W);
	FP2_mul(&W,&W,&FFF);	// W=(1+i)^(p-7)/4

	FP2_mul_ip(&W);			// W=(1+i)^4/4.W=(1+i)^(p-7)/4 = (1+i)^(p-3)/4
	FP2_norm(&W);

	FP2_copy(&FFF,F);

#if SEXTIC_TWIST_ZZZ == M_TYPE	
	FP2_mul_ip(&FFF);		// (1+i)^24/24.(1+i)^(p-19)/24 = (1+i)^(p+5)/24
	FP2_inv(&FFF,&FFF);		// (1+i)^-(p+5)/24
	FP2_sqr(&FF,&FFF);		// (1+i)^-(p+5)/12
#endif


	FP2_mul_ip(&FF);		// FF=(1+i)^(p-19)/12.(1+i)^12/12 = (1+i)^(p-7)/12					// FF=(1+i)^12/12.(1+i)^-(p+5)/12 = (1+i)^-(p-7)/12
	FP2_norm(&FF);

	FP2_mul(&FFF,&FFF,&FF);  // (1+i)^(p-7)/12 . (1+i)^(p-19)/24 = (1+i)^(p-11)/8				// (1+i)^-(p-7)/12 . (1+i)^-(p+5)/24 = (1+i)^-(p-3)/8

	for (i=0;i<n;i++)
	{
		FP8_frob(&X,&W);		// X^p		
		FP8_qmul(&X,&X,&FF); 
#if SEXTIC_TWIST_ZZZ == M_TYPE			
		FP8_div_i2(&X);			// X^p.(1+i)^-(p-1)/12
#endif
#if SEXTIC_TWIST_ZZZ == D_TYPE			
		FP8_times_i2(&X);		// X^p.(1+i)^(p-1)/12
#endif

		FP8_frob(&Y,&W);		// Y^p
		FP8_qmul(&Y,&Y,&FFF); 
#if SEXTIC_TWIST_ZZZ == M_TYPE		
		FP8_div_i(&Y);			// Y^p.(1+i)^-(p-1)/8
#endif
#if SEXTIC_TWIST_ZZZ == D_TYPE
		FP8_times_i2(&Y); FP8_times_i2(&Y); FP8_times_i(&Y);  // Y^p.(1+i)^(p-1)/8
#endif

	}

	ECP8_set(P,&X,&Y);
}

/* Side channel attack secure */
// Bos & Costello https://eprint.iacr.org/2013/458.pdf
// Faz-Hernandez & Longa & Sanchez  https://eprint.iacr.org/2013/158.pdf

void ZZZ::ECP8_mul16(ECP8 *P,ECP8 Q[16],BIG u[16])
{
    int i,j,k,nb,pb1,pb2,pb3,pb4,bt;
	ECP8 T1[8],T2[8],T3[8],T4[8],W;
    BIG mt,t[16];
    sign8 w1[NLEN_XXX*BASEBITS_XXX+1];
    sign8 s1[NLEN_XXX*BASEBITS_XXX+1];
    sign8 w2[NLEN_XXX*BASEBITS_XXX+1];
    sign8 s2[NLEN_XXX*BASEBITS_XXX+1];	
    sign8 w3[NLEN_XXX*BASEBITS_XXX+1];
    sign8 s3[NLEN_XXX*BASEBITS_XXX+1];
    sign8 w4[NLEN_XXX*BASEBITS_XXX+1];
    sign8 s4[NLEN_XXX*BASEBITS_XXX+1];	
    FP fx,fy;
	FP2 X;

    FP_rcopy(&fx,Fra);
    FP_rcopy(&fy,Frb);
    FP2_from_FPs(&X,&fx,&fy);

    for (i=0; i<16; i++)
        BIG_copy(t[i],u[i]);

// Precomputed table
    ECP8_copy(&T1[0],&Q[0]); // Q[0]
    ECP8_copy(&T1[1],&T1[0]);
	ECP8_add(&T1[1],&Q[1]);	// Q[0]+Q[1]
    ECP8_copy(&T1[2],&T1[0]);
	ECP8_add(&T1[2],&Q[2]);	// Q[0]+Q[2]
	ECP8_copy(&T1[3],&T1[1]);
	ECP8_add(&T1[3],&Q[2]);	// Q[0]+Q[1]+Q[2]
	ECP8_copy(&T1[4],&T1[0]);
	ECP8_add(&T1[4],&Q[3]);  // Q[0]+Q[3]
	ECP8_copy(&T1[5],&T1[1]);
	ECP8_add(&T1[5],&Q[3]);	// Q[0]+Q[1]+Q[3]
	ECP8_copy(&T1[6],&T1[2]);
	ECP8_add(&T1[6],&Q[3]);	// Q[0]+Q[2]+Q[3]
	ECP8_copy(&T1[7],&T1[3]);
	ECP8_add(&T1[7],&Q[3]);	// Q[0]+Q[1]+Q[2]+Q[3]

//  Use Frobenius 

	for (i=0;i<8;i++)
	{
		ECP8_copy(&T2[i],&T1[i]);
		ECP8_frob(&T2[i],&X,4);

		ECP8_copy(&T3[i],&T2[i]);
		ECP8_frob(&T3[i],&X,4);

		ECP8_copy(&T4[i],&T3[i]);
		ECP8_frob(&T4[i],&X,4);
	}

// Make them odd
	pb1=1-BIG_parity(t[0]);
	BIG_inc(t[0],pb1);
	BIG_norm(t[0]);

	pb2=1-BIG_parity(t[4]);
	BIG_inc(t[4],pb2);
	BIG_norm(t[4]);

	pb3=1-BIG_parity(t[8]);
	BIG_inc(t[8],pb3);
	BIG_norm(t[8]);

	pb4=1-BIG_parity(t[12]);
	BIG_inc(t[12],pb4);
	BIG_norm(t[12]);

// Number of bits
    BIG_zero(mt);
    for (i=0; i<16; i++)
    {
        BIG_add(mt,mt,t[i]);
        BIG_norm(mt);
    }
    nb=1+BIG_nbits(mt);

// Sign pivot 
	s1[nb-1]=1;
	s2[nb-1]=1;
	s3[nb-1]=1;
	s4[nb-1]=1;
	for (i=0;i<nb-1;i++)
	{
        BIG_fshr(t[0],1);
		s1[i]=2*BIG_parity(t[0])-1;
        BIG_fshr(t[4],1);
		s2[i]=2*BIG_parity(t[4])-1;
        BIG_fshr(t[8],1);
		s3[i]=2*BIG_parity(t[8])-1;
        BIG_fshr(t[12],1);
		s4[i]=2*BIG_parity(t[12])-1;
	}


// Recoded exponents
    for (i=0; i<nb; i++)
    {
		w1[i]=0;
		k=1;
		for (j=1; j<4; j++)
		{
			bt=s1[i]*BIG_parity(t[j]);
			BIG_fshr(t[j],1);

			BIG_dec(t[j],(bt>>1));
			BIG_norm(t[j]);
			w1[i]+=bt*k;
			k*=2;
        }

		w2[i]=0;
		k=1;
		for (j=5; j<8; j++)
		{
			bt=s2[i]*BIG_parity(t[j]);
			BIG_fshr(t[j],1);

			BIG_dec(t[j],(bt>>1));
			BIG_norm(t[j]);
			w2[i]+=bt*k;
			k*=2;
        }

		w3[i]=0;
		k=1;
		for (j=9; j<12; j++)
		{
			bt=s3[i]*BIG_parity(t[j]);
			BIG_fshr(t[j],1);

			BIG_dec(t[j],(bt>>1));
			BIG_norm(t[j]);
			w3[i]+=bt*k;
			k*=2;
        }

		w4[i]=0;
		k=1;
		for (j=13; j<16; j++)
		{
			bt=s4[i]*BIG_parity(t[j]);
			BIG_fshr(t[j],1);

			BIG_dec(t[j],(bt>>1));
			BIG_norm(t[j]);
			w4[i]+=bt*k;
			k*=2;
        }
    }	

// Main loop
	ECP8_select(P,T1,2*w1[nb-1]+1);
	ECP8_select(&W,T2,2*w2[nb-1]+1);
	ECP8_add(P,&W);
	ECP8_select(&W,T3,2*w3[nb-1]+1);
	ECP8_add(P,&W);
	ECP8_select(&W,T4,2*w4[nb-1]+1);
	ECP8_add(P,&W);

    for (i=nb-2; i>=0; i--)
    {
        ECP8_dbl(P);
        ECP8_select(&W,T1,2*w1[i]+s1[i]);
        ECP8_add(P,&W);
        ECP8_select(&W,T2,2*w2[i]+s2[i]);
        ECP8_add(P,&W);
        ECP8_select(&W,T3,2*w3[i]+s3[i]);
        ECP8_add(P,&W);
        ECP8_select(&W,T4,2*w4[i]+s4[i]);
        ECP8_add(P,&W);
    }

// apply corrections
	ECP8_copy(&W,P);   
	ECP8_sub(&W,&Q[0]);
	ECP8_cmove(P,&W,pb1);
	ECP8_copy(&W,P);   
	ECP8_sub(&W,&Q[4]);
	ECP8_cmove(P,&W,pb2);

	ECP8_copy(&W,P);   
	ECP8_sub(&W,&Q[8]);
	ECP8_cmove(P,&W,pb3);
	ECP8_copy(&W,P);   
	ECP8_sub(&W,&Q[12]);
	ECP8_cmove(P,&W,pb4);

}

/*
void ZZZ::ECP8_mul16(ECP8 *P,ECP8 Q[16],BIG u[16])
{
    int i,j,a[4],nb,pb;
    ECP8 W[8],Z[8],WW[8],ZZ[8],T,C;
    BIG mt,t[16];
    sign8 w[NLEN_XXX*BASEBITS_XXX+1];
    sign8 z[NLEN_XXX*BASEBITS_XXX+1];
    sign8 ww[NLEN_XXX*BASEBITS_XXX+1];
    sign8 zz[NLEN_XXX*BASEBITS_XXX+1];

    FP fx,fy;
	FP2 X;

    FP_rcopy(&fx,Fra);
    FP_rcopy(&fy,Frb);
    FP2_from_FPs(&X,&fx,&fy);


    for (i=0; i<16; i++)
        BIG_copy(t[i],u[i]);

    // precompute tables 

// 12 add/subs 

    ECP8_copy(&W[0],&Q[0]);
    ECP8_sub(&W[0],&Q[1]);  // P-Q
    ECP8_copy(&W[1],&W[0]);
    ECP8_copy(&W[2],&W[0]);
    ECP8_copy(&W[3],&W[0]);
    ECP8_copy(&W[4],&Q[0]);
    ECP8_add(&W[4],&Q[1]);  // P+Q 
    ECP8_copy(&W[5],&W[4]);
    ECP8_copy(&W[6],&W[4]);
    ECP8_copy(&W[7],&W[4]);

    ECP8_copy(&T,&Q[2]);
    ECP8_sub(&T,&Q[3]);       // R-S 
    ECP8_sub(&W[1],&T);
    ECP8_add(&W[2],&T);
    ECP8_sub(&W[5],&T);
    ECP8_add(&W[6],&T);
    ECP8_copy(&T,&Q[2]);
    ECP8_add(&T,&Q[3]);      // R+S 
    ECP8_sub(&W[0],&T);
    ECP8_add(&W[3],&T);
    ECP8_sub(&W[4],&T);
    ECP8_add(&W[7],&T);


// Use Frobenius 

	for (i=0;i<8;i++)
	{
		ECP8_copy(&Z[i],&W[i]);
		ECP8_frob(&Z[i],&X,4);
	}

	for (i=0;i<8;i++)
	{
		ECP8_copy(&WW[i],&Z[i]);
		ECP8_frob(&WW[i],&X,4);
	}

	for (i=0;i<8;i++)
	{
		ECP8_copy(&ZZ[i],&WW[i]);
		ECP8_frob(&ZZ[i],&X,4);
	}

    // if multiplier is even add 1 to multiplier, and add P to correction 
    ECP8_inf(&C);

    BIG_zero(mt);
    for (i=0; i<16; i++)
    {
		pb=BIG_parity(t[i]);
		BIG_inc(t[i],1-pb);
		BIG_norm(t[i]);
		ECP8_copy(&T,&C);
		ECP8_add(&T,&Q[i]);
		ECP8_cmove(&C,&T,1-pb);


        BIG_add(mt,mt,t[i]);
        BIG_norm(mt);
    }

    nb=1+BIG_nbits(mt);

    // convert exponents to signed 1-bit windows 
    for (j=0; j<nb; j++)
    {
        for (i=0; i<4; i++)
        {
            a[i]=BIG_lastbits(t[i],2)-2;
            BIG_dec(t[i],a[i]);
            BIG_norm(t[i]);
            BIG_fshr(t[i],1);
        }
        w[j]=8*a[0]+4*a[1]+2*a[2]+a[3];
    }
    w[nb]=8*BIG_lastbits(t[0],2)+4*BIG_lastbits(t[1],2)+2*BIG_lastbits(t[2],2)+BIG_lastbits(t[3],2);


    for (j=0; j<nb; j++)
    {
        for (i=0; i<4; i++)
        {
            a[i]=BIG_lastbits(t[i+4],2)-2;
            BIG_dec(t[i+4],a[i]);
            BIG_norm(t[i+4]);
            BIG_fshr(t[i+4],1);
        }
        z[j]=8*a[0]+4*a[1]+2*a[2]+a[3];
    }
    z[nb]=8*BIG_lastbits(t[4],2)+4*BIG_lastbits(t[5],2)+2*BIG_lastbits(t[6],2)+BIG_lastbits(t[7],2);


    for (j=0; j<nb; j++)
    {
        for (i=0; i<4; i++)
        {
            a[i]=BIG_lastbits(t[i+8],2)-2;
            BIG_dec(t[i+8],a[i]);
            BIG_norm(t[i+8]);
            BIG_fshr(t[i+8],1);
        }
        ww[j]=8*a[0]+4*a[1]+2*a[2]+a[3];
    }
    ww[nb]=8*BIG_lastbits(t[8],2)+4*BIG_lastbits(t[9],2)+2*BIG_lastbits(t[10],2)+BIG_lastbits(t[11],2);

    for (j=0; j<nb; j++)
    {
        for (i=0; i<4; i++)
        {
            a[i]=BIG_lastbits(t[i+12],2)-2;
            BIG_dec(t[i+12],a[i]);
            BIG_norm(t[i+12]);
            BIG_fshr(t[i+12],1);
        }
        zz[j]=8*a[0]+4*a[1]+2*a[2]+a[3];
    }
    zz[nb]=8*BIG_lastbits(t[12],2)+4*BIG_lastbits(t[13],2)+2*BIG_lastbits(t[14],2)+BIG_lastbits(t[15],2);

    ECP8_copy(P,&W[(w[nb]-1)/2]);
	ECP8_add(P,&Z[(z[nb]-1)/2]);
	ECP8_add(P,&WW[(ww[nb]-1)/2]);
	ECP8_add(P,&ZZ[(zz[nb]-1)/2]);
    for (i=nb-1; i>=0; i--)
    {
		ECP8_dbl(P);
        ECP8_select(&T,W,w[i]);
        ECP8_add(P,&T);
        ECP8_select(&T,Z,z[i]);
        ECP8_add(P,&T);
        ECP8_select(&T,WW,ww[i]);
        ECP8_add(P,&T);
        ECP8_select(&T,ZZ,zz[i]);
        ECP8_add(P,&T);

    }
    ECP8_sub(P,&C); // apply correction 
	ECP8_reduce(P);
}
*/
/* Map to hash value to point on G2 from random BIG */

void ZZZ::ECP8_mapit(ECP8 *Q,octet *W)
{
    BIG q,one,x,hv;
	FP Fx,Fy;
    FP2 X;
	FP4 X4;
	FP8 X8;

    ECP8 xQ, x2Q, x3Q, x4Q , x5Q, x6Q, x7Q, x8Q;

	BIG_fromBytes(hv,W->val);
    BIG_rcopy(q,Modulus);
    BIG_one(one);
    BIG_mod(hv,q);

    for (;;)
    {
        FP2_from_BIGs(&X,one,hv);  /*******/
		FP4_from_FP2(&X4,&X);
		FP8_from_FP4(&X8,&X4);
        if (ECP8_setx(Q,&X8)) break;
        BIG_inc(hv,1);
    }

//printf("X4= ");
//FP8_output(&X4);
//printf("\n");

//	ECP8_get(&X4,&Y4,Q);

//printf("X4= ");
//FP8_output(&X4);
//printf("\n");

//printf("Y4= ");
//FP8_output(&Y4);
//printf("\n");


//	ECP8_set(Q,&X4,&Y4);


    FP_rcopy(&Fx,Fra);
    FP_rcopy(&Fy,Frb);
    FP2_from_FPs(&X,&Fx,&Fy);

    BIG_rcopy(x,CURVE_Bnx);

    // Efficient hash maps to G2 on BLS48 curves - Budroni, Pintore 
	// Q -> x8Q -x7Q -Q +  F(x7Q-x6Q) + F(F(x6Q-x5Q)) +F(F(F(x5Q-x4Q))) +F(F(F(F(x4Q-x3Q)))) + F(F(F(F(F(x3Q-x2Q))))) + F(F(F(F(F(F(x2Q-xQ)))))) + F(F(F(F(F(F(F(xQ-Q))))))) +F(F(F(F(F(F(F(F(2Q))))))))

	ECP8_copy(&xQ,Q);
	ECP8_mul(&xQ,x);
	ECP8_copy(&x2Q,&xQ);
	ECP8_mul(&x2Q,x);
	ECP8_copy(&x3Q,&x2Q);
	ECP8_mul(&x3Q,x);
	ECP8_copy(&x4Q,&x3Q);
	ECP8_mul(&x4Q,x);
	ECP8_copy(&x5Q,&x4Q);
	ECP8_mul(&x5Q,x);
	ECP8_copy(&x6Q,&x5Q);
	ECP8_mul(&x6Q,x);
	ECP8_copy(&x7Q,&x6Q);
	ECP8_mul(&x7Q,x);
	ECP8_copy(&x8Q,&x7Q);
	ECP8_mul(&x8Q,x);



#if SIGN_OF_X_ZZZ==NEGATIVEX
	ECP8_neg(&xQ);
	ECP8_neg(&x3Q);
	ECP8_neg(&x5Q);
	ECP8_neg(&x7Q);
#endif

	ECP8_sub(&x8Q,&x7Q);
	ECP8_sub(&x8Q,Q);

	ECP8_sub(&x7Q,&x6Q);
	ECP8_frob(&x7Q,&X,1);

	ECP8_sub(&x6Q,&x5Q);
	ECP8_frob(&x6Q,&X,2);
	
	ECP8_sub(&x5Q,&x4Q);
	ECP8_frob(&x5Q,&X,3);
	
	ECP8_sub(&x4Q,&x3Q);
	ECP8_frob(&x4Q,&X,4);

	ECP8_sub(&x3Q,&x2Q);
	ECP8_frob(&x3Q,&X,5);

	ECP8_sub(&x2Q,&xQ);
	ECP8_frob(&x2Q,&X,6);

	ECP8_sub(&xQ,Q);
	ECP8_frob(&xQ,&X,7);

	ECP8_dbl(Q);
	ECP8_frob(Q,&X,8);


	ECP8_add(Q,&x8Q);
	ECP8_add(Q,&x7Q);
	ECP8_add(Q,&x6Q);
	ECP8_add(Q,&x5Q);

	ECP8_add(Q,&x4Q);
	ECP8_add(Q,&x3Q);
	ECP8_add(Q,&x2Q);
	ECP8_add(Q,&xQ);

	ECP8_reduce(Q);

}

// ECP$ Get Group Generator

void ZZZ::ECP8_generator(ECP8 *G)
{
	BIG a,b;
	FP2 Aa,Bb;
	FP4 A,B;
	FP8 X,Y;

	BIG_rcopy(a,CURVE_Pxaaa);
	BIG_rcopy(b,CURVE_Pxaab);
	FP2_from_BIGs(&Aa,a,b);

	BIG_rcopy(a,CURVE_Pxaba);
	BIG_rcopy(b,CURVE_Pxabb);
	FP2_from_BIGs(&Bb,a,b);

	FP4_from_FP2s(&A,&Aa,&Bb);

	BIG_rcopy(a,CURVE_Pxbaa);
	BIG_rcopy(b,CURVE_Pxbab);
	FP2_from_BIGs(&Aa,a,b);

	BIG_rcopy(a,CURVE_Pxbba);
	BIG_rcopy(b,CURVE_Pxbbb);
	FP2_from_BIGs(&Bb,a,b);

	FP4_from_FP2s(&B,&Aa,&Bb);

	FP8_from_FP4s(&X,&A,&B);

	BIG_rcopy(a,CURVE_Pyaaa);
	BIG_rcopy(b,CURVE_Pyaab);
	FP2_from_BIGs(&Aa,a,b);

	BIG_rcopy(a,CURVE_Pyaba);
	BIG_rcopy(b,CURVE_Pyabb);
	FP2_from_BIGs(&Bb,a,b);

	FP4_from_FP2s(&A,&Aa,&Bb);

	BIG_rcopy(a,CURVE_Pybaa);
	BIG_rcopy(b,CURVE_Pybab);
	FP2_from_BIGs(&Aa,a,b);

	BIG_rcopy(a,CURVE_Pybba);
	BIG_rcopy(b,CURVE_Pybbb);
	FP2_from_BIGs(&Bb,a,b);

	FP4_from_FP2s(&B,&Aa,&Bb);

	FP8_from_FP4s(&Y,&A,&B);

	ECP8_set(G,&X,&Y);
}


// g++ -O2 ecp8_BLS48.cpp fp8_BLS48.cpp fp4_BLS48.cpp fp2_BLS48.cpp fp_BLS48.cpp big_B560_29.cpp rand.cpp hash.cpp rom_field_BLS48.cpp rom_curve_BLS48.cpp oct.cpp -o ecp8_BLS48.exe
/*
int main()
{
	int i;
	ECP8 G,P;
	FP2 Aa,Bb,f;
	FP8 X,Y;
	BIG a,b,r,p;
	char w[100];
	octet W= {0,sizeof(w),w};

	ECP8_generator(&G);

	BIG_rcopy(a,Fra);
    BIG_rcopy(b,Frb);
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

