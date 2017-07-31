/**
 * @file wcc_ZZZ.c
 * @author Mike Scott
 * @author Kealan McCusker
 * @date 28th April 2016
 * @brief AMCL Wang / Chow Choo (WCC) definitions
 *
 * LICENSE
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include "wcc_ZZZ.h"

/* Map octet string to point on curve */
static void mapit(octet *h,ECP_ZZZ *P)
{
    BIG_XXX q,x,c;
    BIG_XXX_fromBytes(x,h->val);
    BIG_XXX_rcopy(q,Modulus_ZZZ);
    BIG_XXX_mod(x,q);

    while (!ECP_ZZZ_setx(P,x,0))
        BIG_XXX_inc(x,1);

    BIG_XXX_rcopy(c,CURVE_Cof_ZZZ);
    ECP_ZZZ_mul(P,c);
}

/* Map to hash value to point on G2 */
static void mapit2(octet *h, ECP2_ZZZ *Q)
{
    BIG_XXX q,one,Fx,Fy,x,hv;
    FP2_YYY X;
#if (PAIRING_FRIENDLY_ZZZ == BN)
    ECP2_ZZZ T,K;
#elif (PAIRING_FRIENDLY_ZZZ == BLS)
    ECP2_ZZZ xQ, x2Q;
#endif

    BIG_XXX_fromBytes(hv,h->val);
    BIG_XXX_rcopy(q,Modulus_ZZZ);
    BIG_XXX_one(one);
    BIG_XXX_mod(hv,q);

    for (;;)
    {
        FP2_YYY_from_BIGs(&X,one,hv);
        if (ECP2_ZZZ_setx(Q,&X)) break;
        BIG_XXX_inc(hv,1);
    }

    BIG_XXX_rcopy(Fx,Fra_ZZZ);
    BIG_XXX_rcopy(Fy,Frb_ZZZ);
    FP2_YYY_from_BIGs(&X,Fx,Fy);
    BIG_XXX_rcopy(x,CURVE_Bnx_ZZZ);

#if (PAIRING_FRIENDLY_ZZZ == BN)

    /* Faster Hashing to G2 - Fuentes-Castaneda, Knapp and Rodriguez-Henriquez */
    /* Q -> xQ + F(3xQ) + F(F(xQ)) + F(F(F(Q))). */
    ECP2_ZZZ_copy(&T,Q);
    ECP2_ZZZ_mul(&T,x);
    ECP2_ZZZ_neg(&T);   // our x is negative
    ECP2_ZZZ_copy(&K,&T);
    ECP2_ZZZ_dbl(&K);
    ECP2_ZZZ_add(&K,&T);
    ECP2_ZZZ_affine(&K);

    ECP2_ZZZ_frob(&K,&X);
    ECP2_ZZZ_frob(Q,&X);
    ECP2_ZZZ_frob(Q,&X);
    ECP2_ZZZ_frob(Q,&X);
    ECP2_ZZZ_add(Q,&T);
    ECP2_ZZZ_add(Q,&K);
    ECP2_ZZZ_frob(&T,&X);
    ECP2_ZZZ_frob(&T,&X);
    ECP2_ZZZ_add(Q,&T);
    ECP2_ZZZ_affine(Q);

#elif (PAIRING_FRIENDLY_ZZZ == BLS)

    /* Efficient hash maps to G2 on BLS curves - Budroni, Pintore */
    /* Q -> x2Q -xQ -Q +F(xQ -Q) +F(F(2Q)) */

    ECP2_ZZZ_copy(&xQ,Q);
    ECP2_ZZZ_mul(&xQ,x);
    ECP2_ZZZ_copy(&x2Q,&xQ);
    ECP2_ZZZ_mul(&x2Q,x);

    ECP2_ZZZ_sub(&x2Q,&xQ);
    ECP2_ZZZ_sub(&x2Q,Q);

    ECP2_ZZZ_sub(&xQ,Q);
    ECP2_ZZZ_frob(&xQ,&X);

    ECP2_ZZZ_dbl(Q);
    ECP2_ZZZ_frob(Q,&X);
    ECP2_ZZZ_frob(Q,&X);

    ECP2_ZZZ_add(Q,&x2Q);
    ECP2_ZZZ_add(Q,&xQ);

    ECP2_ZZZ_affine(Q);

#endif
}

/* Hash number (optional) and octet to octet */
static void hashit(int sha,int n,octet *x,octet *w)
{
    int i,c[4],hlen;
    hash256 sha256;
    hash512 sha512;
    char hh[64];

    switch (sha)
    {
    case SHA256:
        HASH256_init(&sha256);
        break;
    case SHA384:
        HASH384_init(&sha512);
        break;
    case SHA512:
        HASH512_init(&sha512);
        break;
    }

    hlen=sha;

    if (n>0)
    {
        c[0]=(n>>24)&0xff;
        c[1]=(n>>16)&0xff;
        c[2]=(n>>8)&0xff;
        c[3]=(n)&0xff;
        for (i=0; i<4; i++)
        {
            switch(sha)
            {
            case SHA256:
                HASH256_process(&sha256,c[i]);
                break;
            case SHA384:
                HASH384_process(&sha512,c[i]);
                break;
            case SHA512:
                HASH512_process(&sha512,c[i]);
                break;
            }
        }
    }
    if (x!=NULL) for (i=0; i<x->len; i++)
        {
            switch(sha)
            {
            case SHA256:
                HASH256_process(&sha256,x->val[i]);
                break;
            case SHA384:
                HASH384_process(&sha512,x->val[i]);
                break;
            case SHA512:
                HASH512_process(&sha512,x->val[i]);
                break;
            }
        }

    for (i=0; i<hlen; i++) hh[i]=0;
    switch (sha)
    {
    case SHA256:
        HASH256_hash(&sha256,hh);
        break;
    case SHA384:
        HASH384_hash(&sha512,hh);
        break;
    case SHA512:
        HASH512_hash(&sha512,hh);
        break;
    }

    OCT_empty(w);

    if (hlen>=MODBYTES_XXX)
        OCT_jbytes(w,hh,MODBYTES_XXX);
    else
    {
        OCT_jbytes(w,hh,hlen);
        OCT_jbyte(w,0,MODBYTES_XXX-hlen);
    }
}

/* Perform sha256 of EC Points and Id. Map to an integer modulo the curve order.  */
void WCC_ZZZ_Hq(int sha, octet *A,octet *B,octet *C,octet *D,octet *h)
{
    BIG_XXX q,hs;
    // hv has to store two points in G1, One in G2 and the Id length
    char hv[2000];
    octet HV= {0,sizeof(hv),hv};
    char ht[PFS_ZZZ];
    octet HT= {0,sizeof(ht),ht};

    BIG_XXX_rcopy(q,CURVE_Order_ZZZ);

#ifdef DEBUG
    printf("WCC_ZZZ_Hq: A: ");
    OCT_output(A);
    printf("\n");
    printf("WCC_ZZZ_Hq: B: ");
    OCT_output(B);
    printf("\n");
    printf("WCC_ZZZ_Hq: C: ");
    OCT_output(C);
    printf("\n");
    printf("WCC_ZZZ_Hq: D: ");
    OCT_output(D);
    printf("\n");
#endif

    OCT_joctet(&HV,A);
    OCT_joctet(&HV,B);
    OCT_joctet(&HV,C);
    OCT_joctet(&HV,D);
    hashit(sha,0,&HV,&HT);

    BIG_XXX_fromBytes(hs,HT.val);
    BIG_XXX_mod(hs,q);
    OCT_clear(&HT);
    BIG_XXX_toBytes(h->val,hs);
    h->len=PGS_ZZZ;
}

/*  Calculate a value in G1. VG1 = s*H1(ID) where ID is the identity */
int WCC_ZZZ_GET_G1_MULTIPLE(int sha, int hashDone, octet *S,octet *ID,octet *VG1)
{
    BIG_XXX s;
    ECP_ZZZ P;
    char h[PFS_ZZZ];
    octet H= {0,sizeof(h),h};

    if (hashDone)
    {
        mapit(ID,&P);
    }
    else
    {
        hashit(sha,0,ID,&H);
        mapit(&H,&P);
    }

    BIG_XXX_fromBytes(s,S->val);
    PAIR_ZZZ_G1mul(&P,s);

    ECP_ZZZ_toOctet(VG1,&P);
    return 0;
}

/* Calculate a value in G1 used for when time permits are enabled */
int WCC_ZZZ_GET_G1_TPMULT(int sha, int date, octet *S,octet *ID,octet *VG1)
{
    BIG_XXX s;
    ECP_ZZZ P,Q;
    char h1[PFS_ZZZ];
    octet H1= {0,sizeof(h1),h1};
    char h2[PFS_ZZZ];
    octet H2= {0,sizeof(h2),h2};

    // H1(ID)
    hashit(sha,0,ID,&H1);
    mapit(&H1,&P);

    // H1(date|sha256(ID))
    hashit(sha,date,&H1,&H2);
    mapit(&H2,&Q);

    // P = P + Q
    ECP_ZZZ_add(&P,&Q);

    // P = s(P+Q)
    BIG_XXX_fromBytes(s,S->val);
    PAIR_ZZZ_G1mul(&P,s);

    ECP_ZZZ_toOctet(VG1,&P);
    return 0;
}

/* Calculate a value in G2 used for when time permits are enabled */
int WCC_ZZZ_GET_G2_TPMULT(int sha, int date, octet *S,octet *ID,octet *VG2)
{
    BIG_XXX s;
    ECP2_ZZZ P,Q;
    char h1[PFS_ZZZ];
    octet H1= {0,sizeof(h1),h1};
    char h2[PFS_ZZZ];
    octet H2= {0,sizeof(h2),h2};

    // H1(ID)
    hashit(sha,0,ID,&H1);
    mapit2(&H1,&P);

    // H1(date|sha256(ID))
    hashit(sha,date,&H1,&H2);
    mapit2(&H2,&Q);

    // P = P + Q
    ECP2_ZZZ_add(&P,&Q);

    // P = s(P+Q)
    BIG_XXX_fromBytes(s,S->val);
    PAIR_ZZZ_G2mul(&P,s);

    ECP2_ZZZ_toOctet(VG2,&P);
    return 0;
}

/* Calculate a value in G2. VG2 = s*H2(ID) where ID is the identity */
int WCC_ZZZ_GET_G2_MULTIPLE(int sha, int hashDone, octet *S,octet *ID,octet *VG2)
{
    BIG_XXX s;
    ECP2_ZZZ P;
    char h[PFS_ZZZ];
    octet H= {0,sizeof(h),h};

    if (hashDone)
    {
        mapit2(ID,&P);
    }
    else
    {
        hashit(sha,0,ID,&H);
        mapit2(&H,&P);
    }

    BIG_XXX_fromBytes(s,S->val);
    PAIR_ZZZ_G2mul(&P,s);

    ECP2_ZZZ_toOctet(VG2,&P);
    return 0;
}

/* Calculate time permit in G2 */
int WCC_ZZZ_GET_G2_PERMIT(int sha, int date,octet *S,octet *HID,octet *TPG2)
{
    BIG_XXX s;
    ECP2_ZZZ P;
    char h[PFS_ZZZ];
    octet H= {0,sizeof(h),h};

    hashit(sha,date,HID,&H);
    mapit2(&H,&P);
    BIG_XXX_fromBytes(s,S->val);
    PAIR_ZZZ_G2mul(&P,s);

    ECP2_ZZZ_toOctet(TPG2,&P);
    return 0;
}

/* Calculate the sender AES Key */
int WCC_ZZZ_SENDER_KEY(int sha, int date, octet *xOct, octet *piaOct, octet *pibOct, octet *PbG2Oct, octet *PgG1Oct, octet *AKeyG1Oct, octet *ATPG1Oct, octet *IdBOct, octet *AESKeyOct)
{
    ECP_ZZZ sAG1,ATPG1,PgG1;
    ECP2_ZZZ BG2,dateBG2,PbG2;
    char hv1[PFS_ZZZ],hv2[PFS_ZZZ];
    octet HV1= {0,sizeof(hv1),hv1};
    octet HV2= {0,sizeof(hv2),hv2};

    // Pairing outputs
    FP12_YYY g;

    FP4_YYY  c;
    BIG_XXX t,x,z,pia,pib;

    char xpgg1[2*PFS_ZZZ+1];
    octet xPgG1Oct= {0,sizeof(xpgg1), xpgg1};

    char hv[6*PFS_ZZZ+1];
    octet HV= {0,sizeof(hv),hv};
    char ht[PFS_ZZZ];
    octet HT= {0,sizeof(ht),ht};

    BIG_XXX_fromBytes(x,xOct->val);
    BIG_XXX_fromBytes(pia,piaOct->val);
    BIG_XXX_fromBytes(pib,pibOct->val);

    if (!ECP2_ZZZ_fromOctet(&PbG2,PbG2Oct))
    {
#ifdef DEBUG
        printf("PbG2Oct Invalid Point: ");
        OCT_output(PbG2Oct);
        printf("\n");
#endif
        return WCC_INVALID_POINT;
    }

    if (!ECP_ZZZ_fromOctet(&PgG1,PgG1Oct))
    {
#ifdef DEBUG
        printf("PgG1Oct Invalid Point: ");
        OCT_output(PgG1Oct);
        printf("\n");
#endif
        return WCC_INVALID_POINT;
    }

    hashit(sha,0,IdBOct,&HV1);
    mapit2(&HV1,&BG2);

    if (!ECP_ZZZ_fromOctet(&sAG1,AKeyG1Oct))
    {
#ifdef DEBUG
        printf("AKeyG1Oct Invalid Point: ");
        OCT_output(AKeyG1Oct);
        printf("\n");
#endif
        return WCC_INVALID_POINT;
    }

    // Use time permits
    if (date)
    {
        // calculate e( (s*A+s*H(date|H(AID))) , (B+H(date|H(BID))) )
        if (!ECP_ZZZ_fromOctet(&ATPG1,ATPG1Oct))
        {
#ifdef DEBUG
            printf("ATPG1Oct Invalid Point: ");
            OCT_output(ATPG1Oct);
            printf("\n");
            return WCC_INVALID_POINT;
#endif
        }

        // H2(date|sha256(IdB))
        hashit(sha,date,&HV1,&HV2);
        mapit2(&HV2,&dateBG2);

        // sAG1 = sAG1 + ATPG1
        ECP_ZZZ_add(&sAG1, &ATPG1);
        // BG2 = BG2 + H(date|H(IdB))
        ECP2_ZZZ_add(&BG2, &dateBG2);
    }
    // z =  x + pia
    BIG_XXX_add(z,x,pia);

    // (x+pia).AKeyG1
    PAIR_ZZZ_G1mul(&sAG1,z);

    // pib.BG2
    PAIR_ZZZ_G2mul(&BG2,pib);

    // pib.BG2+PbG2
    ECP2_ZZZ_add(&BG2, &PbG2);

    ECP2_ZZZ_affine(&BG2);
    ECP_ZZZ_affine(&sAG1);

    PAIR_ZZZ_ate(&g,&BG2,&sAG1);
    PAIR_ZZZ_fexp(&g);
    // printf("WCC_ZZZ_SENDER_KEY e(sAG1,BG2) = ");FP12_YYY_output(&g); printf("\n");

    // x.PgG1
    PAIR_ZZZ_G1mul(&PgG1,x);
    ECP_ZZZ_toOctet(&xPgG1Oct,&PgG1);

    // Generate AES Key : K=H(k,x.PgG1)
    FP12_YYY_trace(&c,&g);

    HV.len = 4*PFS_ZZZ;
    FP_YYY_redc(t,&(c.a.a));
    BIG_XXX_toBytes(&(HV.val[0]),t);

    FP_YYY_redc(t,&(c.a.b));
    BIG_XXX_toBytes(&(HV.val[PFS_ZZZ]),t);

    FP_YYY_redc(t,&(c.b.a));
    BIG_XXX_toBytes(&(HV.val[PFS_ZZZ*2]),t);

    FP_YYY_redc(t,&(c.b.b));
    BIG_XXX_toBytes(&(HV.val[PFS_ZZZ*3]),t);

    // Set HV.len to correct value
    OCT_joctet(&HV,&xPgG1Oct);

    hashit(sha,0,&HV,&HT);

    OCT_empty(AESKeyOct);
    OCT_jbytes(AESKeyOct,HT.val,PAS);

    return 0;
}

/* Calculate the receiver AES key */
int WCC_ZZZ_RECEIVER_KEY(int sha, int date, octet *yOct, octet *wOct,  octet *piaOct, octet *pibOct,  octet *PaG1Oct, octet *PgG1Oct, octet *BKeyG2Oct,octet *BTPG2Oct,  octet *IdAOct, octet *AESKeyOct)
{
    ECP_ZZZ AG1,dateAG1,PgG1,PaG1;
    ECP2_ZZZ sBG2,BTPG2;
    char hv1[PFS_ZZZ],hv2[PFS_ZZZ];
    octet HV1= {0,sizeof(hv1),hv1};
    octet HV2= {0,sizeof(hv2),hv2};

    // Pairing outputs
    FP12_YYY g;

    FP4_YYY  c;
    BIG_XXX t,w,y,pia,pib;;

    char wpag1[2*PFS_ZZZ+1];
    octet wPaG1Oct= {0,sizeof(wpag1), wpag1};

    char hv[6*PFS_ZZZ+1];
    octet HV= {0,sizeof(hv),hv};
    char ht[PFS_ZZZ];
    octet HT= {0,sizeof(ht),ht};

    BIG_XXX_fromBytes(y,yOct->val);
    BIG_XXX_fromBytes(w,wOct->val);
    BIG_XXX_fromBytes(pia,piaOct->val);
    BIG_XXX_fromBytes(pib,pibOct->val);

    if (!ECP_ZZZ_fromOctet(&PaG1,PaG1Oct))
        return WCC_INVALID_POINT;

    if (!ECP_ZZZ_fromOctet(&PgG1,PgG1Oct))
        return WCC_INVALID_POINT;

    hashit(sha,0,IdAOct,&HV1);
    mapit(&HV1,&AG1);

    if (!ECP2_ZZZ_fromOctet(&sBG2,BKeyG2Oct))
        return WCC_INVALID_POINT;

    if (date)
    {
        // Calculate e( (A+H(date|H(AID))) , (s*B+s*H(date|H(IdB))) )
        if (!ECP2_ZZZ_fromOctet(&BTPG2,BTPG2Oct))
            return WCC_INVALID_POINT;

        // H1(date|sha256(AID))
        hashit(sha,date,&HV1,&HV2);
        mapit(&HV2,&dateAG1);

        // sBG2 = sBG2 + TPG2
        ECP2_ZZZ_add(&sBG2, &BTPG2);
        // AG1 = AG1 + H(date|H(AID))
        ECP_ZZZ_add(&AG1, &dateAG1);
    }
    // y =  y + pib
    BIG_XXX_add(y,y,pib);

    // (y+pib).BKeyG2
    PAIR_ZZZ_G2mul(&sBG2,y);

    // pia.AG1
    PAIR_ZZZ_G1mul(&AG1,pia);

    // pia.AG1+PaG1
    ECP_ZZZ_add(&AG1, &PaG1);

    ECP2_ZZZ_affine(&sBG2);
    ECP_ZZZ_affine(&AG1);

    PAIR_ZZZ_ate(&g,&sBG2,&AG1);
    PAIR_ZZZ_fexp(&g);
    // printf("WCC_ZZZ_RECEIVER_KEY e(AG1,sBG2) = ");FP12_YYY_output(&g); printf("\n");

    // w.PaG1
    PAIR_ZZZ_G1mul(&PaG1,w);
    ECP_ZZZ_toOctet(&wPaG1Oct,&PaG1);

    // Generate AES Key: K=H(k,w.PaG1)
    FP12_YYY_trace(&c,&g);

    HV.len = 4*PFS_ZZZ;
    FP_YYY_redc(t,&(c.a.a));
    BIG_XXX_toBytes(&(HV.val[0]),t);

    FP_YYY_redc(t,&(c.a.b));
    BIG_XXX_toBytes(&(HV.val[PFS_ZZZ]),t);

    FP_YYY_redc(t,&(c.b.a));
    BIG_XXX_toBytes(&(HV.val[PFS_ZZZ*2]),t);

    FP_YYY_redc(t,&(c.b.b));
    BIG_XXX_toBytes(&(HV.val[PFS_ZZZ*3]),t);

    // Set HV.len to correct value
    OCT_joctet(&HV,&wPaG1Oct);

    hashit(sha,0,&HV,&HT);

    OCT_empty(AESKeyOct);
    OCT_jbytes(AESKeyOct,HT.val,PAS);

    return 0;

}

/* Generate a random number Modulus_ZZZ the group order */
int WCC_ZZZ_RANDOM_GENERATE(csprng *RNG,octet* S)
{
    BIG_XXX r,s;
    BIG_XXX_rcopy(r,CURVE_Order_ZZZ);
    BIG_XXX_randomnum(s,r,RNG);
    BIG_XXX_toBytes(S->val,s);
    S->len=PGS_ZZZ;
    return 0;
}

/* Calculate time permit in G2 */
int WCC_ZZZ_GET_G1_PERMIT(int sha, int date,octet *S,octet *HID,octet *TPG1)
{
    BIG_XXX s;
    ECP_ZZZ P;
    char h[PFS_ZZZ];
    octet H= {0,sizeof(h),h};

    hashit(sha,date,HID,&H);
    mapit(&H,&P);
    BIG_XXX_fromBytes(s,S->val);
    PAIR_ZZZ_G1mul(&P,s);

    ECP_ZZZ_toOctet(TPG1,&P);
    return 0;
}

/* Add two members from the group G1 */
int WCC_ZZZ_RECOMBINE_G1(octet *R1,octet *R2,octet *R)
{
    ECP_ZZZ P,T;
    int res=0;
    if (!ECP_ZZZ_fromOctet(&P,R1)) res=WCC_INVALID_POINT;
    if (!ECP_ZZZ_fromOctet(&T,R2)) res=WCC_INVALID_POINT;
    if (res==0)
    {
        ECP_ZZZ_add(&P,&T);
        ECP_ZZZ_toOctet(R,&P);
    }
    return res;
}

/* Add two members from the group G2 */
int WCC_ZZZ_RECOMBINE_G2(octet *W1,octet *W2,octet *W)
{
    ECP2_ZZZ Q,T;
    int res=0;
    if (!ECP2_ZZZ_fromOctet(&Q,W1)) res=WCC_INVALID_POINT;
    if (!ECP2_ZZZ_fromOctet(&T,W2)) res=WCC_INVALID_POINT;
    if (res==0)
    {
        ECP2_ZZZ_add(&Q,&T);
        ECP2_ZZZ_toOctet(W,&Q);
    }
    return res;
}
