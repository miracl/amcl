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

/* AMCL Weierstrass elliptic curve functions over FP2_YYY */

/* Constructor, set this=O */
var ECP2_ZZZ=function()
{
	this.x=new FP2_YYY(0);
	this.y=new FP2_YYY(1);
	this.z=new FP2_YYY(0);
	this.INF=true;
};

ECP2_ZZZ.prototype={
/* Test this=O? */
	is_infinity: function() 
	{
		if (this.INF) return true;                    //******
		this.x.reduce(); this.y.reduce(); this.z.reduce();
		this.INF=(this.x.iszilch() && this.z.iszilch());
		return this.INF;
	},
/* copy this=P */
	copy: function(P)
	{
		this.x.copy(P.x);
		this.y.copy(P.y);
		this.z.copy(P.z);
		this.INF=P.INF;
	},
/* set this=O */
	inf: function() 
	{
		this.INF=true;
		this.x.zero();
		this.y.one();
		this.z.zero();
	},

/* conditional move of Q to P dependant on d */
	cmove: function(Q,d)
	{
		this.x.cmove(Q.x,d);
		this.y.cmove(Q.y,d);
		this.z.cmove(Q.z,d);

		var bd=(d!==0)?true:false;
		this.INF^=(this.INF^Q.INF)&bd;
	},

/* Constant time select from pre-computed table */
	select: function(W,b)
	{
		var MP=new ECP2_ZZZ(); 
		var m=b>>31;
		var babs=(b^m)-m;

		babs=(babs-1)/2;

		this.cmove(W[0],ECP2_ZZZ.teq(babs,0));  // conditional move
		this.cmove(W[1],ECP2_ZZZ.teq(babs,1));
		this.cmove(W[2],ECP2_ZZZ.teq(babs,2));
		this.cmove(W[3],ECP2_ZZZ.teq(babs,3));
		this.cmove(W[4],ECP2_ZZZ.teq(babs,4));
		this.cmove(W[5],ECP2_ZZZ.teq(babs,5));
		this.cmove(W[6],ECP2_ZZZ.teq(babs,6));
		this.cmove(W[7],ECP2_ZZZ.teq(babs,7));

		MP.copy(this);
		MP.neg();
		this.cmove(MP,(m&1));
	},

/* Test P == Q */

	equals: function(Q) {
		if (this.is_infinity() && Q.is_infinity()) return true;
		if (this.is_infinity() || Q.is_infinity()) return false;

		var a=new FP_YYY(0); a.copy(this.x);
		var b=new FP_YYY(0); b.copy(Q.x);

		a.copy(this.x); a.mul(Q.z); a.reduce();
		b.copy(Q.x); b.mul(this.z); b.reduce();
		if (!a.equals(b)) return false;

		a.copy(this.y); a.mul(Q.z); a.reduce();
		b.copy(Q.y); b.mul(this.z); b.reduce();
		if (!a.equals(b)) return false;

		return true;
	},
/* set this=-this */
	neg: function() 
	{
//		if (this.is_infinity()) return;
		this.y.norm();
		this.y.neg(); this.y.norm();
		return;
	},
/* convert this to affine, from (x,y,z) to (x,y) */
	affine: function() 
	{
		if (this.is_infinity()) return;
		var one=new FP2_YYY(1);
		if (this.z.equals(one)) 
		{
			this.x.reduce();
			this.y.reduce();
			return;
		}
		this.z.inverse();

		this.x.mul(this.z); this.x.reduce();               // *****
		this.y.mul(this.z); this.y.reduce();
		this.z.copy(one);
	},
/* extract affine x as FP2_YYY */
	getX: function()
	{
		this.affine();
		return this.x;
	},
/* extract affine y as FP2_YYY */
	getY: function()
	{
		this.affine();
		return this.y;
	},
/* extract projective x */
	getx: function()
	{
		return this.x;
	},
/* extract projective y */
	gety: function()
	{
		return this.y;
	},
/* extract projective z */
	getz: function()
	{
		return this.z;
	},
/* convert this to byte array */
	toBytes: function(b)
	{
		var i,t=[];
		this.affine();
		this.x.getA().toBytes(t);
		for (i=0;i<BIG_XXX.MODBYTES;i++)
			b[i]=t[i];
		this.x.getB().toBytes(t);
		for (i=0;i<BIG_XXX.MODBYTES;i++)
			b[i+BIG_XXX.MODBYTES]=t[i];

		this.y.getA().toBytes(t);
		for (i=0;i<BIG_XXX.MODBYTES;i++)
			b[i+2*BIG_XXX.MODBYTES]=t[i];
		this.y.getB().toBytes(t);
		for (i=0;i<BIG_XXX.MODBYTES;i++)
			b[i+3*BIG_XXX.MODBYTES]=t[i];
	},
/* convert this to hex string */
	toString: function() 
	{
		if (this.is_infinity()) return "infinity";
		this.affine();
		return "("+this.x.toString()+","+this.y.toString()+")";
	},
/* set this=(x,y) */
	setxy: function(ix,iy) 
	{
		this.x.copy(ix);
		this.y.copy(iy);
		this.z.one();

		var rhs=ECP2_ZZZ.RHS(this.x);

		var y2=new FP2_YYY(this.y); //y2.copy(this.y);
		y2.sqr();
		if (y2.equals(rhs)) this.INF=false;
		else this.inf();
	},

/* set this=(x,.) */
	setx: function(ix) 
	{
		this.x.copy(ix);
		this.z.one();

		var rhs=ECP2_ZZZ.RHS(this.x);

		if (rhs.sqrt())
		{
			this.y.copy(rhs);
			this.INF=false;
		}
		else this.inf();
	},

/* set this*=q, where q is Modulus, using Frobenius */
	frob: function(X)
	{
		if (this.INF) return;
		var X2=new FP2_YYY(X); //X2.copy(X);
		X2.sqr();
		this.x.conj();
		this.y.conj();
		this.z.conj();
		this.z.reduce();
		this.x.mul(X2);
		this.y.mul(X2);
		this.y.mul(X);
	},
/* this+=this */
	dbl: function() 
	{
		if (this.INF) return -1;
		
		var iy=new FP2_YYY(0); iy.copy(this.y); //FP2 iy=new FP2(y);
		iy.mul_ip(); iy.norm();

		var t0=new FP2_YYY(0); t0.copy(this.y);//FP2 t0=new FP2(y);                  //***** Change 
		t0.sqr();            t0.mul_ip();   
		var t1=new FP2_YYY(0); t1.copy(iy);//FP2 t1=new FP2(iy);  
		t1.mul(this.z);
		var t2=new FP2_YYY(0); t2.copy(this.z);//FP2 t2=new FP2(z);
		t2.sqr();

		this.z.copy(t0);
		this.z.add(t0); this.z.norm(); 
		this.z.add(this.z); 
		this.z.add(this.z); 
		this.z.norm();  

		t2.imul(3*ROM_CURVE_ZZZ.CURVE_B_I); 

		var x3=new FP2_YYY(0); x3.copy(t2);//FP2 x3=new FP2(t2);
		x3.mul(this.z); 

		var y3=new FP2_YYY(0); y3.copy(t0); //FP2 y3=new FP2(t0);   

		y3.add(t2); y3.norm();
		this.z.mul(t1);
		t1.copy(t2); t1.add(t2); t2.add(t1); t2.norm();  
		t0.sub(t2); t0.norm();                           //y^2-9bz^2
		y3.mul(t0); y3.add(x3);                          //(y^2+3z*2)(y^2-9z^2)+3b.z^2.8y^2
		t1.copy(this.x); t1.mul(iy);						//
		this.x.copy(t0); this.x.norm(); this.x.mul(t1); this.x.add(this.x);       //(y^2-9bz^2)xy2

		this.x.norm(); 
		this.y.copy(y3); this.y.norm();

		return 1;
	},
/* this+=Q - return 0 for add, 1 for double, -1 for O */
/* this+=Q */
	add: function(Q) 
	{
		if (this.INF)
		{
			this.copy(Q);
			return -1;
		}
		if (Q.INF) return -1;

		var b=3*ROM_CURVE_ZZZ.CURVE_B_I;
		var t0=new FP2_YYY(0); t0.copy(this.x); //FP2 t0=new FP2(x);
		t0.mul(Q.x);         // x.Q.x
		var t1=new FP2_YYY(0); t1.copy(this.y); //FP2 t1=new FP2(y);
		t1.mul(Q.y);		 // y.Q.y

		var t2=new FP2_YYY(0); t2.copy(this.z);//FP2 t2=new FP2(z);
		t2.mul(Q.z);
		var t3=new FP2_YYY(0); t3.copy(this.x);//FP2 t3=new FP2(x);
		t3.add(this.y); t3.norm();          //t3=X1+Y1
		var t4=new FP2_YYY(0); t4.copy(Q.x);//FP2 t4=new FP2(Q.x);            
		t4.add(Q.y); t4.norm();			//t4=X2+Y2
		t3.mul(t4);						//t3=(X1+Y1)(X2+Y2)
		t4.copy(t0); t4.add(t1);		//t4=X1.X2+Y1.Y2

		t3.sub(t4); t3.norm(); t3.mul_ip();  t3.norm();         //t3=(X1+Y1)(X2+Y2)-(X1.X2+Y1.Y2) = X1.Y2+X2.Y1

		t4.copy(this.y);                    
		t4.add(this.z); t4.norm();			//t4=Y1+Z1
		var x3=new FP2_YYY(0); x3.copy(Q.y);//FP2 x3=new FP2(Q.y);
		x3.add(Q.z); x3.norm();			//x3=Y2+Z2

		t4.mul(x3);						//t4=(Y1+Z1)(Y2+Z2)
		x3.copy(t1);					//
		x3.add(t2);						//X3=Y1.Y2+Z1.Z2
	
		t4.sub(x3); t4.norm(); t4.mul_ip(); t4.norm();          //t4=(Y1+Z1)(Y2+Z2) - (Y1.Y2+Z1.Z2) = Y1.Z2+Y2.Z1

		x3.copy(this.x); x3.add(this.z); x3.norm();	// x3=X1+Z1
		var y3=new FP2_YYY(0); y3.copy(Q.x);//FP2 y3=new FP2(Q.x);				
		y3.add(Q.z); y3.norm();				// y3=X2+Z2
		x3.mul(y3);							// x3=(X1+Z1)(X2+Z2)
		y3.copy(t0);
		y3.add(t2);							// y3=X1.X2+Z1+Z2
		y3.rsub(x3); y3.norm();				// y3=(X1+Z1)(X2+Z2) - (X1.X2+Z1.Z2) = X1.Z2+X2.Z1

		t0.mul_ip(); t0.norm(); // x.Q.x
		t1.mul_ip(); t1.norm(); // y.Q.y

		x3.copy(t0); x3.add(t0); 
		t0.add(x3); t0.norm();
		t2.imul(b); 	

		var z3=new FP2_YYY(0); z3.copy(t1);//FP2 z3=new FP2(t1); 
		z3.add(t2); z3.norm();
		t1.sub(t2); t1.norm(); 
		y3.imul(b); 

		x3.copy(y3); x3.mul(t4); t2.copy(t3); t2.mul(t1); x3.rsub(t2);
		y3.mul(t0); t1.mul(z3); y3.add(t1);
		t0.mul(t3); z3.mul(t4); z3.add(t0);

		this.x.copy(x3); this.x.norm(); 
		this.y.copy(y3); this.y.norm();
		this.z.copy(z3); this.z.norm();

		return 0;
	},
/* this-=Q */
	sub: function(Q) 
	{
		Q.neg();
		var D=this.add(Q);
		Q.neg();
		return D;
	},

/* P*=e */
	mul: function(e)
	{
/* fixed size windows */
		var i,b,nb,m,s,ns;
		var mt=new BIG_XXX();
		var t=new BIG_XXX();
		var C=new ECP2_ZZZ();
		var P=new ECP2_ZZZ();
		var Q=new ECP2_ZZZ();
		var W=[];
		var w=[];

		if (this.is_infinity()) return new ECP2_ZZZ();

		this.affine();

// precompute table 
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
		P.affine();
		return P;
	}
};

/* convert from byte array to point */
ECP2_ZZZ.fromBytes=function(b)
{
	var i,t=[];
	var ra,rb;

	for (i=0;i<BIG_XXX.MODBYTES;i++) t[i]=b[i];
	ra=BIG_XXX.fromBytes(t);
	for (i=0;i<BIG_XXX.MODBYTES;i++) t[i]=b[i+BIG_XXX.MODBYTES];
	rb=BIG_XXX.fromBytes(t);

	var rx=new FP2_YYY(ra,rb); //rx.bset(ra,rb);

	for (i=0;i<BIG_XXX.MODBYTES;i++) t[i]=b[i+2*BIG_XXX.MODBYTES];
	ra=BIG_XXX.fromBytes(t);
	for (i=0;i<BIG_XXX.MODBYTES;i++) t[i]=b[i+3*BIG_XXX.MODBYTES];
	rb=BIG_XXX.fromBytes(t);

	var ry=new FP2_YYY(ra,rb); //ry.bset(ra,rb);

	var P=new ECP2_ZZZ();
	P.setxy(rx,ry);
	return P;
};

/* Calculate RHS of curve equation x^3+B */
ECP2_ZZZ.RHS=function(x) 
{
	x.norm();
	var r=new FP2_YYY(x); //r.copy(x);
	r.sqr();

	var c=new BIG_XXX(0); c.rcopy(ROM_CURVE_ZZZ.CURVE_B);
	var b=new FP2_YYY(c); //b.bseta(c);
	b.div_ip();
	r.mul(x);
	r.add(b);

	r.reduce();
	return r;
};

/* P=u0.Q0+u1*Q1+u2*Q2+u3*Q3 */
ECP2_ZZZ.mul4=function(Q,u)
{
	var i,j,nb;
	var a=[];
	var T=new ECP2_ZZZ();
	var C=new ECP2_ZZZ();
	var P=new ECP2_ZZZ();
	var W=[];
	var mt=new BIG_XXX();
	var t=[];
	var w=[];

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
			a[i]=(t[i].lastbits(2)-2);
			t[i].dec(a[i]); t[i].norm(); 
			t[i].fshr(1);
		}
		w[j]=(8*a[0]+4*a[1]+2*a[2]+a[3]);
	}
	w[nb]=(8*t[0].lastbits(2)+4*t[1].lastbits(2)+2*t[2].lastbits(2)+t[3].lastbits(2));

	P.copy(W[Math.floor((w[nb]-1)/2)]);  

	for (i=nb-1;i>=0;i--)
	{
		T.select(W,w[i]);
		P.dbl();
		P.add(T);
	}
	P.sub(C); /* apply correction */

	P.affine();
	return P;
};

/* return 1 if b==c, no branching */
ECP2_ZZZ.teq=function(b,c)
{
	var x=b^c;
	x-=1;  // if x=0, x now -1
	return ((x>>31)&1);
};

/* needed for SOK */
ECP2_ZZZ.mapit= function(h)
{
	var q=new BIG_XXX(0); q.rcopy(ROM_FIELD_YYY.Modulus);
	var x=BIG_XXX.fromBytes(h);
	var one=new BIG_XXX(1);
	x.mod(q);
	var Q,T,K,X,xQ,x2Q;
	while (true)
	{
		X=new FP2_YYY(one,x);
		Q=new ECP2_ZZZ(); Q.setx(X);
		if (!Q.is_infinity()) break;
		x.inc(1); x.norm();
	}
/* Fast Hashing to G2 - Fuentes-Castaneda, Knapp and Rodriguez-Henriquez */

	var Fa=new BIG_XXX(0); Fa.rcopy(ROM_FIELD_YYY.Fra);
	var Fb=new BIG_XXX(0); Fb.rcopy(ROM_FIELD_YYY.Frb);
	X=new FP2_YYY(Fa,Fb); 
	x=new BIG_XXX(0); x.rcopy(ROM_CURVE_ZZZ.CURVE_Bnx);

	if (ECP_ZZZ.CURVE_PAIRING_TYPE==ECP_ZZZ.BN)
	{
		T=new ECP2_ZZZ(); T.copy(Q);
		T=T.mul(x); T.neg();
		K=new ECP2_ZZZ(); K.copy(T);
		K.dbl(); K.add(T); //K.affine();

		K.frob(X);
		Q.frob(X); Q.frob(X); Q.frob(X);
		Q.add(T); Q.add(K);
		T.frob(X); T.frob(X);
		Q.add(T);
	}
	if (ECP_ZZZ.CURVE_PAIRING_TYPE==ECP_ZZZ.BLS)
	{
		xQ=new ECP2_ZZZ();
		x2Q=new ECP2_ZZZ();

		xQ=Q.mul(x);
		x2Q=xQ.mul(x);

		x2Q.sub(xQ);
		x2Q.sub(Q);

		xQ.sub(Q);
		xQ.frob(X);

		Q.dbl();
		Q.frob(X);
		Q.frob(X);

		Q.add(x2Q);
		Q.add(xQ);
	}
	Q.affine();
	return Q;
};
