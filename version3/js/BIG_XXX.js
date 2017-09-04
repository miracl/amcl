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

/* AMCL BIG_XXX number class */

/* General purpose Constructor */
var BIG_XXX = function(x) {
	this.w=new Array(BIG_XXX.NLEN);
	switch (typeof(x))
	{
	case "object":
		this.copy(x);
		break;
	case "number":
		this.zero();
		this.w[0]=x;
		break;
	default:
		this.zero();
	}
};

BIG_XXX.CHUNK= 32;
BIG_XXX.MODBYTES=  @NB@;
BIG_XXX.BASEBITS=  @BASE@;
BIG_XXX.NLEN=(1+(Math.floor((8*BIG_XXX.MODBYTES-1)/BIG_XXX.BASEBITS))); 
BIG_XXX.DNLEN=2*BIG_XXX.NLEN;
BIG_XXX.BMASK=(1<<BIG_XXX.BASEBITS)-1;
BIG_XXX.BIGBITS=(8*BIG_XXX.MODBYTES);
BIG_XXX.NEXCESS=(1<<(BIG_XXX.CHUNK-BIG_XXX.BASEBITS-1)); 
BIG_XXX.MODINV=(Math.pow(2,-BIG_XXX.BASEBITS));

BIG_XXX.prototype={
/* set to zero */
	zero: function()
	{
		for (var i=0;i<BIG_XXX.NLEN;i++) this.w[i]=0;
		return this;
	},
/* set to one */
	one: function()
	{
		this.w[0]=1;
		for (var i=1;i<BIG_XXX.NLEN;i++) this.w[i]=0;
		return this;
	},

	get: function(i)
	{
		return this.w[i];
	},

	set: function(i,x)
	{
		this.w[i]=x;
	},
/* test for zero */
	iszilch: function()
	{
		for (var i=0;i<BIG_XXX.NLEN;i++)
			if (this.w[i]!==0) return false;
		return true; 
	},
/* test for unity */
	isunity: function()
	{
		for (var i=1;i<BIG_XXX.NLEN;i++)
			if (this.w[i]!==0) return false;
		if (this.w[0]!=1) return false;
		return true;
	},

/* Conditional swap of two BIG_XXXs depending on d using XOR - no branches */
	cswap: function(b,d)
	{
		var i;
		var t,c=d;
		c=~(c-1);

		for (i=0;i<BIG_XXX.NLEN;i++)
		{
			t=c&(this.w[i]^b.w[i]);
			this.w[i]^=t;
			b.w[i]^=t;
		}
	},

/* Conditional move of BIG_XXX depending on d using XOR - no branches */
	cmove: function(b,d)
	{
		var i;
		var c=d;
		c=~(c-1);

		for (i=0;i<BIG_XXX.NLEN;i++)
		{
			this.w[i]^=(this.w[i]^b.w[i])&c;
		}
	},

/* copy from another BIG_XXX */
	copy: function(y)
	{
		for (var i=0;i<BIG_XXX.NLEN;i++)
			this.w[i]=y.w[i];
		return this;
	},
/* copy from bottom half of DBIG_XXX */
	hcopy: function(y)
	{
		for (var i=0;i<BIG_XXX.NLEN;i++)
			this.w[i]=y.w[i];
		return this;
	},
/* copy from ROM */
	rcopy: function(y)
	{
		for (var i=0;i<BIG_XXX.NLEN;i++)
			this.w[i]=y[i];
		return this;
	},

	xortop: function(x)
	{
		this.w[BIG_XXX.NLEN-1]^=x;
	},

	ortop: function(x)
	{
		this.w[BIG_XXX.NLEN-1]|=x;
	},

/* normalise BIG_XXX - force all digits < 2^BASEBITS */
	norm: function()
	{
		var d,carry=0;
		for (var i=0;i<BIG_XXX.NLEN-1;i++)
		{
			d=this.w[i]+carry;
			this.w[i]=d&BIG_XXX.BMASK;
			carry=d>>BIG_XXX.BASEBITS;
		}
		this.w[BIG_XXX.NLEN-1]=(this.w[BIG_XXX.NLEN-1]+carry);

		return (this.w[BIG_XXX.NLEN-1]>>((8*BIG_XXX.MODBYTES)%BIG_XXX.BASEBITS));  

	},
/* quick shift right by less than a word */
	fshr: function(k)
	{
		var r=this.w[0]&((1<<k)-1); /* shifted out part */
		for (var i=0;i<BIG_XXX.NLEN-1;i++)
			this.w[i]=(this.w[i]>>k)|((this.w[i+1]<<(BIG_XXX.BASEBITS-k))&BIG_XXX.BMASK);
		this.w[BIG_XXX.NLEN-1]=this.w[BIG_XXX.NLEN-1]>>k;
		return r;
	},
/* General shift right by k bits */
	shr: function(k)
	{
		var n=k%BIG_XXX.BASEBITS;
		var m=Math.floor(k/BIG_XXX.BASEBITS);	
		for (var i=0;i<BIG_XXX.NLEN-m-1;i++)
			this.w[i]=(this.w[m+i]>>n)|((this.w[m+i+1]<<(BIG_XXX.BASEBITS-n))&BIG_XXX.BMASK);
		this.w[BIG_XXX.NLEN-m-1]=this.w[BIG_XXX.NLEN-1]>>n;
		for (i=BIG_XXX.NLEN-m;i<BIG_XXX.NLEN;i++) this.w[i]=0;
		return this;
	},
/* quick shift left by less than a word */
	fshl: function(k)
	{
		this.w[BIG_XXX.NLEN-1]=((this.w[BIG_XXX.NLEN-1]<<k))|(this.w[BIG_XXX.NLEN-2]>>(BIG_XXX.BASEBITS-k));
		for (var i=BIG_XXX.NLEN-2;i>0;i--)
			this.w[i]=((this.w[i]<<k)&BIG_XXX.BMASK)|(this.w[i-1]>>(BIG_XXX.BASEBITS-k));
		this.w[0]=(this.w[0]<<k)&BIG_XXX.BMASK; 

		return (this.w[BIG_XXX.NLEN-1]>>((8*BIG_XXX.MODBYTES)%BIG_XXX.BASEBITS)); /* return excess - only used in FF.java */
	},
/* General shift left by k bits */
	shl: function(k)
	{
		var i,n=k%BIG_XXX.BASEBITS;
		var m=Math.floor(k/BIG_XXX.BASEBITS);

		this.w[BIG_XXX.NLEN-1]=(this.w[BIG_XXX.NLEN-1-m]<<n);
		if (BIG_XXX.NLEN>m+2) this.w[BIG_XXX.NLEN-1]|=(this.w[BIG_XXX.NLEN-m-2]>>(BIG_XXX.BASEBITS-n));
		for (i=BIG_XXX.NLEN-2;i>m;i--)
			this.w[i]=((this.w[i-m]<<n)&BIG_XXX.BMASK)|(this.w[i-m-1]>>(BIG_XXX.BASEBITS-n));
		this.w[m]=(this.w[0]<<n)&BIG_XXX.BMASK; 
		for (i=0;i<m;i++) this.w[i]=0;
		return this;
	},
/* return length in bits */
	nbits: function()
	{
		var bts,k=BIG_XXX.NLEN-1;
		var c;
		this.norm();
		while (k>=0 && this.w[k]===0) k--;
		if (k<0) return 0;
		bts=BIG_XXX.BASEBITS*k;
		c=this.w[k];
		while (c!==0) {c=Math.floor(c/2); bts++;}
		return bts;
	},
/* convert this to string */
	toString: function()
	{
		var b;
		var s="";
		var len=this.nbits();
		if (len%4===0) len=Math.floor(len/4);
		else {len=Math.floor(len/4); len++;}
		if (len<BIG_XXX.MODBYTES*2) len=BIG_XXX.MODBYTES*2;
		for (var i=len-1;i>=0;i--)
		{
			b=new BIG_XXX(0);
			b.copy(this);
			b.shr(i*4);
			s+=(b.w[0]&15).toString(16);
		}
		return s;
	},
/* this+=y */
	add: function(y)
	{
		for (var i=0;i<BIG_XXX.NLEN;i++) this.w[i]+=y.w[i];
		return this;
	},
/* return this+x */
	plus: function(x) 
	{
		var s=new BIG_XXX(0);
		for (var i=0;i<BIG_XXX.NLEN;i++)
			s.w[i]=this.w[i]+x.w[i];	
		return s;
	},
/* this+=i, where i is int */
	inc: function(i)
	{
		this.norm();
		this.w[0]+=i;
		return this;
	},
/* this-=y */
	sub: function(y)
	{
		for (var i=0;i<BIG_XXX.NLEN;i++) this.w[i]-=y.w[i];
		return this;
	},

/* reverse subtract this=x-this */
	rsub: function(x) 
	{
		for (var i=0;i<BIG_XXX.NLEN;i++)
			this.w[i]=x.w[i]-this.w[i];
		return this;
	},
/* this-=i, where i is int */
	dec: function(i)
	{
		this.norm();
		this.w[0]-=i;
		return this;
	},
/* return this-x */
	minus: function(x) {
		var d=new BIG_XXX(0);
		for (var i=0;i<BIG_XXX.NLEN;i++)
			d.w[i]=this.w[i]-x.w[i];
		return d;
	},
/* multiply by small integer */
	imul: function(c)
	{
		for (var i=0;i<BIG_XXX.NLEN;i++) this.w[i]*=c;
		return this;
	},
/* convert this BIG_XXX to byte array */
	tobytearray: function(b,n)
	{
		this.norm();
		var c=new BIG_XXX(0);
		c.copy(this);

		for (var i=BIG_XXX.MODBYTES-1;i>=0;i--)
		{
			b[i+n]=c.w[0]&0xff;
			c.fshr(8);
		}
		return this;
	},
/* convert this to byte array */
	toBytes: function(b)
	{
		this.tobytearray(b,0);
	},

/* set this[i]+=x*y+c, and return high part */
	muladd: function(x,y,c,i)
	{
		var prod=x*y+c+this.w[i];
		this.w[i]=prod&BIG_XXX.BMASK;
		return ((prod-this.w[i])*BIG_XXX.MODINV);
	},
/* multiply by larger int */
	pmul: function(c)
	{
		var ak,carry=0;
	//	this.norm();
		for (var i=0;i<BIG_XXX.NLEN;i++)
		{
			ak=this.w[i];
			this.w[i]=0;
			carry=this.muladd(ak,c,carry,i);
		}
		return carry;
	},
/* multiply by still larger int - results requires a DBIG_XXX */
	pxmul: function(c)
	{
		var m=new DBIG_XXX(0);	
		var carry=0;
		for (var j=0;j<BIG_XXX.NLEN;j++)
			carry=m.muladd(this.w[j],c,carry,j);
		m.w[BIG_XXX.NLEN]=carry;		
		return m;
	},
/* divide by 3 */
	div3: function()
	{	
		var ak,base,carry=0;
		this.norm();
		base=(1<<BIG_XXX.BASEBITS);
		for (var i=BIG_XXX.NLEN-1;i>=0;i--)
		{
			ak=(carry*base+this.w[i]);
			this.w[i]=Math.floor(ak/3);
			carry=ak%3;
		}
		return carry;
	},

/* set x = x mod 2^m */
	mod2m: function(m)
	{
		var i,wd,bt;
		var msk;
		wd=Math.floor(m/BIG_XXX.BASEBITS);
		bt=m%BIG_XXX.BASEBITS;
		msk=(1<<bt)-1;
		this.w[wd]&=msk;
		for (i=wd+1;i<BIG_XXX.NLEN;i++) this.w[i]=0;
	},

/* a=1/a mod 2^256. This is very fast! */
	invmod2m: function()
	{
		var U=new BIG_XXX(0);
		var b=new BIG_XXX(0);
		var c=new BIG_XXX(0);

		U.inc(BIG_XXX.invmod256(this.lastbits(8)));

		for (var i=8;i<BIG_XXX.BIGBITS;i<<=1)
		{
			U.norm();
			b.copy(this); b.mod2m(i);
			var t1=BIG_XXX.smul(U,b); t1.shr(i);
			c.copy(this); c.shr(i); c.mod2m(i);

			var t2=BIG_XXX.smul(U,c); t2.mod2m(i);
			t1.add(t2);
			t1.norm();
			b=BIG_XXX.smul(t1,U); t1.copy(b);
			t1.mod2m(i);

			t2.one(); t2.shl(i); t1.rsub(t2); t1.norm();
			t1.shl(i);
			U.add(t1);
		}
		U.mod2m(BIG_XXX.BIGBITS);
		this.copy(U);
		this.norm();
	},

/* reduce this mod m */
	mod: function(m)
	{
		var k=0;  
		var r=new BIG_XXX(0);

		this.norm();
		if (BIG_XXX.comp(this,m)<0) return;
		do
		{
			m.fshl(1);
			k++;
		} while (BIG_XXX.comp(this,m)>=0);

		while (k>0)
		{
			m.fshr(1);

			r.copy(this);
			r.sub(m);
			r.norm();
			this.cmove(r,(1-((r.w[BIG_XXX.NLEN-1]>>(BIG_XXX.CHUNK-1))&1)));

/*
			if (BIG_XXX.comp(this,m)>=0)
			{
				this.sub(m);
				this.norm();
			} */
			k--;
		}
	},
/* this/=m */
	div: function(m)
	{
		var k=0;
		var d=0;
		this.norm();
		var e=new BIG_XXX(1);
		var b=new BIG_XXX(0);
		var r=new BIG_XXX(0);
		b.copy(this);
		this.zero();

		while (BIG_XXX.comp(b,m)>=0)
		{
			e.fshl(1);
			m.fshl(1);
			k++;
		}

		while (k>0)
		{
			m.fshr(1);
			e.fshr(1);

			r.copy(b);
			r.sub(m);
			r.norm();
			d=(1-((r.w[BIG_XXX.NLEN-1]>>(BIG_XXX.CHUNK-1))&1));
			b.cmove(r,d);
			r.copy(this);
			r.add(e);
			r.norm();
			this.cmove(r,d); 

/*
			if (BIG_XXX.comp(b,m)>=0)
			{
				this.add(e);
				this.norm();
				b.sub(m);
				b.norm();
			} */


			k--;
		}
	},
/* return parity of this */
	parity: function()
	{
		return this.w[0]%2;
	},
/* return n-th bit of this */
	bit: function(n)
	{
		if ((this.w[Math.floor(n/BIG_XXX.BASEBITS)]&(1<<(n%BIG_XXX.BASEBITS)))>0) return 1;
		else return 0;
	},
/* return last n bits of this */
	lastbits: function(n)
	{
		var msk=(1<<n)-1;
		this.norm();
		return (this.w[0])&msk;
	},

	isok: function()
	{
		var ok=true;
		for (var i=0;i<BIG_XXX.NLEN;i++)
		{
			if ((this.w[i]>>BIG_XXX.BASEBITS)!=0) ok=false;
		}
		return ok;
	},


/* Jacobi Symbol (this/p). Returns 0, 1 or -1 */
	jacobi: function(p)
	{
		var n8,k,m=0;
		var t=new BIG_XXX(0);
		var x=new BIG_XXX(0);
		var n=new BIG_XXX(0);
		var zilch=new BIG_XXX(0);
		var one=new BIG_XXX(1);
		if (p.parity()===0 || BIG_XXX.comp(this,zilch)===0 || BIG_XXX.comp(p,one)<=0) return 0;
		this.norm();
		x.copy(this);
		n.copy(p);
		x.mod(p);

		while (BIG_XXX.comp(n,one)>0)
		{
			if (BIG_XXX.comp(x,zilch)===0) return 0;
			n8=n.lastbits(3);
			k=0;
			while (x.parity()===0)
			{
				k++;
				x.shr(1);
			}
			if (k%2==1) m+=(n8*n8-1)/8;
			m+=(n8-1)*(x.lastbits(2)-1)/4;
			t.copy(n);
			t.mod(x);
			n.copy(x);
			x.copy(t);
			m%=2;

		}
		if (m===0) return 1;
		else return -1;
	},
/* this=1/this mod p. Binary method */
	invmodp: function(p)
	{
		this.mod(p);
		var u=new BIG_XXX(0);
		u.copy(this);
		var v=new BIG_XXX(0);
		v.copy(p);
		var x1=new BIG_XXX(1);
		var x2=new BIG_XXX(0);
		var t=new BIG_XXX(0);
		var one=new BIG_XXX(1);

		while (BIG_XXX.comp(u,one)!==0 && BIG_XXX.comp(v,one)!==0)
		{
			while (u.parity()===0)
			{
				u.shr(1);
				if (x1.parity()!==0)
				{
					x1.add(p);
					x1.norm();
				}
				x1.shr(1);
			}
			while (v.parity()===0)
			{
				v.shr(1);
				if (x2.parity()!==0)
				{
					x2.add(p);
					x2.norm();
				}
				x2.shr(1);
			}
			if (BIG_XXX.comp(u,v)>=0)
			{
				u.sub(v);
				u.norm();
				if (BIG_XXX.comp(x1,x2)>=0) x1.sub(x2);
				else
				{
					t.copy(p);
					t.sub(x2);
					x1.add(t);
				}
				x1.norm();
			}
			else
			{
				v.sub(u);
				v.norm();
				if (BIG_XXX.comp(x2,x1)>=0) x2.sub(x1);
				else
				{
					t.copy(p);
					t.sub(x1);
					x2.add(t);
				}
				x2.norm();
			}
		}
		if (BIG_XXX.comp(u,one)===0) this.copy(x1);
		else this.copy(x2);
	},
/* return this^e mod m */
	powmod:function(e,m)
	{
		var bt;
		this.norm();
		e.norm();
		var a=new BIG_XXX(1);
		var z=new BIG_XXX(0);
		z.copy(e);
		var s=new BIG_XXX(0);
		s.copy(this);
		var i=0;
		while (true)
		{
			i++;
			bt=z.parity();
			z.fshr(1);
			if (bt==1) a=BIG_XXX.modmul(a,s,m);

			if (z.iszilch()) break;
			s=BIG_XXX.modsqr(s,m);
		}
		return a;
	}

};
/* convert from byte array to BIG_XXX */
BIG_XXX.frombytearray=function(b,n)
{
	var m=new BIG_XXX(0);

	for (var i=0;i<BIG_XXX.MODBYTES;i++)
	{
		m.fshl(8); m.w[0]+=b[i+n]&0xff;
		//m.inc(b[i]&0xff);
	}
	return m; 
};

BIG_XXX.fromBytes=function(b)
{
	return BIG_XXX.frombytearray(b,0);
};

/* return a*b where product fits a BIG_XXX */
BIG_XXX.smul=function(a,b)
{
	var carry;
	var c=new BIG_XXX(0);
	for (var i=0;i<BIG_XXX.NLEN;i++)
	{
		carry=0;
		for (var j=0;j<BIG_XXX.NLEN;j++)
			if (i+j<BIG_XXX.NLEN) carry=c.muladd(a.w[i],b.w[j],carry,i+j);
	}
	return c;
};
/* Compare a and b, return 0 if a==b, -1 if a<b, +1 if a>b. Inputs must be normalised */
BIG_XXX.comp=function(a,b)
{
	for (var i=BIG_XXX.NLEN-1;i>=0;i--)
	{
		if (a.w[i]==b.w[i]) continue;
		if (a.w[i]>b.w[i]) return 1;
		else  return -1;
	}
	return 0;
};

/* get 8*MODBYTES size random number */
BIG_XXX.random=function(rng)
{
	var m=new BIG_XXX(0);
	var i,b,j=0,r=0;

/* generate random BIG_XXX */ 
	for (i=0;i<8*BIG_XXX.MODBYTES;i++)   
	{
		if (j===0) r=rng.getByte();
		else r>>=1;

		b=r&1;
		m.shl(1); m.w[0]+=b;// m.inc(b);
		j++; j&=7; 
	}
	return m;
};

/* Create random BIG_XXX in portable way, one bit at a time */
BIG_XXX.randomnum=function(q,rng)
{
	var d=new DBIG_XXX(0);
	var i,b,j=0,r=0;
	for (i=0;i<2*q.nbits();i++)
	{
		if (j===0) r=rng.getByte();
		else r>>=1;

		b=r&1;
		d.shl(1); d.w[0]+=b; 
		j++; j&=7;
	}

	var m=d.mod(q);

	return m;
};

/* return NAF value as +/- 1, 3 or 5. x and x3 should be normed. 
nbs is number of bits processed, and nzs is number of trailing 0s detected */
/*
BIG_XXX.nafbits=function(x,x3,i)
{
	var n=[];
	var nb=x3.bit(i)-x.bit(i);
	var j;
	n[1]=1;
	n[0]=0;
	if (nb===0) {n[0]=0; return n;}
	if (i===0) {n[0]=nb; return n;}
	if (nb>0) n[0]=1;
	else      n[0]=(-1);

	for (j=i-1;j>0;j--)
	{
		n[1]++;
		n[0]*=2;
		nb=x3.bit(j)-x.bit(j);
		if (nb>0) n[0]+=1;
		if (nb<0) n[0]-=1;
		if (n[0]>5 || n[0]<-5) break;
	}

	if (n[0]%2!==0 && j!==0)
	{ // backtrack 
		if (nb>0) n[0]=(n[0]-1)/2;
		if (nb<0) n[0]=(n[0]+1)/2;
		n[1]--;
	}
	while (n[0]%2===0)
	{ // remove trailing zeros 
		n[0]/=2;
		n[2]++;
		n[1]--;
	}
	return n;
};
*/
/* return a*b as DBIG_XXX */
BIG_XXX.mul=function(a,b)
{
	var n,c=new DBIG_XXX(0);
//	a.norm();
//	b.norm();

		var d=[];
		var s,t;

//if (!a.isok()) alert("Problem in mul a");
//if (!b.isok()) alert("Problem in mul b");

		for (var i=0;i<BIG_XXX.NLEN;i++)
			d[i]=a.w[i]*b.w[i];

		s=d[0];
		t=s; c.w[0]=t;

		for (var k=1;k<BIG_XXX.NLEN;k++)
		{
			s+=d[k]; t=s; for (i=k;i>=1+Math.floor(k/2);i--) t+=(a.w[i]-a.w[k-i])*(b.w[k-i]-b.w[i]); c.w[k]=t;
		}
		for (var k=BIG_XXX.NLEN;k<2*BIG_XXX.NLEN-1;k++)
		{
			s-=d[k-BIG_XXX.NLEN]; t=s; for (i=BIG_XXX.NLEN-1;i>=1+Math.floor(k/2);i--) t+=(a.w[i]-a.w[k-i])*(b.w[k-i]-b.w[i]); c.w[k]=t; 
		}

		var co=0;
		for (var i=0;i<BIG_XXX.DNLEN-1;i++)
		{
			n=c.w[i]+co;
			c.w[i]=n&BIG_XXX.BMASK;
			co=(n-c.w[i])*BIG_XXX.MODINV;
		}
		c.w[BIG_XXX.DNLEN-1]=co;		


/*
	for (var j=0;j<BIG_XXX.NLEN;j++)
	{
		t=0; for (var i=0;i<=j;i++) t+=a.w[j-i]*b.w[i];
		c.w[j]=t;
	}
	for (var j=BIG_XXX.NLEN;j<BIG_XXX.DNLEN-2;j++)
	{
		t=0; for (var i=j-BIG_XXX.NLEN+1;i<BIG_XXX.NLEN;i++) t+=a.w[j-i]*b.w[i];
		c.w[j]=t; 
	}
	t=a.w[BIG_XXX.NLEN-1]*b.w[BIG_XXX.NLEN-1];
	c.w[BIG_XXX.DNLEN-2]=t;
	var co=0;
	for (var i=0;i<BIG_XXX.DNLEN-1;i++)
	{
		n=c.w[i]+co;
		c.w[i]=n&BIG_XXX.BMASK;
		co=(n-c.w[i])*BIG_XXX.MODINV;
	}
	c.w[BIG_XXX.DNLEN-1]=co;
*/
	return c;
};

/* return a^2 as DBIG_XXX */
BIG_XXX.sqr=function(a)
{
	var n,c=new DBIG_XXX(0);
//	a.norm();

//if (!a.isok()) alert("Problem in sqr");

	c.w[0]=a.w[0]*a.w[0];

	for (var j=1;j<BIG_XXX.NLEN-1; )
	{
		t=a.w[j]*a.w[0]; for (var i=1; i<(j+1)>>1; i++) {t+=a.w[j-i]*a.w[i];} t+=t;   
		c.w[j]=t; j++;
		t=a.w[j]*a.w[0]; for (i=1; i<(j+1)>>1; i++) {t+=a.w[j-i]*a.w[i];} t+=t; t+=a.w[j>>1]*a.w[j>>1]; 
		c.w[j]=t; j++;
	}

	for (var j=BIG_XXX.NLEN-1+BIG_XXX.NLEN%2;j<BIG_XXX.DNLEN-3; )
	{
		t=a.w[BIG_XXX.NLEN-1]*a.w[j-BIG_XXX.NLEN+1]; for (var i=j-BIG_XXX.NLEN+2; i<(j+1)>>1; i++) {t+=a.w[j-i]*a.w[i];} t+=t;  
		c.w[j]=t; j++;
		t=a.w[BIG_XXX.NLEN-1]*a.w[j-BIG_XXX.NLEN+1]; for (var i=j-BIG_XXX.NLEN+2; i<(j+1)>>1; i++) {t+=a.w[j-i]*a.w[i];} t+=t; t+=a.w[j>>1]*a.w[j>>1]; 
		c.w[j]=t; j++;
	}

	t=a.w[BIG_XXX.NLEN-2]*a.w[BIG_XXX.NLEN-1];
	t+=t; 
	c.w[BIG_XXX.DNLEN-3]=t;
	
	t=a.w[BIG_XXX.NLEN-1]*a.w[BIG_XXX.NLEN-1]; 
	c.w[BIG_XXX.DNLEN-2]=t;

	var co=0;
	for (var i=0;i<BIG_XXX.DNLEN-1;i++)
	{
		n=c.w[i]+co;
		c.w[i]=n&BIG_XXX.BMASK;
		co=(n-c.w[i])*BIG_XXX.MODINV;
	}
	c.w[BIG_XXX.DNLEN-1]=co;

	return c;
};

BIG_XXX.monty=function(m,nd,d)
{
	var b=new BIG_XXX(0);
	var v=[];
	var dd=[];
	var s,c,t;

	t=d.w[0]; v[0]=((t&BIG_XXX.BMASK)*nd)&BIG_XXX.BMASK; t+=v[0]*m.w[0]; 
	c=d.w[1]+(t*BIG_XXX.MODINV); s=0;

	for (var k=1;k<BIG_XXX.NLEN;k++)
	{
		t=c+s+v[0]*m.w[k];
		for (i=k-1;i>Math.floor(k/2);i--) t+=(v[k-i]-v[i])*(m.w[i]-m.w[k-i]);
		v[k]=((t&BIG_XXX.BMASK)*nd)&BIG_XXX.BMASK; t+=v[k]*m.w[0]; 
		c=(t*BIG_XXX.MODINV)+d.w[k+1];

		dd[k]=v[k]*m.w[k]; s+=dd[k];
	}
	for (var k=BIG_XXX.NLEN;k<2*BIG_XXX.NLEN-1;k++)
	{
		t=c+s;
		for (i=BIG_XXX.NLEN-1;i>=1+Math.floor(k/2);i--) t+=(v[k-i]-v[i])*(m.w[i]-m.w[k-i]);
		b.w[k-BIG_XXX.NLEN]=t&BIG_XXX.BMASK; 
		c=((t-b.w[k-BIG_XXX.NLEN])*BIG_XXX.MODINV)+d.w[k+1]; 

		s-=dd[k-BIG_XXX.NLEN+1];
	}
	b.w[BIG_XXX.NLEN-1]=c&BIG_XXX.BMASK;	
	return b;
}



/* return a*b mod m */
BIG_XXX.modmul=function(a,b,m)
{
	a.mod(m);
	b.mod(m);
	var d=BIG_XXX.mul(a,b);
	return d.mod(m);
};

/* return a^2 mod m */
BIG_XXX.modsqr=function(a,m)
{
	a.mod(m);
	var d=BIG_XXX.sqr(a);
	return d.mod(m);
};

/* return -a mod m */
BIG_XXX.modneg=function(a,m)
{
	a.mod(m);
	return m.minus(a);
};

/* Arazi and Qi inversion mod 256 */
BIG_XXX.invmod256=function(a)
{
	var U,t1,t2,b,c;
	t1=0;
	c=(a>>1)&1;  
	t1+=c;
	t1&=1;
	t1=2-t1;
	t1<<=1;
	U=t1+1;

// i=2
	b=a&3;
	t1=U*b; t1>>=2;
	c=(a>>2)&3;
	t2=(U*c)&3;
	t1+=t2;
	t1*=U; t1&=3;
	t1=4-t1;
	t1<<=2;
	U+=t1;

// i=4
	b=a&15;
	t1=U*b; t1>>=4;
	c=(a>>4)&15;
	t2=(U*c)&15;
	t1+=t2;
	t1*=U; t1&=15;
	t1=16-t1;
	t1<<=4;
	U+=t1;

	return U;
};
