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

extern crate amcl;

use std::str;
use std::io;

use amcl::arch;
use amcl::rand::RAND;
use amcl::ed25519;
use amcl::rsa2048::rsa;
use amcl::rsa2048::ff;
use amcl::bn254;
use amcl::bn254::pair;
use amcl::bn254::ecp2::ECP2;
use amcl::bn254::fp2::FP2;

use std::time::Instant;

const MIN_ITERS:isize=10;
const MIN_TIME: isize=10;

#[allow(non_snake_case)]
fn main()
{
	let mut raw:[u8;100]=[0;100];	
	let mut fail=false;
	let mut pbc=rsa::new_public_key(ff::FFLEN);
	let mut prv=rsa::new_private_key(ff::HFLEN);	
	let mut c: [u8;rsa::RFS]=[0;rsa::RFS];
	let mut m: [u8;rsa::RFS]=[0;rsa::RFS];
	let mut p: [u8;rsa::RFS]=[0;rsa::RFS];	

	let mut rng=RAND::new();
	rng.clean();
	for i in 0..100 {raw[i]=i as u8}

	rng.seed(100,&raw);	


	println!("Testing/Timing ed25519 ECC");

	if ed25519::ecp::CURVETYPE==ed25519::ecp::WEIERSTRASS {
		println!("Weierstrass parameterization");
	}		
	if ed25519::ecp::CURVETYPE==ed25519::ecp::EDWARDS {
		println!("Edwards parameterization");
	}
	if ed25519::ecp::CURVETYPE==ed25519::ecp::MONTGOMERY {
		println!("Montgomery parameterization");
	}

	if ed25519::fp::MODTYPE==ed25519::fp::PSEUDO_MERSENNE {
		println!("Pseudo-Mersenne Modulus");
	}
	if ed25519::fp::MODTYPE==ed25519::fp::MONTGOMERY_FRIENDLY {
		println!("Montgomery friendly Modulus");
	}
	if ed25519::fp::MODTYPE==ed25519::fp::GENERALISED_MERSENNE {
		println!("Generalised-Mersenne Modulus");
	}
	if ed25519::fp::MODTYPE==ed25519::fp::NOT_SPECIAL {
		println!("Not special Modulus");
	}

	println!("Modulus size {:} bits",ed25519::fp::MODBITS); 
	println!("{:} bit build",arch::CHUNK); 

	let mut G=ed25519::ecp::ECP::generator();

	let mut r=ed25519::big::BIG::new_ints(&ed25519::rom::CURVE_ORDER);
	let mut s=ed25519::big::BIG::randomnum(&r,&mut rng);

	let mut P=G.mul(&mut r);
	if !P.is_infinity() {
		println!("FAILURE - rG!=O");
		fail=true;
	} 

	let start = Instant::now();
	let mut iterations=0;
	let mut dur=0 as u64;
	while dur<(MIN_TIME as u64)*1000 || iterations<MIN_ITERS {
		P=G.mul(&mut s);
		iterations+=1;
		let elapsed=start.elapsed();
		dur=(elapsed.as_secs() * 1_000) + (elapsed.subsec_nanos() / 1_000_000) as u64;
	} 
	let duration=(dur as f64)/(iterations as f64);
	print!("EC  mul - {:} iterations  ",iterations);
	println!(" {:0.2} ms per iteration",duration);


	println!("\nTesting/Timing BN254 Pairings");

	if bn254::ecp::CURVE_PAIRING_TYPE==bn254::ecp::BN {
		println!("BN Pairing-Friendly Curve");
	}
	if bn254::ecp::CURVE_PAIRING_TYPE==bn254::ecp::BLS {
		println!("BLS Pairing-Friendly Curve");
	}

	println!("Modulus size {:} bits",bn254::fp::MODBITS); 
	println!("{:} bit build",arch::CHUNK); 

	let mut G =bn254::ecp::ECP::generator();

	let mut r=bn254::big::BIG::new_ints(&bn254::rom::CURVE_ORDER);
	let mut s=bn254::big::BIG::randomnum(&r,&mut rng);

	let mut P=pair::g1mul(&mut G,&mut r);

	if !P.is_infinity() {
		println!("FAILURE - rP!=O");
		fail=true;
	}

	let start = Instant::now();
	let mut iterations=0;
	let mut dur=0 as u64;
	while dur<(MIN_TIME as u64)*1000 || iterations<MIN_ITERS {
		P=pair::g1mul(&mut G,&mut s);
		iterations+=1;
		let elapsed=start.elapsed();
		dur=(elapsed.as_secs() * 1_000) + (elapsed.subsec_nanos() / 1_000_000) as u64;
	} 
	let duration=(dur as f64)/(iterations as f64);
	print!("G1  mul              - {:} iterations  ",iterations);
	println!(" {:0.2} ms per iteration",duration);

	let mut Q=ECP2::generator();
	let mut W=pair::g2mul(&mut Q,&mut r);

	if !W.is_infinity() {
		println!("FAILURE - rQ!=O");
		fail=true;
	}

	let start = Instant::now();
	let mut iterations=0;
	let mut dur=0 as u64;
	while dur<(MIN_TIME as u64)*1000 || iterations<MIN_ITERS {
		W=pair::g2mul(&mut Q,&mut s);
		iterations+=1;
		let elapsed=start.elapsed();
		dur=(elapsed.as_secs() * 1_000) + (elapsed.subsec_nanos() / 1_000_000) as u64;
	} 
	let duration=(dur as f64)/(iterations as f64);
	print!("G2  mul              - {:} iterations  ",iterations);
	println!(" {:0.2} ms per iteration",duration);

	let mut w=pair::ate(&mut Q,&mut P);
	w=pair::fexp(&w);

	let mut g=pair::gtpow(&mut w,&mut r);

	if !g.isunity() {
		println!("FAILURE - g^r!=1");
		return;
	}

	let start = Instant::now();
	let mut iterations=0;
	let mut dur=0 as u64;
	while dur<(MIN_TIME as u64)*1000 || iterations<MIN_ITERS {
		g=pair::gtpow(&mut w,&mut s);
		iterations+=1;
		let elapsed=start.elapsed();
		dur=(elapsed.as_secs() * 1_000) + (elapsed.subsec_nanos() / 1_000_000) as u64;
	} 
	let duration=(dur as f64)/(iterations as f64);
	print!("GT  pow              - {:} iterations  ",iterations);
	println!(" {:0.2} ms per iteration",duration);

	let start = Instant::now();
	let mut iterations=0;
	let mut dur=0 as u64;
	while dur<(MIN_TIME as u64)*1000 || iterations<MIN_ITERS {
		let c=w.compow(&s,&mut r);
		iterations+=1;
		let elapsed=start.elapsed();
		dur=(elapsed.as_secs() * 1_000) + (elapsed.subsec_nanos() / 1_000_000) as u64;
	} 
	let duration=(dur as f64)/(iterations as f64);
	print!("GT  pow (compressed) - {:} iterations  ",iterations);
	println!(" {:0.2} ms per iteration",duration);

	let start = Instant::now();
	let mut iterations=0;
	let mut dur=0 as u64;
	while dur<(MIN_TIME as u64)*1000 || iterations<MIN_ITERS {
		w=pair::ate(&mut Q,&mut P);
		iterations+=1;
		let elapsed=start.elapsed();
		dur=(elapsed.as_secs() * 1_000) + (elapsed.subsec_nanos() / 1_000_000) as u64;
	} 
	let duration=(dur as f64)/(iterations as f64);
	print!("PAIRing ATE          - {:} iterations  ",iterations);
	println!(" {:0.2} ms per iteration",duration);


	let start = Instant::now();
	let mut iterations=0;
	let mut dur=0 as u64;
	while dur<(MIN_TIME as u64)*1000 || iterations<MIN_ITERS {
		g=pair::fexp(&w);
		iterations+=1;
		let elapsed=start.elapsed();
		dur=(elapsed.as_secs() * 1_000) + (elapsed.subsec_nanos() / 1_000_000) as u64;
	} 
	let duration=(dur as f64)/(iterations as f64);
	print!("PAIRing FEXP         - {:} iterations  ",iterations);
	println!(" {:0.2} ms per iteration",duration);

	P.copy(&G);
	Q.copy(&W);

	P=pair::g1mul(&mut P,&mut s);
	g=pair::ate(&mut Q,&mut P);
	g=pair::fexp(&g);

	P.copy(&G);
	Q=pair::g2mul(&mut Q,&mut s);
	w=pair::ate(&mut Q,&mut P);
	w=pair::fexp(&w);

	if !g.equals(&mut w) {
		println!("FAILURE - e(sQ,p)!=e(Q,sP) ");
		fail=true;
	}

	Q.copy(&W);
	g=pair::ate(&mut Q,&mut P);
	g=pair::fexp(&g);
	g=pair::gtpow(&mut g,&mut s);

	if !g.equals(&mut w) {
		println!("FAILURE - e(sQ,p)!=e(Q,P)^s ");
		fail=true;
	}	



	println!("\nTesting/Timing 2048-bit RSA");
	println!("Generating 2048 -bit RSA public/private key pair");

	let start = Instant::now();
	let mut iterations=0;
	let mut dur=0 as u64;
	while dur<(MIN_TIME as u64)*1000 || iterations<MIN_ITERS {
		rsa::key_pair(&mut rng,65537,&mut prv,&mut pbc);
		iterations+=1;
		let elapsed=start.elapsed();
		dur=(elapsed.as_secs() * 1_000) + (elapsed.subsec_nanos() / 1_000_000) as u64;
	} 
	let duration=(dur as f64)/(iterations as f64);
	print!("RSA gen - {:} iterations  ",iterations);
	println!(" {:0.2} ms per iteration",duration);

	for i in 0..rsa::RFS {m[i]=(i%128) as u8;}

	let start = Instant::now();
	let mut iterations=0;
	let mut dur=0 as u64;
	while dur<(MIN_TIME as u64)*1000 || iterations<MIN_ITERS {
		rsa::encrypt(&pbc,&m,&mut c); 
		iterations+=1;
		let elapsed=start.elapsed();
		dur=(elapsed.as_secs() * 1_000) + (elapsed.subsec_nanos() / 1_000_000) as u64;
	} 
	let duration=(dur as f64)/(iterations as f64);
	print!("RSA enc - {:} iterations  ",iterations);
	println!(" {:0.2} ms per iteration",duration);

	let start = Instant::now();
	let mut iterations=0;
	let mut dur=0 as u64;
	while dur<(MIN_TIME as u64)*1000 || iterations<MIN_ITERS {
		rsa::decrypt(&prv,&c,&mut p); 
		iterations+=1;
		let elapsed=start.elapsed();
		dur=(elapsed.as_secs() * 1_000) + (elapsed.subsec_nanos() / 1_000_000) as u64;
	} 
	let duration=(dur as f64)/(iterations as f64);
	print!("RSA dec - {:} iterations  ",iterations);
	println!(" {:0.2} ms per iteration",duration);

	let mut cmp=true;
	for i in 0..rsa::RFS {
			if p[i]!=m[i] {cmp=false;}
		}

	if !cmp {
		println!("FAILURE - RSA decryption");
		fail=true;
	}

	if !fail {
		println!("All tests pass");
	}

}
