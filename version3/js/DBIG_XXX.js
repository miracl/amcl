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

/* AMCL double length DBIG_XXX number class */ 

/* constructor */
var DBIG_XXX = function(x) {
	this.w=[]; 
	this.zero();
	this.w[0]=x;
};

DBIG_XXX.prototype={

/* set this=0 */
	zero: function()
	{
		for (var i=0;i<BIG_XXX.DNLEN;i++) this.w[i]=0;
		return this;
	},

/* set this=b */
	copy: function(b)
	{
		for (var i=0;i<BIG_XXX.DNLEN;i++) this.w[i]=b.w[i];
		return this;
	},


/* copy from BIG_XXX */
	hcopy: function(b)
	{
		var i;
		for (i=0;i<BIG_XXX.NLEN;i++) this.w[i]=b.w[i];
		for (i=BIG_XXX.NLEN;i<BIG_XXX.DNLEN;i++) this.w[i]=0;
		return this;
	},

	ucopy: function(b)
	{
		var i;
		for (i=0;i<BIG_XXX.NLEN;i++) this.w[i]=0;
		for (i=BIG_XXX.NLEN;i<BIG_XXX.DNLEN;i++) this.w[i]=b.w[i-BIG_XXX.NLEN];
		return this;
	},

/* normalise this */
	norm: function()
	{
		var d,carry=0;
		for (var i=0;i<BIG_XXX.DNLEN-1;i++)
		{
			d=this.w[i]+carry;
			this.w[i]=d&BIG_XXX.BMASK;
			carry=d>>BIG_XXX.BASEBITS;
		}
		this.w[BIG_XXX.DNLEN-1]=(this.w[BIG_XXX.DNLEN-1]+carry);
		return this;
	},

/* set this[i]+=x*y+c, and return high part */
	muladd: function(x,y,c,i)
	{
		var prod=x*y+c+this.w[i];
		this.w[i]=prod&BIG_XXX.BMASK;
		return ((prod-this.w[i])*BIG_XXX.MODINV);
	},

/* shift this right by k bits */
	shr: function(k) 
	{
		var i,n=k%BIG_XXX.BASEBITS;
		var m=Math.floor(k/BIG_XXX.BASEBITS);	
		for (i=0;i<BIG_XXX.DNLEN-m-1;i++)
			this.w[i]=(this.w[m+i]>>n)|((this.w[m+i+1]<<(BIG_XXX.BASEBITS-n))&BIG_XXX.BMASK);
		this.w[BIG_XXX.DNLEN-m-1]=this.w[BIG_XXX.DNLEN-1]>>n;
		for (i=BIG_XXX.DNLEN-m;i<BIG_XXX.DNLEN;i++) this.w[i]=0;
		return this;
	},

/* shift this left by k bits */
	shl: function(k) 
	{
		var i,n=k%BIG_XXX.BASEBITS;
		var m=Math.floor(k/BIG_XXX.BASEBITS);

		this.w[BIG_XXX.DNLEN-1]=((this.w[BIG_XXX.DNLEN-1-m]<<n))|(this.w[BIG_XXX.DNLEN-m-2]>>(BIG_XXX.BASEBITS-n));
		for (i=BIG_XXX.DNLEN-2;i>m;i--)
			this.w[i]=((this.w[i-m]<<n)&BIG_XXX.BMASK)|(this.w[i-m-1]>>(BIG_XXX.BASEBITS-n));
		this.w[m]=(this.w[0]<<n)&BIG_XXX.BMASK; 
		for (i=0;i<m;i++) this.w[i]=0;
		return this;
	},

/* Conditional move of BIG_XXX depending on d using XOR - no branches */
	cmove: function(b,d)
	{
		var i;
		var c=d;
		c=~(c-1);

		for (i=0;i<BIG_XXX.DNLEN;i++)
		{
			this.w[i]^=(this.w[i]^b.w[i])&c;
		}
	},


/* this+=x */
	add: function(x) 
	{
		for (var i=0;i<BIG_XXX.DNLEN;i++)
			this.w[i]+=x.w[i];	
	},

/* this-=x */
	sub: function(x) 
	{
		for (var i=0;i<BIG_XXX.DNLEN;i++)
			this.w[i]-=x.w[i];
	},

	rsub: function(x) 
	{
		for (var i=0;i<BIG_XXX.DNLEN;i++)
			this.w[i]=x.w[i]-this.w[i];
	},

/* return number of bits in this */
	nbits: function()
	{
		var bts,k=BIG_XXX.DNLEN-1;
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

		for (var i=len-1;i>=0;i--)
		{
			b=new DBIG_XXX(0);
			b.copy(this);
			b.shr(i*4);
			s+=(b.w[0]&15).toString(16);
		}
		return s;
	},

/* reduces this DBIG_XXX mod a BIG_XXX, and returns the BIG_XXX */
	mod: function(c)
	{
		var k=0;  
		this.norm();
		var m=new DBIG_XXX(0);
		var dr=new DBIG_XXX(0);
		m.hcopy(c);
		var r=new BIG_XXX(0);
		r.hcopy(this);

		if (DBIG_XXX.comp(this,m)<0) return r;

		do
		{
			m.shl(1);
			k++;
		}
		while (DBIG_XXX.comp(this,m)>=0);

		while (k>0)
		{
			m.shr(1);

			dr.copy(this);
			dr.sub(m);
			dr.norm();
			this.cmove(dr,(1-((dr.w[BIG_XXX.DNLEN-1]>>(BIG_XXX.CHUNK-1))&1)));

/*
			if (DBIG_XXX.comp(this,m)>=0)
			{
				this.sub(m);
				this.norm();
			} */
			k--;
		}

		r.hcopy(this);
		return r;
	},

/* this/=c */
	div: function(c)
	{
		var d=0;
		var k=0;
		var m=new DBIG_XXX(0); m.hcopy(c);
		var dr=new DBIG_XXX(0);
		var r=new BIG_XXX(0);
		var a=new BIG_XXX(0);
		var e=new BIG_XXX(1);
		this.norm();

		while (DBIG_XXX.comp(this,m)>=0)
		{
			e.fshl(1);
			m.shl(1);
			k++;
		}

		while (k>0)
		{
			m.shr(1);
			e.shr(1);

			dr.copy(this);
			dr.sub(m);
			dr.norm();
			d=(1-((dr.w[BIG_XXX.DNLEN-1]>>(BIG_XXX.CHUNK-1))&1));
			this.cmove(dr,d);
			r.copy(a);
			r.add(e);
			r.norm();
			a.cmove(r,d);  
/*
			if (DBIG_XXX.comp(this,m)>0)
			{
				a.add(e);
				a.norm();
				this.sub(m);
				this.norm();
			}  */
			k--;
		}
		return a;
	},

/* split this DBIG_XXX at position n, return higher half, keep lower half */
	split: function(n)
	{
		var t=new BIG_XXX(0);
		var nw,m=n%BIG_XXX.BASEBITS;
		var carry=this.w[BIG_XXX.DNLEN-1]<<(BIG_XXX.BASEBITS-m);

	
		for (var i=BIG_XXX.DNLEN-2;i>=BIG_XXX.NLEN-1;i--)
		{
			nw=(this.w[i]>>m)|carry;
			carry=(this.w[i]<<(BIG_XXX.BASEBITS-m))&BIG_XXX.BMASK;
			t.w[i-BIG_XXX.NLEN+1]=nw;
		}
		this.w[BIG_XXX.NLEN-1]&=((1<<m)-1);

		return t;
	}

};

/* Compare a and b, return 0 if a==b, -1 if a<b, +1 if a>b. Inputs must be normalised */
DBIG_XXX.comp=function(a,b)
{
	for (var i=BIG_XXX.DNLEN-1;i>=0;i--)
	{
		if (a.w[i]==b.w[i]) continue;
		if (a.w[i]>b.w[i]) return 1;
		else  return -1;
	}
	return 0;
};
