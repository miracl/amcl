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

use rom;

#[derive(Copy, Clone)]
pub struct BIG {
 	pub w: [i32; rom::NLEN]
}

//mod dbig;

use dbig::DBIG;
use rand::RAND;

impl BIG {

   pub fn new() -> BIG {
        BIG {
        	w: [0; rom::NLEN]
         }
    }

    pub fn new_int(x:i32) -> BIG {
    	let mut s= BIG::new();
    	s.w[0]=x;
    	return s;
    }

    pub fn new_ints(a:&[i32]) -> BIG {
    	let mut s= BIG::new();
    	for i in 0..rom::NLEN {s.w[i]=a[i]}
    	return s;
    }

    pub fn new_copy(y:&BIG) -> BIG {
    	let mut s= BIG::new();   
    	for i in 0..rom::NLEN {s.w[i]=y.w[i]}
    	return s;	
    }

    pub fn new_big(y:&BIG) -> BIG {
        let mut s= BIG::new();   
        for i in 0..rom::NLEN {s.w[i]=y.w[i]}
        return s;   
    }

    pub fn new_dcopy(y:&DBIG) -> BIG {
    	let mut s= BIG::new();   
    	for i in 0..rom::NLEN {s.w[i]=y.w[i]}
    	return s;	
    } 

	pub fn get(&self,i:usize) -> i32 {
		return self.w[i]; 
	}

	pub fn set(&mut self,i:usize,x:i32) {
		self.w[i]=x;	
	}

	pub fn xortop(&mut self,x:i32) {
		self.w[rom::NLEN-1]^=x;
	}

	pub fn ortop(&mut self,x:i32) {
		self.w[rom::NLEN-1]|=x;
	}

/* test for zero */
	pub fn iszilch(&self) -> bool {
		for i in 0 ..rom::NLEN {
			if self.w[i]!=0 {return false}
		}
		return true; 
	}

/* set to zero */
	pub fn zero(&mut self) {
		for i in 0 ..rom::NLEN {
			self.w[i]=0
		}
	}

/* Test for equal to one */
	pub fn isunity(&self) -> bool {
		for i in 0 ..rom::NLEN {
			if self.w[i]!=0 {return false}
		}
		if self.w[0]!=1 {return false}
		return true;
	}

/* set to one */
	pub fn one(&mut self) {
		self.w[0]=1;
		for i in 1 ..rom::NLEN {
			self.w[i]=0;
		}
	}

/* Copy from another BIG */
	pub fn copy(&mut self,x: &BIG) {
		for i in 0 ..rom::NLEN {
			self.w[i]=x.w[i]
		}
	}

    pub fn dcopy(&mut self,x: &DBIG)
    {
        for i in 0 ..rom::NLEN {self.w[i] = x.w[i]}
    }

/* calculate Field Excess */
	pub fn excess(a:&BIG) ->i32 {
		return (a.w[rom::NLEN-1]&rom::OMASK)>>(rom::MODBITS%rom::BASEBITS)
	}

/* normalise BIG - force all digits < 2^rom::BASEBITS */
    pub fn norm(&mut self) -> i32
    {
        let mut carry:i32=0;
        for i in 0 ..rom::NLEN-1 {
            let d=self.w[i]+carry;
            self.w[i]=d&rom::BMASK;
            carry=d>>rom::BASEBITS;
        }
        self.w[rom::NLEN-1]+=carry;
        return self.w[rom::NLEN-1]>>((8*rom::MODBYTES)%rom::BASEBITS);
    }

/* Conditional swap of two bigs depending on d using XOR - no branches */
	pub fn cswap(&mut self,b: &mut BIG,d: i32) {
		let mut c=d;
		c=!(c-1);
		for i in 0 ..rom::NLEN {
			let t=c&(self.w[i]^b.w[i]);
			self.w[i]^=t;
			b.w[i]^=t;
		}
	}

	pub fn cmove(&mut self,g:&BIG,d: i32) {
		let b=-d;
		for i in 0 ..rom::NLEN {
			self.w[i]^=(self.w[i]^g.w[i])&b;
		}
	}

/* Shift right by less than a word */
	pub fn fshr(&mut self, k: usize) -> i32 {
		let n:i32 = k as i32;
		let w=self.w[0]&((1<<n)-1); /* shifted out part */
		for i in 0 ..rom::NLEN-1 {
			self.w[i]=(self.w[i]>>k)|((self.w[i+1]<<(rom::BASEBITS-n))&rom::BMASK);
		}
		self.w[rom::NLEN-1]=self.w[rom::NLEN-1]>>k;
		return w;
	}

 /* general shift right */
	pub fn shr(&mut self,k:usize) {
		let n:i32 =(k as i32)%rom::BASEBITS;
		let m:usize =((k as i32)/rom::BASEBITS) as usize;
		for i in 0 ..rom::NLEN-m-1 {
			self.w[i]=(self.w[m+i]>>n)|((self.w[m+i+1]<<(rom::BASEBITS-n))&rom::BMASK)
		}
		self.w[rom::NLEN-m-1]=self.w[rom::NLEN-1]>>n;
		for i in rom::NLEN-m ..rom::NLEN 
			{self.w[i]=0}
	}	

/* Shift right by less than a word */
	pub fn fshl(&mut self,k:usize) -> i32 {
		let n:i32 = k as i32;
		self.w[rom::NLEN-1]=((self.w[rom::NLEN-1]<<n))|(self.w[rom::NLEN-2]>>(rom::BASEBITS-n));
		for i in (1 ..rom::NLEN-1).rev() {
			self.w[i]=((self.w[i]<<k)&rom::BMASK)|(self.w[i-1]>>(rom::BASEBITS-n));
		}
		self.w[0]=(self.w[0]<<n)&rom::BMASK;
		return self.w[rom::NLEN-1]>>((8*rom::MODBYTES)%rom::BASEBITS) /* return excess - only used in ff.c */
	}

/* general shift left */
	pub fn shl(&mut self,k: usize) {
		let n:i32=(k as i32)%rom::BASEBITS;
		let m:usize=((k as i32)/rom::BASEBITS) as usize;

		self.w[rom::NLEN-1]=self.w[rom::NLEN-1-m]<<n;
		if rom::NLEN>=m+2 {self.w[rom::NLEN-1]|=self.w[rom::NLEN-m-2]>>(rom::BASEBITS-n)}
		for i in (m+1 ..rom::NLEN-1).rev() {
			self.w[i]=((self.w[i-m]<<n)&rom::BMASK)|(self.w[i-m-1]>>(rom::BASEBITS-n));
		}
		self.w[m]=(self.w[0]<<n)&rom::BMASK; 
		for i in 0 ..m {self.w[i]=0}
	}

/* return number of bits */
	pub fn nbits(&mut self) -> usize {
		let mut k=rom::NLEN-1;
		self.norm();
		while (k as isize)>=0 && self.w[k]==0 {k=k-1}
		if (k as isize) <0 {return 0}
		let mut bts=(rom::BASEBITS as usize)*k;
		let mut c=self.w[k];
		while c!=0 {c/=2; bts+=1;}
		return bts;
	}

/* Convert to Hex String */
	pub fn tostring(&mut self) -> String {
		let mut s = String::new();
		let mut len=self.nbits();

		if len%4==0 {
			len/=4;
		} else {
			len/=4;
			len+=1;
		}
		let mb=(rom::MODBYTES*2) as usize;
		if len<mb {len=mb}

		for i in (0 ..len).rev() {
			let mut b=BIG::new_copy(&self);
			b.shr(i*4);
			s=s + &format!("{:X}", b.w[0]&15);
		}
		return s;
	}	

    pub fn add(&mut self,r:&BIG) {
		for i in 0 ..rom::NLEN {
			self.w[i]+=r.w[i] 
		}
	}

    pub fn dbl(&mut self) {
        for i in 0 ..rom::NLEN {
            self.w[i]+=self.w[i]
        }        
    }

/* return this+x */
	pub fn plus(&self,x: &BIG) -> BIG {
		let mut s=BIG::new();
		for i in 0 ..rom::NLEN {
			s.w[i]=self.w[i]+x.w[i];
		}
		return s;
	}

    pub fn inc(&mut self,x:i32) {
    	self.norm();
    	self.w[0]+=x;
    }

/* return self-x */
	pub fn minus(&self,x:& BIG) -> BIG {
		let mut d=BIG::new();
		for i in 0 ..rom::NLEN {
			d.w[i]=self.w[i]-x.w[i];
		}
		return d;
	}

/* self-=x */
	pub fn sub(&mut self,x:&BIG) {
		for i in 0 ..rom::NLEN {
			self.w[i]-=x.w[i]; 
		}
	} 

/* reverse subtract this=x-this */ 
	pub fn rsub(&mut self,x:&BIG) {
		for i in 0 ..rom::NLEN {
			self.w[i]=x.w[i]-self.w[i] 
		}
	} 

/* self-=x, where x is int */
	pub fn dec(&mut self,x:i32) {
		self.norm();
		self.w[0]-=x;
	} 

/* self*=x, where x is small int<NEXCESS */
	pub fn imul(&mut self,c: i32) {
		for i in 0 ..rom::NLEN { 
			self.w[i]*=c;
		}
	}

/* convert this BIG to byte array */
	pub fn tobytearray(&mut self,b: &mut [u8],n:usize) {
		self.norm();
		let mut c=BIG::new_copy(self);

		for i in (0 ..(rom::MODBYTES as usize)).rev() {
			b[i+n]=(c.w[0]&0xff) as u8;
			c.fshr(8);
		}
	}

/* convert from byte array to BIG */
	pub fn frombytearray(b: &[u8],n:usize) -> BIG {
		let mut m=BIG::new();
		for i in 0 ..(rom::MODBYTES as usize) {
			m.fshl(8); m.w[0]+=(b[i+n]&0xff) as i32;
		}
		return m; 
	}

	pub fn tobytes(&mut self,b: &mut [u8]) {
		self.tobytearray(b,0)
	}

	pub fn frombytes(b: &[u8]) -> BIG {
		return BIG::frombytearray(b,0)
	}

/* set self.w[i]+=x*y+c, and return high part */

	pub fn muladd(&mut self,x: i32,y: i32,c: i32, i:usize) -> i32 {
        let prod:i64 = (x as i64)*(y as i64)+(c as i64)+(self.w[i] as i64);
        self.w[i]=(prod&(rom::BMASK as i64)) as i32;
        return (prod>>rom::BASEBITS) as i32;
    }

/* self*=x, where x is >NEXCESS */
    pub fn pmul(&mut self,c: i32) -> i32 {
        let mut carry:i32=0;
        self.norm();
        for i in 0 ..rom::NLEN {
            let ak=self.w[i];
            self.w[i]=0;
            carry=self.muladd(ak,c,carry,i);
        }
        return carry;
    }  

/* self*=c and catch overflow in DBIG */
    pub fn pxmul(&mut self,c: i32) -> DBIG
    {
        let mut m=DBIG::new();
        let mut carry:i32=0;
        for j in 0 ..rom::NLEN {
            carry=m.muladd(self.w[j],c,carry,j);
        }
        m.w[rom::NLEN]=carry;
        return m;
    }

/* divide by 3 */
    pub fn div3(&mut self) -> i32
    {
        let mut carry:i32=0;
        self.norm();
        let base=1<<rom::BASEBITS;
        for i in (0 ..rom::NLEN).rev() {
            let ak=carry*base+self.w[i];
            self.w[i]=ak/3;
            carry=ak%3;
        }
        return carry;
    }

/* return a*b where result fits in a BIG */
    pub fn smul(a: &BIG,b: &BIG) -> BIG {
        let mut c=BIG::new();
        for i in 0 ..rom::NLEN {
            let mut carry:i32=0;
            for j in 0 ..rom::NLEN {
                if i+j<rom::NLEN {carry=c.muladd(a.w[i],b.w[j],carry,i+j)}
            }
        }
        return c;
    }

/* Compare a and b, return 0 if a==b, -1 if a<b, +1 if a>b. Inputs must be normalised */
    pub fn comp(a: &BIG,b: &BIG) -> isize {
        for i in (0 ..rom::NLEN).rev() {
            if a.w[i]==b.w[i] {continue}
            if a.w[i]>b.w[i] {return 1}
            else  {return -1}
        }
        return 0;
    }

/* set x = x mod 2^m */
    pub fn mod2m(&mut self,m: usize)
    {
        let wd=m/(rom::BASEBITS as usize);
        let bt=(m as i32)%rom::BASEBITS;
        let msk=(1<<bt)-1;
        self.w[wd]&=msk;
        for i in wd+1 ..rom::NLEN {self.w[i]=0}
    }

/* Arazi and Qi inversion mod 256 */
    pub fn invmod256(a: i32) -> i32 {
        let mut t1:i32=0;
        let mut c=(a>>1)&1;
        t1+=c;
        t1&=1;
        t1=2-t1;
        t1<<=1;
        let mut u=t1+1;
    
    // i=2
        let mut b=a&3;
        t1=u*b; t1>>=2;
        c=(a>>2)&3;
        let mut t2=(u*c)&3;
        t1+=t2;
        t1*=u; t1&=3;
        t1=4-t1;
        t1<<=2;
        u+=t1;
    
    // i=4
        b=a&15;
        t1=u*b; t1>>=4;
        c=(a>>4)&15;
        t2=(u*c)&15;
        t1+=t2;
        t1*=u; t1&=15;
        t1=16-t1;
        t1<<=4;
        u+=t1;
    
        return u;
    }

/* return parity */
    pub fn parity(&self) -> i32 {
        return self.w[0]%2;
    }

/* return n-th bit */
    pub fn bit(&self,n: usize) -> i32 {
        if (self.w[n/(rom::BASEBITS as usize)]&(1<<((n as i32)%rom::BASEBITS)))>0 {return 1;}
        else {return 0;}
    }

/* return n last bits */
    pub fn lastbits(&mut self,n: usize) -> i32
    {
        let msk:i32 =((1<<n)-1) as i32;
        self.norm();
        return self.w[0]&msk;
    }

/* a=1/a mod 2^256. This is very fast! */
    pub fn invmod2m(&mut self) {
        let mut u=BIG::new();
        let mut b=BIG::new();
        let mut c=BIG::new();
    
        u.inc(BIG::invmod256(self.lastbits(8)));
    
        let mut i=8;
        while i<rom::BIGBITS {
            b.copy(self);
            b.mod2m(i);
            let mut t1=BIG::smul(&u,&b);
            t1.shr(i);
            c.copy(self);
            c.shr(i);
            c.mod2m(i);
    
            let mut t2=BIG::smul(&u,&c);
            t2.mod2m(i);
            t1.add(&t2);
            b=BIG::smul(&t1,&u);
            t1.copy(&b);
            t1.mod2m(i);
    
            t2.one(); t2.shl(i); t1.rsub(&t2); t1.norm();
            t1.shl(i);
            u.add(&t1);
            i<<=1;
        }
        u.mod2m(rom::BIGBITS);
        self.copy(&u);
        self.norm();
    }

/* reduce self mod m */
    pub fn rmod(&mut self,n: &BIG) {
        let mut k=0;
        let mut m=BIG::new_copy(n);
        self.norm();
        if BIG::comp(self,&m)<0 {return}
        loop {
            m.fshl(1);
            k += 1;
            if BIG::comp(self,&m)<0 {break}
        }
    
        while k>0 {
            m.fshr(1);
            if BIG::comp(self,&m)>=0 {
				self.sub(&m);
				self.norm();
            }
            k -= 1;
        }
    }

/* divide self by m */
    pub fn div(&mut self,n: &BIG) {
        let mut k=0;
        self.norm();
        let mut e=BIG::new_int(1);
        let mut b=BIG::new_copy(self);
        let mut m=BIG::new_copy(n);
        self.zero();
    
        while BIG::comp(&b,&m)>=0 {
            e.fshl(1);
            m.fshl(1);
            k += 1;
        }
    
        while k>0 {
            m.fshr(1);
            e.fshr(1);
            if BIG::comp(&b,&m)>=0 {
				self.add(&e);
				self.norm();
				b.sub(&m);
				b.norm();
            }
            k -= 1;
        }
    }

/* get 8*MODBYTES size random number */
    pub fn random(rng: &mut RAND) -> BIG {
        let mut m=BIG::new();
        let mut j=0;
        let mut r:u8=0;
/* generate random BIG */ 
        for _ in 0..8*(rom::MODBYTES as usize)  {
            if j==0 {
                r=rng.getbyte()
            } else {r>>=1}

            let b=(r&1) as i32;
            m.shl(1); m.w[0]+=b;// m.inc(b)
            j+=1; j&=7; 
        }
        return m;
    }

/* Create random BIG in portable way, one bit at a time */
    pub fn randomnum(q: &BIG,rng: &mut RAND) -> BIG {
        let mut d=DBIG::new();
        let mut j=0;
        let mut r:u8=0;
        for _ in 0..2*(rom::MODBITS as usize) {
            if j==0 {
                r=rng.getbyte();
            } else {r>>=1}

            let b=(r&1) as i32;
            d.shl(1); d.w[0]+=b; // m.inc(b);
            j+=1; j&=7; 
        }
        let m=d.dmod(q);
        return m;
    }


   /* Jacobi Symbol (this/p). Returns 0, 1 or -1 */
    pub fn jacobi(&mut self,p: &BIG) -> isize {
        let mut m:usize=0;
        let mut t=BIG::new();
        let mut x=BIG::new();
        let mut n=BIG::new();
        let zilch=BIG::new();
        let one=BIG::new_int(1);
        if p.parity()==0 || BIG::comp(self,&zilch)==0 || BIG::comp(p,&one)<=0 {return 0}
        self.norm();

        x.copy(self);
        n.copy(p);
        x.rmod(p);

        while BIG::comp(&n,&one)>0 {
            if BIG::comp(&x,&zilch)==0 {return 0}
            let n8=n.lastbits(3) as usize;
            let mut k=0;
            while x.parity()==0 {
				k += 1;
				x.shr(1);
            }
            if k%2==1 {m+=(n8*n8-1)/8}
            m+=(n8-1)*((x.lastbits(2) as usize)-1)/4;
            t.copy(&n);
            t.rmod(&x);
            n.copy(&x);
            x.copy(&t);
            m%=2;
    
        }
        if m==0 {return 1}
        else {return -1}
    }

/* self=1/self mod p. Binary method */
    pub fn invmodp(&mut self,p: &BIG) {
        self.rmod(p);
        let mut u=BIG::new_copy(self);
        let mut v=BIG::new_copy(p);
        let mut x1=BIG::new_int(1);
        let mut x2=BIG::new();
        let mut t=BIG::new();
        let one=BIG::new_int(1);
    
        while (BIG::comp(&u,&one) != 0 ) && (BIG::comp(&v,&one) != 0 ) {
            while u.parity()==0 {
				u.shr(1);
				if x1.parity() != 0 {
                    x1.add(p);
                    x1.norm();
				}
				x1.shr(1);
            }
            while v.parity()==0 {
				v.shr(1);
				if x2.parity() != 0  {
                    x2.add(p);
                    x2.norm();
				}
				x2.shr(1);
            }
            if BIG::comp(&u,&v)>=0 {
				u.sub(&v);
				u.norm();
                if BIG::comp(&x1,&x2)>=0 {x1.sub(&x2)}
				else
				{
                    t.copy(p);
                    t.sub(&x2);
                    x1.add(&t);
				}
				x1.norm();
            }
            else
            {
				v.sub(&u);
				v.norm();
                if BIG::comp(&x2,&x1)>=0 {x2.sub(&x1)}
				else
				{
                    t.copy(p);
                    t.sub(&x1);
                    x2.add(&t);
				}
				x2.norm();
            }
        }
        if BIG::comp(&u,&one)==0 {self.copy(&x1)}
        else {self.copy(&x2)}
    }

   /* return a*b as DBIG */
    pub fn mul(a: &BIG,b: &BIG) -> DBIG {
        let mut c=DBIG::new();
        let rm=rom::BMASK as i64;
        let rb=rom::BASEBITS;
     //   a.norm();
     //   b.norm();

        let mut d: [i64; rom::DNLEN] = [0; rom::DNLEN];
        for i in 0 ..rom::NLEN {
            d[i]=(a.w[i] as i64)*(b.w[i] as i64);
        }
        let mut s=d[0];
        let mut t=s; c.w[0]=(t&rm) as i32; 
        let mut co=t>>rb;
        for k in 1 ..rom::NLEN {
            s+=d[k]; t=co+s;
            for i in 1+k/2..k+1
                {t+=((a.w[i]-a.w[k-i]) as i64)*((b.w[k-i]-b.w[i]) as i64)}
            c.w[k]=(t&rm) as i32; co=t>>rb;
        }
        for k in rom::NLEN ..2*rom::NLEN-1 {
            s-=d[k-rom::NLEN]; t=co+s;
            let mut i=1+k/2;
            while i<rom::NLEN {
                t+=((a.w[i]-a.w[k-i]) as i64)*((b.w[k-i]-b.w[i]) as i64);
                i+=1;
            }
        
            c.w[k]=(t&rm) as i32; co=t>>rb;
        }
        c.w[2*rom::NLEN-1]=co as i32;
        return c;
    }

    /* return a^2 as DBIG */
    pub fn sqr(a: &BIG) -> DBIG {
        let mut c=DBIG::new();
        let rm=rom::BMASK as i64;
        let rb=rom::BASEBITS;
    //    a.norm();
 
        let mut t=(a.w[0] as i64)*(a.w[0] as i64);
        c.w[0]=(t&rm) as i32; let mut co=t>>rb;
        t=(a.w[1] as i64)*(a.w[0] as i64); t+=t; t+=co;
        c.w[1]=(t&rm) as i32; co=t>>rb;
        
        let last=rom::NLEN-(rom::NLEN%2);
        let mut j=2;
        while j<last {
            t=(a.w[j] as i64)*(a.w[0] as i64); for i in 1 ..(j+1)/2 {t+=(a.w[j-i] as i64)*(a.w[i] as i64)} ; t+=t; t+=co; t+=(a.w[j/2] as i64)*(a.w[j/2] as i64);
            c.w[j]=(t&rm) as i32; co=t>>rb;
            t=(a.w[j+1] as i64)*(a.w[0] as i64); for i in 1 ..(j+2)/2 {t+=(a.w[j+1-i] as i64)*(a.w[i] as i64)} ; t+=t; t+=co;
            c.w[j+1]=(t&rm) as i32; co=t>>rb;
            j+=2;
        }
        j=last;
        if rom::NLEN%2==1 {
            t=(a.w[j] as i64)*(a.w[0] as i64); for i in 1 ..(j+1)/2 {t+=(a.w[j-i] as i64)*(a.w[i] as i64)} ; t+=t; t+=co; t+=(a.w[j/2] as i64)*(a.w[j/2] as i64);
            c.w[j]=(t&rm) as i32; co=t>>rb; j += 1;
            t=(a.w[rom::NLEN-1] as i64)*(a.w[j-rom::NLEN+1] as i64); for i in j-rom::NLEN+2 ..(j+1)/2 {t+=(a.w[j-i] as i64)*(a.w[i] as i64)}; t+=t; t+=co;
            c.w[j]=(t&rm) as i32; co=t>>rb; j += 1;
        }
        while j<rom::DNLEN-2 {
            t=(a.w[rom::NLEN-1] as i64)*(a.w[j-rom::NLEN+1] as i64); for i in j-rom::NLEN+2 ..(j+1)/2 {t+=(a.w[j-i] as i64)*(a.w[i] as i64)} ; t+=t; t+=co; t+=(a.w[j/2] as i64)*(a.w[j/2] as i64);
            c.w[j]=(t&rm) as i32; co=t>>rb;
            t=(a.w[rom::NLEN-1] as i64)*(a.w[j-rom::NLEN+2] as i64); for i in j-rom::NLEN+3 ..(j+2)/2 {t+=(a.w[j+1-i] as i64)*(a.w[i] as i64)} ; t+=t; t+=co;
            c.w[j+1]=(t&rm) as i32; co=t>>rb;
            j+=2;
        }
        t=(a.w[rom::NLEN-1] as i64)*(a.w[rom::NLEN-1] as i64)+co;
        c.w[rom::DNLEN-2]=(t&rm) as i32; co=t>>rb;
        c.w[rom::DNLEN-1]=co as i32;
        
        return c;
    }

/* reduce a DBIG to a BIG using the appropriate form of the modulus */
    pub fn modulo(d: &mut DBIG) -> BIG {
        let mut b=BIG::new();
        if rom::MODTYPE==rom::PSEUDO_MERSENNE {
            let mut t=d.split(rom::MODBITS);
            b.dcopy(&d);
            let v=t.pmul(rom::MCONST);
            let tw=t.w[rom::NLEN-1];
            t.w[rom::NLEN-1] &= rom::TMASK;
            t.inc(rom::MCONST*((tw>>rom::TBITS)+(v<<(rom::BASEBITS-rom::TBITS))));
    
            b.add(&t);
            b.norm();
        }
    
        if rom::MODTYPE==rom::MONTGOMERY_FRIENDLY
        {
            for i in 0 ..rom::NLEN {
                let x=d.w[i];
                d.w[rom::NLEN+i]+=d.muladd(x,rom::MCONST-1,x,rom::NLEN+i-1);
            }
    
            b.zero();
    
            for i in 0 ..rom::NLEN {
                b.w[i]=d.w[rom::NLEN+i];
            }
            b.norm();
        }
            
        if rom::MODTYPE==rom::GENERALISED_MERSENNE
        { // GoldiLocks Only
            let t=d.split(rom::MODBITS);
            let rm2=(rom::MODBITS/2) as usize;
            b.dcopy(&d);
            b.add(&t);
            let mut dd=DBIG::new_scopy(&t);
            dd.shl(rm2);
            
            let mut tt=dd.split(rom::MODBITS);
            let lo=BIG::new_dcopy(&dd);
            b.add(&tt);
            b.add(&lo);
            b.norm();
            tt.shl(rm2);
            b.add(&tt);
            
            let carry=b.w[rom::NLEN-1]>>rom::TBITS;
            b.w[rom::NLEN-1]&=rom::TMASK;
            b.w[0]+=carry;
            
            b.w[(224/rom::BASEBITS) as usize]+=carry<<(224%rom::BASEBITS);
            b.norm();
        }
       
        if rom::MODTYPE==rom::NOT_SPECIAL {
            let md=BIG::new_ints(&rom::MODULUS);
            let rm=rom::BMASK as i64;
            let rb=rom::BASEBITS;

            let mut dd: [i64; rom::NLEN] = [0; rom::NLEN];
            let mut v: [i32; rom::NLEN] = [0; rom::NLEN];
            
            b.zero();
            
            let mut t=d.w[0] as i64; v[0]=(((t&rm) as i32)*rom::MCONST)&rom::BMASK; t+=(v[0] as i64)*(md.w[0] as i64); let mut c=(d.w[1] as i64)+(t>>rb); let mut s:i64=0;
            for k in 1 ..rom::NLEN {
                t=c+s+(v[0] as i64)*(md.w[k] as i64);
                let mut i=1+k/2;
                while i<k {
                    t+=((v[k-i]-v[i]) as i64)*((md.w[i]-md.w[k-i]) as i64);
                    i+=1;
                }
                v[k]=(((t&rm) as i32)*rom::MCONST)&rom::BMASK; t+=(v[k] as i64)*(md.w[0] as i64); c=(d.w[k+1] as i64)+(t>>rb);
                dd[k]=(v[k] as i64)*(md.w[k] as i64); s+=dd[k];
            }
            
            for k in rom::NLEN ..2*rom::NLEN-1
            {
                t=c+s;
                let mut i=1+k/2;
                while i<rom::NLEN {
                    t+=((v[k-i]-v[i]) as i64)*((md.w[i]-md.w[k-i]) as i64);
                    i+=1;
                }
                b.w[k-rom::NLEN]=(t&rm) as i32; c=(d.w[k+1] as i64)+(t>>rb); s-=dd[k-rom::NLEN+1];
            }
            b.w[rom::NLEN-1]=(c&rm) as i32;  
            b.norm();
        }     
        return b;
    }

    /* return a*b mod m */
    pub fn modmul(a: &mut BIG,b: &mut BIG,m: &BIG) -> BIG {
        a.rmod(m);
        b.rmod(m);
        let mut d=BIG::mul(a,b);
        return d.dmod(m);
    }
    
    /* return a^2 mod m */
    pub fn modsqr(a: &mut BIG,m: &BIG) -> BIG {
        a.rmod(m);
        let mut d=BIG::sqr(a);
        return d.dmod(m);
    }
    
    /* return -a mod m */
    pub fn modneg(a: &mut BIG,m: &BIG) -> BIG {
        a.rmod(m);
        return m.minus(a);
    }

    /* return this^e mod m */
    pub fn powmod(&mut self,e: &mut BIG,m: &BIG) -> BIG {
        self.norm();
        e.norm();
        let mut a=BIG::new_int(1);
        let mut z=BIG::new_copy(e);
        let mut s=BIG::new_copy(self);
        loop {      
            let bt=z.parity();       
            z.fshr(1);    
            if bt==1 {a=BIG::modmul(&mut a,&mut s,m)}
            if z.iszilch() {break}
            s=BIG::modsqr(&mut s,m);         
        }
        return a;
    }

}
 
/*
fn main() {
	let fd: [i32; rom::NLEN as usize] = [1, 2, 3, 4, 5, 6, 7, 8, 9];	
	let mut x= BIG::new();
	x.inc(3);
 	println!("{}", x.w[0]);	
 	let mut y= BIG::new_int(7);
 	println!("{}", y.w[0]);	
 	y=BIG::new_copy(&x);
	println!("{}", y.w[0]); 	
	x.add(&y);
	x.add(&y);
	println!("{}", x.w[0]); 	
	let mut z= BIG::new_ints(&fd);
	println!("{}", z.w[0]); 	
	z.shr(3);
	z.norm();
	println!("{:X}", z.w[0]); 	

	println!("{}",z.tostring());

    let mut a = BIG::new_int(3);
    let mut m = BIG::new_ints(&MODULUS);

    println!("rom::MODULUS= {}",m.tostring());

    let mut e = BIG::new_copy(&m);
    e.dec(1); e.norm();
    println!("Exponent= {}",e.tostring());
//    for i in 0..20
//    {
        a=a.powmod(&mut e,&mut m);
//        a.inc(2);
//    }
    println!("Result= {}",a.tostring());

}
*/
