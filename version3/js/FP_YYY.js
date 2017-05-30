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

/* Finite Field arithmetic */
/* AMCL mod p functions */

/* General purpose Constructor */
var FP_YYY = function(x) {
	if (x instanceof FP_YYY)
	{
		this.f=new BIG_XXX(x.f);
	}
	else
	{
		this.f=new BIG_XXX(x);
		this.nres();
	}
};

FP_YYY.NOT_SPECIAL=0;
FP_YYY.PSEUDO_MERSENNE=1;
FP_YYY.GENERALISED_MERSENNE=2;
FP_YYY.MONTGOMERY_FRIENDLY=3;

FP_YYY.MODBITS=@NBT@;
FP_YYY.MOD8=@M8@;
FP_YYY.MODTYPE=FP_YYY.@MT@;

FP_YYY.FEXCESS=(1<<(BIG_XXX.BASEBITS*BIG_XXX.NLEN-FP_YYY.MODBITS)); // 2^(BASEBITS*NLEN-MODBITS)
FP_YYY.OMASK=(-1)<<FP_YYY.TBITS;
FP_YYY.TBITS=FP_YYY.MODBITS%BIG_XXX.BASEBITS;
FP_YYY.TMASK=(1<<FP_YYY.TBITS)-1;

FP_YYY.prototype={
/* set this=0 */
	zero: function()
	{
		return this.f.zero();
	},

/* copy from a BIG_XXX in ROM */
	rcopy: function(y)
	{
		this.f.rcopy(y);
		this.nres();
	},

/* copy from another BIG_XXX */
	bcopy: function(y)
	{
		this.f.copy(y);
		this.nres();
//alert("4. f= "+this.f.toString());
	},

/* copy from another FP_YYY */
	copy: function(y)
	{
		return this.f.copy(y.f);
	},

/* conditional swap of a and b depending on d */
	cswap: function(b,d)
	{
		this.f.cswap(b.f,d);
	},

/* conditional copy of b to a depending on d */
	cmove: function(b,d)
	{
		this.f.cmove(b.f,d);
	},

/* convert to Montgomery n-residue form */
	nres: function()
	{
		if (FP_YYY.MODTYPE!=FP_YYY.PSEUDO_MERSENNE && FP_YYY.MODTYPE!=FP_YYY.GENERALISED_MERSENNE)
		{
			var p=new BIG_XXX();
			p.rcopy(ROM_FIELD_YYY.Modulus);
			var d=new DBIG_XXX(0);

			d.hcopy(this.f);
			d.norm();
			d.shl(BIG_XXX.NLEN*BIG_XXX.BASEBITS);
			this.f.copy(d.mod(p));
		}
		return this;
	},
	
/* convert back to regular form */
	redc: function()
	{
		var r=new BIG_XXX(0);
		r.copy(this.f);
		if (FP_YYY.MODTYPE!=FP_YYY.PSEUDO_MERSENNE && FP_YYY.MODTYPE!=FP_YYY.GENERALISED_MERSENNE)
		{
			var d=new DBIG_XXX(0);
			d.hcopy(this.f);
			var w=FP_YYY.mod(d);
			r.copy(w);
		}

		return r;
	},	

/* convert this to string */
	toString: function() 
	{
		var s=this.redc().toString();
		return s;
	},

/* test this=0 */
	iszilch: function() 
	{
		this.reduce();
		return this.f.iszilch();
	},

/* reduce this mod Modulus */
	reduce: function()
	{
		var p=new BIG_XXX(0);
		p.rcopy(ROM_FIELD_YYY.Modulus);
		return this.f.mod(p);
	},

/* set this=1 */
	one: function()
	{
		this.f.one(); 
		return this.nres();
	},

/* normalise this */
	norm: function()
	{
		return this.f.norm();
	},

/* this*=b mod Modulus */
	mul: function(b)
	{
		var ea=FP_YYY.EXCESS(this.f);
		var eb=FP_YYY.EXCESS(b.f);

		if ((ea+1)*(eb+1)>FP_YYY.FEXCESS) this.reduce();

		var d=BIG_XXX.mul(this.f,b.f);
		this.f.copy(FP_YYY.mod(d));
		return this;
	},

/* this*=c mod Modulus where c is an int */
	imul: function(c)
	{
		var s=false;
		this.norm();
		if (c<0)
		{
			c=-c;
			s=true;
		}

		var afx=(FP_YYY.EXCESS(this.f)+1)*(c+1)+1;
		if (c<=BIG_XXX.NEXCESS && afx<FP_YYY.FEXCESS)
		{
			this.f.imul(c);
			this.norm();
		}
		else
		{
			if (afx<FP_YYY.FEXCESS) this.f.pmul(c);
			else
			{
				var p=new BIG_XXX(0);
				p.rcopy(ROM_FIELD_YYY.Modulus);
				var d=this.f.pxmul(c);
				this.f.copy(d.mod(p));
			}
		}
		if (s) {this.neg(); this.norm();}
		return this;
	},

/* this*=this mod Modulus */
	sqr: function()
	{
		var d;
//		this.norm();
		var ea=FP_YYY.EXCESS(this.f);

		if ((ea+1)*(ea+1)>FP_YYY.FEXCESS) this.reduce();
		//if ((ea+1)>= Math.floor((FP_YYY.FEXCESS-1)/(ea+1))) this.reduce();

		d=BIG_XXX.sqr(this.f);
		var t=FP_YYY.mod(d); 
		this.f.copy(t);
		return this;
	},

/* this+=b */
	add: function(b) 
	{
		this.f.add(b.f);
		if (FP_YYY.EXCESS(this.f)+2>=FP_YYY.FEXCESS) this.reduce();
		return this;
	},
/* this=-this mod Modulus */
	neg: function()
	{
		var sb,ov;
		var m=new BIG_XXX(0);
		m.rcopy(ROM_FIELD_YYY.Modulus);

//		this.norm();
		sb=FP_YYY.logb2(FP_YYY.EXCESS(this.f)+1);

//		ov=FP_YYY.EXCESS(this.f); 
//		sb=1; while(ov!==0) {sb++;ov>>=1;} 

		m.fshl(sb);
		this.f.rsub(m);	
		if (FP_YYY.EXCESS(this.f)>=FP_YYY.FEXCESS) this.reduce();
		return this;
	},

/* this-=b */
	sub: function(b)
	{
		var n=new FP_YYY(0);
		n.copy(b);
		n.neg();
		this.add(n);
		return this;
	},

/* this/=2 mod Modulus */
	div2: function()
	{
//		this.norm();
		if (this.f.parity()===0)
			this.f.fshr(1);
		else
		{
			var p=new BIG_XXX(0);
			p.rcopy(ROM_FIELD_YYY.Modulus);

			this.f.add(p);
			this.f.norm();
			this.f.fshr(1);
		}
		return this;
	},

/* this=1/this mod Modulus */
	inverse: function()
	{
		var p=new BIG_XXX(0);
		p.rcopy(ROM_FIELD_YYY.Modulus);
		var r=this.redc();
		r.invmodp(p);
		this.f.copy(r);
		return this.nres();
	},

/* return TRUE if this==a */
	equals: function(a)
	{
		a.reduce();
		this.reduce();
		if (BIG_XXX.comp(a.f,this.f)===0) return true;
		return false;
	},

/* return this^e mod Modulus */
	pow: function(e)
	{
		var bt;
		var r=new FP_YYY(1);
		e.norm();
		this.norm();
		var m=new FP_YYY(0);
		m.copy(this);
		while (true)
		{
			bt=e.parity();
			e.fshr(1);
			if (bt==1) r.mul(m);
			if (e.iszilch()) break;
			m.sqr();
		}

		r.reduce();
		return r;
	},

/* return jacobi symbol (this/Modulus) */
	jacobi: function()
	{
		var p=new BIG_XXX(0);
		p.rcopy(ROM_FIELD_YYY.Modulus);
		var w=this.redc();
		return w.jacobi(p);
	},

/* return sqrt(this) mod Modulus */
	sqrt: function()
	{
		this.reduce();
		var b=new BIG_XXX(0);
		b.rcopy(ROM_FIELD_YYY.Modulus);
		if (FP_YYY.MOD8==5)
		{
			b.dec(5); b.norm(); b.shr(3);
			var i=new FP_YYY(0); 
			i.copy(this);
			i.f.shl(1);
			var v=i.pow(b);
			i.mul(v); i.mul(v);
			i.f.dec(1);
			var r=new FP_YYY(0);
			r.copy(this);
			r.mul(v); r.mul(i); 
			r.reduce();
			return r;
		}
		else
		{
			b.inc(1); b.norm(); b.shr(2);
			return this.pow(b);
		}
	}

};

FP_YYY.logb2=function(v)
{
		v |= v >>> 1;
		v |= v >>> 2;
		v |= v >>> 4;
		v |= v >>> 8;
		v |= v >>> 16;

		v = v - ((v >>> 1) & 0x55555555);                  
		v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);  
		var r = ((v + (v >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24; 
		return r+1;
};

/* calculate Field Excess */
FP_YYY.EXCESS=function(a)
{
	return ((a.w[BIG_XXX.NLEN-1]&FP_YYY.OMASK)>>(FP_YYY.MODBITS%BIG_XXX.BASEBITS));
};


/* reduce a DBIG_XXX to a BIG_XXX using a "special" modulus */
FP_YYY.mod=function(d)
{
	var i,j,b=new BIG_XXX(0);
	if (FP_YYY.MODTYPE==FP_YYY.PSEUDO_MERSENNE)
	{
		var v,tw;
		var t=d.split(FP_YYY.MODBITS);
		b.hcopy(d);

		if (ROM_FIELD_YYY.MConst!=1)
			v=t.pmul(ROM_FIELD_YYY.MConst);
		else v=0;

		t.add(b); t.norm();

		tw=t.w[BIG_XXX.NLEN-1];
		t.w[BIG_XXX.NLEN-1]&=FP_YYY.TMASK;
		t.inc(ROM_FIELD_YYY.MConst*((tw>>FP_YYY.TBITS)+(v<<(BIG_XXX.BASEBITS-FP_YYY.TBITS))));
//		b.add(t);
		t.norm();
		return t;
	}
	
	if (FP_YYY.MODTYPE==FP_YYY.MONTGOMERY_FRIENDLY)
	{
		for (i=0;i<BIG_XXX.NLEN;i++)
			d.w[BIG_XXX.NLEN+i]+=d.muladd(d.w[i],ROM_FIELD_YYY.MConst-1,d.w[i],BIG_XXX.NLEN+i-1);
		for (i=0;i<BIG_XXX.NLEN;i++)
			b.w[i]=d.w[BIG_XXX.NLEN+i];
	}

	if (FP_YYY.MODTYPE==FP_YYY.GENERALISED_MERSENNE)
	{ // GoldiLocks Only
		var t=d.split(FP_YYY.MODBITS);
		b.hcopy(d);
		b.add(t);
		var dd=new DBIG_XXX(0);
		dd.hcopy(t);
		dd.shl(FP_YYY.MODBITS/2);

		var tt=dd.split(FP_YYY.MODBITS);
		var lo=new BIG_XXX();
		lo.hcopy(dd);

		b.add(tt);
		b.add(lo);
		//b.norm();
		tt.shl(FP_YYY.MODBITS/2);
		b.add(tt);

		var carry=b.w[BIG_XXX.NLEN-1]>>FP_YYY.TBITS;
		b.w[BIG_XXX.NLEN-1]&=FP_YYY.TMASK;
		b.w[0]+=carry;
			
		b.w[Math.floor(224/BIG_XXX.BASEBITS)]+=carry<<(224%BIG_XXX.BASEBITS);
	}

	if (FP_YYY.MODTYPE==FP_YYY.NOT_SPECIAL)
	{

		var m=new BIG_XXX(0);
		m.rcopy(ROM_FIELD_YYY.Modulus);

		b.copy(BIG_XXX.monty(m,ROM_FIELD_YYY.MConst,d));

	}
	b.norm();
	return b;
};
