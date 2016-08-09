/*
Copyright 2015 CertiVox UK Ltd

This file is part of The CertiVox MIRACL IOT Crypto SDK (MiotCL)

MiotCL is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

MiotCL is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with MiotCL.  If not, see <http://www.gnu.org/licenses/>.

You can be released from the requirements of the license by purchasing 
a commercial license.
*/

/* MiotCL double length DBIG number class */ 


package main

import "strconv"

type DBIG struct {
	w [2*NLEN]int64
}

func NewDBIG() *DBIG {
	b:=new(DBIG)
	for i:=0;i<DNLEN;i++ {
		b.w[i]=0
	}
	return b
}

func NewDBIGcopy(x *DBIG) *DBIG {
	b:=new(DBIG)
	for i:=0;i<DNLEN;i++ {
		b.w[i]=x.w[i]
	}
	return b
}

func NewDBIGscopy(x *BIG) *DBIG {
	b:=new(DBIG)
	for i:=0;i<NLEN-1;i++ {
		b.w[i]=x.w[i]
	}
	b.w[NLEN-1]=x.get(NLEN-1)&BMASK /* top word normalized */
	b.w[NLEN]=x.get(NLEN-1)>>BASEBITS

	for i:=NLEN+1;i<DNLEN;i++  {b.w[i]=0}
	return b
}

/* set this[i]+=x*y+c, and return high part */

func (r *DBIG) muladd(a int64,b int64,c int64,i int) int64 {
	x0:=a&HMASK
	x1:=(a>>HBITS)
	y0:=b&HMASK;
	y1:=(b>>HBITS)
	bot:=x0*y0
	top:=x1*y1
	mid:=x0*y1+x1*y0
	x0=mid&HMASK;
	x1=(mid>>HBITS)
	bot+=x0<<HBITS; bot+=c; bot+=r.w[i] 
	top+=x1;
	carry:=bot>>BASEBITS
	bot&=BMASK
	top+=carry
	r.w[i]=bot
	return top
}

/* normalise this */
func (r *DBIG) norm() {
	var carry int64=0
	for i:=0;i<DNLEN-1;i++ {
		d:=r.w[i]+carry
		r.w[i]=d&BMASK
		carry=d>>BASEBITS
	}
	r.w[DNLEN-1]=(r.w[DNLEN-1]+carry)
}

/* split DBIG at position n, return higher half, keep lower half */
func (r *DBIG) split(n uint) *BIG {
	t:=NewBIG()
	m:=n%BASEBITS;
	carry:=r.w[DNLEN-1]<<(BASEBITS-m)

	for i:=DNLEN-2;i>=NLEN-1;i-- {
		nw:=(r.w[i]>>m)|carry;
		carry=(r.w[i]<<(BASEBITS-m))&BMASK;
		t.set(i-NLEN+1,nw);
	}
	r.w[NLEN-1]&=((int64(1)<<m)-1)
	return t;
}

/* Compare a and b, return 0 if a==b, -1 if a<b, +1 if a>b. Inputs must be normalised */
func dcomp(a *DBIG,b *DBIG) int {
	for i:=DNLEN-1;i>=0;i-- {
		if a.w[i]==b.w[i] {continue}
		if a.w[i]>b.w[i] {
			return 1
		} else  {return -1}
	}
	return 0
}

func (r *DBIG) add(x *DBIG) {
	for i:=0;i<DNLEN;i++ {
		r.w[i]=r.w[i]+x.w[i] 
	}
}

/* this-=x */
func (r *DBIG) sub(x *DBIG) {
	for i:=0;i<DNLEN;i++ {
		r.w[i]=r.w[i]-x.w[i] 
	}
} 

/* general shift left */
func (r *DBIG) shl(k uint) {
	n:=k%BASEBITS
	m:=int(k/BASEBITS)

	r.w[DNLEN-1]=((r.w[DNLEN-1-m]<<n))|(r.w[DNLEN-m-2]>>(BASEBITS-n))
	for i:=DNLEN-2;i>m;i-- {
		r.w[i]=((r.w[i-m]<<n)&BMASK)|(r.w[i-m-1]>>(BASEBITS-n))
	}
	r.w[m]=(r.w[0]<<n)&BMASK; 
	for i:=0;i<m;i++ {r.w[i]=0}
}

/* general shift right */
func (r *DBIG) shr(k uint) {
	n:=(k%BASEBITS)
	m:=int(k/BASEBITS)	
	for i:=0;i<DNLEN-m-1;i++ {
		r.w[i]=(r.w[m+i]>>n)|((r.w[m+i+1]<<(BASEBITS-n))&BMASK)
	}
	r.w[DNLEN-m-1]=r.w[DNLEN-1]>>n;
	for i:=DNLEN-m;i<DNLEN;i++ {r.w[i]=0}
}

/* reduces this DBIG mod a BIG, and returns the BIG */
func (r *DBIG) mod(c *BIG) *BIG {
	r.norm()
	m:=NewDBIGscopy(c)

	if dcomp(r,m)<0 {
		return NewBIGdcopy(r)
	}

	m.shl(1);
	k:=1;
		
	for dcomp(r,m)>=0 {
		m.shl(1);
		k++;
	}

	for k>0 {
		m.shr(1);
		if dcomp(r,m)>=0 {
			r.sub(m);
			r.norm();
		}
		k--;
	}
	return NewBIGdcopy(r)
}

/* return this/c */
func (r *DBIG) div(c *BIG) *BIG {
	k:=0
	m:=NewDBIGscopy(c)
	a:=NewBIGint(0)
	e:=NewBIGint(1)
	r.norm()

	for dcomp(r,m)>=0 {
		e.fshl(1)
		m.shl(1)
		k++
	}

	for k>0 {
		m.shr(1)
		e.shr(1)
		if dcomp(r,m)>0 {
			a.add(e)
			a.norm()
			r.sub(m)
			r.norm()
		}
		k--
	}
	return a
}

/* Convert to Hex String */
func (r *DBIG) toString() string {
	s:=""
	len:=r.nbits()

	if len%4==0 {
		len/=4
	} else {
		len/=4 
		len++

	}

	for i:=len-1;i>=0;i-- {
		b:=NewDBIGcopy(r)
		
		b.shr(uint(i*4))
		s+=strconv.FormatInt(b.w[0]&15,16)
	}
	return s
}

/* return number of bits */
func (r *DBIG) nbits() int {
	k:=DNLEN-1
	r.norm()
	for (k>=0 && r.w[k]==0) {k--}
	if k<0 {return 0}
	bts:=int(BASEBITS)*k;
	c:=r.w[k];
	for c!=0 {c/=2; bts++}
	return bts
}

