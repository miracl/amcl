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

/* AMCL double length DBIG number class */ 

package amcl;

public class DBIG_XXX {
	protected int[] w=new int[BIG_XXX.DNLEN];

/* normalise this */
	public void norm() {
		int d,carry=0;
		for (int i=0;i<BIG_XXX.DNLEN-1;i++)
		{
			d=w[i]+carry;
			carry=d>>BIG_XXX.BASEBITS;
			w[i]=d&BIG_XXX.BMASK;
		}
		w[BIG_XXX.DNLEN-1]=(w[BIG_XXX.DNLEN-1]+carry);
	}


/*
	public String toRawString()
	{
		DBIG_XXX b=new DBIG_XXX(this);
		String s="(";
		for (int i=0;i<BIG_XXX.DNLEN-1;i++)
		{
			s+=Integer.toHexString(b.w[i]); s+=",";
		}
		s+=Integer.toHexString(b.w[BIG_XXX.DNLEN-1]); s+=")";
		return s;
	}
*/


/****************************************************************************/


/* return number of bits in this */
	public int nbits() {
		int bts,k=BIG_XXX.DNLEN-1;
		long c;
		norm();
		while (w[k]==0 && k>=0) k--;
		if (k<0) return 0;
		bts=BIG_XXX.BASEBITS*k;
		c=w[k];
		while (c!=0) {c/=2; bts++;}
		return bts;
	}

/* convert this to string */
	public String toString() {
		DBIG_XXX b;
		String s="";
		int len=nbits();
		if (len%4==0) len>>=2; //len/=4;
		else {len>>=2; len++;}

		for (int i=len-1;i>=0;i--)
		{
			b=new DBIG_XXX(this);
			b.shr(i*4);
			s+=Integer.toHexString((int)(b.w[0]&15));
		}
		return s;
	}

	public void cmove(DBIG_XXX g,int d)
	{
		int i;
	//	int b=-d;

		for (i=0;i<BIG_XXX.DNLEN;i++)
		{
			w[i]^=(w[i]^g.w[i])&BIG_XXX.cast_to_chunk(-d);
		}
	}

/* Constructors */
	public DBIG_XXX(int x)
	{
		w[0]=x;
		for (int i=1;i<BIG_XXX.DNLEN;i++)
			w[i]=0;
	}

	public DBIG_XXX(DBIG_XXX x)
	{
		for (int i=0;i<BIG_XXX.DNLEN;i++)
			w[i]=x.w[i];
	}

	public DBIG_XXX(BIG_XXX x)
	{
		for (int i=0;i<BIG_XXX.NLEN-1;i++)
			w[i]=x.w[i];//get(i);

		w[BIG_XXX.NLEN-1]=x.w[(BIG_XXX.NLEN-1)]&BIG_XXX.BMASK; /* top word normalized */
		w[BIG_XXX.NLEN]=(x.w[(BIG_XXX.NLEN-1)]>>BIG_XXX.BASEBITS);

		for (int i=BIG_XXX.NLEN+1;i<BIG_XXX.DNLEN;i++) w[i]=0;
	}

/* split DBIG at position n, return higher half, keep lower half */
	public BIG_XXX split(int n)
	{
		BIG_XXX t=new BIG_XXX(0);
		int nw,m=n%BIG_XXX.BASEBITS;
		int carry=w[BIG_XXX.DNLEN-1]<<(BIG_XXX.BASEBITS-m);

		for (int i=BIG_XXX.DNLEN-2;i>=BIG_XXX.NLEN-1;i--)
		{
			nw=(w[i]>>m)|carry;
			carry=(w[i]<<(BIG_XXX.BASEBITS-m))&BIG_XXX.BMASK;
			t.w[i-BIG_XXX.NLEN+1]=nw;
		//	t.set(i-BIG.NLEN+1,nw);
		}
		w[BIG_XXX.NLEN-1]&=(((int)1<<m)-1);
		return t;
	}

/* Copy from another DBIG */
	public void copy(DBIG_XXX x)
	{
		for (int i=0;i<BIG_XXX.DNLEN;i++)
			w[i]=x.w[i];
	}

/* test this=0? */
	public boolean iszilch() {
		for (int i=0;i<BIG_XXX.DNLEN;i++)
			if (w[i]!=0) return false;
		return true; 
	}

/* shift this right by k bits */
	public void shr(int k) {
		int n=k%BIG_XXX.BASEBITS;
		int m=k/BIG_XXX.BASEBITS;	
		for (int i=0;i<BIG_XXX.DNLEN-m-1;i++)
			w[i]=(w[m+i]>>n)|((w[m+i+1]<<(BIG_XXX.BASEBITS-n))&BIG_XXX.BMASK);
		w[BIG_XXX.DNLEN-m-1]=w[BIG_XXX.DNLEN-1]>>n;
		for (int i=BIG_XXX.DNLEN-m;i<BIG_XXX.DNLEN;i++) w[i]=0;
	}

/* shift this left by k bits */
	public void shl(int k) {
		int n=k%BIG_XXX.BASEBITS;
		int m=k/BIG_XXX.BASEBITS;

		w[BIG_XXX.DNLEN-1]=((w[BIG_XXX.DNLEN-1-m]<<n))|(w[BIG_XXX.DNLEN-m-2]>>(BIG_XXX.BASEBITS-n));
		for (int i=BIG_XXX.DNLEN-2;i>m;i--)
			w[i]=((w[i-m]<<n)&BIG_XXX.BMASK)|(w[i-m-1]>>(BIG_XXX.BASEBITS-n));
		w[m]=(w[0]<<n)&BIG_XXX.BMASK; 
		for (int i=0;i<m;i++) w[i]=0;
	}

/* this+=x */
	public void add(DBIG_XXX x) {
		for (int i=0;i<BIG_XXX.DNLEN;i++)
			w[i]+=x.w[i];	
	}

/* this-=x */
	public void sub(DBIG_XXX x) {
		for (int i=0;i<BIG_XXX.DNLEN;i++)
			w[i]-=x.w[i];
	}

/* Compare a and b, return 0 if a==b, -1 if a<b, +1 if a>b. Inputs must be normalised */
	public static int comp(DBIG_XXX a,DBIG_XXX b)
	{
		for (int i=BIG_XXX.DNLEN-1;i>=0;i--)
		{
			if (a.w[i]==b.w[i]) continue;
			if (a.w[i]>b.w[i]) return 1;
			else  return -1;
		}
		return 0;
	}

/* reduces this DBIG mod a BIG, and returns the BIG */
	public BIG_XXX mod(BIG_XXX c)
	{
		int k=0;  
		norm();
		DBIG_XXX m=new DBIG_XXX(c);
		DBIG_XXX r=new DBIG_XXX(0);

		if (comp(this,m)<0) return new BIG_XXX(this);
		
		do
		{
			m.shl(1);
			k++;
		}
		while (comp(this,m)>=0);

		while (k>0)
		{
			m.shr(1);

			r.copy(this);
			r.sub(m);
			r.norm();
			cmove(r,(int)(1-((r.w[BIG_XXX.DNLEN-1]>>(BIG_XXX.CHUNK-1))&1)));
/*
			if (comp(this,m)>=0)
			{
				sub(m);
				norm();
			}
*/
			k--;
		}
		return new BIG_XXX(this);
	}

/* reduces this DBIG mod a DBIG in place */
/*	public void mod(DBIG_XXX m)
	{
		int k=0;
		if (comp(this,m)<0) return;

		do
		{
			m.shl(1);
			k++;
		}
		while (comp(this,m)>=0);

		while (k>0)
		{
			m.shr(1);
			if (comp(this,m)>=0)
			{
				sub(m);
				norm();
			}
			k--;
		}
		return;

	}*/

/* return this/c */
	public BIG_XXX div(BIG_XXX c)
	{
		int d,k=0;
		DBIG_XXX m=new DBIG_XXX(c);
		DBIG_XXX dr=new DBIG_XXX(0);
		BIG_XXX r=new BIG_XXX(0);
		BIG_XXX a=new BIG_XXX(0);
		BIG_XXX e=new BIG_XXX(1);
		norm();

		while (comp(this,m)>=0)
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
			d=(int)(1-((dr.w[BIG_XXX.DNLEN-1]>>(BIG_XXX.CHUNK-1))&1));
			cmove(dr,d);
			r.copy(a);
			r.add(e);
			r.norm();
			a.cmove(r,d);
/*
			if (comp(this,m)>0)
			{
				a.add(e);
				a.norm();
				sub(m);
				norm();
			} */
			k--;
		}
		return a;
	}
}
