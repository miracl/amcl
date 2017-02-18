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

package amcl;

public final class ECP2_ZZZ {
	private FP2_YYY x;
	private FP2_YYY y;
	private FP2_YYY z;
	private boolean INF;

/* Constructor - set this=O */
	public ECP2_ZZZ() {
		INF=true;
		x=new FP2_YYY(0);
		y=new FP2_YYY(1);
		z=new FP2_YYY(1);
	}

/* Test this=O? */
	public boolean is_infinity() {
		return INF;
	}
/* copy this=P */
	public void copy(ECP2_ZZZ P)
	{
		x.copy(P.x);
		y.copy(P.y);
		z.copy(P.z);
		INF=P.INF;
	}
/* set this=O */
	public void inf() {
		INF=true;
		x.zero();
		y.zero();
		z.zero();
	}

/* Conditional move of Q to P dependant on d */
	public void cmove(ECP2_ZZZ Q,int d)
	{
		x.cmove(Q.x,d);
		y.cmove(Q.y,d);
		z.cmove(Q.z,d);

		boolean bd;
		if (d==0) bd=false;
		else bd=true;
		INF^=(INF^Q.INF)&bd;
	}

/* return 1 if b==c, no branching */
	public static int teq(int b,int c)
	{
		int x=b^c;
		x-=1;  // if x=0, x now -1
		return ((x>>31)&1);
	}

/* Constant time select from pre-computed table */
	public void select(ECP2_ZZZ W[],int b)
	{
		ECP2_ZZZ MP=new ECP2_ZZZ(); 
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

/* Test if P == Q */
	public boolean equals(ECP2_ZZZ Q) {
		if (is_infinity() && Q.is_infinity()) return true;
		if (is_infinity() || Q.is_infinity()) return false;

		FP2_YYY zs2=new FP2_YYY(z); zs2.sqr();
		FP2_YYY zo2=new FP2_YYY(Q.z); zo2.sqr();
		FP2_YYY zs3=new FP2_YYY(zs2); zs3.mul(z);
		FP2_YYY zo3=new FP2_YYY(zo2); zo3.mul(Q.z);
		zs2.mul(Q.x);
		zo2.mul(x);
		if (!zs2.equals(zo2)) return false;
		zs3.mul(Q.y);
		zo3.mul(y);
		if (!zs3.equals(zo3)) return false;

		return true;
	}
/* set this=-this */
	public void neg() {
		if (is_infinity()) return;
		y.neg(); y.norm();
		return;
	}
/* set to Affine - (x,y,z) to (x,y) */
	public void affine() {
		if (is_infinity()) return;
		FP2_YYY one=new FP2_YYY(1);
		if (z.equals(one)) return;
		z.inverse();

		FP2_YYY z2=new FP2_YYY(z);
		z2.sqr();
		x.mul(z2); x.reduce();
		y.mul(z2); 
		y.mul(z);  y.reduce();
		z.copy(one);
	}
/* extract affine x as FP2 */
	public FP2_YYY getX()
	{
		affine();
		return x;
	}
/* extract affine y as FP2 */
	public FP2_YYY getY()
	{
		affine();
		return y;
	}
/* extract projective x */
	public FP2_YYY getx()
	{
		return x;
	}
/* extract projective y */
	public FP2_YYY gety()
	{
		return y;
	}
/* extract projective z */
	public FP2_YYY getz()
	{
		return z;
	}
/* convert to byte array */
	public void toBytes(byte[] b)
	{
		byte[] t=new byte[BIG_XXX.MODBYTES];
		affine();
		x.getA().toBytes(t);
		for (int i=0;i<BIG_XXX.MODBYTES;i++)
			b[i]=t[i];
		x.getB().toBytes(t);
		for (int i=0;i<BIG_XXX.MODBYTES;i++)
			b[i+BIG_XXX.MODBYTES]=t[i];

		y.getA().toBytes(t);
		for (int i=0;i<BIG_XXX.MODBYTES;i++)
			b[i+2*BIG_XXX.MODBYTES]=t[i];
		y.getB().toBytes(t);
		for (int i=0;i<BIG_XXX.MODBYTES;i++)
			b[i+3*BIG_XXX.MODBYTES]=t[i];
	}
/* convert from byte array to point */
	public static ECP2_ZZZ fromBytes(byte[] b)
	{
		byte[] t=new byte[BIG_XXX.MODBYTES];
		BIG_XXX ra;
		BIG_XXX rb;

		for (int i=0;i<BIG_XXX.MODBYTES;i++) t[i]=b[i];
		ra=BIG_XXX.fromBytes(t);
		for (int i=0;i<BIG_XXX.MODBYTES;i++) t[i]=b[i+BIG_XXX.MODBYTES];
		rb=BIG_XXX.fromBytes(t);
		FP2_YYY rx=new FP2_YYY(ra,rb);

		for (int i=0;i<BIG_XXX.MODBYTES;i++) t[i]=b[i+2*BIG_XXX.MODBYTES];
		ra=BIG_XXX.fromBytes(t);
		for (int i=0;i<BIG_XXX.MODBYTES;i++) t[i]=b[i+3*BIG_XXX.MODBYTES];
		rb=BIG_XXX.fromBytes(t);
		FP2_YYY ry=new FP2_YYY(ra,rb);

		return new ECP2_ZZZ(rx,ry);
	}
/* convert this to hex string */
	public String toString() {
		if (is_infinity()) return "infinity";
		affine();
		return "("+x.toString()+","+y.toString()+")";
	}

/* Calculate RHS of twisted curve equation x^3+B/i */
	public static FP2_YYY RHS(FP2_YYY x) {
		x.norm();
		FP2_YYY r=new FP2_YYY(x);
		r.sqr();
		FP2_YYY b=new FP2_YYY(new BIG_XXX(ROM_ZZZ.CURVE_B));
		b.div_ip();
		r.mul(x);
		r.add(b);

		r.reduce();
		return r;
	}

/* construct this from (x,y) - but set to O if not on curve */
	public ECP2_ZZZ(FP2_YYY ix,FP2_YYY iy) {
		x=new FP2_YYY(ix);
		y=new FP2_YYY(iy);
		z=new FP2_YYY(1);
		FP2_YYY rhs=RHS(x);
		FP2_YYY y2=new FP2_YYY(y);
		y2.sqr();
		if (y2.equals(rhs)) INF=false;
		else {x.zero();INF=true;}
	}

/* construct this from x - but set to O if not on curve */
	public ECP2_ZZZ(FP2_YYY ix) {
		x=new FP2_YYY(ix);
		y=new FP2_YYY(1);
		z=new FP2_YYY(1);
		FP2_YYY rhs=RHS(x);
		if (rhs.sqrt()) 
		{
			y.copy(rhs);
			INF=false;
		}
		else {x.zero();INF=true;}
	}

/* this+=this */
	public int dbl() {
		if (INF) return -1;
		if (y.iszilch())
		{
			inf();
			return -1;
		}

		FP2_YYY w1=new FP2_YYY(x);
		FP2_YYY w2=new FP2_YYY(0);
		FP2_YYY w3=new FP2_YYY(x);
		FP2_YYY w8=new FP2_YYY(x);

		w1.sqr();
		w8.copy(w1);
		w8.imul(3);

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
	//	w2.norm();
		y.sub(w2);

		y.norm();
		z.norm();

		return 1;
	}

/* this+=Q - return 0 for add, 1 for double, -1 for O */
	public int add(ECP2_ZZZ Q) {
		if (INF)
		{
			copy(Q);
			return -1;
		}
		if (Q.INF) return -1;

		boolean aff=false;

		if (Q.z.isunity()) aff=true;

		FP2_YYY A,C;
		FP2_YYY B=new FP2_YYY(z);
		FP2_YYY D=new FP2_YYY(z);
		if (!aff)
		{
			A=new FP2_YYY(Q.z);
			C=new FP2_YYY(Q.z);

			A.sqr(); B.sqr();
			C.mul(A); D.mul(B);

			A.mul(x);
			C.mul(y);
		}
		else
		{
			A=new FP2_YYY(x);
			C=new FP2_YYY(y);
	
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
				return 1;
			}
			else
			{
				INF=true;
				return -1;
			}
		}

		if (!aff) z.mul(Q.z);
		z.mul(B);

		FP2_YYY e=new FP2_YYY(B); e.sqr();
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

		return 0;
	}

/* set this-=Q */
	public int sub(ECP2_ZZZ Q) {
		Q.neg();
		int D=add(Q);
		Q.neg();
		return D;
	}
/* set this*=q, where q is Modulus, using Frobenius */
	public void frob(FP2_YYY X)
	{
		if (INF) return;
		FP2_YYY X2=new FP2_YYY(X);
		X2.sqr();
		x.conj();
		y.conj();
		z.conj();
		z.reduce();
		x.mul(X2);
		y.mul(X2);
		y.mul(X);
	}

/* normalises m-array of ECP2 points. Requires work vector of m FP2s */

	public static void multiaffine(int m,ECP2_ZZZ[] P)
	{
		int i;
		FP2_YYY t1=new FP2_YYY(0);
		FP2_YYY t2=new FP2_YYY(0);

		FP2_YYY[] work=new FP2_YYY[m];
		work[0]=new FP2_YYY(1);
		work[1]=new FP2_YYY(P[0].z);
		for (i=2;i<m;i++)
		{
			work[i]=new FP2_YYY(work[i-1]);
			work[i].mul(P[i-1].z);
		}

		t1.copy(work[m-1]); t1.mul(P[m-1].z);

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
			t1.copy(work[i]); t1.sqr();
			P[i].x.mul(t1);
			t1.mul(work[i]);
			P[i].y.mul(t1);
		}    
	}

/* P*=e */
	public ECP2_ZZZ mul(BIG_XXX e)
	{
/* fixed size windows */
		int i,b,nb,m,s,ns;
		BIG_XXX mt=new BIG_XXX();
		BIG_XXX t=new BIG_XXX();
		ECP2_ZZZ P=new ECP2_ZZZ();
		ECP2_ZZZ Q=new ECP2_ZZZ();
		ECP2_ZZZ C=new ECP2_ZZZ();
		ECP2_ZZZ[] W=new ECP2_ZZZ[8];
		byte[] w=new byte[1+(BIG_XXX.NLEN*BIG_XXX.BASEBITS+3)/4];

		if (is_infinity()) return new ECP2_ZZZ();

		affine();

/* precompute table */
		Q.copy(this);
		Q.dbl();
		W[0]=new ECP2_ZZZ();
		W[0].copy(this);

		for (i=1;i<8;i++)
		{
			W[i]=new ECP2_ZZZ();
			W[i].copy(W[i-1]);
			W[i].add(Q);
		}

/* convert the table to affine */

		multiaffine(8,W);

/* make exponent odd - add 2P if even, P if odd */
		t.copy(e);
		s=t.parity();
		t.inc(1); t.norm(); ns=t.parity(); mt.copy(t); mt.inc(1); mt.norm();
		t.cmove(mt,s);
		Q.cmove(this,ns);
		C.copy(Q);

		nb=1+(t.nbits()+3)/4;
/* convert exponent to signed 4-bit window */
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
		P.sub(C);
		P.affine();
		return P;
	}

/* P=u0.Q0+u1*Q1+u2*Q2+u3*Q3 */
	public static ECP2_ZZZ mul4(ECP2_ZZZ[] Q,BIG_XXX[] u)
	{
		int i,j,nb;
		int[] a=new int[4];
		ECP2_ZZZ T=new ECP2_ZZZ();
		ECP2_ZZZ C=new ECP2_ZZZ();
		ECP2_ZZZ P=new ECP2_ZZZ();
		ECP2_ZZZ[] W=new ECP2_ZZZ[8];

		BIG_XXX mt=new BIG_XXX();
		BIG_XXX[] t=new BIG_XXX[4];

		byte[] w=new byte[BIG_XXX.NLEN*BIG_XXX.BASEBITS+1];

		for (i=0;i<4;i++)
		{
			t[i]=new BIG_XXX(u[i]);
			Q[i].affine();
		}

/* precompute table */

		W[0]=new ECP2_ZZZ(); W[0].copy(Q[0]); W[0].sub(Q[1]);
		W[1]=new ECP2_ZZZ(); W[1].copy(W[0]);
		W[2]=new ECP2_ZZZ(); W[2].copy(W[0]);
		W[3]=new ECP2_ZZZ(); W[3].copy(W[0]);
		W[4]=new ECP2_ZZZ(); W[4].copy(Q[0]); W[4].add(Q[1]);
		W[5]=new ECP2_ZZZ(); W[5].copy(W[4]);
		W[6]=new ECP2_ZZZ(); W[6].copy(W[4]);
		W[7]=new ECP2_ZZZ(); W[7].copy(W[4]);
		T.copy(Q[2]); T.sub(Q[3]);
		W[1].sub(T);
		W[2].add(T);
		W[5].sub(T);
		W[6].add(T);
		T.copy(Q[2]); T.add(Q[3]);
		W[0].sub(T);
		W[3].add(T);
		W[4].sub(T);
		W[7].add(T);

		multiaffine(8,W);

/* if multiplier is even add 1 to multiplier, and add P to correction */
		mt.zero(); C.inf();
		for (i=0;i<4;i++)
		{
			if (t[i].parity()==0)
			{
				t[i].inc(1); t[i].norm();
				C.add(Q[i]);
			}
			mt.add(t[i]); mt.norm();
		}

		nb=1+mt.nbits();

/* convert exponent to signed 1-bit window */
		for (j=0;j<nb;j++)
		{
			for (i=0;i<4;i++)
			{
				a[i]=(byte)(t[i].lastbits(2)-2);
				t[i].dec(a[i]); t[i].norm(); 
				t[i].fshr(1);
			}
			w[j]=(byte)(8*a[0]+4*a[1]+2*a[2]+a[3]);
		}
		w[nb]=(byte)(8*t[0].lastbits(2)+4*t[1].lastbits(2)+2*t[2].lastbits(2)+t[3].lastbits(2));

		P.copy(W[(w[nb]-1)/2]);  
		for (i=nb-1;i>=0;i--)
		{
			T.select(W,w[i]);
			P.dbl();
			P.add(T);
		}
		P.sub(C); /* apply correction */

		P.affine();
		return P;
	}

/*
	public static void main(String[] args) {
		BIG_XXX r=new BIG_XXX(ROM_YYY.Modulus);

		BIG_XXX Pxa=new BIG_XXX(ROM_ZZZ.CURVE_Pxa);
		BIG_XXX Pxb=new BIG_XXX(ROM_ZZZ.CURVE_Pxb);
		BIG_XXX Pya=new BIG_XXX(ROM_ZZZ.CURVE_Pya);
		BIG_XXX Pyb=new BIG_XXX(ROM_ZZZ.CURVE_Pyb);

		BIG_XXX Fra=new BIG_XXX(ROM_ZZZ.CURVE_Fra);
		BIG_XXX Frb=new BIG_XXX(ROM_ZZZ.CURVE_Frb);

		FP2_YYY f=new FP2_YYY(Fra,Frb);

		FP2_YYY Px=new FP2_YYY(Pxa,Pxb);
		FP2_YYY Py=new FP2_YYY(Pya,Pyb);

		ECP2_ZZZ P=new ECP2_ZZZ(Px,Py);

		System.out.println("P= "+P.toString());

		P=P.mul(r);
		System.out.println("P= "+P.toString());

		ECP2_ZZZ Q=new ECP2_ZZZ(Px,Py);
		Q.frob(f);
		System.out.println("Q= "+Q.toString());
	} */


}