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
/* CLINT mod p functions */

package XXX

//import "fmt"

const NOT_SPECIAL int=0
const PSEUDO_MERSENNE int=1
const MONTGOMERY_FRIENDLY int=2
const GENERALISED_MERSENNE int=3

const MODBITS uint=@NBT@ /* Number of bits in Modulus */
const MOD8 uint=@M8@  /* Modulus mod 8 */
const MODTYPE int=@MT@ //NOT_SPECIAL

const FEXCESS Chunk=(Chunk(1)<<(BASEBITS*uint(NLEN)-MODBITS))
const OMASK Chunk= ((Chunk(-1))<<(MODBITS%BASEBITS))
const TBITS uint=MODBITS%BASEBITS // Number of active bits in top word 
const TMASK Chunk=(Chunk(1)<<TBITS)-1

/* calculate Field Excess */
func EXCESS(a *BIG) Chunk {
	return ((a.w[NLEN-1]&OMASK)>>(MODBITS%BASEBITS))
}

/***************** Start 64-bit specific code ****************/

func pexceed(a *BIG,b *BIG) bool {
	ea:=EXCESS(a)
	eb:=EXCESS(b)
	if (ea+1)>FEXCESS/(eb+1) {return true}
	return false
}

func sexceed(a *BIG) bool {
	ea:=EXCESS(a)
	if (ea+1)>FEXCESS/(ea+1) {return true}
	return false
}


/***************** End 64-bit specific code ****************/

type FP struct {
	x *BIG
}

/* Constructors */
func NewFPint(a int) *FP {
	F:=new(FP)
	F.x=NewBIGint(a)
	F.nres()
	return F
}

func NewFPbig(a *BIG) *FP {
	F:=new(FP)
	F.x=NewBIGcopy(a)
	F.nres()
	return F
}

func NewFPcopy(a *FP) *FP {
	F:=new(FP)
	F.x=NewBIGcopy(a.x)
	return F
}

func (F *FP) toString() string {
	return F.redc().toString()
}

/* convert to Montgomery n-residue form */
func (F *FP) nres() {
	if MODTYPE!=PSEUDO_MERSENNE && MODTYPE!=GENERALISED_MERSENNE {
		p:=NewBIGints(Modulus);
		d:=NewDBIGscopy(F.x)
		d.shl(uint(NLEN)*BASEBITS)
		F.x.copy(d.mod(p))
	}
}

/* convert back to regular form */
func (F *FP) redc() *BIG {
	if MODTYPE!=PSEUDO_MERSENNE && MODTYPE!=GENERALISED_MERSENNE {
		d:=NewDBIGscopy(F.x)
		return mod(d)
	} else {
		r:=NewBIGcopy(F.x)
		return r
	}
}

/* reduce a DBIG to a BIG using the appropriate form of the modulus */

func mod(d *DBIG) *BIG {
	if MODTYPE==PSEUDO_MERSENNE {
		t:=d.split(MODBITS)
		b:=NewBIGdcopy(d)

		v:=t.pmul(int(MConst))
		tw:=t.w[NLEN-1]
		t.w[NLEN-1]&=TMASK
		t.w[0]+=(MConst*((tw>>TBITS)+(v<<(BASEBITS-TBITS))))

		b.add(t)
		b.norm()
		return b		
	}
	if MODTYPE==MONTGOMERY_FRIENDLY {
		for i:=0;i<NLEN;i++ {
			top,bot:=muladd(d.w[i],MConst-1,d.w[i],d.w[NLEN+i-1])
			d.w[NLEN+i-1]=bot
			d.w[NLEN+i]+=top
		}
		b:=NewBIG()

		for i:=0;i<NLEN;i++ {
			b.w[i]=d.w[NLEN+i]
		}
		b.norm()
		return b		
	}

	if MODTYPE==GENERALISED_MERSENNE { // GoldiLocks only
		t:=d.split(MODBITS)
		b:=NewBIGdcopy(d)
		b.add(t);
		dd:=NewDBIGscopy(t)
		dd.shl(MODBITS/2)

		tt:=dd.split(MODBITS)
		lo:=NewBIGdcopy(dd)
		b.add(tt)
		b.add(lo)
		b.norm()
		tt.shl(MODBITS/2)
		b.add(tt)

		carry:=b.w[NLEN-1]>>TBITS
		b.w[NLEN-1]&=TMASK
		b.w[0]+=carry
			
		b.w[224/BASEBITS]+=carry<<(224%BASEBITS);
		b.norm()
		return b		
	}

	if MODTYPE==NOT_SPECIAL {
		md:=NewBIGints(Modulus)
		return monty(md,MConst,d) 
	}
	return NewBIG()
}


/* reduce this mod Modulus */
func (F *FP) reduce() {
	p:=NewBIGints(Modulus)
	F.x.mod(p)
}

/* test this=0? */
func (F *FP) iszilch() bool {
	F.reduce()
	return F.x.iszilch()
}

/* copy from FP b */
func (F *FP) copy(b *FP ) {
	F.x.copy(b.x)
}

/* set this=0 */
func (F *FP) zero() {
	F.x.zero()
}
	
/* set this=1 */
func (F *FP) one() {
	F.x.one(); F.nres()
}

/* normalise this */
func (F *FP) norm() {
	F.x.norm();
}

/* swap FPs depending on d */
func (F *FP) cswap(b *FP,d int) {
	F.x.cswap(b.x,d);
}

/* copy FPs depending on d */
func (F *FP) cmove(b *FP,d int) {
	F.x.cmove(b.x,d)
}

/* this*=b mod Modulus */
func (F *FP) mul(b *FP) {

	F.norm()
	b.norm()
	if pexceed(F.x,b.x) {F.reduce()}
	d:=mul(F.x,b.x)
	F.x.copy(mod(d))
}

/* this = -this mod Modulus */
func (F *FP) neg() {
	p:=NewBIGints(Modulus)
	m:=NewBIGcopy(p)
	F.norm()
	sb:=logb2(uint32(EXCESS(F.x)))

//	ov:=EXCESS(F.x); 
//	sb:=uint(1); for ov!=0 {sb++;ov>>=1} 

	m.fshl(sb)
	F.x.rsub(m)		

	if EXCESS(F.x)>=FEXCESS {F.reduce()}
}


/* this*=c mod Modulus, where c is a small int */
func (F *FP) imul(c int) {
	F.norm()
	s:=false
	if (c<0) {
		c=-c
		s=true
	}
	afx:=(EXCESS(F.x)+1)*(Chunk(c)+1)+1;
	if (c<NEXCESS && afx<FEXCESS) {
		F.x.imul(c);
	} else {
		if (afx<FEXCESS) {
			F.x.pmul(c)
		} else {
			p:=NewBIGints(Modulus);
			d:=F.x.pxmul(c)
			F.x.copy(d.mod(p))
		}
	}
	if s {F.neg()}
	F.norm()
}

/* this*=this mod Modulus */
func (F *FP) sqr() {
	F.norm();
	if sexceed(F.x) {F.reduce()}
	d:=sqr(F.x)	
	F.x.copy(mod(d))
}

/* this+=b */
func (F *FP) add(b *FP) {
	F.x.add(b.x)
	if (EXCESS(F.x)+2>=FEXCESS) {F.reduce()}
}

/* this-=b */
func (F *FP) sub(b *FP) {
	n:=NewFPcopy(b)
	n.neg()
	F.add(n)
}

/* this/=2 mod Modulus */
func (F *FP) div2() {
	F.x.norm()
	if (F.x.parity()==0) {
		F.x.fshr(1)
	} else {
		p:=NewBIGints(Modulus);
		F.x.add(p)
		F.x.norm()
		F.x.fshr(1)
	}
}

/* this=1/this mod Modulus */
func (F *FP) inverse() {
	p:=NewBIGints(Modulus);
	r:=F.redc()
	r.invmodp(p)
	F.x.copy(r)
	F.nres()
}

/* return TRUE if this==a */
func (F *FP) equals(a *FP) bool {
	a.reduce()
	F.reduce()
	if (comp(a.x,F.x)==0) {return true}
	return false
}

/* return this^e mod Modulus */
func (F *FP) pow(e *BIG) *FP {
	r:=NewFPint(1)
	e.norm()
	F.x.norm()
	m:=NewFPcopy(F)
	for true {
		bt:=e.parity();
		e.fshr(1);
		if bt==1 {r.mul(m)}
		if e.iszilch() {break}
		m.sqr();
	}
	p:=NewBIGints(Modulus);
	r.x.mod(p);
	return r;
}

/* return sqrt(this) mod Modulus */
func (F *FP) sqrt() *FP {
	F.reduce();
	p:=NewBIGints(Modulus);
	b:=NewBIGcopy(p)
	if MOD8==5 {
		b.dec(5); b.norm(); b.shr(3)
		i:=NewFPcopy(F); i.x.shl(1)
		v:=i.pow(b)
		i.mul(v); i.mul(v)
		i.x.dec(1)
		r:=NewFPcopy(F)
		r.mul(v); r.mul(i) 
		r.reduce()
		return r
	} else {
		b.inc(1); b.norm(); b.shr(2)
		return F.pow(b);
	}
}

/* return jacobi symbol (this/Modulus) */
func (F *FP) jacobi() int {
	w:=F.redc();
	p:=NewBIGints(Modulus);
	return w.jacobi(p)
}
