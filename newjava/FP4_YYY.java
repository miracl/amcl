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

/* Finite Field arithmetic  Fp^4 functions */

/* FP4 elements are of the form a+ib, where i is sqrt(-1+sqrt(-1))  */

package amcl;

public final class FP4_YYY {
	private final FP2_YYY a;
	private final FP2_YYY b;
/* reduce all components of this mod Modulus */
	public void reduce()
	{
		a.reduce();
		b.reduce();
	}
/* normalise all components of this mod Modulus */
	public void norm()
	{
		a.norm();
		b.norm();
	}
/* test this==0 ? */
	public boolean iszilch() {
		reduce();
		return (a.iszilch() && b.iszilch());
	}
/* test this==1 ? */
	public boolean isunity() {
		FP2_YYY one=new FP2_YYY(1);
		return (a.equals(one) && b.iszilch());
	}

/* test is w real? That is in a+ib test b is zero */
	public boolean isreal()
	{
		return b.iszilch();
	}
/* extract real part a */
	public FP2_YYY real()
	{
		return a;
	}

	public FP2_YYY geta()
	{
		return a;
	}
/* extract imaginary part b */
	public FP2_YYY getb()
	{
		return b;
	}
/* test this=x? */
	public boolean equals(FP4_YYY x)
	{
		return (a.equals(x.a) && b.equals(x.b));
	}
/* constructors */
	public FP4_YYY(int c)
	{
		a=new FP2_YYY(c);
		b=new FP2_YYY(0);
	}

	public FP4_YYY(FP4_YYY x)
	{
		a=new FP2_YYY(x.a);
		b=new FP2_YYY(x.b);
	}

	public FP4_YYY(FP2_YYY c,FP2_YYY d)
	{
		a=new FP2_YYY(c);
		b=new FP2_YYY(d);
	}

	public FP4_YYY(FP2_YYY c)
	{
		a=new FP2_YYY(c);
		b=new FP2_YYY(0);
	}
/* copy this=x */
	public void copy(FP4_YYY x)
	{
		a.copy(x.a);
		b.copy(x.b);
	}
/* set this=0 */
	public void zero()
	{
		a.zero();
		b.zero();
	}
/* set this=1 */
	public void one()
	{
		a.one();
		b.zero();
	}
/* set this=-this */
	public void neg()
	{
		FP2_YYY m=new FP2_YYY(a);
		FP2_YYY t=new FP2_YYY(0);
		m.add(b);
		m.neg();
		m.norm();
		t.copy(m); t.add(b);
		b.copy(m);
		b.add(a);
		a.copy(t);
	}
/* this=conjugate(this) */
	public void conj()
	{
		b.neg(); b.norm();
	}
/* this=-conjugate(this) */
	public void nconj()
	{
		a.neg(); a.norm();
	}
/* this+=x */
	public void add(FP4_YYY x)
	{
		a.add(x.a);
		b.add(x.b);
	}
/* this-=x */
	public void sub(FP4_YYY x)
	{
		FP4_YYY m=new FP4_YYY(x);
		m.neg();
		add(m);
	}

/* this*=s where s is FP2 */
	public void pmul(FP2_YYY s)
	{
		a.mul(s);
		b.mul(s);
	}
/* this*=c where c is int */
	public void imul(int c)
	{
		a.imul(c);
		b.imul(c);
	}
/* this*=this */	
	public void sqr()
	{
		norm();

		FP2_YYY t1=new FP2_YYY(a);
		FP2_YYY t2=new FP2_YYY(b);
		FP2_YYY t3=new FP2_YYY(a);

		t3.mul(b);
		t1.add(b);
		t2.mul_ip();

		t2.add(a);
		a.copy(t1);

		a.mul(t2);

		t2.copy(t3);
		t2.mul_ip();
		t2.add(t3);
		t2.neg();
		a.add(t2);

		b.copy(t3);
		b.add(t3);

		norm();
	}
/* this*=y */
	public void mul(FP4_YYY y)
	{
		norm();

		FP2_YYY t1=new FP2_YYY(a);
		FP2_YYY t2=new FP2_YYY(b);
		FP2_YYY t3=new FP2_YYY(0);
		FP2_YYY t4=new FP2_YYY(b);

		t1.mul(y.a);
		t2.mul(y.b);
		t3.copy(y.b);
		t3.add(y.a);
		t4.add(a);

		t4.mul(t3);
		t4.sub(t1);
		t4.norm();

		b.copy(t4);
		b.sub(t2);
		t2.mul_ip();
		a.copy(t2);
		a.add(t1);

		norm();
	}
/* convert this to hex string */
	public String toString() 
	{
		return ("["+a.toString()+","+b.toString()+"]");
	}

	public String toRawString() 
	{
		return ("["+a.toRawString()+","+b.toRawString()+"]");
	}

/* this=1/this */
	public void inverse()
	{
		norm();

		FP2_YYY t1=new FP2_YYY(a);
		FP2_YYY t2=new FP2_YYY(b);

		t1.sqr();
		t2.sqr();
		t2.mul_ip();
		t1.sub(t2);
		t1.inverse();
		a.mul(t1);
		t1.neg();
		b.mul(t1);
	}


/* this*=i where i = sqrt(-1+sqrt(-1)) */
	public void times_i()
	{
		norm();
		FP2_YYY s=new FP2_YYY(b);
		FP2_YYY t=new FP2_YYY(b);
		s.times_i();
		t.add(s);
		t.norm();
		b.copy(a);
		a.copy(t);
	}

/* this=this^p using Frobenius */
	public void frob(FP2_YYY f)
	{
		a.conj();
		b.conj();
		b.mul(f);
	}

/* this=this^e */
	public FP4_YYY pow(BIG_XXX e)
	{
		norm();
		e.norm();
		FP4_YYY w=new FP4_YYY(this);
		BIG_XXX z=new BIG_XXX(e);
		FP4_YYY r=new FP4_YYY(1);
		while (true)
		{
			int bt=z.parity();
			z.fshr(1);
			if (bt==1) r.mul(w);
			if (z.iszilch()) break;
			w.sqr();
		}
		r.reduce();
		return r;
	}
/* XTR xtr_a function */
	public void xtr_A(FP4_YYY w,FP4_YYY y,FP4_YYY z) 
	{
		FP4_YYY r=new FP4_YYY(w);
		FP4_YYY t=new FP4_YYY(w);
		r.sub(y);
		r.pmul(a);
		t.add(y);
		t.pmul(b);
		t.times_i();

		copy(r);
		add(t);
		add(z);

		norm();
	}

/* XTR xtr_d function */
	public void xtr_D() {
		FP4_YYY w=new FP4_YYY(this);
		sqr(); w.conj();
		w.add(w);
		sub(w);
		reduce();
	}

/* r=x^n using XTR method on traces of FP12s */
	public FP4_YYY xtr_pow(BIG_XXX n) {
		FP4_YYY a=new FP4_YYY(3);
		FP4_YYY b=new FP4_YYY(this);
		FP4_YYY c=new FP4_YYY(b);
		c.xtr_D();
		FP4_YYY t=new FP4_YYY(0);
		FP4_YYY r=new FP4_YYY(0);

		n.norm();
		int par=n.parity();
		BIG_XXX v=new BIG_XXX(n); v.fshr(1);
		if (par==0) {v.dec(1); v.norm();}

		int nb=v.nbits();
		for (int i=nb-1;i>=0;i--)
		{
			if (v.bit(i)!=1)
			{
				t.copy(b);
				conj();
				c.conj();
				b.xtr_A(a,this,c);
				conj();
				c.copy(t);
				c.xtr_D();
				a.xtr_D();
			}
			else
			{
				t.copy(a); t.conj();
				a.copy(b);
				a.xtr_D();
				b.xtr_A(c,this,t);
				c.xtr_D();
			}
		}
		if (par==0) r.copy(c);
		else r.copy(b);
		r.reduce();
		return r;
	}

/* r=ck^a.cl^n using XTR double exponentiation method on traces of FP12s. See Stam thesis. */
	public FP4_YYY xtr_pow2(FP4_YYY ck,FP4_YYY ckml,FP4_YYY ckm2l,BIG_XXX a,BIG_XXX b)
	{
		a.norm(); b.norm();
		BIG_XXX e=new BIG_XXX(a);
		BIG_XXX d=new BIG_XXX(b);
		BIG_XXX w=new BIG_XXX(0);

		FP4_YYY cu=new FP4_YYY(ck);  // can probably be passed in w/o copying
		FP4_YYY cv=new FP4_YYY(this);
		FP4_YYY cumv=new FP4_YYY(ckml);
		FP4_YYY cum2v=new FP4_YYY(ckm2l);
		FP4_YYY r=new FP4_YYY(0);
		FP4_YYY t=new FP4_YYY(0);

		int f2=0;
		while (d.parity()==0 && e.parity()==0)
		{
			d.fshr(1);
			e.fshr(1);
			f2++;
		}

		while (BIG_XXX.comp(d,e)!=0)
		{
			if (BIG_XXX.comp(d,e)>0)
			{
				w.copy(e); w.imul(4); w.norm();
				if (BIG_XXX.comp(d,w)<=0)
				{
					w.copy(d); d.copy(e);
					e.rsub(w); e.norm();

					t.copy(cv); 
					t.xtr_A(cu,cumv,cum2v);
					cum2v.copy(cumv); 
					cum2v.conj();
					cumv.copy(cv);
					cv.copy(cu);
					cu.copy(t);

				}
				else if (d.parity()==0)
				{
					d.fshr(1);
					r.copy(cum2v); r.conj();
					t.copy(cumv);
					t.xtr_A(cu,cv,r);
					cum2v.copy(cumv);
					cum2v.xtr_D();
					cumv.copy(t);
					cu.xtr_D();
				}
				else if (e.parity()==1)
				{
					d.sub(e); d.norm();
					d.fshr(1);
					t.copy(cv);
					t.xtr_A(cu,cumv,cum2v);
					cu.xtr_D();
					cum2v.copy(cv);
					cum2v.xtr_D();
					cum2v.conj();
					cv.copy(t);
				}
				else
				{
					w.copy(d);
					d.copy(e); d.fshr(1);
					e.copy(w);
					t.copy(cumv);
					t.xtr_D();
					cumv.copy(cum2v); cumv.conj();
					cum2v.copy(t); cum2v.conj();
					t.copy(cv);
					t.xtr_D();
					cv.copy(cu);
					cu.copy(t);
				}
			}
			if (BIG_XXX.comp(d,e)<0)
			{
				w.copy(d); w.imul(4); w.norm();
				if (BIG_XXX.comp(e,w)<=0)
				{
					e.sub(d); e.norm();
					t.copy(cv);
					t.xtr_A(cu,cumv,cum2v);
					cum2v.copy(cumv);
					cumv.copy(cu);
					cu.copy(t);
				}
				else if (e.parity()==0)
				{
					w.copy(d);
					d.copy(e); d.fshr(1);
					e.copy(w);
					t.copy(cumv);
					t.xtr_D();
					cumv.copy(cum2v); cumv.conj();
					cum2v.copy(t); cum2v.conj();
					t.copy(cv);
					t.xtr_D();
					cv.copy(cu);
					cu.copy(t);
				}
				else if (d.parity()==1)
				{
					w.copy(e);
					e.copy(d);
					w.sub(d); w.norm();
					d.copy(w); d.fshr(1);
					t.copy(cv);
					t.xtr_A(cu,cumv,cum2v);
					cumv.conj();
					cum2v.copy(cu);
					cum2v.xtr_D();
					cum2v.conj();
					cu.copy(cv);
					cu.xtr_D();
					cv.copy(t);
				}
				else
				{
					d.fshr(1);
					r.copy(cum2v); r.conj();
					t.copy(cumv);
					t.xtr_A(cu,cv,r);
					cum2v.copy(cumv);
					cum2v.xtr_D();
					cumv.copy(t);
					cu.xtr_D();
				}
			}
		}
		r.copy(cv);
		r.xtr_A(cu,cumv,cum2v);
		for (int i=0;i<f2;i++)
			r.xtr_D();
		r=r.xtr_pow(d);
		return r;
	}

/*
	public static void main(String[] args) {
		BIG_XXX m=new BIG(ROM_YYY.Modulus);
		BIG_XXX e=new BIG_XXX(12);
		BIG_XXX a=new BIG_XXX(0);
		BIG_XXX b=new BIG_XXX(0);
		
		a.inc(27); b.inc(45);

		FP2_YYY w0=new FP2_YYY(a,b);

		a.zero(); b.zero();
		a.inc(33); b.inc(54);

		FP2_YYY w1=new FP2_YYY(a,b);


		FP4_YYY w=new FP4_YYY(w0,w1);
		FP4_YYY t=new FP4_YYY(w);

		a=new BIG_XXX(ROM_ZZZ.CURVE_Fra);
		b=new BIG_XXX(ROM_ZZZ.CURVE_Frb);

		FP2_YYY f=new FP2_YYY(a,b);

		System.out.println("w= "+w.toString());

		w=w.pow(m);

		System.out.println("w^p= "+w.toString());

		t.frob(f);


		System.out.println("w^p= "+t.toString());

		w=w.pow(m);
		w=w.pow(m);
		w=w.pow(m);
		System.out.println("w^p4= "+w.toString());


	System.out.println("Test Inversion");

		w=new FP4_YYY(w0,w1);

		w.inverse();

		System.out.println("1/w mod p^4 = "+w.toString());

		w.inverse();

		System.out.println("1/(1/w) mod p^4 = "+w.toString());

		FP4_YYY ww=new FP4_YYY(w);

		w=w.xtr_pow(e);
		System.out.println("w^e= "+w.toString());


		a.zero(); b.zero();
		a.inc(37); b.inc(17);
		w0=new FP2_YYY(a,b);
		a.zero(); b.zero();
		a.inc(49); b.inc(31);
		w1=new FP2_YYY(a,b);

		FP4_YYY c1=new FP4_YYY(w0,w1);
		FP4_YYY c2=new FP4_YYY(w0,w1);
		FP4_YYY c3=new FP4_YYY(w0,w1);

		BIG_XXX e1=new BIG_XXX(3331);
		BIG_XXX e2=new BIG_XXX(3372);

		FP4_YYY cr=w.xtr_pow2(c1,c2,c3,e1,e2);

		System.out.println("c^e= "+cr.toString()); 
	} */
}
