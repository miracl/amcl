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

/* Constructor */
var ECP_ZZZ = function() 
{
	this.x=new FP_YYY(0);
	this.y=new FP_YYY(1);
	this.z=new FP_YYY(1);
	this.INF=true;
};

ECP_ZZZ.WEIERSTRASS=0;
ECP_ZZZ.EDWARDS=1;
ECP_ZZZ.MONTGOMERY=2;
ECP_ZZZ.NOT=0;
ECP_ZZZ.BN=1;
ECP_ZZZ.BLS=2;

ECP_ZZZ.CURVETYPE=ECP_ZZZ.@CT@;
ECP_ZZZ.CURVE_PAIRING_TYPE=ECP_ZZZ.@PF@;

ECP_ZZZ.prototype={
/* test this=O point-at-infinity */
	is_infinity: function() 
	{
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.EDWARDS)
		{
			this.x.reduce(); this.y.reduce(); this.z.reduce();
			return (this.x.iszilch() && this.y.equals(this.z));
		}
		else return this.INF;
	},


/* conditional swap of this and Q dependant on d */
	cswap: function(Q,d)
	{
		this.x.cswap(Q.x,d);
		if (ECP_ZZZ.CURVETYPE!=ECP_ZZZ.MONTGOMERY) this.y.cswap(Q.y,d);
		this.z.cswap(Q.z,d);
		if (ECP_ZZZ.CURVETYPE!=ECP_ZZZ.EDWARDS)
		{
			var bd=(d!==0)?true:false;
			bd=bd&(this.INF^Q.INF);
			this.INF^=bd;
			Q.INF^=bd;
		}
	},

/* conditional move of Q to P dependant on d */
	cmove: function(Q,d)
	{
		this.x.cmove(Q.x,d);
		if (ECP_ZZZ.CURVETYPE!=ECP_ZZZ.MONTGOMERY) this.y.cmove(Q.y,d);
		this.z.cmove(Q.z,d);
		if (ECP_ZZZ.CURVETYPE!=ECP_ZZZ.EDWARDS)
		{
			var bd=(d!==0)?true:false;
			this.INF^=(this.INF^Q.INF)&bd;
		}
	},

/* Constant time select from pre-computed table */
	select: function(W,b)
	{
		var MP=new ECP_ZZZ(); 
		var m=b>>31;
		var babs=(b^m)-m;

		babs=(babs-1)/2;

		this.cmove(W[0],ECP_ZZZ.teq(babs,0));  // conditional move
		this.cmove(W[1],ECP_ZZZ.teq(babs,1));
		this.cmove(W[2],ECP_ZZZ.teq(babs,2));
		this.cmove(W[3],ECP_ZZZ.teq(babs,3));
		this.cmove(W[4],ECP_ZZZ.teq(babs,4));
		this.cmove(W[5],ECP_ZZZ.teq(babs,5));
		this.cmove(W[6],ECP_ZZZ.teq(babs,6));
		this.cmove(W[7],ECP_ZZZ.teq(babs,7));
 
		MP.copy(this);
		MP.neg();
		this.cmove(MP,(m&1));
	},

/* Test P == Q */

	equals: function(Q) 
	{
		if (this.is_infinity() && Q.is_infinity()) return true;
		if (this.is_infinity() || Q.is_infinity()) return false;
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.WEIERSTRASS)
		{
			var zs2=new FP_YYY(0); zs2.copy(this.z); zs2.sqr();
			var zo2=new FP_YYY(0); zo2.copy(Q.z); zo2.sqr();
			var zs3=new FP_YYY(0); zs3.copy(zs2); zs3.mul(this.z);
			var zo3=new FP_YYY(0); zo3.copy(zo2); zo3.mul(Q.z);
			zs2.mul(Q.x);
			zo2.mul(this.x);
			if (!zs2.equals(zo2)) return false;
			zs3.mul(Q.y);
			zo3.mul(this.y);
			if (!zs3.equals(zo3)) return false;
		}
		else
		{
			var a=new FP_YYY(0);
			var b=new FP_YYY(0);
			a.copy(this.x); a.mul(Q.z); a.reduce();
			b.copy(Q.x); b.mul(this.z); b.reduce();
			if (!a.equals(b)) return false;
			if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.EDWARDS)
			{
				a.copy(this.y); a.mul(Q.z); a.reduce();
				b.copy(Q.y); b.mul(this.z); b.reduce();
				if (!a.equals(b)) return false;
			}
		}
		return true;
	},
/* copy this=P */
	copy: function(P)
	{
		this.x.copy(P.x);
		if (ECP_ZZZ.CURVETYPE!=ECP_ZZZ.MONTGOMERY) this.y.copy(P.y);
		this.z.copy(P.z);
		this.INF=P.INF;
	},
/* this=-this */
	neg: function() 
	{
		if (this.is_infinity()) return;
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.WEIERSTRASS)
		{
			this.y.neg(); this.y.norm();
		}
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.EDWARDS)
		{
			this.x.neg(); this.x.norm();
		}
		return;
	},
/* set this=O */
	inf: function() 
	{
		this.INF=true;
		this.x.zero();
		this.y=new FP_YYY(1);
		this.z=new FP_YYY(1);
	},
/* set this=(x,y) where x and y are BIG_XXXs */
	setxy: function(ix,iy) 
	{

		this.x=new FP_YYY(0); this.x.bcopy(ix);
		var bx=this.x.redc();

		this.y=new FP_YYY(0); this.y.bcopy(iy);
		this.z=new FP_YYY(1);
		var rhs=ECP_ZZZ.RHS(this.x);

		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.MONTGOMERY)
		{
			if (rhs.jacobi()==1) this.INF=false;
			else this.inf();
		}
		else
		{
			var y2=new FP_YYY(0); y2.copy(this.y);
			y2.sqr();
			if (y2.equals(rhs)) this.INF=false;
			else this.inf();

		}
	},
/* set this=x, where x is BIG_XXX, y is derived from sign s */
	setxi: function(ix,s) 
	{
		this.x=new FP_YYY(0); this.x.bcopy(ix);
		var rhs=ECP_ZZZ.RHS(this.x);
		this.z=new FP_YYY(1);
		if (rhs.jacobi()==1)
		{
			var ny=rhs.sqrt();
			if (ny.redc().parity()!=s) ny.neg();
			this.y=ny;
			this.INF=false;
		}
		else this.inf();
	},
/* set this=x, y calcuated from curve equation */
	setx: function(ix) 
	{
		this.x=new FP_YYY(0); this.x.bcopy(ix);
		var rhs=ECP_ZZZ.RHS(this.x);
		this.z=new FP_YYY(1);
		if (rhs.jacobi()==1)
		{
			if (ECP_ZZZ.CURVETYPE!=ECP_ZZZ.MONTGOMERY) this.y=rhs.sqrt();
			this.INF=false;
		}
		else this.INF=true;
	},
/* set this to affine - from (x,y,z) to (x,y) */
	affine: function() 
	{
		if (this.is_infinity()) return;
		var one=new FP_YYY(1);
		if (this.z.equals(one)) return;
		this.z.inverse();
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.WEIERSTRASS)
		{
			var z2=new FP_YYY(0); z2.copy(this.z);
			z2.sqr();
			this.x.mul(z2); this.x.reduce();
			this.y.mul(z2); 
			this.y.mul(this.z); this.y.reduce();
			this.z=one;
		}
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.EDWARDS)
		{
			this.x.mul(this.z); this.x.reduce();
			this.y.mul(this.z); this.y.reduce();
			this.z=one;
		}
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.MONTGOMERY)
		{
			this.x.mul(this.z); this.x.reduce();
			this.z=one;
		}
	},
/* extract x as BIG_XXX */
	getX: function()
	{
		this.affine();
		return this.x.redc();
	},
/* extract y as BIG_XXX */
	getY: function()
	{
		this.affine();
		return this.y.redc();
	},

/* get sign of Y */
	getS: function()
	{
		this.affine();
		var y=this.getY();
		return y.parity();
	},
/* extract x as FP_YYY */
	getx: function()
	{
		return this.x;
	},
/* extract y as FP_YYY */
	gety: function()
	{
		return this.y;
	},
/* extract z as FP_YYY */
	getz: function()
	{
		return this.z;
	},
/* convert to byte array */
	toBytes: function(b)
	{
		var i,t=[];
		if (ECP_ZZZ.CURVETYPE!=ECP_ZZZ.MONTGOMERY) b[0]=0x04;
		else b[0]=0x02;
	
		this.affine();
		this.x.redc().toBytes(t);
		for (i=0;i<BIG_XXX.MODBYTES;i++) b[i+1]=t[i];
		if (ECP_ZZZ.CURVETYPE!=ECP_ZZZ.MONTGOMERY)
		{
			this.y.redc().toBytes(t);
			for (i=0;i<BIG_XXX.MODBYTES;i++) b[i+BIG_XXX.MODBYTES+1]=t[i];
		}
	},
/* convert to hex string */
	toString: function() 
	{
		if (this.is_infinity()) return "infinity";
		this.affine();
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.MONTGOMERY) return "("+this.x.redc().toString()+")";
		else return "("+this.x.redc().toString()+","+this.y.redc().toString()+")";
	},

/* this+=this */
	dbl: function() 
	{
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.WEIERSTRASS)
		{
			if (this.INF) return;
			if (this.y.iszilch())
			{
				this.inf();
				return;
			}

			var w1=new FP_YYY(0); w1.copy(this.x);
			var w6=new FP_YYY(0); w6.copy(this.z);
			var w2=new FP_YYY(0);
			var w3=new FP_YYY(0); w3.copy(this.x);
			var w8=new FP_YYY(0); w8.copy(this.x);

			if (ROM_CURVE_ZZZ.CURVE_A==-3)
			{
				w6.sqr();
				w1.copy(w6);
				w1.neg();
				w3.add(w1);
				w8.add(w6);
				w3.norm(); w8.norm();
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

			w2.copy(this.y); w2.sqr();

w3.copy(this.x); w3.imul(4);

//			w3.copy(this.x); 
			w3.mul(w2);
//			w3.imul(4); //w3.norm();
			w1.copy(w3); w1.neg();

			//w8.norm();
			this.x.copy(w8); this.x.sqr();
			this.x.add(w1);
			this.x.add(w1);
			this.x.norm();

			this.z.add(this.z); this.z.norm();
			this.z.mul(this.y);

//			this.z.mul(this.y);
//			this.z.add(this.z);

			w2.add(w2);
			w2.norm(); w2.sqr();
			w2.add(w2);
			w3.sub(this.x); w3.norm();
			this.y.copy(w8); this.y.mul(w3);
			this.y.sub(w2);
			this.y.norm();
			this.z.norm();
		}
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.EDWARDS)
		{
			var C=new FP_YYY(0); C.copy(this.x);
			var D=new FP_YYY(0); D.copy(this.y);
			var H=new FP_YYY(0); H.copy(this.z);
			var J=new FP_YYY(0);

			this.x.mul(this.y); this.x.add(this.x); this.x.norm();
			C.sqr();
			D.sqr();
			if (ROM_CURVE_ZZZ.CURVE_A==-1) C.neg();	
			this.y.copy(C); this.y.add(D); this.y.norm();
			H.sqr(); H.add(H);
			this.z.copy(this.y);
			J.copy(this.y); J.sub(H); J.norm();
			this.x.mul(J);
			C.sub(D); C.norm();
			this.y.mul(C);  
			this.z.mul(J);

		//	this.x.norm();
		//	this.y.norm();
		//	this.z.norm();
		}
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.MONTGOMERY)
		{
			var A=new FP_YYY(0); A.copy(this.x);
			var B=new FP_YYY(0); B.copy(this.x);		
			var AA=new FP_YYY(0);
			var BB=new FP_YYY(0);
			var C=new FP_YYY(0);
	
			if (this.INF) return;

			A.add(this.z); A.norm();
			AA.copy(A); AA.sqr();
			B.sub(this.z); B.norm();
			BB.copy(B); BB.sqr();
			C.copy(AA); C.sub(BB); C.norm();

			this.x.copy(AA); this.x.mul(BB);

			A.copy(C); A.imul((ROM_CURVE_ZZZ.CURVE_A+2)>>2);

			BB.add(A); BB.norm();
			this.z.copy(BB); this.z.mul(C);
		//	this.x.norm();
		//	this.z.norm();
		}
		return;
	},

/* this+=Q */
	add: function(Q) 
	{
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.WEIERSTRASS)
		{
			if (this.INF)
			{
				this.copy(Q);
				return;
			}
			if (Q.INF) return;

			var aff=false;
			var one=new FP_YYY(1);
			if (Q.z.equals(one)) aff=true;

			var A,C;
			var B=new FP_YYY(this.z);
			var D=new FP_YYY(this.z);
			if (!aff)
			{
				A=new FP_YYY(Q.z);
				C=new FP_YYY(Q.z);

				A.sqr(); B.sqr();
				C.mul(A); D.mul(B);

				A.mul(this.x);
				C.mul(this.y);
			}
			else
			{
				A=new FP_YYY(this.x);
				C=new FP_YYY(this.y);
	
				B.sqr();
				D.mul(B);
			}

			B.mul(Q.x); B.sub(A);
			D.mul(Q.y); D.sub(C);
			
			if (B.iszilch())
			{
				if (D.iszilch())
				{
					this.dbl();
					return;
				}
				else
				{
					this.INF=true;
					return;
				}
			}

			if (!aff) this.z.mul(Q.z);
			this.z.mul(B);

			var e=new FP_YYY(B); e.sqr();
			B.mul(e);
			A.mul(e);

			e.copy(A);
			e.add(A); e.add(B); e.norm(); D.norm();
			this.x.copy(D); this.x.sqr(); this.x.sub(e);

			A.sub(this.x); A.norm();
			this.y.copy(A); this.y.mul(D); 
			C.mul(B); this.y.sub(C);

			this.x.norm();
			this.y.norm();
		//	this.z.norm();

		}
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.EDWARDS)
		{
			var b=new FP_YYY(0); b.rcopy(ROM_CURVE_ZZZ.CURVE_B);
			var A=new FP_YYY(0); A.copy(this.z);
			var B=new FP_YYY(0);
			var C=new FP_YYY(0); C.copy(this.x);
			var D=new FP_YYY(0); D.copy(this.y);
			var E=new FP_YYY(0);
			var F=new FP_YYY(0);
			var G=new FP_YYY(0);

			A.mul(Q.z);
			B.copy(A); B.sqr();
			C.mul(Q.x);
			D.mul(Q.y);

			E.copy(C); E.mul(D); E.mul(b);
			F.copy(B); F.sub(E); 
			G.copy(B); G.add(E); 

			if (ROM_CURVE_ZZZ.CURVE_A==1)
			{
				E.copy(D); E.sub(C);
			}
			C.add(D);

			B.copy(this.x); B.add(this.y);
			D.copy(Q.x); D.add(Q.y); 
			B.norm(); D.norm();
			B.mul(D);
			B.sub(C);
			B.norm(); F.norm();
			B.mul(F);
			this.x.copy(A); this.x.mul(B);

			G.norm();
			if (ROM_CURVE_ZZZ.CURVE_A==1)
			{
				E.norm(); C.copy(E); C.mul(G);
			}
			if (ROM_CURVE_ZZZ.CURVE_A==-1)
			{
				C.norm(); C.mul(G);
			}
			this.y.copy(A); this.y.mul(C);
			this.z.copy(F); this.z.mul(G);
		//	this.x.norm(); this.y.norm(); this.z.norm();
		}
		return;
	},

/* Differential Add for Montgomery curves. this+=Q where W is this-Q and is affine. */
	dadd: function(Q,W) 
	{
		var A=new FP_YYY(0); A.copy(this.x);
		var B=new FP_YYY(0); B.copy(this.x);
		var C=new FP_YYY(0); C.copy(Q.x);
		var D=new FP_YYY(0); D.copy(Q.x);
		var DA=new FP_YYY(0);
		var CB=new FP_YYY(0);	
			
		A.add(this.z); 
		B.sub(this.z); 

		C.add(Q.z);
		D.sub(Q.z);

		D.norm(); A.norm();
		DA.copy(D); DA.mul(A);
		C.norm(); B.norm();
		CB.copy(C); CB.mul(B);

		A.copy(DA); A.add(CB); A.norm(); A.sqr();
		B.copy(DA); B.sub(CB); B.norm(); B.sqr();

		this.x.copy(A);
		this.z.copy(W.x); this.z.mul(B);

		if (this.z.iszilch()) this.inf();
		else this.INF=false;

	//	this.x.norm();
	},

/* this-=Q */
	sub: function(Q) {
		Q.neg();
		this.add(Q);
		Q.neg();
	},

/* constant time multiply by small integer of length bts - use ladder */
	pinmul: function(e,bts) {	
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.MONTGOMERY)
			return this.mul(new BIG_XXX(e));
		else
		{
			var nb,i,b;
			var P=new ECP_ZZZ();
			var R0=new ECP_ZZZ();
			var R1=new ECP_ZZZ(); R1.copy(this);
		
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
	},

/* return e.this - SPA immune, using Ladder */

	mul: function(e) 
	{
		if (e.iszilch() || this.is_infinity()) return new ECP_ZZZ();
		var P=new ECP_ZZZ();
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.MONTGOMERY)
		{ /* use ladder */
			var nb,i,b;
			var D=new ECP_ZZZ();
			var R0=new ECP_ZZZ(); R0.copy(this);
			var R1=new ECP_ZZZ(); R1.copy(this);
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
			var i,b,nb,m,s,ns;
			var mt=new BIG_XXX();
			var t=new BIG_XXX();
			var Q=new ECP_ZZZ();
			var C=new ECP_ZZZ();
			var W=[];
			var w=[];

			this.affine();

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
			if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.WEIERSTRASS) 
				ECP_ZZZ.multiaffine(8,W);

// make exponent odd - add 2P if even, P if odd 
			t.copy(e);
			s=t.parity();
			t.inc(1); t.norm(); ns=t.parity(); mt.copy(t); mt.inc(1); mt.norm();
			t.cmove(mt,s);
			Q.cmove(this,ns);
			C.copy(Q);

			nb=1+Math.floor((t.nbits()+3)/4);

// convert exponent to signed 4-bit window 
			for (i=0;i<nb;i++)
			{
				w[i]=(t.lastbits(5)-16);
				t.dec(w[i]); t.norm();
				t.fshr(4);	
			}
			w[nb]=t.lastbits(5);
	
			P.copy(W[Math.floor((w[nb]-1)/2)]);  
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
		}
		P.affine();
		return P;
	},

/* Return e.this+f.Q */

	mul2: function(e,Q,f) {
		var te=new BIG_XXX();
		var tf=new BIG_XXX();
		var mt=new BIG_XXX();
		var S=new ECP_ZZZ();
		var T=new ECP_ZZZ();
		var C=new ECP_ZZZ();
		var W=[];
		var w=[];		
		var i,s,ns,nb;
		var a,b;

		this.affine();
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
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.WEIERSTRASS) 
			ECP_ZZZ.multiaffine(8,W);

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
		nb=1+Math.floor((mt.nbits()+1)/2);

// convert exponent to signed 2-bit window 
		for (i=0;i<nb;i++)
		{
			a=(te.lastbits(3)-4);
			te.dec(a); te.norm(); 
			te.fshr(2);
			b=(tf.lastbits(3)-4);
			tf.dec(b); tf.norm(); 
			tf.fshr(2);
			w[i]=(4*a+b);
		}
		w[nb]=(4*te.lastbits(3)+tf.lastbits(3));
		S.copy(W[Math.floor((w[nb]-1)/2)]);  

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

};

ECP_ZZZ.multiaffine=function(m,P)
{
	var i;
	var t1=new FP_YYY(0);
	var t2=new FP_YYY(0);
	var work=[];

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
};

/* return 1 if b==c, no branching */
ECP_ZZZ.teq=function(b,c)
{
	var x=b^c;
	x-=1;  // if x=0, x now -1
	return ((x>>31)&1);
};

/* convert from byte array to ECP_ZZZ */
ECP_ZZZ.fromBytes= function(b)
{
	var i,t=[];
	var P=new ECP_ZZZ();
	var p=new BIG_XXX(0); p.rcopy(ROM_FIELD_YYY.Modulus);

	for (i=0;i<BIG_XXX.MODBYTES;i++) t[i]=b[i+1];
	var px=BIG_XXX.fromBytes(t);
	if (BIG_XXX.comp(px,p)>=0) return P;

	if (b[0]==0x04)
	{
		for (i=0;i<BIG_XXX.MODBYTES;i++) t[i]=b[i+BIG_XXX.MODBYTES+1];
		var py=BIG_XXX.fromBytes(t);
		if (BIG_XXX.comp(py,p)>=0) return P;
		P.setxy(px,py);
		return P;
	}
	else 
	{
		P.setx(px);
		return P;
	}
};

/* Calculate RHS of curve equation */
ECP_ZZZ.RHS= function(x) 
{
	x.norm();
	var r=new FP_YYY(0); r.copy(x);
	r.sqr();

	if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.WEIERSTRASS)   
	{ // x^3+Ax+B
		var b=new FP_YYY(0); b.rcopy(ROM_CURVE_ZZZ.CURVE_B);
		r.mul(x);
		if (ROM_CURVE_ZZZ.CURVE_A==-3)
		{
			var cx=new FP_YYY(0); cx.copy(x);
			cx.imul(3);
			cx.neg(); cx.norm();
			r.add(cx);
		}
		r.add(b);
	}
	if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.EDWARDS)
	{ // (Ax^2-1)/(Bx^2-1) 
		var b=new FP_YYY(0); b.rcopy(ROM_CURVE_ZZZ.CURVE_B);

		var one=new FP_YYY(1);
		b.mul(r);
		b.sub(one);
		if (ROM_CURVE_ZZZ.CURVE_A==-1) r.neg();
		r.sub(one);
		r.norm();
		b.inverse();

		r.mul(b);
	}
	if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.MONTGOMERY)
	{ // x^3+Ax^2+x
		var x3=new FP_YYY(0);
		x3.copy(r);
		x3.mul(x);
		r.imul(ROM_CURVE_ZZZ.CURVE_A);
		r.add(x3);
		r.add(x);
	}
	r.reduce();
	return r;
};
