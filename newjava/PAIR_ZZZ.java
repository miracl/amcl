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

/* AMCL BN Curve Pairing functions */

package amcl;

public final class PAIR_ZZZ {

	public static final boolean USE_GLV =true;
	public static final boolean USE_GS_G2 =true;
	public static final boolean USE_GS_GT =true;	
	public static final boolean GT_STRONG=false;


/* Line function */
	public static FP12_YYY line(ECP2_ZZZ A,ECP2_ZZZ B,FP_YYY Qx,FP_YYY Qy)
	{
		ECP2_ZZZ P=new ECP2_ZZZ();

		FP4_YYY a,b,c;
		P.copy(A);
		FP2_YYY ZZ=new FP2_YYY(P.getz());
		ZZ.sqr();
		int D;
		if (A==B) D=A.dbl(); /* Check this return value in ecp2.c */
		else D=A.add(B);
		if (D<0) 
			return new FP12_YYY(1);
		FP2_YYY Z3=new FP2_YYY(A.getz());
		c=new FP4_YYY(0);
		if (D==0)
		{ /* Addition */
			FP2_YYY X=new FP2_YYY(B.getx());
			FP2_YYY Y=new FP2_YYY(B.gety());
			FP2_YYY T=new FP2_YYY(P.getz()); 
			T.mul(Y);
			ZZ.mul(T);

			FP2_YYY NY=new FP2_YYY(P.gety()); NY.neg();
			ZZ.add(NY);
			Z3.pmul(Qy);
			T.mul(P.getx());
			X.mul(NY);
			T.add(X);
			a=new FP4_YYY(Z3,T);
			ZZ.neg();
			ZZ.pmul(Qx);
			b=new FP4_YYY(ZZ);
		}
		else
		{ /* Doubling */
			FP2_YYY X=new FP2_YYY(P.getx());
			FP2_YYY Y=new FP2_YYY(P.gety());
			FP2_YYY T=new FP2_YYY(P.getx());
			T.sqr();
			T.imul(3);

			Y.sqr();
			Y.add(Y);
			Z3.mul(ZZ);
			Z3.pmul(Qy);

			X.mul(T);
			X.sub(Y);
			a=new FP4_YYY(Z3,X);
			T.neg();
			ZZ.mul(T);
			ZZ.pmul(Qx);
			b=new FP4_YYY(ZZ);
		}
		return new FP12_YYY(a,b,c);
	}

/* Optimal R-ate pairing */
	public static FP12_YYY ate(ECP2_ZZZ P,ECP_ZZZ Q)
	{
		FP2_YYY f=new FP2_YYY(new BIG_XXX(ROM_ZZZ.CURVE_Fra),new BIG_XXX(ROM_ZZZ.CURVE_Frb));
		BIG_XXX x=new BIG_XXX(ROM_ZZZ.CURVE_Bnx);
		BIG_XXX n=new BIG_XXX(x);
		ECP2_ZZZ K=new ECP2_ZZZ();
		FP12_YYY lv;

		if (ECP_ZZZ.CURVE_PAIRING_TYPE==ECP_ZZZ.BN)
		{
			n.pmul(6); n.dec(2);
		}
		else
			n.copy(x);
		n.norm();
		
		P.affine();
		Q.affine();
		FP_YYY Qx=new FP_YYY(Q.getx());
		FP_YYY Qy=new FP_YYY(Q.gety());

		ECP2_ZZZ A=new ECP2_ZZZ();
		FP12_YYY r=new FP12_YYY(1);

		A.copy(P);
		int nb=n.nbits();

		for (int i=nb-2;i>=1;i--)
		{
			lv=line(A,A,Qx,Qy);
			r.smul(lv);

			if (n.bit(i)==1)
			{
				lv=line(A,P,Qx,Qy);
				r.smul(lv);
			}
			r.sqr();
		}

		lv=line(A,A,Qx,Qy);
		r.smul(lv);
		if (n.parity()==1)
		{
			lv=line(A,P,Qx,Qy);
			r.smul(lv);
		}

/* R-ate fixup required for BN curves */
		if (ECP_ZZZ.CURVE_PAIRING_TYPE==ECP_ZZZ.BN)
		{
			r.conj();
			K.copy(P);
			K.frob(f);
			A.neg();
			lv=line(A,K,Qx,Qy);
			r.smul(lv);
			K.frob(f);
			K.neg();
			lv=line(A,K,Qx,Qy);
			r.smul(lv);
		}
		return r;
	}

/* Optimal R-ate double pairing e(P,Q).e(R,S) */
	public static FP12_YYY ate2(ECP2_ZZZ P,ECP_ZZZ Q,ECP2_ZZZ R,ECP_ZZZ S)
	{
		FP2_YYY f=new FP2_YYY(new BIG_XXX(ROM_ZZZ.CURVE_Fra),new BIG_XXX(ROM_ZZZ.CURVE_Frb));
		BIG_XXX x=new BIG_XXX(ROM_ZZZ.CURVE_Bnx);
		BIG_XXX n=new BIG_XXX(x);
		ECP2_ZZZ K=new ECP2_ZZZ();
		FP12_YYY lv;

		if (ECP_ZZZ.CURVE_PAIRING_TYPE==ECP_ZZZ.BN)
		{
			n.pmul(6); n.dec(2);
		}
		else
			n.copy(x);
		n.norm();

		P.affine();
		Q.affine();
		R.affine();
		S.affine();

		FP_YYY Qx=new FP_YYY(Q.getx());
		FP_YYY Qy=new FP_YYY(Q.gety());
		FP_YYY Sx=new FP_YYY(S.getx());
		FP_YYY Sy=new FP_YYY(S.gety());

		ECP2_ZZZ A=new ECP2_ZZZ();
		ECP2_ZZZ B=new ECP2_ZZZ();
		FP12_YYY r=new FP12_YYY(1);

		A.copy(P);
		B.copy(R);
		int nb=n.nbits();

		for (int i=nb-2;i>=1;i--)
		{
			lv=line(A,A,Qx,Qy);
			r.smul(lv);
			lv=line(B,B,Sx,Sy);
			r.smul(lv);

			if (n.bit(i)==1)
			{
				lv=line(A,P,Qx,Qy);
				r.smul(lv);
				lv=line(B,R,Sx,Sy);
				r.smul(lv);
			}
			r.sqr();
		}

		lv=line(A,A,Qx,Qy);
		r.smul(lv);
		lv=line(B,B,Sx,Sy);
		r.smul(lv);
		if (n.parity()==1)
		{
			lv=line(A,P,Qx,Qy);
			r.smul(lv);
			lv=line(B,R,Sx,Sy);
			r.smul(lv);
		}

/* R-ate fixup required for BN curves */
		if (ECP_ZZZ.CURVE_PAIRING_TYPE==ECP_ZZZ.BN)
		{
			r.conj();
			K.copy(P);
			K.frob(f);
			A.neg();
			lv=line(A,K,Qx,Qy);
			r.smul(lv);
			K.frob(f);
			K.neg();
			lv=line(A,K,Qx,Qy);
			r.smul(lv);

			K.copy(R);
			K.frob(f);
			B.neg();
			lv=line(B,K,Sx,Sy);
			r.smul(lv);
			K.frob(f);
			K.neg();
			lv=line(B,K,Sx,Sy);
			r.smul(lv);
		}
		return r;
	}

/* final exponentiation - keep separate for multi-pairings and to avoid thrashing stack */
	public static FP12_YYY fexp(FP12_YYY m)
	{
		FP2_YYY f=new FP2_YYY(new BIG_XXX(ROM_ZZZ.CURVE_Fra),new BIG_XXX(ROM_ZZZ.CURVE_Frb));
		BIG_XXX x=new BIG_XXX(ROM_ZZZ.CURVE_Bnx);
		FP12_YYY r=new FP12_YYY(m);

/* Easy part of final exp */
		FP12_YYY lv=new FP12_YYY(r);
		lv.inverse();
		r.conj();

		r.mul(lv);
		lv.copy(r);
		r.frob(f);
		r.frob(f);
		r.mul(lv);
/* Hard part of final exp */
		if (ECP_ZZZ.CURVE_PAIRING_TYPE==ECP_ZZZ.BN)
		{
			FP12_YYY x0,x1,x2,x3,x4,x5;			
			lv.copy(r);
			lv.frob(f);
			x0=new FP12_YYY(lv);
			x0.frob(f);
			lv.mul(r);
			x0.mul(lv);
			x0.frob(f);
			x1=new FP12_YYY(r);
			x1.conj();
			x4=r.pow(x);

			x3=new FP12_YYY(x4);
			x3.frob(f);

			x2=x4.pow(x);

			x5=new FP12_YYY(x2); x5.conj();
			lv=x2.pow(x);

			x2.frob(f);
			r.copy(x2); r.conj();

			x4.mul(r);
			x2.frob(f);

			r.copy(lv);
			r.frob(f);
			lv.mul(r);

			lv.usqr();
			lv.mul(x4);
			lv.mul(x5);
			r.copy(x3);
			r.mul(x5);
			r.mul(lv);
			lv.mul(x2);
			r.usqr();
			r.mul(lv);
			r.usqr();
			lv.copy(r);
			lv.mul(x1);
			r.mul(x0);
			lv.usqr();
			r.mul(lv);
			r.reduce();
		}
		else
		{

			FP12_YYY y0,y1,y2,y3;
// Ghamman & Fouotsa Method
			y0=new FP12_YYY(r); y0.usqr();
			y1=y0.pow(x);
			x.fshr(1); y2=y1.pow(x); x.fshl(1);
			y3=new FP12_YYY(r); y3.conj();
			y1.mul(y3);

			y1.conj();
			y1.mul(y2);

			y2=y1.pow(x);

			y3=y2.pow(x);
			y1.conj();
			y3.mul(y1);

			y1.conj();
			y1.frob(f); y1.frob(f); y1.frob(f);
			y2.frob(f); y2.frob(f);
			y1.mul(y2);

			y2=y3.pow(x);
			y2.mul(y0);
			y2.mul(r);

			y1.mul(y2);
			y2.copy(y3); y2.frob(f);
			y1.mul(y2);
			r.copy(y1);
			r.reduce();

/*
			x0=new FP12_YYY(r);
			x1=new FP12_YYY(r);
			lv.copy(r); lv.frob(f);
			x3=new FP12_YYY(lv); x3.conj(); x1.mul(x3);
			lv.frob(f); lv.frob(f);
			x1.mul(lv);

			r.copy(r.pow(x));  //r=r.pow(x);
			x3.copy(r); x3.conj(); x1.mul(x3);
			lv.copy(r); lv.frob(f);
			x0.mul(lv);
			lv.frob(f);
			x1.mul(lv);
			lv.frob(f);
			x3.copy(lv); x3.conj(); x0.mul(x3);

			r.copy(r.pow(x));
			x0.mul(r);
			lv.copy(r); lv.frob(f); lv.frob(f);
			x3.copy(lv); x3.conj(); x0.mul(x3);
			lv.frob(f);
			x1.mul(lv);

			r.copy(r.pow(x));
			lv.copy(r); lv.frob(f);
			x3.copy(lv); x3.conj(); x0.mul(x3);
			lv.frob(f);
			x1.mul(lv);

			r.copy(r.pow(x));
			x3.copy(r); x3.conj(); x0.mul(x3);
			lv.copy(r); lv.frob(f);
			x1.mul(lv);

			r.copy(r.pow(x));
			x1.mul(r);

			x0.usqr();
			x0.mul(x1);
			r.copy(x0);
			r.reduce(); */
		}
		
		return r;
	}

/* GLV method */
	public static BIG_XXX[] glv(BIG_XXX e)
	{
		BIG_XXX[] u=new BIG_XXX[2];
		if (ECP_ZZZ.CURVE_PAIRING_TYPE==ECP_ZZZ.BN)
		{
			int i,j;
			BIG_XXX t=new BIG_XXX(0);
			BIG_XXX q=new BIG_XXX(ROM_ZZZ.CURVE_Order);

			BIG_XXX[] v=new BIG_XXX[2];
			for (i=0;i<2;i++)
			{
				t.copy(new BIG_XXX(ROM_ZZZ.CURVE_W[i]));  // why not just t=new BIG_XXX(ROM_ZZZ.CURVE_W[i]); 
				DBIG_XXX d=BIG_XXX.mul(t,e);
				v[i]=new BIG_XXX(d.div(q));
				u[i]=new BIG_XXX(0);
			}
			u[0].copy(e);
			for (i=0;i<2;i++)
				for (j=0;j<2;j++)
				{
					t.copy(new BIG_XXX(ROM_ZZZ.CURVE_SB[j][i]));
					t.copy(BIG_XXX.modmul(v[j],t,q));
					u[i].add(q);
					u[i].sub(t);
					u[i].mod(q);
				}
		}
		else
		{ // -(x^2).P = (Beta.x,y)
			BIG_XXX q=new BIG_XXX(ROM_ZZZ.CURVE_Order);
			BIG_XXX x=new BIG_XXX(ROM_ZZZ.CURVE_Bnx);
			BIG_XXX x2=BIG_XXX.smul(x,x);
			u[0]=new BIG_XXX(e);
			u[0].mod(x2);
			u[1]=new BIG_XXX(e);
			u[1].div(x2);
			u[1].rsub(q);
		}
		return u;
	}

/* Galbraith & Scott Method */
	public static BIG_XXX[] gs(BIG_XXX e)
	{
		BIG_XXX[] u=new BIG_XXX[4];
		if (ECP_ZZZ.CURVE_PAIRING_TYPE==ECP_ZZZ.BN)
		{
			int i,j;
			BIG_XXX t=new BIG_XXX(0);
			BIG_XXX q=new BIG_XXX(ROM_ZZZ.CURVE_Order);
			BIG_XXX[] v=new BIG_XXX[4];
			for (i=0;i<4;i++)
			{
				t.copy(new BIG_XXX(ROM_ZZZ.CURVE_WB[i]));
				DBIG_XXX d=BIG_XXX.mul(t,e);
				v[i]=new BIG_XXX(d.div(q));
				u[i]=new BIG_XXX(0);
			}
			u[0].copy(e);
			for (i=0;i<4;i++)
				for (j=0;j<4;j++)
				{
					t.copy(new BIG_XXX(ROM_ZZZ.CURVE_BB[j][i]));
					t.copy(BIG_XXX.modmul(v[j],t,q));
					u[i].add(q);
					u[i].sub(t);
					u[i].mod(q);
				}
		}
		else
		{
			BIG_XXX x=new BIG_XXX(ROM_ZZZ.CURVE_Bnx);
			BIG_XXX w=new BIG_XXX(e);
			for (int i=0;i<4;i++)
			{
				u[i]=new BIG_XXX(w);
				u[i].mod(x);
				w.div(x);
			}
		}
		return u;
	}	

/* Multiply P by e in group G1 */
	public static ECP_ZZZ G1mul(ECP_ZZZ P,BIG_XXX e)
	{
		ECP_ZZZ R;
		if (USE_GLV)
		{
			P.affine();
			R=new ECP_ZZZ();
			R.copy(P);
			int i,np,nn;
			ECP_ZZZ Q=new ECP_ZZZ();
			Q.copy(P);
			BIG_XXX q=new BIG_XXX(ROM_ZZZ.CURVE_Order);
			FP_YYY cru=new FP_YYY(new BIG_XXX(ROM_ZZZ.CURVE_Cru));
			BIG_XXX t=new BIG_XXX(0);
			BIG_XXX[] u=glv(e);
			Q.getx().mul(cru);

			np=u[0].nbits();
			t.copy(BIG_XXX.modneg(u[0],q));
			nn=t.nbits();
			if (nn<np)
			{
				u[0].copy(t);
				R.neg();
			}

			np=u[1].nbits();
			t.copy(BIG_XXX.modneg(u[1],q));
			nn=t.nbits();
			if (nn<np)
			{
				u[1].copy(t);
				Q.neg();
			}

			R=R.mul2(u[0],Q,u[1]);
			
		}
		else
		{
			R=P.mul(e);
		}
		return R;
	}

/* Multiply P by e in group G2 */
	public static ECP2_ZZZ G2mul(ECP2_ZZZ P,BIG_XXX e)
	{
		ECP2_ZZZ R;
		if (USE_GS_G2)
		{
			ECP2_ZZZ[] Q=new ECP2_ZZZ[4];
			FP2_YYY f=new FP2_YYY(new BIG_XXX(ROM_ZZZ.CURVE_Fra),new BIG_XXX(ROM_ZZZ.CURVE_Frb));
			BIG_XXX q=new BIG_XXX(ROM_ZZZ.CURVE_Order);
			BIG_XXX[] u=gs(e);



			BIG_XXX t=new BIG_XXX(0);
			int i,np,nn;
			P.affine();
			Q[0]=new ECP2_ZZZ(); Q[0].copy(P);
			for (i=1;i<4;i++)
			{
				Q[i]=new ECP2_ZZZ(); Q[i].copy(Q[i-1]);
				Q[i].frob(f);
			}
			for (i=0;i<4;i++)
			{
				np=u[i].nbits();
				t.copy(BIG_XXX.modneg(u[i],q));
				nn=t.nbits();
				if (nn<np)
				{
					u[i].copy(t);
					Q[i].neg();
				}
			}

			R=ECP2_ZZZ.mul4(Q,u);
		}
		else
		{
			R=P.mul(e);
		}
		return R;
	}

/* f=f^e */
/* Note that this method requires a lot of RAM! Better to use compressed XTR method, see FP4.java */
	public static FP12_YYY GTpow(FP12_YYY d,BIG_XXX e)
	{
		FP12_YYY r;
		if (USE_GS_GT)
		{
			FP12_YYY[] g=new FP12_YYY[4];
			FP2_YYY f=new FP2_YYY(new BIG_XXX(ROM_ZZZ.CURVE_Fra),new BIG_XXX(ROM_ZZZ.CURVE_Frb));
			BIG_XXX q=new BIG_XXX(ROM_ZZZ.CURVE_Order);
			BIG_XXX t=new BIG_XXX(0);
			int i,np,nn;
			BIG_XXX[] u=gs(e);

			g[0]=new FP12_YYY(d);
			for (i=1;i<4;i++)
			{
				g[i]=new FP12_YYY(0); g[i].copy(g[i-1]);
				g[i].frob(f);
			}
			for (i=0;i<4;i++)
			{
				np=u[i].nbits();
				t.copy(BIG_XXX.modneg(u[i],q));
				nn=t.nbits();
				if (nn<np)
				{
					u[i].copy(t);
					g[i].conj();
				}
			}
			r=FP12_YYY.pow4(g,u);
		}
		else
		{
			r=d.pow(e);
		}
		return r;
	}

/* test group membership - no longer needed */
/* with GT-Strong curve, now only check that m!=1, conj(m)*m==1, and m.m^{p^4}=m^{p^2} */
/*
	public static boolean GTmember(FP12_YYY m)
	{
		if (m.isunity()) return false;
		FP12_YYY r=new FP12_YYY(m);
		r.conj();
		r.mul(m);
		if (!r.isunity()) return false;

		FP2_YYY f=new FP2_YYY(new BIG_XXX(ROM_ZZZ.CURVE_Fra),new BIG_XXX(ROM_ZZZ.CURVE_Frb));

		r.copy(m); r.frob(f); r.frob(f);
		FP12_YYY w=new FP12_YYY(r); w.frob(f); w.frob(f);
		w.mul(m);
		if (!ROM_ZZZ.GT_STRONG)
		{
			if (!w.equals(r)) return false;
			BIG_XXX x=new BIG_XXX(ROM_ZZZ.CURVE_Bnx);
			r.copy(m); w=r.pow(x); w=w.pow(x);
			r.copy(w); r.sqr(); r.mul(w); r.sqr();
			w.copy(m); w.frob(f);
		}
		return w.equals(r);
	}
*/
/*
	public static void main(String[] args) {
		ECP_ZZZ Q=new ECP_ZZZ(new BIG_XXX(ROM_ZZZ.CURVE_Gx),new BIG_XXX(ROM_ZZZ.CURVE_Gy));
		ECP2_ZZZ P=new ECP2_ZZZ(new FP2_YYY(new BIG_XXX(ROM_ZZZ.CURVE_Pxa),new BIG_XXX(ROM_ZZZ.CURVE_Pxb)),new FP2_YYY(new BIG_XXX(ROM_ZZZ.CURVE_Pya),new BIG_XXX(ROM_ZZZ.CURVE_Pyb)));

		BIG_XXX r=new BIG_XXX(ROM_ZZZ.CURVE_Order);
		BIG_XXX xa=new BIG_XXX(ROM_ZZZ.CURVE_Pxa);

		System.out.println("P= "+P.toString());
		System.out.println("Q= "+Q.toString());

		BIG_XXX m=new BIG_XXX(17);

		FP12_YYY e=ate(P,Q);
		System.out.println("\ne= "+e.toString());

		e=fexp(e);

		for (int i=1;i<1000;i++)
		{
			e=ate(P,Q);
			e=fexp(e);
		}
	//	e=GTpow(e,m);

		System.out.println("\ne= "+e.toString());

		BIG_XXX [] GLV=glv(r);

		System.out.println("GLV[0]= "+GLV[0].toString());
		System.out.println("GLV[0]= "+GLV[1].toString());

		ECP_ZZZ G=new ECP_ZZZ(); G.copy(Q);
		ECP2_ZZZ R=new ECP2_ZZZ(); R.copy(P);


		e=ate(R,Q);
		e=fexp(e);

		e=GTpow(e,xa);
		System.out.println("\ne= "+e.toString()); 


		R=G2mul(R,xa);
		e=ate(R,G);
		e=fexp(e);

		System.out.println("\ne= "+e.toString());

		G=G1mul(G,xa);
		e=ate(P,G);
		e=fexp(e);
		System.out.println("\ne= "+e.toString()); 
	} */
}

