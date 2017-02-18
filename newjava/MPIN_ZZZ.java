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

/* MPIN API Functions */

package amcl;

public class MPIN_ZZZ
{
	public static final int EFS=BIG_XXX.MODBYTES;
	public static final int EGS=BIG_XXX.MODBYTES;
	public static final int PAS=16;
	public static final int INVALID_POINT=-14;
	public static final int BAD_PARAMS=-11;
	public static final int WRONG_ORDER=-18;
	public static final int BAD_PIN=-19;

/* Configure your PIN here */

	public static final int MAXPIN=10000;  /* PIN less than this */
	public static final int PBLEN=14;      /* Number of bits in PIN */
	public static final int TS=10;         /* 10 for 4 digit PIN, 14 for 6-digit PIN - 2^TS/TS approx = sqrt(MAXPIN) */
	public static final int TRAP=200;      /* 200 for 4 digit PIN, 2000 for 6-digit PIN  - approx 2*sqrt(MAXPIN) */

	public static final int HASH_TYPE=MPIN_SUP.SHA256;

	public static byte[] mpin_hash(int sha,FP4_YYY c,ECP_ZZZ U)
	{
		byte[] w=new byte[EFS];
		byte[] t=new byte[6*EFS];
		byte[] h=null;
		c.geta().getA().toBytes(w); for (int i=0;i<EFS;i++) t[i]=w[i];
		c.geta().getB().toBytes(w); for (int i=EFS;i<2*EFS;i++) t[i]=w[i-EFS];
		c.getb().getA().toBytes(w); for (int i=2*EFS;i<3*EFS;i++) t[i]=w[i-2*EFS];
		c.getb().getB().toBytes(w); for (int i=3*EFS;i<4*EFS;i++) t[i]=w[i-3*EFS];
		
		U.getX().toBytes(w); for (int i=4*EFS;i<5*EFS;i++) t[i]=w[i-4*EFS];
		U.getY().toBytes(w); for (int i=5*EFS;i<6*EFS;i++) t[i]=w[i-5*EFS];
		
		if (sha==MPIN_SUP.SHA256)
		{
			HASH256 H=new HASH256();
			H.process_array(t);
			h=H.hash();
		}
		if (sha==MPIN_SUP.SHA384)
		{
			HASH384 H=new HASH384();
			H.process_array(t);
			h=H.hash();
		}
		if (sha==MPIN_SUP.SHA512)
		{
			HASH512 H=new HASH512();
			H.process_array(t);
			h=H.hash();
		}
		if (h==null) return null;
		byte[] R=new byte[PAS];
		for (int i=0;i<PAS;i++) R[i]=h[i];
		return R;
	}



	public static ECP_ZZZ mapit(byte[] h)
	{
		BIG_XXX q=new BIG_XXX(ROM_YYY.Modulus);
		BIG_XXX x=BIG_XXX.fromBytes(h);
		x.mod(q);
		ECP_ZZZ P;
		while (true)
		{
			P=new ECP_ZZZ(x,0);
			if (!P.is_infinity()) break;
			x.inc(1); x.norm();
		}

		if (ECP_ZZZ.CURVE_PAIRING_TYPE!=ECP_ZZZ.BN)
		{
			BIG_XXX c=new BIG_XXX(ROM_ZZZ.CURVE_Cof);
			P=P.mul(c);
		}
		return P;
	}

/* needed for SOK */
	public static ECP2_ZZZ mapit2(byte[] h)
	{
		BIG_XXX q=new BIG_XXX(ROM_YYY.Modulus);
		BIG_XXX x=BIG_XXX.fromBytes(h);
		BIG_XXX one=new BIG_XXX(1);
		FP2_YYY X;
		ECP2_ZZZ Q,T,K;
		x.mod(q);
		while (true)
		{
			X=new FP2_YYY(one,x);
			Q=new ECP2_ZZZ(X);
			if (!Q.is_infinity()) break;
			x.inc(1); x.norm();
		}
/* Fast Hashing to G2 - Fuentes-Castaneda, Knapp and Rodriguez-Henriquez */
		BIG_XXX Fra=new BIG_XXX(ROM_ZZZ.CURVE_Fra);
		BIG_XXX Frb=new BIG_XXX(ROM_ZZZ.CURVE_Frb);
		X=new FP2_YYY(Fra,Frb);
		x=new BIG_XXX(ROM_ZZZ.CURVE_Bnx);

		T=new ECP2_ZZZ(); T.copy(Q);
		T.mul(x); T.neg();
		K=new ECP2_ZZZ(); K.copy(T);
		K.dbl(); K.add(T); K.affine();

		K.frob(X);
		Q.frob(X); Q.frob(X); Q.frob(X);
		Q.add(T); Q.add(K);
		T.frob(X); T.frob(X);
		Q.add(T);
		Q.affine();
		return Q;
	}



/* these next two functions help to implement elligator squared - http://eprint.iacr.org/2014/043 */
/* maps a random u to a point on the curve */
	public static ECP_ZZZ map(BIG_XXX u,int cb)
	{
		ECP_ZZZ P;
		BIG_XXX x=new BIG_XXX(u);
		BIG_XXX p=new BIG_XXX(ROM_YYY.Modulus);
		x.mod(p);
		while (true)
		{
			P=new ECP_ZZZ(x,cb);
			if (!P.is_infinity()) break;
			x.inc(1);  x.norm();
		}
		return P;
	}

/* returns u derived from P. Random value in range 1 to return value should then be added to u */
	public static int unmap(BIG_XXX u,ECP_ZZZ P)
	{
		int s=P.getS();
		ECP_ZZZ R;
		int r=0;
		BIG_XXX x=P.getX();
		u.copy(x);
		while (true)
		{
			u.dec(1); u.norm();
			r++;
			R=new ECP_ZZZ(u,s);
			if (!R.is_infinity()) break;
		}
		return r;
	}



/* these next two functions implement elligator squared - http://eprint.iacr.org/2014/043 */
/* Elliptic curve point E in format (0x04,x,y} is converted to form {0x0-,u,v} */
/* Note that u and v are indistinguisible from random strings */
	public static int ENCODING(RAND rng,byte[] E)
	{
		int rn,m,su,sv;
		byte[] T=new byte[EFS];

		for (int i=0;i<EFS;i++) T[i]=E[i+1];
		BIG_XXX u=BIG_XXX.fromBytes(T);
		for (int i=0;i<EFS;i++) T[i]=E[i+EFS+1];
		BIG_XXX v=BIG_XXX.fromBytes(T);
		
		ECP_ZZZ P=new ECP_ZZZ(u,v);
		if (P.is_infinity()) return INVALID_POINT;

		BIG_XXX p=new BIG_XXX(ROM_YYY.Modulus);
		u=BIG_XXX.randomnum(p,rng);

		su=rng.getByte(); /*if (su<0) su=-su;*/ su%=2;
		
		ECP_ZZZ W=map(u,su);
		P.sub(W);
		sv=P.getS();
		rn=unmap(v,P);
		m=rng.getByte(); /*if (m<0) m=-m;*/ m%=rn;
		v.inc(m+1);
		E[0]=(byte)(su+2*sv);
		u.toBytes(T);
		for (int i=0;i<EFS;i++) E[i+1]=T[i];
		v.toBytes(T);
		for (int i=0;i<EFS;i++) E[i+EFS+1]=T[i];		
		
		return 0;
	}

	public static int DECODING(byte[] D)
	{
		int su,sv;
		byte[] T=new byte[EFS];

		if ((D[0]&0x04)!=0) return INVALID_POINT;

		for (int i=0;i<EFS;i++) T[i]=D[i+1];
		BIG_XXX u=BIG_XXX.fromBytes(T);
		for (int i=0;i<EFS;i++) T[i]=D[i+EFS+1];
		BIG_XXX v=BIG_XXX.fromBytes(T);

		su=D[0]&1;
		sv=(D[0]>>1)&1;
		ECP_ZZZ W=map(u,su);
		ECP_ZZZ P=map(v,sv);
		P.add(W);
		u=P.getX();
		v=P.getY();
		D[0]=0x04;
		u.toBytes(T);
		for (int i=0;i<EFS;i++) D[i+1]=T[i];
		v.toBytes(T);
		for (int i=0;i<EFS;i++) D[i+EFS+1]=T[i];		
		
		return 0;
	}

/* R=R1+R2 in group G1 */
	public static int RECOMBINE_G1(byte[] R1,byte[] R2,byte[] R)
	{
		ECP_ZZZ P=ECP_ZZZ.fromBytes(R1);
		ECP_ZZZ Q=ECP_ZZZ.fromBytes(R2);

		if (P.is_infinity() || Q.is_infinity()) return INVALID_POINT;

		P.add(Q);

		P.toBytes(R);
		return 0;
	}

/* W=W1+W2 in group G2 */
	public static int RECOMBINE_G2(byte[] W1,byte[] W2,byte[] W)
	{
		ECP2_ZZZ P=ECP2_ZZZ.fromBytes(W1);
		ECP2_ZZZ Q=ECP2_ZZZ.fromBytes(W2);

		if (P.is_infinity() || Q.is_infinity()) return INVALID_POINT;

		P.add(Q);
	
		P.toBytes(W);
		return 0;
	}
	
/* create random secret S */
	public static int RANDOM_GENERATE(RAND rng,byte[] S)
	{
		BIG_XXX s;
		BIG_XXX r=new BIG_XXX(ROM_ZZZ.CURVE_Order);
		s=BIG_XXX.randomnum(r,rng);
		//if (ROM.AES_S>0)
		//{
		//	s.mod2m(2*ROM.AES_S);
		//}
		s.toBytes(S);
		return 0;
	}

/* Extract PIN from TOKEN for identity CID */
	public static int EXTRACT_PIN(int sha,byte[] CID,int pin,byte[] TOKEN)
	{
		ECP_ZZZ P=ECP_ZZZ.fromBytes(TOKEN);
		if (P.is_infinity()) return INVALID_POINT;
		byte[] h=MPIN_SUP.hashit(sha,0,CID,EFS);
		ECP_ZZZ R=mapit(h);


		pin%=MAXPIN;

		R=R.pinmul(pin,PBLEN);
		P.sub(R);

		P.toBytes(TOKEN);

		return 0;
	}

/* Implement step 2 on client side of MPin protocol */
	public static int CLIENT_2(byte[] X,byte[] Y,byte[] SEC)
	{
		BIG_XXX r=new BIG_XXX(ROM_ZZZ.CURVE_Order);
		ECP_ZZZ P=ECP_ZZZ.fromBytes(SEC);
		if (P.is_infinity()) return INVALID_POINT;

		BIG_XXX px=BIG_XXX.fromBytes(X);
		BIG_XXX py=BIG_XXX.fromBytes(Y);
		px.add(py);
		px.mod(r);
	//	px.rsub(r);

		P=PAIR_ZZZ.G1mul(P,px);
		P.neg();
		P.toBytes(SEC);
		return 0;
	}

/* Implement step 1 on client side of MPin protocol */
	public static int CLIENT_1(int sha,int date,byte[] CLIENT_ID,RAND rng,byte[] X,int pin,byte[] TOKEN,byte[] SEC,byte[] xID,byte[] xCID,byte[] PERMIT)
	{
		BIG_XXX r=new BIG_XXX(ROM_ZZZ.CURVE_Order);
		BIG_XXX x;
		if (rng!=null)
		{
			x=BIG_XXX.randomnum(r,rng);
			//if (ROM.AES_S>0)
			//{
			//	x.mod2m(2*ROM.AES_S);
			//}
			x.toBytes(X);
		}
		else
		{
			x=BIG_XXX.fromBytes(X);
		}
		ECP_ZZZ P,T,W;
		BIG_XXX px;
//		byte[] t=new byte[EFS];

		byte[] h=MPIN_SUP.hashit(sha,0,CLIENT_ID,EFS);
		P=mapit(h);
	
		T=ECP_ZZZ.fromBytes(TOKEN);
		if (T.is_infinity()) return INVALID_POINT;

		pin%=MAXPIN;
		W=P.pinmul(pin,PBLEN);
		T.add(W);
		if (date!=0)
		{
			W=ECP_ZZZ.fromBytes(PERMIT);
			if (W.is_infinity()) return INVALID_POINT;
			T.add(W);
			h=MPIN_SUP.hashit(sha,date,h,EFS);
			W=mapit(h);
			if (xID!=null)
			{
				P=PAIR_ZZZ.G1mul(P,x);
				P.toBytes(xID);
				W=PAIR_ZZZ.G1mul(W,x);
				P.add(W);
			}
			else
			{
				P.add(W);
				P=PAIR_ZZZ.G1mul(P,x);
			}
			if (xCID!=null) P.toBytes(xCID);
		}
		else
		{
			if (xID!=null)
			{
				P=PAIR_ZZZ.G1mul(P,x);
				P.toBytes(xID);
			}
		}


		T.toBytes(SEC);
		return 0;
	}

/* Extract Server Secret SST=S*Q where Q is fixed generator in G2 and S is master secret */
	public static int GET_SERVER_SECRET(byte[] S,byte[] SST)
	{
		ECP2_ZZZ Q=new ECP2_ZZZ(new FP2_YYY(new BIG_XXX(ROM_ZZZ.CURVE_Pxa),new BIG_XXX(ROM_ZZZ.CURVE_Pxb)),new FP2_YYY(new BIG_XXX(ROM_ZZZ.CURVE_Pya),new BIG_XXX(ROM_ZZZ.CURVE_Pyb)));

		BIG_XXX s=BIG_XXX.fromBytes(S);
		Q=PAIR_ZZZ.G2mul(Q,s);
		Q.toBytes(SST);
		return 0;
	}

/*
 W=x*H(G);
 if RNG == NULL then X is passed in 
 if RNG != NULL the X is passed out 
 if type=0 W=x*G where G is point on the curve, else W=x*M(G), where M(G) is mapping of octet G to point on the curve
*/
	public static int GET_G1_MULTIPLE(RAND rng, int type,byte[] X,byte[] G,byte[] W)
	{
		BIG_XXX x;
		BIG_XXX r=new BIG_XXX(ROM_ZZZ.CURVE_Order);
		if (rng!=null)
		{
			x=BIG_XXX.randomnum(r,rng);
			//if (ROM.AES_S>0)
			//{
			//	x.mod2m(2*ROM.AES_S);
			//}
			x.toBytes(X);
		}
		else
		{
			x=BIG_XXX.fromBytes(X);
		}
		ECP_ZZZ P;
		if (type==0)
		{
			P=ECP_ZZZ.fromBytes(G);
			if (P.is_infinity()) return INVALID_POINT;
		}
		else
			P=mapit(G);

		PAIR_ZZZ.G1mul(P,x).toBytes(W);
		return 0;
	}

/* Client secret CST=S*H(CID) where CID is client ID and S is master secret */
/* CID is hashed externally */
	public static int GET_CLIENT_SECRET(byte[] S,byte[] CID,byte[] CST)
	{
		return GET_G1_MULTIPLE(null,1,S,CID,CST);
	}

/* Time Permit CTT=S*(date|H(CID)) where S is master secret */
	public static int GET_CLIENT_PERMIT(int sha,int date,byte[] S,byte[] CID,byte[] CTT)
	{
		byte[] h=MPIN_SUP.hashit(sha,date,CID,EFS);
		ECP_ZZZ P=mapit(h);

		BIG_XXX s=BIG_XXX.fromBytes(S);
		PAIR_ZZZ.G1mul(P,s).toBytes(CTT);
		return 0;
	}

/* Outputs H(CID) and H(T|H(CID)) for time permits. If no time permits set HID=HTID */
	public static void SERVER_1(int sha,int date,byte[] CID,byte[] HID,byte[] HTID)
	{
		byte[] h=MPIN_SUP.hashit(sha,0,CID,EFS);
		ECP_ZZZ R,P=mapit(h);

		P.toBytes(HID);   // new
		if (date!=0)
		{
	//		if (HID!=null) P.toBytes(HID);
			h=MPIN_SUP.hashit(sha,date,h,EFS);
			R=mapit(h);
			P.add(R);
			P.toBytes(HTID);
		}
	//	else P.toBytes(HID);
	}

/* Implement step 2 of MPin protocol on server side */
	public static int SERVER_2(int date,byte[] HID,byte[] HTID,byte[] Y,byte[] SST,byte[] xID,byte[] xCID,byte[] mSEC,byte[] E,byte[] F)
	{
		BIG_XXX q=new BIG_XXX(ROM_YYY.Modulus);
		ECP2_ZZZ Q=new ECP2_ZZZ(new FP2_YYY(new BIG_XXX(ROM_ZZZ.CURVE_Pxa),new BIG_XXX(ROM_ZZZ.CURVE_Pxb)),new FP2_YYY(new BIG_XXX(ROM_ZZZ.CURVE_Pya),new BIG_XXX(ROM_ZZZ.CURVE_Pyb)));

		ECP2_ZZZ sQ=ECP2_ZZZ.fromBytes(SST);
		if (sQ.is_infinity()) return INVALID_POINT;	

		ECP_ZZZ R;
		if (date!=0)
			R=ECP_ZZZ.fromBytes(xCID);
		else 
		{
			if (xID==null) return BAD_PARAMS;
			R=ECP_ZZZ.fromBytes(xID);
		}
		if (R.is_infinity()) return INVALID_POINT;

		BIG_XXX y=BIG_XXX.fromBytes(Y);
		ECP_ZZZ P;
		if (date!=0) P=ECP_ZZZ.fromBytes(HTID);
		else 
		{
			if (HID==null) return BAD_PARAMS;
			P=ECP_ZZZ.fromBytes(HID);
		}
	
		if (P.is_infinity()) return INVALID_POINT;

		P=PAIR_ZZZ.G1mul(P,y);
		P.add(R);
		R=ECP_ZZZ.fromBytes(mSEC);
		if (R.is_infinity()) return INVALID_POINT;

		FP12_YYY g;

		g=PAIR_ZZZ.ate2(Q,R,sQ,P);
		g=PAIR_ZZZ.fexp(g);

		if (!g.isunity())
		{
			if (HID!=null && xID!=null && E!=null && F!=null)
			{
				g.toBytes(E);
				if (date!=0)
				{
					P=ECP_ZZZ.fromBytes(HID);
					if (P.is_infinity()) return INVALID_POINT;
					R=ECP_ZZZ.fromBytes(xID);
					if (R.is_infinity()) return INVALID_POINT;

					P=PAIR_ZZZ.G1mul(P,y);
					P.add(R);
				}
				g=PAIR_ZZZ.ate(Q,P);
				g=PAIR_ZZZ.fexp(g);
				g.toBytes(F);
			}
			return BAD_PIN;
		}

		return 0;
	}

/* Pollards kangaroos used to return PIN error */
	public static int KANGAROO(byte[] E,byte[] F)
	{
		FP12_YYY ge=FP12_YYY.fromBytes(E);
		FP12_YYY gf=FP12_YYY.fromBytes(F);
		int[] distance = new int[TS];
		FP12_YYY t=new FP12_YYY(gf);
		FP12_YYY[] table=new FP12_YYY[TS];
		int i,j,m,s,dn,dm,res,steps;

		s=1;
		for (m=0;m<TS;m++)
		{
			distance[m]=s;
			table[m]=new FP12_YYY(t);
			s*=2;
			t.usqr();
		}
		t.one();
		dn=0;
		for (j=0;j<TRAP;j++)
		{
			i=t.geta().geta().getA().lastbits(20)%TS;
			t.mul(table[i]);
			dn+=distance[i];
		}
		gf.copy(t); gf.conj();
		steps=0; dm=0;
		res=0;
		while (dm-dn<MAXPIN)
		{
			steps++;
			if (steps>4*TRAP) break;
			i=ge.geta().geta().getA().lastbits(20)%TS;
			ge.mul(table[i]);
			dm+=distance[i];
			if (ge.equals(t))
			{
				res=dm-dn;
				break;
			}
			if (ge.equals(gf))
			{
				res=dn-dm;
				break;
			}

		}
		if (steps>4*TRAP || dm-dn>=MAXPIN) {res=0; }    // Trap Failed  - probable invalid token
		return res;
	}

/* Functions to support M-Pin Full */

	public static int PRECOMPUTE(byte[] TOKEN,byte[] CID,byte[] G1,byte[] G2)
	{
		ECP_ZZZ P,T;
		FP12_YYY g;

		T=ECP_ZZZ.fromBytes(TOKEN);
		if (T.is_infinity()) return INVALID_POINT; 

		P=mapit(CID);

		ECP2_ZZZ Q=new ECP2_ZZZ(new FP2_YYY(new BIG_XXX(ROM_ZZZ.CURVE_Pxa),new BIG_XXX(ROM_ZZZ.CURVE_Pxb)),new FP2_YYY(new BIG_XXX(ROM_ZZZ.CURVE_Pya),new BIG_XXX(ROM_ZZZ.CURVE_Pyb)));

		g=PAIR_ZZZ.ate(Q,T);
		g=PAIR_ZZZ.fexp(g);
		g.toBytes(G1);

		g=PAIR_ZZZ.ate(Q,P);
		g=PAIR_ZZZ.fexp(g);
		g.toBytes(G2);

		return 0;
	}



/* calculate common key on client side */
/* wCID = w.(A+AT) */
	public static int CLIENT_KEY(int sha,byte[] G1,byte[] G2,int pin,byte[] R,byte[] X,byte[] H,byte[] wCID,byte[] CK)
	{
		byte[] t;

		FP12_YYY g1=FP12_YYY.fromBytes(G1);
		FP12_YYY g2=FP12_YYY.fromBytes(G2);
		BIG_XXX z=BIG_XXX.fromBytes(R);
		BIG_XXX x=BIG_XXX.fromBytes(X);
		BIG_XXX h=BIG_XXX.fromBytes(H);

		ECP_ZZZ W=ECP_ZZZ.fromBytes(wCID);
		if (W.is_infinity()) return INVALID_POINT; 

		W=PAIR_ZZZ.G1mul(W,x);

		FP2_YYY f=new FP2_YYY(new BIG_XXX(ROM_ZZZ.CURVE_Fra),new BIG_XXX(ROM_ZZZ.CURVE_Frb));
		BIG_XXX r=new BIG_XXX(ROM_ZZZ.CURVE_Order);
		BIG_XXX q=new BIG_XXX(ROM_YYY.Modulus);

		z.add(h);	//new
		z.mod(r);

		BIG_XXX m=new BIG_XXX(q);
		m.mod(r);

		BIG_XXX a=new BIG_XXX(z);
		a.mod(m);

		BIG_XXX b=new BIG_XXX(z);
		b.div(m);

		g2.pinpow(pin,PBLEN);
		g1.mul(g2);

		FP4_YYY c=g1.trace();
		g2.copy(g1);
		g2.frob(f);
		FP4_YYY cp=g2.trace();
		g1.conj();
		g2.mul(g1);
		FP4_YYY cpm1=g2.trace();
		g2.mul(g1);
		FP4_YYY cpm2=g2.trace();

		c=c.xtr_pow2(cp,cpm1,cpm2,a,b);

		t=mpin_hash(sha,c,W);

		for (int i=0;i<PAS;i++) CK[i]=t[i];

		return 0;
	}

/* calculate common key on server side */
/* Z=r.A - no time permits involved */

	public static int SERVER_KEY(int sha,byte[] Z,byte[] SST,byte[] W,byte[] H,byte[] HID,byte[] xID,byte[] xCID,byte[] SK)
	{
		byte[] t;

		ECP2_ZZZ sQ=ECP2_ZZZ.fromBytes(SST);
		if (sQ.is_infinity()) return INVALID_POINT; 
		ECP_ZZZ R=ECP_ZZZ.fromBytes(Z);
		if (R.is_infinity()) return INVALID_POINT; 
		ECP_ZZZ A=ECP_ZZZ.fromBytes(HID);
		if (A.is_infinity()) return INVALID_POINT; 

		ECP_ZZZ U;
		if (xCID!=null)
			U=ECP_ZZZ.fromBytes(xCID);
		else
			U=ECP_ZZZ.fromBytes(xID);
		if (U.is_infinity()) return INVALID_POINT; 

		BIG_XXX w=BIG_XXX.fromBytes(W);
		BIG_XXX h=BIG_XXX.fromBytes(H);
		A=PAIR_ZZZ.G1mul(A,h);	// new
		R.add(A);

		U=PAIR_ZZZ.G1mul(U,w);
		FP12_YYY g=PAIR_ZZZ.ate(sQ,R);
		g=PAIR_ZZZ.fexp(g);

		FP4_YYY c=g.trace();

		t=mpin_hash(sha,c,U);

		for (int i=0;i<PAS;i++) SK[i]=t[i];

		return 0;
	}

/* Generate Y = H(epoch, xCID/xID) */
	public static void GET_Y(int sha,int TimeValue,byte[] xCID,byte[] Y)
	{
		byte[] h = MPIN_SUP.hashit(sha,TimeValue,xCID,EFS);
		BIG_XXX y = BIG_XXX.fromBytes(h);
		BIG_XXX q=new BIG_XXX(ROM_ZZZ.CURVE_Order);
		y.mod(q);
		//if (ROM.AES_S>0)
		//{
		//	y.mod2m(2*ROM.AES_S);
		//}
		y.toBytes(Y);
	}
        
/* One pass MPIN Client */
	public static int CLIENT(int sha,int date,byte[] CLIENT_ID,RAND RNG,byte[] X,int pin,byte[] TOKEN,byte[] SEC,byte[] xID,byte[] xCID,byte[] PERMIT, int TimeValue, byte[] Y)
	{
		int rtn=0;
        
		byte[] pID;
		if (date == 0)
			pID = xID;
		else
			pID = xCID;
          
		rtn = CLIENT_1(sha,date,CLIENT_ID,RNG,X,pin,TOKEN,SEC,xID,xCID,PERMIT);
		if (rtn != 0)
			return rtn;
        
		GET_Y(sha,TimeValue,pID,Y);
        
		rtn = CLIENT_2(X,Y,SEC);
		if (rtn != 0)
		return rtn;
        
		return 0;
	}
        
/* One pass MPIN Server */
	public static int SERVER(int sha,int date,byte[] HID,byte[] HTID,byte[] Y,byte[] SST,byte[] xID,byte[] xCID,byte[] SEC,byte[] E,byte[] F,byte[] CID, int TimeValue)
	{
		int rtn=0;
        
		byte[] pID;
		if (date == 0)
			pID = xID;
		else
			pID = xCID;
          
		SERVER_1(sha,date,CID,HID,HTID);
        
		GET_Y(sha,TimeValue,pID,Y);
          
		rtn = SERVER_2(date,HID,HTID,Y,SST,xID,xCID,SEC,E,F);
		if (rtn != 0)
			return rtn;
        
		return 0;
	}
}
