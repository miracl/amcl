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

use std::time::{SystemTime};
use std::time::UNIX_EPOCH;
use std::io;

mod fp;
//use fp::FP;
mod ecp;
use ecp::ECP;
mod fp2;
use fp2::FP2;
mod ecp2;
use ecp2::ECP2;
mod fp4;
use fp4::FP4;
mod fp12;
use fp12::FP12;
mod big;
use big::BIG;
mod dbig;
mod rand;
use rand::RAND;
mod hash256;
use hash256::HASH256;
mod hash384;
use hash384::HASH384;
mod hash512;
use hash512::HASH512;
mod rom;
mod aes;
//use aes::AES;
mod pair;


/* MPIN API Functions */

/* Configure mode of operation */

pub const PERMITS:bool=true;
pub const PINERROR:bool=true;
pub const FULL: bool=true;
pub const SINGLE_PASS:bool=false;

pub const MPIN_EFS: usize=rom::MODBYTES as usize;
pub const MPIN_EGS: usize=rom::MODBYTES as usize;
pub const MPIN_PAS: usize=16;
pub const MPIN_BAD_PARAMS: isize=-11;
pub const MPIN_INVALID_POINT: isize=-14;
pub const MPIN_WRONG_ORDER: isize=-18;
pub const MPIN_BAD_PIN: isize=-19;
pub const MPIN_SHA256: usize=32;
pub const MPIN_SHA384: usize=48;
pub const MPIN_SHA512: usize=64;

/* Configure your PIN here */

pub const MPIN_MAXPIN: i32=10000;  /* PIN less than this */
pub const MPIN_PBLEN: i32=14;      /* Number of bits in PIN */
pub const MPIN_TS: usize=10;         /* 10 for 4 digit PIN, 14 for 6-digit PIN - 2^TS/TS approx = sqrt(MAXPIN) */
pub const MPIN_TRAP:usize=200;      /* 200 for 4 digit PIN, 2000 for 6-digit PIN  - approx 2*sqrt(MAXPIN) */

pub const MPIN_HASH_TYPE: usize=MPIN_SHA256;

#[allow(non_snake_case)]
fn mpin_hash(sha: usize,c: &mut FP4,U: &mut ECP,r: &mut [u8]) -> bool {
	let mut w:[u8;MPIN_EFS]=[0;MPIN_EFS];
	let mut t:[u8;6*MPIN_EFS]=[0;6*MPIN_EFS];

	c.geta().geta().tobytes(&mut w); for i in 0..MPIN_EFS {t[i]=w[i]}
	c.geta().getb().tobytes(&mut w); for i in MPIN_EFS..2*MPIN_EFS {t[i]=w[i-MPIN_EFS]}
	c.getb().geta().tobytes(&mut w); for i in 2*MPIN_EFS..3*MPIN_EFS {t[i]=w[i-2*MPIN_EFS]}
	c.getb().getb().tobytes(&mut w); for i in 3*MPIN_EFS..4*MPIN_EFS {t[i]=w[i-3*MPIN_EFS]}

	U.getx().tobytes(&mut w); for i in 4*MPIN_EFS..5*MPIN_EFS {t[i]=w[i-4*MPIN_EFS]}
	U.gety().tobytes(&mut w); for i in 5*MPIN_EFS..6*MPIN_EFS {t[i]=w[i-5*MPIN_EFS]}

	if sha==MPIN_SHA256 {
		let mut h=HASH256::new();
		h.process_array(&t);
		let sh=h.hash();
		for i in 0..MPIN_PAS {r[i]=sh[i]}	
		return true;	
	}
	if sha==MPIN_SHA384 {
		let mut h=HASH384::new();
		h.process_array(&t);
		let sh=h.hash();
		for i in 0..MPIN_PAS {r[i]=sh[i]}		
		return true;
	}
	if sha==MPIN_SHA512 {
		let mut h=HASH512::new();
		h.process_array(&t);
		let sh=h.hash();
		for i in 0..MPIN_PAS {r[i]=sh[i]}
		return true;		
	}
	return false;

}

/* Hash number (optional) and string to point on curve */

fn hashit(sha: usize,n: usize,id: &[u8],w: &mut [u8]) -> bool {
	let mut r:[u8;64]=[0;64];
	let mut didit=false;
	if sha==MPIN_SHA256 {
		let mut h=HASH256::new();
		if n>0 {h.process_num(n as i32)}
		h.process_array(id);
        let hs=h.hash();	
        for i in 0..sha {r[i]=hs[i];}	
        didit=true;
	}
	if sha==MPIN_SHA384 {
		let mut h=HASH384::new();
		if n>0 {h.process_num(n as i32)}
		h.process_array(id);
		let hs=h.hash();
        for i in 0..sha {r[i]=hs[i];}			
		didit=true;
	}
	if sha==MPIN_SHA512 {
		let mut h=HASH512::new();
		if n>0 {h.process_num(n as i32)}
		h.process_array(id);
		let hs=h.hash();
        for i in 0..sha {r[i]=hs[i];}	
        didit=true;		
	}
	if !didit {return false}

	let rm=rom::MODBYTES as usize;

	if sha>rm {
		for i in 0..rm {w[i]=r[i]}
	} else {
		for i in 0..sha {w[i]=r[i]}	
		for i in sha..rm {w[i]=0}
	}

	return true;
}

#[allow(non_snake_case)]
fn mapit(h: &[u8]) -> ECP {
	let mut q=BIG::new_ints(&rom::MODULUS);
	let mut x=BIG::frombytes(h);
	x.rmod(&mut q);
	let mut P:ECP;

	loop {
		P=ECP::new_bigint(&x,0);
		if !P.is_infinity() {break}
		x.inc(1); x.norm();
	}
	if rom::CURVE_PAIRING_TYPE!=rom::BN_CURVE {
		let mut c=BIG::new_ints(&rom::CURVE_COF);
		P=P.mul(&mut c);
	}	
	return P;
}

/* return time in slots since epoch */
fn today() -> usize {
  	return (SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs()/(60*1440)) as usize;
}

/* these next two functions help to implement elligator squared - http://eprint.iacr.org/2014/043 */
/* maps a random u to a point on the curve */
#[allow(non_snake_case)]
fn emap(u: &BIG,cb: i32) -> ECP {
	let mut P:ECP;
	let mut x=BIG::new_copy(u);
	let mut p=BIG::new_ints(&rom::MODULUS);
	x.rmod(&mut p);
	loop {
		P=ECP::new_bigint(&x,cb);
		if !P.is_infinity() {break}
		x.inc(1);  x.norm();
	}
	return P;
}

/* returns u derived from P. Random value in range 1 to return value should then be added to u */
#[allow(non_snake_case)]
fn unmap(u: &mut BIG,P: &mut ECP) -> i32 {
	let s=P.gets();
	let mut R:ECP;
	let mut r=0;
	let x=P.getx();
	u.copy(&x);
	loop {
		u.dec(1); u.norm();
		r+=1;
		R=ECP::new_bigint(u,s);
		if !R.is_infinity() {break}
	}
	return r as i32;
}

pub fn mpin_hash_id(sha: usize,id: &[u8],w: &mut [u8]) -> bool {
	return hashit(sha,0,id,w);
}

/* these next two functions implement elligator squared - http://eprint.iacr.org/2014/043 */
/* Elliptic curve point E in format (0x04,x,y} is converted to form {0x0-,u,v} */
/* Note that u and v are indistinguisible from random strings */
#[allow(non_snake_case)]
pub fn mpin_encoding(rng: &mut RAND,e: &mut [u8]) ->isize {
	let mut t:[u8;MPIN_EFS]=[0;MPIN_EFS];

	for i in 0..MPIN_EFS {t[i]=e[i+1]}
	let mut u=BIG::frombytes(&t);
	for i in 0..MPIN_EFS {t[i]=e[i+MPIN_EFS+1]}
	let mut v=BIG::frombytes(&t);
		
	let mut P=ECP::new_bigs(&u,&v);
	if P.is_infinity() {return MPIN_INVALID_POINT}

	let p=BIG::new_ints(&rom::MODULUS);
	u=BIG::randomnum(&p,rng);

	let mut su=rng.getbyte() as i32; /*if (su<0) su=-su;*/ su%=2;
		
	let mut W=emap(&mut u,su);
	P.sub(&mut W);
	let sv=P.gets();
	let rn=unmap(&mut v,&mut P);
	let mut m=rng.getbyte() as i32; /*if (m<0) m=-m;*/ m%=rn;
	v.inc(m+1);
	e[0]=(su+2*sv) as u8;
	u.tobytes(&mut t);
	for i in 0..MPIN_EFS {e[i+1]=t[i]}
	v.tobytes(&mut t);
	for i in 0..MPIN_EFS {e[i+MPIN_EFS+1]=t[i]}		
		
	return 0;
}

#[allow(non_snake_case)]
pub fn mpin_decoding(d: &mut [u8]) -> isize {
	let mut t:[u8;MPIN_EFS]=[0;MPIN_EFS];

	if (d[0]&0x04)!=0 {return MPIN_INVALID_POINT}

	for i in 0..MPIN_EFS {t[i]=d[i+1]}
	let mut u=BIG::frombytes(&t);
	for i in 0..MPIN_EFS {t[i]=d[i+MPIN_EFS+1]}
	let mut v=BIG::frombytes(&t);

	let su=(d[0]&1) as i32;
	let sv=((d[0]>>1)&1) as i32;
	let mut W=emap(&mut u,su);
	let mut P=emap(&mut v,sv);
	P.add(&mut W);
	u=P.getx();
	v=P.gety();
	d[0]=0x04;
	u.tobytes(&mut t);
	for i in 0..MPIN_EFS {d[i+1]=t[i]}
	v.tobytes(&mut t);
	for i in 0..MPIN_EFS {d[i+MPIN_EFS+1]=t[i]}		
		
	return 0;
}

/* R=R1+R2 in group G1 */
#[allow(non_snake_case)]
pub fn mpin_recombine_g1(r1: &[u8],r2: &[u8],r: &mut [u8]) -> isize {
	let mut P=ECP::frombytes(&r1);
	let mut Q=ECP::frombytes(&r2);

	if P.is_infinity() || Q.is_infinity() {return MPIN_INVALID_POINT}

	P.add(&mut Q);

	P.tobytes(r);
	return 0;
}

/* W=W1+W2 in group G2 */
#[allow(non_snake_case)]
pub fn mpin_recombine_g2(w1: &[u8],w2: &[u8],w: &mut [u8]) -> isize {
	let mut P=ECP2::frombytes(&w1);
	let mut Q=ECP2::frombytes(&w2);

	if P.is_infinity() || Q.is_infinity() {return MPIN_INVALID_POINT}

	P.add(&mut Q);
	
	P.tobytes(w);
	return 0;
}
	
/* create random secret S */
pub fn mpin_random_generate(rng: &mut RAND,s: &mut [u8]) -> isize {
	let r=BIG::new_ints(&rom::CURVE_ORDER);
	let mut sc=BIG::randomnum(&r,rng);
	if rom::AES_S>0 {
		sc.mod2m(2*rom::AES_S);
	}		
	sc.tobytes(s);
	return 0;
}

pub fn printbinary(array: &[u8]) {
	for i in 0..array.len() {
		print!("{:02X}", array[i])
	}
	println!("")
} 

/* Extract Server Secret SST=S*Q where Q is fixed generator in G2 and S is master secret */
#[allow(non_snake_case)]
pub fn mpin_get_server_secret(s: &[u8],sst: &mut [u8]) -> isize {

	let mut Q=ECP2::new_fp2s(&FP2::new_bigs(&BIG::new_ints(&rom::CURVE_PXA),&BIG::new_ints(&rom::CURVE_PXB)),&FP2::new_bigs(&BIG::new_ints(&rom::CURVE_PYA),&BIG::new_ints(&rom::CURVE_PYB)));

	let mut sc=BIG::frombytes(s);
	Q=pair::g2mul(&mut Q,&mut sc);
	Q.tobytes(sst);
	return 0;
}

/*
 W=x*H(G);
 if RNG == NULL then X is passed in 
 if RNG != NULL the X is passed out 
 if type=0 W=x*G where G is point on the curve, else W=x*M(G), where M(G) is mapping of octet G to point on the curve
*/
#[allow(non_snake_case)]
pub fn mpin_get_g1_multiple(rng: Option<&mut RAND>,typ: usize,x: &mut [u8],g: &[u8],w: &mut [u8]) -> isize {
	let mut sx:BIG;
	let r=BIG::new_ints(&rom::CURVE_ORDER);

	if let Some(mut rd)=rng
	{
		sx=BIG::randomnum(&r,rd);
		if rom::AES_S>0 {
			sx.mod2m(2*rom::AES_S);
		}
		sx.tobytes(x);
	} else {
		sx=BIG::frombytes(x);
	}
	let mut P:ECP;

	if typ==0 {
		P=ECP::frombytes(g);
		if P.is_infinity() {return MPIN_INVALID_POINT}
	} else {
		P=mapit(g)
	}



	pair::g1mul(&mut P,&mut sx).tobytes(w);
	return 0;
}


/* Client secret CST=S*H(CID) where CID is client ID and S is master secret */
/* CID is hashed externally */
pub fn mpin_get_client_secret(s: &mut [u8],cid: &[u8],cst: &mut [u8]) -> isize {
	return mpin_get_g1_multiple(None,1,s,cid,cst);
}

/* Extract PIN from TOKEN for identity CID */
#[allow(non_snake_case)]
pub fn mpin_extract_pin(sha: usize,cid: &[u8],pin: i32,token: &mut [u8]) -> isize {
	let mut P=ECP::frombytes(&token);
	const RM:usize=rom::MODBYTES as usize;
	let mut h:[u8;RM]=[0;RM];
	if P.is_infinity() {return MPIN_INVALID_POINT}
	hashit(sha,0,cid,&mut h);
	let mut R=mapit(&h);

	R=R.pinmul(pin%MPIN_MAXPIN,MPIN_PBLEN);
	P.sub(&mut R);

	P.tobytes(token);

	return 0;
}

/* Functions to support M-Pin Full */
#[allow(non_snake_case)]
pub fn mpin_precompute(token: &[u8],cid: &[u8],g1: &mut [u8],g2: &mut [u8]) -> isize {
	let mut T=ECP::frombytes(&token);
	if T.is_infinity() {return MPIN_INVALID_POINT} 

	let mut P=mapit(&cid);

	let mut Q=ECP2::new_fp2s(&FP2::new_bigs(&BIG::new_ints(&rom::CURVE_PXA),&BIG::new_ints(&rom::CURVE_PXB)),&FP2::new_bigs(&BIG::new_ints(&rom::CURVE_PYA),&BIG::new_ints(&rom::CURVE_PYB)));

	let mut g=pair::ate(&mut Q,&mut T);
	g=pair::fexp(&g);
	g.tobytes(g1);

	g=pair::ate(&mut Q,&mut P);
	g=pair::fexp(&g);
	g.tobytes(g2);

	return 0;
}

/* Time Permit CTT=S*(date|H(CID)) where S is master secret */
#[allow(non_snake_case)]
pub fn mpin_get_client_permit(sha: usize,date: usize,s: &[u8],cid: &[u8],ctt: &mut [u8]) ->isize {
	const RM:usize=rom::MODBYTES as usize;
	let mut h:[u8;RM]=[0;RM];	
	hashit(sha,date,cid,&mut h);
	let mut P=mapit(&h);

	let mut sc=BIG::frombytes(s);
	pair::g1mul(&mut P,&mut sc).tobytes(ctt);
	return 0;
}

/* Implement step 1 on client side of MPin protocol */
#[allow(non_snake_case)]
pub fn mpin_client_1(sha: usize,date: usize,client_id: &[u8],rng: Option<&mut RAND>,x: &mut [u8],pin: usize,token: &[u8],sec: &mut [u8],xid: Option<&mut [u8]>,xcid: Option<&mut [u8]>,permit: Option<&[u8]>) ->isize {
	let r=BIG::new_ints(&rom::CURVE_ORDER);
		
	let mut sx:BIG;

	if let Some(mut rd)=rng
	{
		sx=BIG::randomnum(&r,rd);
		if rom::AES_S>0 {
			sx.mod2m(2*rom::AES_S);
		}
		sx.tobytes(x);
	} else {
		sx=BIG::frombytes(x);
	}

	const RM:usize=rom::MODBYTES as usize;
	let mut h:[u8;RM]=[0;RM];

	hashit(sha,0,&client_id,&mut h);
	let mut P=mapit(&h);
	
	let mut T=ECP::frombytes(&token);
	if T.is_infinity() {return MPIN_INVALID_POINT}

	let mut W=P.pinmul((pin as i32)%MPIN_MAXPIN,MPIN_PBLEN);
	T.add(&mut W);
	if date!=0 {
		if let Some(rpermit)=permit {W=ECP::frombytes(&rpermit);}
		if W.is_infinity() {return MPIN_INVALID_POINT}
		T.add(&mut W);
		let mut h2:[u8;RM]=[0;RM];		
		hashit(sha,date,&h,&mut h2);
		W=mapit(&h2);
		if let Some(mut rxid)=xid {
			P=pair::g1mul(&mut P,&mut sx);
			P.tobytes(&mut rxid);
			W=pair::g1mul(&mut W,&mut sx);
			P.add(&mut W);
		} else {
			P.add(&mut W);
			P=pair::g1mul(&mut P,&mut sx);
		}
		if let Some(mut rxcid)=xcid {P.tobytes(&mut rxcid)}
	} else {
		if let Some(mut rxid)=xid {
			P=pair::g1mul(&mut P,&mut sx);
			P.tobytes(&mut rxid);
		}
	}

	T.tobytes(sec);
	return 0;
}

/* Outputs H(CID) and H(T|H(CID)) for time permits. If no time permits set HID=HTID */
#[allow(non_snake_case)]
pub fn mpin_server_1(sha: usize,date: usize,cid: &[u8],hid: &mut [u8],htid: Option<&mut [u8]>) {
	const RM:usize=rom::MODBYTES as usize;
	let mut h:[u8;RM]=[0;RM];

	hashit(sha,0,cid,&mut h);	

	let mut P=mapit(&h);
	
	P.tobytes(hid);
	if date!=0 {
		let mut h2:[u8;RM]=[0;RM];		
		hashit(sha,date,&h,&mut h2);
		let mut R=mapit(&h2);
		P.add(&mut R);
		if let Some(rhtid)=htid {P.tobytes(rhtid);}
	} 
}

/* Implement step 2 on client side of MPin protocol */
#[allow(non_snake_case)]
pub fn mpin_client_2(x: &[u8],y: &[u8],sec: &mut [u8]) -> isize {
	let mut r=BIG::new_ints(&rom::CURVE_ORDER);
	let mut P=ECP::frombytes(sec);
	if P.is_infinity() {return MPIN_INVALID_POINT}

	let mut px=BIG::frombytes(x);
	let py=BIG::frombytes(y);
	px.add(&py);
	px.rmod(&mut r);
	//px.rsub(r)

	P=pair::g1mul(&mut P,&mut px);
	P.neg();
	P.tobytes(sec);
	
	return 0;
}

/* return time since epoch */
pub fn mpin_get_time() -> usize {
  	return (SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs()) as usize;	
}

/* Generate Y = H(epoch, xCID/xID) */
pub fn mpin_get_y(sha: usize,timevalue: usize,xcid: &[u8],y: &mut [u8]) {
	const RM:usize=rom::MODBYTES as usize;
	let mut h:[u8;RM]=[0;RM];

	hashit(sha,timevalue,xcid,&mut h);	

	let mut sy= BIG::frombytes(&h);
	let mut q=BIG::new_ints(&rom::CURVE_ORDER);
	sy.rmod(&mut q);
	if rom::AES_S>0 {
		sy.mod2m(2*rom::AES_S);
	}
	sy.tobytes(y);
}

/* Implement step 2 of MPin protocol on server side */
#[allow(non_snake_case)]
pub fn mpin_server_2(date: usize,hid: &[u8],htid: Option<&[u8]>,y: &[u8],sst: &[u8],xid: Option<&[u8]>,xcid: Option<&[u8]>,msec: &[u8],e: Option<&mut [u8]>,f: Option<&mut [u8]>) -> isize {
//	q:=NewBIGints(Modulus)
	let mut Q=ECP2::new_fp2s(&FP2::new_bigs(&BIG::new_ints(&rom::CURVE_PXA),&BIG::new_ints(&rom::CURVE_PXB)),&FP2::new_bigs(&BIG::new_ints(&rom::CURVE_PYA),&BIG::new_ints(&rom::CURVE_PYB)));

	let mut sQ=ECP2::frombytes(&sst);
	if sQ.is_infinity() {return MPIN_INVALID_POINT}	

	let mut R:ECP;
	if date!=0 {
		if let Some(rxcid)=xcid {R=ECP::frombytes(&rxcid);}
		else {return MPIN_BAD_PARAMS}
	} else {
		if let Some(rxid)=xid {R=ECP::frombytes(&rxid)}
		else {return MPIN_BAD_PARAMS}
	}
	if R.is_infinity() {return MPIN_INVALID_POINT}

	let mut sy=BIG::frombytes(&y);
	let mut P:ECP;
	if date!=0 {
		if let Some(rhtid)=htid {P=ECP::frombytes(&rhtid)}
		else {return MPIN_BAD_PARAMS}
	} else {
		P=ECP::frombytes(&hid);
	}
	
	if P.is_infinity() {return MPIN_INVALID_POINT}

	P=pair::g1mul(&mut P,&mut sy);
	P.add(&mut R);
	R=ECP::frombytes(&msec);
	if R.is_infinity() {return MPIN_INVALID_POINT}

	let mut g:FP12;
//		FP12 g1=new FP12(0);

	g=pair::ate2(&mut Q,&mut R,&mut sQ,&mut P);
	g=pair::fexp(&g);

	if !g.isunity() {
		
		if let Some(rxid)=xid {
			if let Some(re)=e {
				if let Some(rf)=f {

					g.tobytes(re);
					if date!=0 {
						P=ECP::frombytes(&hid);
						if P.is_infinity() {return MPIN_INVALID_POINT}		
						R=ECP::frombytes(&rxid);
						if R.is_infinity() {return MPIN_INVALID_POINT}			
						P=pair::g1mul(&mut P,&mut sy);
						P.add(&mut R);									
					}
					g=pair::ate(&mut Q,&mut P);
					g=pair::fexp(&g);
					g.tobytes(rf);

				}
			}
		}
	
		return MPIN_BAD_PIN;
	}

	return 0;
}

/* Pollards kangaroos used to return PIN error */
pub fn mpin_kangaroo(e: &[u8],f: &[u8]) -> isize {
	let mut ge=FP12::frombytes(e);
	let mut gf=FP12::frombytes(f);
	let mut distance: [isize;MPIN_TS]=[0;MPIN_TS];
	let mut t=FP12::new_copy(&gf);

	let mut table: [FP12;MPIN_TS]=[FP12::new();MPIN_TS];
	let mut s:isize=1;
	for m in 0..MPIN_TS {
		distance[m]=s;
		table[m]=FP12::new_copy(&t);
		s*=2;
		t.usqr();
	}
	t.one();
	let mut dn:isize=0;
	let mut i:usize;
	for _ in 0..MPIN_TRAP {
		i=(t.geta().geta().geta().lastbits(20)%(MPIN_TS as i32)) as usize;
		t.mul(&mut table[i]);
		dn+=distance[i];
	}
	gf.copy(&t); gf.conj();
	let mut steps:usize=0; let mut dm:isize=0;
	let mut res:isize=0;
	while dm-dn<MPIN_MAXPIN as isize {
		steps+=1;
		if steps>4*MPIN_TRAP {break}
		i=(ge.geta().geta().geta().lastbits(20)%(MPIN_TS as i32)) as usize;
		ge.mul(&mut table[i]);
		dm+=distance[i];
		if ge.equals(&mut t) {
			res=dm-dn;
			break;
		}
		if ge.equals(&mut gf) {
			res=dn-dm;
			break;
		}

	}
	if steps>4*MPIN_TRAP || dm-dn>=MPIN_MAXPIN as isize {res=0 }    // Trap Failed  - probable invalid token
	return res;
}

/* Hash the M-Pin transcript - new */

fn mpin_hash_all(sha: usize,hid: &[u8],xid: &[u8],xcid: Option<&[u8]>,sec: &[u8],y: &[u8],r: &[u8],w: &[u8],h: &mut[u8]) -> bool {
	let mut tlen:usize=0;
	const RM:usize=rom::MODBYTES as usize;	
	let mut t: [u8;10*RM+4]=[0;10*RM+4];

	for i in 0 .. hid.len() {t[i]=hid[i]}
	tlen+=hid.len();

	if let Some(rxcid)=xcid {
		for i in 0..rxcid.len() {t[i+tlen]=rxcid[i]}
		tlen+=rxcid.len();
	} else {
		for i in 0..xid.len() {t[i+tlen]=xid[i]}
		tlen+=xid.len();
	}	

	for i in 0..sec.len() {t[i+tlen]=sec[i]}
	tlen+=sec.len();		
	for i in 0..y.len() {t[i+tlen]=y[i]}
	tlen+=y.len();
	for i in 0..r.len() {t[i+tlen]=r[i]}
	tlen+=r.len();		
	for i in 0..w.len() {t[i+tlen]=w[i]}
	tlen+=w.len();	
	if tlen!=10*RM+4 {return false}

	return hashit(sha,0,&t,h);
}

/* calculate common key on client side */
/* wCID = w.(A+AT) */
#[allow(non_snake_case)]
pub fn mpin_client_key(sha: usize,g1: &[u8],g2: &[u8],pin: usize,r: &[u8],x: &[u8],h: &[u8],wcid: &[u8],ck: &mut [u8]) -> isize {

	let mut g1=FP12::frombytes(&g1);
	let mut g2=FP12::frombytes(&g2);
	let mut z=BIG::frombytes(&r);
	let mut x=BIG::frombytes(&x);
	let h=BIG::frombytes(&h);

	let mut W=ECP::frombytes(&wcid);
	if W.is_infinity() {return MPIN_INVALID_POINT} 

	W=pair::g1mul(&mut W,&mut x);

	let mut f=FP2::new_bigs(&BIG::new_ints(&rom::CURVE_FRA),&BIG::new_ints(&rom::CURVE_FRB));
	let mut r=BIG::new_ints(&rom::CURVE_ORDER);
	let q=BIG::new_ints(&rom::MODULUS);

	z.add(&h);	//new
	z.rmod(&mut r);

	let mut m=BIG::new_copy(&q);
	m.rmod(&mut r);

	let mut a=BIG::new_copy(&z);
	a.rmod(&mut m);

	let mut b=BIG::new_copy(&z);
	b.div(&mut m);

	g2.pinpow(pin as i32,MPIN_PBLEN);
	g1.mul(&mut g2);

	let mut c=g1.trace();
	g2.copy(&g1);
	g2.frob(&mut f);
	let cp=g2.trace();
	g1.conj();
	g2.mul(&mut g1);
	let cpm1=g2.trace();
	g2.mul(&mut g1);
	let cpm2=g2.trace();

	c=c.xtr_pow2(&cp,&cpm1,&cpm2,&mut a,&mut b);

	mpin_hash(sha,&mut c,&mut W,ck);

	return 0
}

/* calculate common key on server side */
/* Z=r.A - no time permits involved */
#[allow(non_snake_case)]
pub fn mpin_server_key(sha: usize,z: &[u8],sst: &[u8],w: &[u8],h: &[u8],hid: &[u8],xid: &[u8],xcid: Option<&[u8]>,sk: &mut [u8]) -> isize {
	let mut sQ=ECP2::frombytes(&sst);
	if sQ.is_infinity() {return MPIN_INVALID_POINT} 
	let mut R=ECP::frombytes(&z);
	if R.is_infinity() {return MPIN_INVALID_POINT} 
	let mut A=ECP::frombytes(&hid);
	if A.is_infinity() {return MPIN_INVALID_POINT} 

	let mut U=ECP::new();
	if let Some(rxcid)=xcid {
		U.copy(&ECP::frombytes(&rxcid));
	} else {
		U.copy(&ECP::frombytes(&xid));
	}
	
	if U.is_infinity() {return MPIN_INVALID_POINT} 

	let mut w=BIG::frombytes(&w);
	let mut h=BIG::frombytes(&h);
	A=pair::g1mul(&mut A,&mut h);	// new
	R.add(&mut A);

	U=pair::g1mul(&mut U,&mut w);
	let mut g=pair::ate(&mut sQ,&mut R);
	g=pair::fexp(&g);

	let mut c=g.trace();

	mpin_hash(sha,&mut c,&mut U,sk);

	return 0
}


fn main()
{
	let mut raw:[u8;100]=[0;100];	
	let mut s:[u8;MPIN_EGS]=[0;MPIN_EGS];
	const RM:usize=rom::MODBYTES as usize;
	let mut hcid:[u8;RM]=[0;RM];
	let mut hsid:[u8;RM]=[0;RM];

	const EGS:usize=MPIN_EGS;
	const EFS:usize=MPIN_EFS;
	const G1S:usize=2*EFS+1; /* Group 1 Size */
	const G2S:usize=4*EFS; /* Group 2 Size */
	const EAS:usize=16;

	let mut sst:[u8;G2S]=[0;G2S];
	let mut token: [u8;G1S]=[0;G1S];	
	let mut permit:[u8;G1S]=[0;G1S];	
	let mut g1: [u8;12*EFS]=[0;12*EFS];
	let mut g2: [u8;12*EFS]=[0;12*EFS];	
	let mut xid: [u8;G1S]=[0;G1S];
	let mut xcid: [u8;G1S]=[0;G1S];	
	let mut x: [u8;EGS]=[0;EGS];	
	let mut y: [u8;EGS]=[0;EGS];
	let mut sec: [u8;G1S]=[0;G1S];	
	let mut r: [u8;EGS]=[0;EGS];
	let mut z: [u8;G1S]=[0;G1S];	
	let mut hid: [u8;G1S]=[0;G1S];
	let mut htid: [u8;G1S]=[0;G1S];
	let mut rhid: [u8;G1S]=[0;G1S];
	let mut w: [u8;EGS]=[0;EGS];
	let mut t: [u8;G1S]=[0;G1S];
	let mut e: [u8;12*EFS]=[0;12*EFS];
	let mut f: [u8;12*EFS]=[0;12*EFS];
	let mut h: [u8;RM]=[0;RM];
	let mut ck: [u8;EAS]=[0;EAS];
	let mut sk: [u8;EAS]=[0;EAS];	


	let sha=MPIN_HASH_TYPE;
	let mut rng=RAND::new();
	rng.clean();
	for i in 0..100 {raw[i]=(i+1) as u8}

	rng.seed(100,&raw);	

/* Trusted Authority set-up */

	mpin_random_generate(&mut rng,&mut s);
	print!("Master Secret s: 0x");  printbinary(&s);

/* Create Client Identity */
 	let name= "testUser@miracl.com";
 	let client_id=name.as_bytes();

	print!("Client ID= "); printbinary(&client_id); 


	mpin_hash_id(sha,&client_id,&mut hcid);  /* Either Client or TA calculates Hash(ID) - you decide! */
		
/* Client and Server are issued secrets by DTA */
	mpin_get_server_secret(&s,&mut sst);
	print!("Server Secret SS: 0x");  printbinary(&sst);	

	mpin_get_client_secret(&mut s,&hcid,&mut token);
	print!("Client Secret CS: 0x"); printbinary(&token); 

/* Client extracts PIN from secret to create Token */
	let pin:i32=1234;
	println!("Client extracts PIN= {}",pin);
	let mut rtn=mpin_extract_pin(sha,&client_id,pin,&mut token);
	if rtn != 0 {
		println!("FAILURE: EXTRACT_PIN rtn: {}",rtn);
	}

	print!("Client Token TK: 0x"); printbinary(&token); 

	if FULL {
		mpin_precompute(&token,&hcid,&mut g1,&mut g2);
	}

	let mut date=0;
	if PERMITS {
		date=today();
/* Client gets "Time Token" permit from DTA */ 
		mpin_get_client_permit(sha,date,&s,&hcid,&mut permit);
		print!("Time Permit TP: 0x");  printbinary(&permit);

/* This encoding makes Time permit look random - Elligator squared */
		mpin_encoding(&mut rng,&mut permit);
		print!("Encoded Time Permit TP: 0x"); printbinary(&permit);
		mpin_decoding(&mut permit);
		print!("Decoded Time Permit TP: 0x"); printbinary(&permit);
	}

	print!("\nPIN= "); let _ =io::Write::flush(&mut io::stdout());
    let mut input_text = String::new();
    let _ = io::stdin().read_line(&mut input_text);

    let pin=input_text.trim().parse::<usize>().unwrap();

	println!("MPIN Multi Pass");
/* Send U=x.ID to server, and recreate secret from token and pin */
	rtn=mpin_client_1(sha,date,&client_id,Some(&mut rng),&mut x,pin,&token,&mut sec,Some(&mut xid[..]),Some(&mut xcid[..]),Some(&permit[..]));
	if rtn != 0 {
		println!("FAILURE: CLIENT_1 rtn: {}",rtn);
	}
  
	if FULL {
		mpin_hash_id(sha,&client_id,&mut hcid);
		mpin_get_g1_multiple(Some(&mut rng),1,&mut r,&hcid,&mut z);  /* Also Send Z=r.ID to Server, remember random r */
	}
  
/* Server calculates H(ID) and H(T|H(ID)) (if time permits enabled), and maps them to points on the curve HID and HTID resp. */
		
	mpin_server_1(sha,date,&client_id,&mut hid,Some(&mut htid[..]));


    if date!=0 {rhid.clone_from_slice(&htid[..]);}
    else {rhid.clone_from_slice(&hid[..]);}
    	
/* Server generates Random number Y and sends it to Client */
	mpin_random_generate(&mut rng,&mut y);
  
	if FULL {
		mpin_hash_id(sha,&client_id,&mut hsid);
		mpin_get_g1_multiple(Some(&mut rng),0,&mut w,&rhid,&mut t);  /* Also send T=w.ID to client, remember random w  */
	}
  
/* Client Second Pass: Inputs Client secret SEC, x and y. Outputs -(x+y)*SEC */
	rtn=mpin_client_2(&x,&y,&mut sec);
	if rtn != 0 {
		println!("FAILURE: CLIENT_2 rtn: {}",rtn);
	}
  
/* Server Second pass. Inputs hashed client id, random Y, -(x+y)*SEC, xID and xCID and Server secret SST. E and F help kangaroos to find error. */
/* If PIN error not required, set E and F = null */
  
	if !PINERROR {
		rtn=mpin_server_2(date,&hid,Some(&htid[..]),&y,&sst,Some(&xid[..]),Some(&xcid[..]),&sec,None,None);
	} else {
		rtn=mpin_server_2(date,&hid,Some(&htid[..]),&y,&sst,Some(&xid[..]),Some(&xcid[..]),&sec,Some(&mut e),Some(&mut f));
	}

	if rtn == MPIN_BAD_PIN {
		println!("Server says - Bad Pin. I don't know you. Feck off.");
		if PINERROR {
			let err=mpin_kangaroo(&e,&f);
			if err!=0 {println!("(Client PIN is out by {})",err)}
		}
		return;
	} else {
		println!("Server says - PIN is good! You really are {}",name);
	}

	if  FULL {

		let mut pxcid=None;
		if PERMITS {pxcid=Some(&xcid[..])};

		mpin_hash_all(sha,&hcid,&xid,pxcid,&sec,&y,&z,&t,&mut h);	
		mpin_client_key(sha,&g1,&g2,pin,&r,&x,&h,&t,&mut ck);
		print!("Client Key =  0x");  printbinary(&ck);

		mpin_hash_all(sha,&hsid,&xid,pxcid,&sec,&y,&z,&t,&mut h);			
		mpin_server_key(sha,&z,&sst,&w,&h,&hid,&xid,pxcid,&mut sk);
		print!("Server Key =  0x"); printbinary(&sk);
	}

}
