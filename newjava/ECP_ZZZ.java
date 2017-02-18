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

/* Elliptic Curve Point class */

package amcl;

public final class ECP_ZZZ {

	public static final int WEIERSTRASS=0;
	public static final int EDWARDS=1;
	public static final int MONTGOMERY=2;
	public static final int NOT=0;
	public static final int BN=1;
	public static final int BLS=2;

	public static final int CURVETYPE=@CT@;
	public static final int CURVE_PAIRING_TYPE=@PF@;

	private FP_YYY x;
	private FP_YYY y;
	private FP_YYY z;
	private boolean INF;

/* Constructor - set to O */
	public ECP_ZZZ() {
		INF=true;
		x=new FP_YYY(0);
		y=new FP_YYY(1);
		z=new FP_YYY(1);
	}
/* test for O point-at-infinity */
	public boolean is_infinity() {
		if (CURVETYPE==EDWARDS)
		{
			x.reduce(); y.reduce(); z.reduce();
			return (x.iszilch() && y.equals(z));
		}
		else return INF;
	}
/* Conditional swap of P and Q dependant on d */
	private void cswap(ECP_ZZZ Q,int d)
	{
		x.cswap(Q.x,d);
		if (CURVETYPE!=MONTGOMERY) y.cswap(Q.y,d);
		z.cswap(Q.z,d);
		if (CURVETYPE!=EDWARDS)
		{
			boolean bd;
			if (d==0) bd=false;
			else bd=true;
			bd=bd&(INF^Q.INF);
			INF^=bd;
			Q.INF^=bd;
		}
	}

/* Conditional move of Q to P dependant on d */
	private void cmove(ECP_ZZZ Q,int d)
	{
		x.cmove(Q.x,d);
		if (CURVETYPE!=MONTGOMERY) y.cmove(Q.y,d);
		z.cmove(Q.z,d);
		if (CURVETYPE!=EDWARDS)
		{
			boolean bd;
			if (d==0) bd=false;
			else bd=true;
			INF^=(INF^Q.INF)&bd;
		}
	}

/* return 1 if b==c, no branching */
	private static int teq(int b,int c)
	{
		int x=b^c;
		x-=1;  // if x=0, x now -1
		return ((x>>31)&1);
	}

/* Constant time select from pre-computed table */
	private void select(ECP_ZZZ W[],int b)
	{
		ECP_ZZZ MP=new ECP_ZZZ(); 
		int m=b>>31;
		int babs=(b^m)-m;

		babs=(babs-1)/2;

		cmove(W[0],teq(babs,0));  // conditional move
		cmove(W[1],teq(babs,1));
		cmove(W[2],teq(babs,2));
		cmove(W[3],teq(babs,3));
		cmove(W[4],teq(babs,4));
		cmove(W[5],teq(babs,5));
		cmove(W[6],teq(babs,6));
		cmove(W[7],teq(babs,7));
 
		MP.copy(this);
		MP.neg();
		cmove(MP,(int)(m&1));
	}

/* Test P == Q */
	public boolean equals(ECP_ZZZ Q) {
		if (is_infinity() && Q.is_infinity()) return true;
		if (is_infinity() || Q.is_infinity()) return false;
		if (CURVETYPE==WEIERSTRASS)
		{
			FP_YYY zs2=new FP_YYY(z); zs2.sqr();
			FP_YYY zo2=new FP_YYY(Q.z); zo2.sqr();
			FP_YYY zs3=new FP_YYY(zs2); zs3.mul(z);
			FP_YYY zo3=new FP_YYY(zo2); zo3.mul(Q.z);
			zs2.mul(Q.x);
			zo2.mul(x);
			if (!zs2.equals(zo2)) return false;
			zs3.mul(Q.y);
			zo3.mul(y);
			if (!zs3.equals(zo3)) return false;
		}
		else
		{
			FP_YYY a=new FP_YYY(0);
			FP_YYY b=new FP_YYY(0);
			a.copy(x); a.mul(Q.z); a.reduce();
			b.copy(Q.x); b.mul(z); b.reduce();
			if (!a.equals(b)) return false;
			if (CURVETYPE==EDWARDS)
			{
				a.copy(y); a.mul(Q.z); a.reduce();
				b.copy(Q.y); b.mul(z); b.reduce();
				if (!a.equals(b)) return false;
			}
		}
		return true;
	}

/* this=P */
	public void copy(ECP_ZZZ P)
	{
		x.copy(P.x);
		if (CURVETYPE!=MONTGOMERY) y.copy(P.y);
		z.copy(P.z);
		INF=P.INF;
	}
/* this=-this */
	public void neg() {
		if (is_infinity()) return;
		if (CURVETYPE==WEIERSTRASS)
		{
			y.neg(); y.norm();
		}
		if (CURVETYPE==EDWARDS)
		{
			x.neg(); x.norm();
		}
		return;
	}
/* set this=O */
	public void inf() {
		INF=true;
		x.zero();
		y.one();
		z.one();
	//	y=new FP_YYY(1);
	//	z=new FP_YYY(1);
	}

/* Calculate RHS of curve equation */
	public static FP_YYY RHS(FP_YYY x) {
		x.norm();
		FP_YYY r=new FP_YYY(x);
		r.sqr();

		if (CURVETYPE==WEIERSTRASS)
		{ // x^3+Ax+B
			FP_YYY b=new FP_YYY(new BIG_XXX(ROM_ZZZ.CURVE_B));
			r.mul(x);
			if (ROM_ZZZ.CURVE_A==-3)
			{
				FP_YYY cx=new FP_YYY(x);
				cx.imul(3);
				cx.neg(); cx.norm();
				r.add(cx);
			}
			r.add(b);
		}
		if (CURVETYPE==EDWARDS)
		{ // (Ax^2-1)/(Bx^2-1) 
			FP_YYY b=new FP_YYY(new BIG_XXX(ROM_ZZZ.CURVE_B));

			FP_YYY one=new FP_YYY(1);
			b.mul(r);
			b.sub(one);
			if (ROM_ZZZ.CURVE_A==-1) r.neg();
			r.sub(one);

			b.inverse();

			r.mul(b);
		}
		if (CURVETYPE==MONTGOMERY)
		{ // x^3+Ax^2+x
			FP_YYY x3=new FP_YYY(0);
			x3.copy(r);
			x3.mul(x);
			r.imul(ROM_ZZZ.CURVE_A);
			r.add(x3);
			r.add(x);
		}
		r.reduce();
		return r;
	}

/* set (x,y) from two BIGs */
	public ECP_ZZZ(BIG_XXX ix,BIG_XXX iy) {
		x=new FP_YYY(ix);
		y=new FP_YYY(iy);
		z=new FP_YYY(1);
		FP_YYY rhs=RHS(x);

		if (CURVETYPE==MONTGOMERY)
		{
			if (rhs.jacobi()==1) INF=false;
			else inf();
		}
		else
		{
			FP_YYY y2=new FP_YYY(y);
			y2.sqr();
			if (y2.equals(rhs)) INF=false;
			else inf();
		}
	}
/* set (x,y) from BIG and a bit */
	public ECP_ZZZ(BIG_XXX ix,int s) {
		x=new FP_YYY(ix);
		FP_YYY rhs=RHS(x);
		y=new FP_YYY(0);
		z=new FP_YYY(1);
		if (rhs.jacobi()==1)
		{
			FP_YYY ny=rhs.sqrt();
			if (ny.redc().parity()!=s) ny.neg();
			y.copy(ny);
			INF=false;
		}
		else inf();
	}

/* set from x - calculate y from curve equation */
	public ECP_ZZZ(BIG_XXX ix) {
		x=new FP_YYY(ix);
		FP_YYY rhs=RHS(x);
		y=new FP_YYY(0);
		z=new FP_YYY(1);
		if (rhs.jacobi()==1)
		{
			if (CURVETYPE!=MONTGOMERY) y.copy(rhs.sqrt());
			INF=false;
		}
		else INF=true;
	}

/* set to affine - from (x,y,z) to (x,y) */
	public void affine() {
		if (is_infinity()) return;
		FP_YYY one=new FP_YYY(1);
		if (z.equals(one)) return;
		z.inverse();
		if (CURVETYPE==WEIERSTRASS)
		{
			FP_YYY z2=new FP_YYY(z);
			z2.sqr();
			x.mul(z2); x.reduce();
			y.mul(z2); 
			y.mul(z);  y.reduce();
		}
		if (CURVETYPE==EDWARDS)
		{
			x.mul(z); x.reduce();
			y.mul(z); y.reduce();
		}
		if (CURVETYPE==MONTGOMERY)
		{
			x.mul(z); x.reduce();
		}
		z.copy(one);
	}
/* extract x as a BIG */
	public BIG_XXX getX()
	{
		affine();
		return x.redc();
	}
/* extract y as a BIG */
	public BIG_XXX getY()
	{
		affine();
		return y.redc();
	}

/* get sign of Y */
	public int getS()
	{
		affine();
		BIG_XXX y=getY();
		return y.parity();
	}
/* extract x as an FP */
	public FP_YYY getx()
	{
		return x;
	}
/* extract y as an FP */
	public FP_YYY gety()
	{
		return y;
	}
/* extract z as an FP */
	public FP_YYY getz()
	{
		return z;
	}
/* convert to byte array */
	public void toBytes(byte[] b)
	{
		byte[] t=new byte[BIG_XXX.MODBYTES];
		if (CURVETYPE!=MONTGOMERY) b[0]=0x04;
		else b[0]=0x02;
	
		affine();
		x.redc().toBytes(t);
		for (int i=0;i<BIG_XXX.MODBYTES;i++) b[i+1]=t[i];
		if (CURVETYPE!=MONTGOMERY)
		{
			y.redc().toBytes(t);
			for (int i=0;i<BIG_XXX.MODBYTES;i++) b[i+BIG_XXX.MODBYTES+1]=t[i];
		}
	}
/* convert from byte array to point */
	public static ECP_ZZZ fromBytes(byte[] b)
	{
		byte[] t=new byte[BIG_XXX.MODBYTES];
		BIG_XXX p=new BIG_XXX(ROM_YYY.Modulus);

		for (int i=0;i<BIG_XXX.MODBYTES;i++) t[i]=b[i+1];
		BIG_XXX px=BIG_XXX.fromBytes(t);
		if (BIG_XXX.comp(px,p)>=0) return new ECP_ZZZ();

		if (b[0]==0x04)
		{
			for (int i=0;i<BIG_XXX.MODBYTES;i++) t[i]=b[i+BIG_XXX.MODBYTES+1];
			BIG_XXX py=BIG_XXX.fromBytes(t);
			if (BIG_XXX.comp(py,p)>=0) return new ECP_ZZZ();
			return new ECP_ZZZ(px,py);
		}
		else return new ECP_ZZZ(px);
	}
/* convert to hex string */
	public String toString() {
		if (is_infinity()) return "infinity";
		affine();
		if (CURVETYPE==MONTGOMERY) return "("+x.redc().toString()+")";
		else return "("+x.redc().toString()+","+y.redc().toString()+")";
	}
/* this*=2 */
	public void dbl() {
		if (CURVETYPE==WEIERSTRASS)
		{
			if (INF) return;
			if (y.iszilch())
			{
				inf();
				return;
			}

			FP_YYY w1=new FP_YYY(x);
			FP_YYY w6=new FP_YYY(z);
			FP_YYY w2=new FP_YYY(0);
			FP_YYY w3=new FP_YYY(x);
			FP_YYY w8=new FP_YYY(x);

			if (ROM_ZZZ.CURVE_A==-3)
			{
				w6.sqr();
				w1.copy(w6);
				w1.neg();
				w3.add(w1);
				w8.add(w6);
				w3.mul(w8);
				w8.copy(w3);
				w8.imul(3);
			}
			else
			{
				w1.sqr();
				w8.copy(w1);
				w8.imul(3);
			}

			w2.copy(y); w2.sqr();
			w3.copy(x); w3.mul(w2);
			w3.imul(4);
			w1.copy(w3); w1.neg();
			w1.norm();

			x.copy(w8); x.sqr();
			x.add(w1);
			x.add(w1);
			x.norm();

			z.mul(y);
			z.add(z);

			w2.add(w2);
			w2.sqr();
			w2.add(w2);
			w3.sub(x);
			y.copy(w8); y.mul(w3);
			y.sub(w2);
			y.norm();
			z.norm();
		}
		if (CURVETYPE==EDWARDS)
		{
			FP_YYY C=new FP_YYY(x);
			FP_YYY D=new FP_YYY(y);
			FP_YYY H=new FP_YYY(z);
			FP_YYY J=new FP_YYY(0);
	
			x.mul(y); x.add(x);
			C.sqr();
			D.sqr();
			if (ROM_ZZZ.CURVE_A==-1) C.neg();	
			y.copy(C); y.add(D);
			y.norm();
			H.sqr(); H.add(H);
			z.copy(y);
			J.copy(y); J.sub(H);
			x.mul(J);
			C.sub(D);
			y.mul(C);
			z.mul(J);

			x.norm();
			y.norm();
			z.norm();
		}
		if (CURVETYPE==MONTGOMERY)
		{
			FP_YYY A=new FP_YYY(x);
			FP_YYY B=new FP_YYY(x);		
			FP_YYY AA=new FP_YYY(0);
			FP_YYY BB=new FP_YYY(0);
			FP_YYY C=new FP_YYY(0);
	
			if (INF) return;

			A.add(z);
			AA.copy(A); AA.sqr();
			B.sub(z);
			BB.copy(B); BB.sqr();
			C.copy(AA); C.sub(BB);

			x.copy(AA); x.mul(BB);

			A.copy(C); A.imul((ROM_ZZZ.CURVE_A+2)/4);

			BB.add(A);
			z.copy(BB); z.mul(C);
			x.norm();
			z.norm();
		}
		return;
	}

/* this+=Q */
	public void add(ECP_ZZZ Q) {
		if (CURVETYPE==WEIERSTRASS)
		{
			if (INF)
			{
				copy(Q);
				return;
			}
			if (Q.INF) return;

			boolean aff=false;

			FP_YYY one=new FP_YYY(1);
			if (Q.z.equals(one)) aff=true;

			FP_YYY A,C;
			FP_YYY B=new FP_YYY(z);
			FP_YYY D=new FP_YYY(z);
			if (!aff)
			{
				A=new FP_YYY(Q.z);
				C=new FP_YYY(Q.z);

				A.sqr(); B.sqr();
				C.mul(A); D.mul(B);

				A.mul(x);
				C.mul(y);
			}
			else
			{
				A=new FP_YYY(x);
				C=new FP_YYY(y);
	
				B.sqr();
				D.mul(B);
			}

			B.mul(Q.x); B.sub(A);
			D.mul(Q.y); D.sub(C);

			if (B.iszilch())
			{
				if (D.iszilch())
				{
					dbl();
					return;
				}
				else
				{
					INF=true;
					return;
				}
			}

			if (!aff) z.mul(Q.z);
			z.mul(B);

			FP_YYY e=new FP_YYY(B); e.sqr();
			B.mul(e);
			A.mul(e);

			e.copy(A);
			e.add(A); e.add(B);
			x.copy(D); x.sqr(); x.sub(e);

			A.sub(x);
			y.copy(A); y.mul(D); 
			C.mul(B); y.sub(C);

			x.norm();
			y.norm();
			z.norm();
		}
		if (CURVETYPE==EDWARDS)
		{
			FP_YYY b=new FP_YYY(new BIG_XXX(ROM_ZZZ.CURVE_B));
			FP_YYY A=new FP_YYY(z);
			FP_YYY B=new FP_YYY(0);
			FP_YYY C=new FP_YYY(x);
			FP_YYY D=new FP_YYY(y);
			FP_YYY E=new FP_YYY(0);
			FP_YYY F=new FP_YYY(0);
			FP_YYY G=new FP_YYY(0);
		//	FP_YYY H=new FP_YYY(0);
		//	FP_YYY I=new FP_YYY(0);
	
			A.mul(Q.z);
			B.copy(A); B.sqr();
			C.mul(Q.x);
			D.mul(Q.y);

			E.copy(C); E.mul(D); E.mul(b);
			F.copy(B); F.sub(E); 
			G.copy(B); G.add(E); 

			if (ROM_ZZZ.CURVE_A==1)
			{
				E.copy(D); E.sub(C);
			}
			C.add(D);

			B.copy(x); B.add(y);
			D.copy(Q.x); D.add(Q.y); 
			B.mul(D);
			B.sub(C);
			B.mul(F);
			x.copy(A); x.mul(B);

			if (ROM_ZZZ.CURVE_A==1)
			{
				C.copy(E); C.mul(G);
			}
			if (ROM_ZZZ.CURVE_A==-1)
			{
				C.mul(G);
			}
			y.copy(A); y.mul(C);
			z.copy(F); z.mul(G);
			x.norm(); y.norm(); z.norm();
		}
		return;
	}

/* Differential Add for Montgomery curves. this+=Q where W is this-Q and is affine. */
	public void dadd(ECP_ZZZ Q,ECP_ZZZ W) {
			FP_YYY A=new FP_YYY(x);
			FP_YYY B=new FP_YYY(x);
			FP_YYY C=new FP_YYY(Q.x);
			FP_YYY D=new FP_YYY(Q.x);
			FP_YYY DA=new FP_YYY(0);
			FP_YYY CB=new FP_YYY(0);	
			
			A.add(z); 
			B.sub(z); 

			C.add(Q.z);
			D.sub(Q.z);

			DA.copy(D); DA.mul(A);
			CB.copy(C); CB.mul(B);

			A.copy(DA); A.add(CB); A.sqr();
			B.copy(DA); B.sub(CB); B.sqr();

			x.copy(A);
			z.copy(W.x); z.mul(B);

			if (z.iszilch()) inf();
			else INF=false;

			x.norm();
	}
/* this-=Q */
	public void sub(ECP_ZZZ Q) {
		Q.neg();
		add(Q);
		Q.neg();
	}

	public static void multiaffine(int m,ECP_ZZZ[] P)
	{
		int i;
		FP_YYY t1=new FP_YYY(0);
		FP_YYY t2=new FP_YYY(0);

		FP_YYY[] work=new FP_YYY[m];

		for (i=0;i<m;i++)
			work[i]=new FP_YYY(0);
	
		work[0].one();
		work[1].copy(P[0].z);

		for (i=2;i<m;i++)
		{
			work[i].copy(work[i-1]);
			work[i].mul(P[i-1].z);
		}

		t1.copy(work[m-1]);
		t1.mul(P[m-1].z);
		t1.inverse();
		t2.copy(P[m-1].z);
		work[m-1].mul(t1);

		for (i=m-2;;i--)
		{
			if (i==0)
			{
				work[0].copy(t1);
				work[0].mul(t2);
				break;
			}
			work[i].mul(t2);
			work[i].mul(t1);
			t2.mul(P[i].z);
		}
/* now work[] contains inverses of all Z coordinates */

		for (i=0;i<m;i++)
		{
			P[i].z.one();
			t1.copy(work[i]);
			t1.sqr();
			P[i].x.mul(t1);
			t1.mul(work[i]);
			P[i].y.mul(t1);
		}    
	}

/* constant time multiply by small integer of length bts - use ladder */
	public ECP_ZZZ pinmul(int e,int bts) {	
		if (CURVETYPE==MONTGOMERY)
			return this.mul(new BIG_XXX(e));
		else
		{
			int nb,i,b;
			ECP_ZZZ P=new ECP_ZZZ();
			ECP_ZZZ R0=new ECP_ZZZ();
			ECP_ZZZ R1=new ECP_ZZZ(); R1.copy(this);

			for (i=bts-1;i>=0;i--)
			{
				b=(e>>i)&1;
				P.copy(R1);
				P.add(R0);
				R0.cswap(R1,b);
				R1.copy(P);
				R0.dbl();
				R0.cswap(R1,b);
			}
			P.copy(R0);
			P.affine();
			return P;
		}
	}

/* return e.this */

	public ECP_ZZZ mul(BIG_XXX e) {
		if (e.iszilch() || is_infinity()) return new ECP_ZZZ();
		ECP_ZZZ P=new ECP_ZZZ();
		if (CURVETYPE==MONTGOMERY)
		{
/* use Ladder */
			int nb,i,b;
			ECP_ZZZ D=new ECP_ZZZ();
			ECP_ZZZ R0=new ECP_ZZZ(); R0.copy(this);
			ECP_ZZZ R1=new ECP_ZZZ(); R1.copy(this);
			R1.dbl();
			D.copy(this); D.affine();
			nb=e.nbits();
			for (i=nb-2;i>=0;i--)
			{
				b=e.bit(i);
				P.copy(R1);
				P.dadd(R0,D);
				R0.cswap(R1,b);
				R1.copy(P);
				R0.dbl();
				R0.cswap(R1,b);
			}
			P.copy(R0);
		}
		else
		{
// fixed size windows 
			int i,b,nb,m,s,ns;
			BIG_XXX mt=new BIG_XXX();
			BIG_XXX t=new BIG_XXX();
			ECP_ZZZ Q=new ECP_ZZZ();
			ECP_ZZZ C=new ECP_ZZZ();
			ECP_ZZZ[] W=new ECP_ZZZ[8];
			byte[] w=new byte[1+(BIG_XXX.NLEN*BIG_XXX.BASEBITS+3)/4];

			affine();

// precompute table 
			Q.copy(this);
			Q.dbl();
			W[0]=new ECP_ZZZ();
			W[0].copy(this);

			for (i=1;i<8;i++)
			{
				W[i]=new ECP_ZZZ();
				W[i].copy(W[i-1]);
				W[i].add(Q);
			}

// convert the table to affine 
			if (CURVETYPE==WEIERSTRASS) 
				multiaffine(8,W);

// make exponent odd - add 2P if even, P if odd 
			t.copy(e);
			s=t.parity();
			t.inc(1); t.norm(); ns=t.parity(); mt.copy(t); mt.inc(1); mt.norm();
			t.cmove(mt,s);
			Q.cmove(this,ns);
			C.copy(Q);

			nb=1+(t.nbits()+3)/4;

// convert exponent to signed 4-bit window 
			for (i=0;i<nb;i++)
			{
				w[i]=(byte)(t.lastbits(5)-16);
				t.dec(w[i]); t.norm();
				t.fshr(4);	
			}
			w[nb]=(byte)t.lastbits(5);
	
			P.copy(W[(w[nb]-1)/2]);  
			for (i=nb-1;i>=0;i--)
			{
				Q.select(W,w[i]);
				P.dbl();
				P.dbl();
				P.dbl();
				P.dbl();
				P.add(Q);
			}
			P.sub(C); /* apply correction */
		}
		P.affine();
		return P;
	}

/* Return e.this+f.Q */

	public ECP_ZZZ mul2(BIG_XXX e,ECP_ZZZ Q,BIG_XXX f) {
		BIG_XXX te=new BIG_XXX();
		BIG_XXX tf=new BIG_XXX();
		BIG_XXX mt=new BIG_XXX();
		ECP_ZZZ S=new ECP_ZZZ();
		ECP_ZZZ T=new ECP_ZZZ();
		ECP_ZZZ C=new ECP_ZZZ();
		ECP_ZZZ[] W=new ECP_ZZZ[8];
		byte[] w=new byte[1+(BIG_XXX.NLEN*BIG_XXX.BASEBITS+1)/2];		
		int i,s,ns,nb;
		byte a,b;

		affine();
		Q.affine();

		te.copy(e);
		tf.copy(f);

// precompute table 
		W[1]=new ECP_ZZZ(); W[1].copy(this); W[1].sub(Q);
		W[2]=new ECP_ZZZ(); W[2].copy(this); W[2].add(Q);
		S.copy(Q); S.dbl();
		W[0]=new ECP_ZZZ(); W[0].copy(W[1]); W[0].sub(S);
		W[3]=new ECP_ZZZ(); W[3].copy(W[2]); W[3].add(S);
		T.copy(this); T.dbl();
		W[5]=new ECP_ZZZ(); W[5].copy(W[1]); W[5].add(T);
		W[6]=new ECP_ZZZ(); W[6].copy(W[2]); W[6].add(T);
		W[4]=new ECP_ZZZ(); W[4].copy(W[5]); W[4].sub(S);
		W[7]=new ECP_ZZZ(); W[7].copy(W[6]); W[7].add(S);

// convert the table to affine 
		if (CURVETYPE==WEIERSTRASS) 
			multiaffine(8,W);

// if multiplier is odd, add 2, else add 1 to multiplier, and add 2P or P to correction 

		s=te.parity();
		te.inc(1); te.norm(); ns=te.parity(); mt.copy(te); mt.inc(1); mt.norm();
		te.cmove(mt,s);
		T.cmove(this,ns);
		C.copy(T);

		s=tf.parity();
		tf.inc(1); tf.norm(); ns=tf.parity(); mt.copy(tf); mt.inc(1); mt.norm();
		tf.cmove(mt,s);
		S.cmove(Q,ns);
		C.add(S);

		mt.copy(te); mt.add(tf); mt.norm();
		nb=1+(mt.nbits()+1)/2;

// convert exponent to signed 2-bit window 
		for (i=0;i<nb;i++)
		{
			a=(byte)(te.lastbits(3)-4);
			te.dec(a); te.norm(); 
			te.fshr(2);
			b=(byte)(tf.lastbits(3)-4);
			tf.dec(b); tf.norm(); 
			tf.fshr(2);
			w[i]=(byte)(4*a+b);
		}
		w[nb]=(byte)(4*te.lastbits(3)+tf.lastbits(3));
		S.copy(W[(w[nb]-1)/2]);  

		for (i=nb-1;i>=0;i--)
		{
			T.select(W,w[i]);
			S.dbl();
			S.dbl();
			S.add(T);
		}
		S.sub(C); /* apply correction */
		S.affine();
		return S;
	}

/*
	public static void main(String[] args) {

		BIG_XXX Gx=new BIG_XXX(ROM_ZZZ.CURVE_Gx);
		BIG_XXX Gy;
		ECP_ZZZ P;
		if (CURVETYPE!=MONTGOMERY) Gy=new BIG_XXX(ROM_ZZZ.CURVE_Gy);
		BIG_XXX r=new BIG_XXX(ROM_ZZZ.CURVE_Order);

		//r.dec(7);
	
		System.out.println("Gx= "+Gx.toString());		
		if (CURVETYPE!=MONTGOMERY) System.out.println("Gy= "+Gy.toString());	

		if (CURVETYPE!=MONTGOMERY) P=new ECP_ZZZ(Gx,Gy);
		else  P=new ECP_ZZZ(Gx);

		System.out.println("P= "+P.toString());		

		ECP_ZZZ R=P.mul(r);
		//for (int i=0;i<10000;i++)
		//	R=P.mul(r);
	
		System.out.println("R= "+R.toString());
    } */
}

