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
	this.z=new FP_YYY(0);
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
		if (this.INF) return true;
		this.x.reduce(); this.z.reduce();
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.EDWARDS)
		{
			this.y.reduce();
			this.INF= (this.x.iszilch() && this.y.equals(this.z));
		}
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.WEIERSTRASS)
		{
			this.y.reduce();
			this.INF= (this.x.iszilch() && this.z.iszilch());
		}
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.MONTGOMERY)
		{
			this.INF= (z.iszilch());
		}		
		return this.INF;
	},


/* conditional swap of this and Q dependant on d */
	cswap: function(Q,d)
	{
		this.x.cswap(Q.x,d);
		if (ECP_ZZZ.CURVETYPE!=ECP_ZZZ.MONTGOMERY) this.y.cswap(Q.y,d);
		this.z.cswap(Q.z,d);

		var bd=(d!==0)?true:false;
		bd=bd&(this.INF^Q.INF);
		this.INF^=bd;
		Q.INF^=bd;

	},

/* conditional move of Q to P dependant on d */
	cmove: function(Q,d)
	{
		this.x.cmove(Q.x,d);
		if (ECP_ZZZ.CURVETYPE!=ECP_ZZZ.MONTGOMERY) this.y.cmove(Q.y,d);
		this.z.cmove(Q.z,d);
	
		var bd=(d!==0)?true:false;
		this.INF^=(this.INF^Q.INF)&bd;
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

		var a=new FP_YYY(0);
		var b=new FP_YYY(0);
		a.copy(this.x); a.mul(Q.z); a.reduce();
		b.copy(Q.x); b.mul(this.z); b.reduce();
		if (!a.equals(b)) return false;
		if (ECP_ZZZ.CURVETYPE!=ECP_ZZZ.MONTGOMERY)
		{
			a.copy(this.y); a.mul(Q.z); a.reduce();
			b.copy(Q.y); b.mul(this.z); b.reduce();
			if (!a.equals(b)) return false;
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
//		if (this.is_infinity()) return;
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
		if (ECP_ZZZ.CURVETYPE!=ECP_ZZZ. MONTGOMERY) this.y.one();
		if (ECP_ZZZ.CURVETYPE!=ECP_ZZZ.EDWARDS) this.z.zero();
		else this.z.one();
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

		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.EDWARDS || ECP_ZZZ.CURVETYPE==ECP_ZZZ.WEIERSTRASS)
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
	
			if (ROM_CURVE_ZZZ.CURVE_A==0)
			{
				var t0=new FP_YYY(0); t0.copy(this.y); //FP t0=new FP(y);                      /*** Change ***/    // Edits made
				t0.sqr();
				var t1=new FP_YYY(0); t1.copy(this.y); //FP t1=new FP(y);
				t1.mul(this.z);
				var t2=new FP_YYY(0); t2.copy(this.z); //FP t2=new FP(z);
				t2.sqr();

				this.z.copy(t0);
				this.z.add(t0); this.z.norm(); 
				this.z.add(this.z); this.z.add(this.z); this.z.norm();

				t2.imul(3*ROM_CURVE_ZZZ.CURVE_B_I);

				var x3=new FP_YYY(0); x3.copy(t2); //FP x3=new FP(t2);
				x3.mul(this.z);
				var y3=new FP_YYY(0); y3.copy(t0); //FP y3=new FP(t0);
				y3.add(t2); y3.norm();
				this.z.mul(t1); 
				t1.copy(t2); t1.add(t2); t2.add(t1);
				t0.sub(t2); t0.norm(); y3.mul(t0); y3.add(x3);
				t1.copy(this.x); t1.mul(this.y); 
				this.x.copy(t0); this.x.norm(); this.x.mul(t1); this.x.add(this.x);
//System.out.println("Out of dbl");
				this.x.norm(); 
				this.y.copy(y3); this.y.norm();
			}
			else
			{
				var t0=new FP_YYY(0); t0.copy(this.x); //FP t0=new FP(x);
				var t1=new FP_YYY(0); t1.copy(this.y);//FP t1=new FP(y);
				var t2=new FP_YYY(0); t2.copy(this.z);//FP t2=new FP(z);
				var t3=new FP_YYY(0); t3.copy(this.x);//FP t3=new FP(x);
				var z3=new FP_YYY(0); z3.copy(this.z);//FP z3=new FP(z);
				var y3=new FP_YYY(0); //FP y3=new FP(0);
				var x3=new FP_YYY(0);//FP x3=new FP(0);
				var b=new FP_YYY(0); //FP b=new FP(0);
//System.out.println("Into dbl");
				if (ROM_CURVE_ZZZ.CURVE_B_I==0)
					b.copy(new FP(new BIG(ROM_CURVE_ZZZ.CURVE_B)));
//System.out.println("b= "+b.toString());
				t0.sqr();  //1    x^2
				t1.sqr();  //2    y^2
				t2.sqr();  //3

				t3.mul(this.y); //4
				t3.add(t3); t3.norm();//5
				z3.mul(this.x);   //6
				z3.add(z3);  z3.norm();//7
				y3.copy(t2); 
				
				if (ROM_CURVE_ZZZ.CURVE_B_I==0)
					y3.mul(b); //8
				else
					y3.imul(ROM_CURVE_ZZZ.CURVE_B_I);
				
				y3.sub(z3); //y3.norm(); //9  ***
				x3.copy(y3); x3.add(y3); x3.norm();//10

				y3.add(x3); //y3.norm();//11
				x3.copy(t1); x3.sub(y3); x3.norm();//12
				y3.add(t1); y3.norm();//13
				y3.mul(x3); //14
				x3.mul(t3); //15
				t3.copy(t2); t3.add(t2); //t3.norm(); //16
				t2.add(t3); //t2.norm(); //17

				if (ROM_CURVE_ZZZ.CURVE_B_I==0)
					z3.mul(b); //18
				else
					z3.imul(ROM_CURVE_ZZZ.CURVE_B_I);

				z3.sub(t2); //z3.norm();//19
				z3.sub(t0); z3.norm();//20  ***
				t3.copy(z3); t3.add(z3); //t3.norm();//21

				z3.add(t3); z3.norm(); //22
				t3.copy(t0); t3.add(t0); //t3.norm(); //23
				t0.add(t3); //t0.norm();//24
				t0.sub(t2); t0.norm();//25

				t0.mul(z3);//26
				y3.add(t0); //y3.norm();//27
				t0.copy(this.y); t0.mul(this.z);//28
				t0.add(t0); t0.norm(); //29
				z3.mul(t0);//30
				x3.sub(z3); //x3.norm();//31
				t0.add(t0); t0.norm();//32
				t1.add(t1); t1.norm();//33
				z3.copy(t0); z3.mul(t1);//34
//System.out.println("Out of dbl");
				this.x.copy(x3); this.x.norm(); 
				this.y.copy(y3); this.y.norm();
				this.z.copy(z3); this.z.norm();
			}
		}
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.EDWARDS)
		{
			var C=new FP_YYY(0); C.copy(this.x); //FP C=new FP(x);
			var D=new FP_YYY(0); D.copy(this.y);//FP D=new FP(y);
			var H=new FP_YYY(0); H.copy(this.z);//FP H=new FP(z);
			var J=new FP_YYY(0); //FP J=new FP(0);
//System.out.println("Into dbl");	
			this.x.mul(this.y); this.x.add(this.x); this.x.norm();
			C.sqr();
			D.sqr();
			if (ROM_CURVE_ZZZ.CURVE_A==-1) C.neg();	

			this.y.copy(C); this.y.add(D); this.y.norm();
			H.sqr(); H.add(H);

			this.z.copy(this.y);
			J.copy(this.y); 

			J.sub(H); J.norm();

			this.x.mul(J);
			C.sub(D); C.norm();
			this.y.mul(C);
			this.z.mul(J);
//System.out.println("Out of dbl");
		}
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.MONTGOMERY)
		{
			var A=new FP_YYY(0); A.copy(this.x);  //FP A=new FP(x);
			var B=new FP_YYY(0); B.copy(this.x);//FP B=new FP(x);		
			var AA=new FP_YYY(0); //FP AA=new FP(0);
			var BB=new FP_YYY(0); //FP BB=new FP(0);
			var C=new FP_YYY(0); //FP C=new FP(0);

			A.add(this.z); A.norm();
			AA.copy(A); AA.sqr();
			B.sub(this.z); B.norm();
			BB.copy(B); BB.sqr();
			C.copy(AA); C.sub(BB); C.norm();
			this.x.copy(AA); this.x.mul(BB);

			A.copy(C); A.imul((ROM_CURVE_ZZZ.CURVE_A+2)>>2);

			BB.add(A); BB.norm();
			this.z.copy(BB); this.z.mul(C);
		}
		return;
	},

/* this+=Q */
	add: function(Q) 
	{
		if (this.INF)
		{
			this.copy(Q);
			return;
		}
		if (Q.INF) return;

		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.WEIERSTRASS)
		{

//System.out.println("Into add");
			if (ROM_CURVE_ZZZ.CURVE_A==0)
			{
//	System.out.println("Into add");                      // Edits made

				var b=3*ROM_CURVE_ZZZ.CURVE_B_I;
				var t0=new FP_YYY(0); t0.copy(this.x);//FP t0=new FP(x);
				t0.mul(Q.x);
				var t1=new FP_YYY(0); t1.copy(this.y);//FP t1=new FP(y);
				t1.mul(Q.y);
				var t2=new FP_YYY(0); t2.copy(this.z);//FP t2=new FP(z);
				t2.mul(Q.z);
				var t3=new FP_YYY(0); t3.copy(this.x);//FP t3=new FP(x);
				t3.add(this.y); t3.norm();
				var t4=new FP_YYY(0); t4.copy(Q.x);//FP t4=new FP(Q.x);
				t4.add(Q.y); t4.norm();
				t3.mul(t4);
				t4.copy(t0); t4.add(t1);

				t3.sub(t4); t3.norm();
				t4.copy(this.y);
				t4.add(this.z); t4.norm();
				var x3=new FP_YYY(0); x3.copy(Q.y);//FP x3=new FP(Q.y);
				x3.add(Q.z); x3.norm();

				t4.mul(x3);
				x3.copy(t1);
				x3.add(t2);
	
				t4.sub(x3); t4.norm();
				x3.copy(this.x); x3.add(this.z); x3.norm();
				var y3=new FP_YYY(0); y3.copy(Q.x);//FP y3=new FP(Q.x);
				y3.add(Q.z); y3.norm();
				x3.mul(y3);
				y3.copy(t0);
				y3.add(t2);
				y3.rsub(x3); y3.norm();
				x3.copy(t0); x3.add(t0); 
				t0.add(x3); t0.norm();
				t2.imul(b);

				var z3=new FP_YYY(0); z3.copy(t1);//FP z3=new FP(t1); 
				z3.add(t2); z3.norm();
				t1.sub(t2); t1.norm(); 
				y3.imul(b);
	
				x3.copy(y3); x3.mul(t4); t2.copy(t3); t2.mul(t1); x3.rsub(t2);
				y3.mul(t0); t1.mul(z3); y3.add(t1);
				t0.mul(t3); z3.mul(t4); z3.add(t0);

//System.out.println("Out of add");

				this.x.copy(x3); this.x.norm(); 
				this.y.copy(y3); this.y.norm();
				this.z.copy(z3); this.z.norm();
			}
			else
			{
				var t0=new FP_YYY(0); t0.copy(this.x);//FP t0=new FP(x);
				var t1=new FP_YYY(0); t1.copy(this.y);//FP t1=new FP(y);
				var t2=new FP_YYY(0); t2.copy(this.z);//FP t2=new FP(z);
				var t3=new FP_YYY(0); t3.copy(this.x);//FP t3=new FP(x);
				var t4=new FP_YYY(0); t4.copy(Q.x);//FP t4=new FP(Q.x);
				var z3=new FP_YYY(0); //FP z3=new FP(0);
				var y3=new FP_YYY(0); y3.copy(Q.x); //FP y3=new FP(Q.x);
				var x3=new FP_YYY(0); x3.copy(Q.y);//FP x3=new FP(Q.y);
				var b=new FP_YYY(0); //FP b=new FP(0);

				if (ROM_CURVE_ZZZ.CURVE_B_I==0)
					b.rcopy(ROM_CURVE_ZZZ.CURVE_B);
				t0.mul(Q.x); //1
				t1.mul(Q.y); //2
				t2.mul(Q.z); //3

				t3.add(this.y); t3.norm(); //4
				t4.add(Q.y); t4.norm();//5
				t3.mul(t4);//6
				t4.copy(t0); t4.add(t1); //t4.norm(); //7
				t3.sub(t4); t3.norm(); //8
				t4.copy(this.y); t4.add(this.z); t4.norm();//9
				x3.add(Q.z); x3.norm();//10
				t4.mul(x3); //11
				x3.copy(t1); x3.add(t2); //x3.norm();//12

				t4.sub(x3); t4.norm();//13
				x3.copy(this.x); x3.add(this.z); x3.norm(); //14
				y3.add(Q.z); y3.norm();//15

				x3.mul(y3); //16
				y3.copy(t0); y3.add(t2); //y3.norm();//17

				y3.rsub(x3); y3.norm(); //18
				z3.copy(t2); 
				

				if (ROM_CURVE_ZZZ.CURVE_B_I==0)
					z3.mul(b); //18
				else
					z3.imul(ROM_CURVE_ZZZ.CURVE_B_I);
				
				x3.copy(y3); x3.sub(z3); x3.norm(); //20
				z3.copy(x3); z3.add(x3); //z3.norm(); //21

				x3.add(z3); //x3.norm(); //22
				z3.copy(t1); z3.sub(x3); z3.norm(); //23
				x3.add(t1); x3.norm(); //24

				if (ROM_CURVE_ZZZ.CURVE_B_I==0)
					y3.mul(b); //18
				else
					y3.imul(ROM_CURVE_ZZZ.CURVE_B_I);

				t1.copy(t2); t1.add(t2); //t1.norm();//26
				t2.add(t1); //t2.norm();//27

				y3.sub(t2); //y3.norm(); //28

				y3.sub(t0); y3.norm(); //29
				t1.copy(y3); t1.add(y3); //t1.norm();//30
				y3.add(t1); y3.norm(); //31

				t1.copy(t0); t1.add(t0); //t1.norm(); //32
				t0.add(t1); //t0.norm();//33
				t0.sub(t2); t0.norm();//34
				t1.copy(t4); t1.mul(y3);//35
				t2.copy(t0); t2.mul(y3);//36
				y3.copy(x3); y3.mul(z3);//37
				y3.add(t2); //y3.norm();//38
				x3.mul(t3);//39
				x3.sub(t1);//40
				z3.mul(t4);//41
				t1.copy(t3); t1.mul(t0);//42
				z3.add(t1); //z3.norm();
//System.out.println("Out of add");
				this.x.copy(x3); this.x.norm(); 
				this.y.copy(y3); this.y.norm();
				this.z.copy(z3); this.z.norm();
			}
		}
		if (ECP_ZZZ.CURVETYPE==ECP_ZZZ.EDWARDS)
		{

			var A=new FP_YYY(0); A.copy(this.z);  //FP A=new FP(z);
			var B=new FP_YYY(0); //FP B=new FP(0);
			var C=new FP_YYY(0); C.copy(this.x);//FP C=new FP(x);
			var D=new FP_YYY(0); D.copy(this.y);//FP D=new FP(y);
			var E=new FP_YYY(0); //FP E=new FP(0);
			var F=new FP_YYY(0); //FP F=new FP(0);
			var G=new FP_YYY(0); //FP G=new FP(0);

			A.mul(Q.z);             //A=2
			B.copy(A); B.sqr();     //B=2
			C.mul(Q.x);             //C=2
			D.mul(Q.y);             //D=2

			E.copy(C); E.mul(D);    //E=2
		
			if (ROM_CURVE_ZZZ.CURVE_B_I==0)
			{
				var b=new FP_YYY(0); b.rcopy(ROM_CURVE_ZZZ.CURVE_B);
				E.mul(b);
			}
			else
				E.imul(ROM_CURVE_ZZZ.CURVE_B_I);  //E=22222	

			F.copy(B); F.sub(E);        //F=22224 
			G.copy(B); G.add(E);        //G=22224

			if (ROM_CURVE_ZZZ.CURVE_A==1)
			{
				E.copy(D); E.sub(C);    //E=4
			}
			C.add(D);                   //C=4

			B.copy(this.x); B.add(this.y);        //B=4
			D.copy(Q.x); D.add(Q.y); B.norm(); D.norm(); //D=4
			B.mul(D);                   //B=2  
			B.sub(C); B.norm(); F.norm(); // B=6
			B.mul(F);                     //B=2  
			this.x.copy(A); this.x.mul(B); G.norm();  // x=2
			if (ROM_CURVE_ZZZ.CURVE_A==1)
			{
				E.norm(); C.copy(E); C.mul(G);  //C=2
			}
			if (ROM_CURVE_ZZZ.CURVE_A==-1)
			{
				C.norm(); C.mul(G);
			}
			this.y.copy(A); this.y.mul(C);     //y=2
			this.z.copy(F);   
			this.z.mul(G);  
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

ECP_ZZZ.mapit= function(h)
{
	var q=new BIG_XXX(0); q.rcopy(ROM_FIELD_YYY.Modulus);
	var x=BIG_XXX.fromBytes(h);
	x.mod(q);
	var P=new ECP_ZZZ();
	while (true)
	{
		P.setxi(x,0);
		if (!P.is_infinity()) break;
		x.inc(1); x.norm();
	}
	if (ECP_ZZZ.CURVE_PAIRING_TYPE!=ECP_ZZZ.BN)
	{
		var c=new BIG_XXX(0); c.rcopy(ROM_CURVE_ZZZ.CURVE_Cof);
		P=P.mul(c);
	}
	return P;
};
