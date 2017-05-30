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

package amcl.XXX;

public final class FP {

	public static final int NOT_SPECIAL=0;
	public static final int PSEUDO_MERSENNE=1;
	public static final int MONTGOMERY_FRIENDLY=2;
	public static final int GENERALISED_MERSENNE=3;

	public static final int MODBITS=@NBT@; /* Number of bits in Modulus */
	public static final int MOD8=@M8@;  /* Modulus mod 8 */
	public static final int MODTYPE=@MT@;

	public static final int FEXCESS =((int)1<<(BIG.BASEBITS*BIG.NLEN-MODBITS)); 
	public static final int OMASK=(int)(-1)<<(MODBITS%BIG.BASEBITS);
	public static final int TBITS=MODBITS%BIG.BASEBITS; // Number of active bits in top word 
	public static final int TMASK=((int)1<<TBITS)-1;


	public final BIG x;
	public static BIG p=new BIG(ROM.Modulus);

/**************** 32-bit specific ************************/

/* calculate Field Excess */
	public static int EXCESS(BIG a)
	{
		return ((a.w[BIG.NLEN-1]&OMASK)>>(MODBITS%BIG.BASEBITS));
	}

/* Check if product causes excess */
	public static boolean pexceed(int ea,int eb)
	{
	//	int ea,eb;
	//	ea=EXCESS(a);
	//	eb=EXCESS(b);
		if ((long)(ea+1)*(eb+1)>FEXCESS) return true;
		return false;
	}

/* Check if square causes excess */
	public static boolean sexceed(int ea)
	{
	//	int ea,eb;
	//	ea=EXCESS(a);
		if ((long)(ea+1)*(ea+1)>FEXCESS) return true;
		return false;
	}

/* reduce a DBIG to a BIG using the appropriate form of the modulus */
	public static BIG mod(DBIG d)
	{
		if (MODTYPE==PSEUDO_MERSENNE)
		{
			BIG b;
			int v,tw;
			BIG t=d.split(MODBITS);
			b=new BIG(d);

			v=t.pmul((int)ROM.MConst);

	t.add(b);
	t.norm();

			tw=t.w[BIG.NLEN-1];
			t.w[BIG.NLEN-1]&=TMASK;
			t.w[0]+=(ROM.MConst*((tw>>TBITS)+(v<<(BIG.BASEBITS-TBITS))));

//			b.add(t);    // out
//			b.norm();    // out
//			return b;    // out
	t.norm();
	return t;

		}
		if (MODTYPE==MONTGOMERY_FRIENDLY)
		{
			BIG b;
			int[] cr=new int[2];				
			for (int i=0;i<BIG.NLEN;i++)
			{
				cr=BIG.muladd(d.w[i],ROM.MConst-1,d.w[i],d.w[BIG.NLEN+i-1]);
				d.w[BIG.NLEN+i]+=cr[0];
				d.w[BIG.NLEN+i-1]=cr[1];	
			}
			
			b=new BIG(0);
			for (int i=0;i<BIG.NLEN;i++ )
				b.w[i]=d.w[BIG.NLEN+i];
			b.norm();
			return b;
		}
		if (MODTYPE==GENERALISED_MERSENNE)
		{ // GoldiLocks Only
			BIG b;
			BIG t=d.split(MODBITS);
			b=new BIG(d);
			b.add(t);
			DBIG dd=new DBIG(t);
			dd.shl(MODBITS/2);

			BIG tt=dd.split(MODBITS);
			BIG lo=new BIG(dd);
			b.add(tt);
			b.add(lo);
			b.norm();
			tt.shl(MODBITS/2);
			b.add(tt);

			int carry=b.w[BIG.NLEN-1]>>TBITS;
			b.w[BIG.NLEN-1]&=TMASK;
			b.w[0]+=carry;
			
			b.w[224/BIG.BASEBITS]+=carry<<(224%BIG.BASEBITS);
			b.norm();
			return b;
		}
		if (MODTYPE==NOT_SPECIAL)
		{
			BIG m=new BIG(ROM.Modulus);
			return BIG.monty(m,ROM.MConst,d);
		}

		return new BIG(0);
	}

/*********************************************************/


/* Constructors */
	public FP(int a)
	{
		x=new BIG(a);
		nres();
	}

	public FP()
	{
		x=new BIG(0);
	}

	public FP(BIG a)
	{
		x=new BIG(a);
		nres();
	}
	
	public FP(FP a)
	{
		x=new BIG(a.x);
	}

/* convert to string */
	public String toString() 
	{
		String s=redc().toString();
		return s;
	}

	public String toRawString() 
	{
		String s=x.toRawString();
		return s;
	}

/* convert to Montgomery n-residue form */
	public void nres()
	{
		if (MODTYPE!=PSEUDO_MERSENNE && MODTYPE!=GENERALISED_MERSENNE)
		{
			DBIG d=new DBIG(x);
			d.shl(BIG.NLEN*BIG.BASEBITS);
			x.copy(d.mod(p));
		}
	}

/* convert back to regular form */
	public BIG redc()
	{
		if (MODTYPE!=PSEUDO_MERSENNE && MODTYPE!=GENERALISED_MERSENNE)
		{
			DBIG d=new DBIG(x);
			return mod(d);
		}
		else 
		{
			BIG r=new BIG(x);
			return r;
		}
	}

/* test this=0? */
	public boolean iszilch() {
		reduce();
		return x.iszilch();
	}

/* copy from FP b */
	public void copy(FP b)
	{
		x.copy(b.x);
	}

/* set this=0 */
	public void zero()
	{
		x.zero();
	}
	
/* set this=1 */
	public void one()
	{
		x.one(); nres();
	}

/* normalise this */
	public void norm()
	{
		x.norm();
	}

/* swap FPs depending on d */
	public void cswap(FP b,int d)
	{
		x.cswap(b.x,d);
	}

/* copy FPs depending on d */
	public void cmove(FP b,int d)
	{
		x.cmove(b.x,d);
	}

/* this*=b mod Modulus */
	public void mul(FP b)
	{
//		norm();
//		b.norm();

		if (pexceed(EXCESS(x),EXCESS(b.x))) reduce();

		DBIG d=BIG.mul(x,b.x);
		x.copy(mod(d));
	}

/* this*=c mod Modulus, where c is a small int */
	public void imul(int c)
	{
//		norm();
		boolean s=false;
		if (c<0)
		{
			c=-c;
			s=true;
		}
		if (c<=BIG.NEXCESS && ((EXCESS(x)+1)*(c+1)+1)<FEXCESS)
		{
			x.imul(c);
			x.norm();
		}
		else
		{
			if (((EXCESS(x)+1)*(c+1)+1)<FEXCESS) x.pmul(c);
			else
			{
				DBIG d=x.pxmul(c);
				x.copy(d.mod(p));
			}
		}
		if (s) {neg(); norm();}
	}

/* this*=this mod Modulus */
	public void sqr()
	{
		DBIG d;
//		norm();

		if (sexceed(EXCESS(x))) reduce();

		d=BIG.sqr(x);	
		x.copy(mod(d));
	}

/* this+=b */
	public void add(FP b) {
		x.add(b.x);
		if (EXCESS(x)+2>=FEXCESS) reduce();
	}

// https://graphics.stanford.edu/~seander/bithacks.html
// constant time log to base 2 (or number of bits in)

	private static int logb2(int v)
	{
		int r;
		v |= v >>> 1;
		v |= v >>> 2;
		v |= v >>> 4;
		v |= v >>> 8;
		v |= v >>> 16;

		v = v - ((v >>> 1) & 0x55555555);                  
		v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);  
		r = ((v + (v >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24; 
		return r+1;
	}

/* this = -this mod Modulus */
	public void neg()
	{
		int sb;
		BIG m=new BIG(p);

//		norm();
		sb=logb2((int)EXCESS(x)+1);
/*
		ov=EXCESS(x); 
		sb=1; while(ov!=0) {sb++;ov>>=1;} 
*/
		m.fshl(sb);
		x.rsub(m);		

		if (EXCESS(x)>=FEXCESS) reduce();
	}

/* this-=b */
	public void sub(FP b)
	{
		FP n=new FP(b);
		n.neg();
//	n.norm();
		this.add(n);
	}

/* this/=2 mod Modulus */
	public void div2()
	{
//		x.norm();
		if (x.parity()==0)
			x.fshr(1);
		else
		{
			x.add(p);
			x.norm();
			x.fshr(1);
		}
	}

/* this=1/this mod Modulus */
	public void inverse()
	{
		BIG r=redc();
		r.invmodp(p);
		x.copy(r);
		nres();
	}

/* return TRUE if this==a */
	public boolean equals(FP a)
	{
		a.reduce();
		reduce();
		if (BIG.comp(a.x,x)==0) return true;
		return false;
	}

/* reduce this mod Modulus */
	public void reduce()
	{
		x.mod(p);
	}

/* return this^e mod Modulus */
	public FP pow(BIG e)
	{
		int bt;
		FP r=new FP(1);
		e.norm();
		x.norm();
		FP m=new FP(this);
		while (true)
		{
			bt=e.parity();
			e.fshr(1);
			if (bt==1) r.mul(m);
			if (e.iszilch()) break;
			m.sqr();
		}
		r.x.mod(p);
		return r;
	}

/* return sqrt(this) mod Modulus */
	public FP sqrt()
	{
		reduce();
		BIG b=new BIG(p);
		if (MOD8==5)
		{
			b.dec(5); b.norm(); b.shr(3);
			FP i=new FP(this); i.x.shl(1);
			FP v=i.pow(b);
			i.mul(v); i.mul(v);
			i.x.dec(1);
			FP r=new FP(this);
			r.mul(v); r.mul(i); 
			r.reduce();
			return r;
		}
		else
		{
			b.inc(1); b.norm(); b.shr(2);
			return pow(b);
		}
	}

/* return jacobi symbol (this/Modulus) */
	public int jacobi()
	{
		BIG w=redc();
		return w.jacobi(p);
	}
/*
	public static void main(String[] args) {
		BIG m=new BIG(ROM.Modulus);
		BIG x=new BIG(3);
		BIG e=new BIG(m);
		e.dec(1);

		System.out.println("m= "+m.nbits());	


		BIG r=x.powmod(e,m);

		System.out.println("m= "+m.toString());	
		System.out.println("r= "+r.toString());	

		BIG.cswap(m,r,0);

		System.out.println("m= "+m.toString());	
		System.out.println("r= "+r.toString());	

//		FP y=new FP(3);
//		FP s=y.pow(e);
//		System.out.println("s= "+s.toString());	

	} */
}
