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

/* RSA API high-level functions  */

package main

import "fmt"

const RSA_RFS int=int(MODBYTES)*FFLEN
const RSA_SHA256 int=32
const RSA_SHA384 int=48
const RSA_SHA512 int=64

const RSA_HASH_TYPE int=RSA_SHA512


type rsa_private_key struct {
	p,q,dp,dq,c *FF
}

func New_rsa_private_key(n int) *rsa_private_key {
	SK:=new(rsa_private_key)
	SK.p=NewFFint(n)
	SK.q=NewFFint(n)
	SK.dp=NewFFint(n)
	SK.dq=NewFFint(n)
	SK.c=NewFFint(n)
	return SK
}

type rsa_public_key struct {
	e int
	n *FF
}

func New_rsa_public_key(m int) *rsa_public_key{
	PK:=new(rsa_public_key)
	PK.e=0
	PK.n=NewFFint(m)
	return PK
}

func hashit(sha int,A []byte,n int) []byte {
	var R []byte
	if sha==RSA_SHA256 {
		H:=NewHASH256()
		if A!=nil {H.Process_array(A)}
		if n>=0 {H.Process_num(int32(n))}
		R=H.Hash()
	}
	if sha==RSA_SHA384 {
		H:=NewHASH384()
		if A!=nil {H.Process_array(A)}
		if n>=0 {H.Process_num(int32(n))}
		R=H.Hash()
	}
	if sha==RSA_SHA512 {
		H:=NewHASH512()
		if A!=nil {H.Process_array(A)}
		if n>=0 {H.Process_num(int32(n))}
		R=H.Hash()
	}
	return R
}

func RSA_KEY_PAIR(rng *RAND,e int,PRIV *rsa_private_key,PUB *rsa_public_key) { /* IEEE1363 A16.11/A16.12 more or less */
	n:=PUB.n.getlen()/2
	t:=NewFFint(n)
	p1:=NewFFint(n)
	q1:=NewFFint(n)

	for true {
		PRIV.p.random(rng)
		for PRIV.p.lastbits(2)!=3 {PRIV.p.inc(1)}	
		for !prime(PRIV.p,rng) {
			PRIV.p.inc(4)
		}
			
		p1.copy(PRIV.p)
		p1.dec(1)

		if p1.cfactor(e) {continue}
		break;
	}

	for true {
		PRIV.q.random(rng);
		for PRIV.q.lastbits(2)!=3 {PRIV.q.inc(1)}
		for !prime(PRIV.q,rng) {
			PRIV.q.inc(4)
		}
			
		q1.copy(PRIV.q);
		q1.dec(1);

		if q1.cfactor(e) {continue}

		break;
	}
	
	PUB.n=ff_mul(PRIV.p,PRIV.q);
	PUB.e=e;

	t.copy(p1)
	t.shr()
	PRIV.dp.set(e)
	PRIV.dp.invmodp(t)
	if PRIV.dp.parity()==0 {PRIV.dp.add(t)}
	PRIV.dp.norm();

	t.copy(q1)
	t.shr()
	PRIV.dq.set(e)
	PRIV.dq.invmodp(t)
	if PRIV.dq.parity()==0 {PRIV.dq.add(t)}
	PRIV.dq.norm()

	PRIV.c.copy(PRIV.p)
	PRIV.c.invmodp(PRIV.q)

}

/* Mask Generation Function */

func RSA_MGF1(sha int,Z []byte,olen int,K []byte) {
	hlen:=sha

	var k int=0
	for i:=0;i<len(K);i++ {K[i]=0}

	cthreshold:=olen/hlen 
	if olen%hlen!=0 {cthreshold++}
	for counter:=0;counter<cthreshold;counter++ {
		B:=hashit(sha,Z,counter)

		if (k+hlen>olen) {
			for i:=0;i<olen%hlen;i++ {K[k]=B[i]; k++}
		} else {
			for i:=0;i<hlen;i++ {K[k]=B[i]; k++}
		}
	}	
}

func RSA_printBinary(array []byte) {
	for i:=0;i<len(array);i++ {
		fmt.Printf("%02x", array[i])
	}
	fmt.Printf("\n")
}  

/* SHAXXX identifier strings */
var SHA256ID= [...]byte {0x30,0x31,0x30,0x0d,0x06,0x09,0x60,0x86,0x48,0x01,0x65,0x03,0x04,0x02,0x01,0x05,0x00,0x04,0x20}
var SHA384ID= [...]byte {0x30,0x41,0x30,0x0d,0x06,0x09,0x60,0x86,0x48,0x01,0x65,0x03,0x04,0x02,0x02,0x05,0x00,0x04,0x30};
var SHA512ID= [...]byte {0x30,0x51,0x30,0x0d,0x06,0x09,0x60,0x86,0x48,0x01,0x65,0x03,0x04,0x02,0x03,0x05,0x00,0x04,0x40};

func PKCS15(sha int,m []byte,w []byte) bool {
	olen:=FF_BITS/8
	hlen:=sha
	idlen:=19

	if olen<idlen+hlen+10 {return false}
	H:=hashit(sha,m,-1)

	for i:=0;i<len(w);i++ {w[i]=0}
	i:=0
	w[i]=0; i++
	w[i]=1; i++
	for j:=0;j<olen-idlen-hlen-3;j++ {w[i]=0xff; i++}
	w[i]=0; i++

	if hlen==RSA_SHA256 {
		for j:=0;j<idlen;j++ {w[i]=SHA256ID[j]; i++}
	}
	if hlen==RSA_SHA384 {
		for j:=0;j<idlen;j++ {w[i]=SHA384ID[j]; i++}
	}
	if hlen==RSA_SHA512 {
		for j:=0;j<idlen;j++ {w[i]=SHA512ID[j]; i++}
	}
	for j:=0;j<hlen;j++ {w[i]=H[j]; i++}

	return true
}


/* OAEP Message Encoding for Encryption */
func RSA_OAEP_ENCODE(sha int,m []byte,rng *RAND,p []byte) []byte { 
	olen:=RSA_RFS-1
	mlen:=len(m)
	var f [RSA_RFS]byte

	hlen:=sha

	SEED:=make([]byte,hlen);

	seedlen:=hlen
	if (mlen>olen-hlen-seedlen-1) {return nil} 

	DBMASK:=make([]byte,olen-seedlen)

	h:=hashit(sha,p,-1);

	for i:=0;i<hlen;i++ {f[i]=h[i]}

	slen:=olen-mlen-hlen-seedlen-1      

	for i:=0;i<slen;i++ {f[hlen+i]=0}
	f[hlen+slen]=1
	for i:=0;i<mlen;i++ {f[hlen+slen+1+i]=m[i]}

	for i:=0;i<seedlen;i++ {SEED[i]=rng.GetByte()}
	RSA_MGF1(sha,SEED,olen-seedlen,DBMASK)

	for i:=0;i<olen-seedlen;i++ {DBMASK[i]^=f[i]}

	RSA_MGF1(sha,DBMASK,seedlen,f[:])

	for i:=0;i<seedlen;i++ {f[i]^=SEED[i]}

	for i:=0;i<olen-seedlen;i++ {f[i+seedlen]=DBMASK[i]}

	/* pad to length RFS */
	d:=1
	for i:=RSA_RFS-1;i>=d;i-- {
		f[i]=f[i-d]
	}
	for i:=d-1;i>=0;i-- {
		f[i]=0
	}
	return f[:]
}

/* OAEP Message Decoding for Decryption */
func RSA_OAEP_DECODE(sha int,p []byte,f []byte) [] byte {
	olen:=RSA_RFS-1

	hlen:=sha
	SEED:=make([]byte,hlen)
	seedlen:=hlen;
	CHASH:=make([]byte,hlen)
	
	if olen<seedlen+hlen+1 {return nil}
	DBMASK:=make([]byte,olen-seedlen)
	for i:=0;i<olen-seedlen;i++ {DBMASK[i]=0}

	if len(f)<RSA_RFS {
		d:=RSA_RFS-len(f)
		for i:=RSA_RFS-1;i>=d;i-- {
			f[i]=f[i-d]
		}
		for i:=d-1;i>=0;i-- {
			f[i]=0
		}
	}

	h:=hashit(sha,p,-1)
	for i:=0;i<hlen;i++ {CHASH[i]=h[i]}

	x:=f[0]

	for i:=seedlen;i<olen;i++ {
		DBMASK[i-seedlen]=f[i+1]
	}

	RSA_MGF1(sha,DBMASK,seedlen,SEED)
	for i:=0;i<seedlen;i++ {SEED[i]^=f[i+1]}
	RSA_MGF1(sha,SEED,olen-seedlen,f)
	for i:=0;i<olen-seedlen;i++ {DBMASK[i]^=f[i]}

	comp:=true
	for i:=0;i<hlen;i++ {
		if CHASH[i]!=DBMASK[i] {comp=false}
	}

	for i:=0;i<olen-seedlen-hlen;i++ {
		DBMASK[i]=DBMASK[i+hlen]
	}

	for i:=0;i<hlen;i++ {
		SEED[i]=0; CHASH[i]=0
	}
		
	var k int
	for k=0;;k++ {
		if k>=olen-seedlen-hlen {return nil}
		if DBMASK[k]!=0 {break}
	}

	t:=DBMASK[k]
	if (!comp || x!=0 || t!=0x01) {
		for i:=0;i<olen-seedlen;i++ {DBMASK[i]=0}
		return nil
	}

	var r = make([]byte,olen-seedlen-hlen-k-1)

	for i:=0;i<olen-seedlen-hlen-k-1;i++ {
		r[i]=DBMASK[i+k+1]
	}
	
	for i:=0;i<olen-seedlen;i++  {DBMASK[i]=0}

	return r
}

/* destroy the Private Key structure */
func RSA_PRIVATE_KEY_KILL(PRIV *rsa_private_key) {
	PRIV.p.zero();
	PRIV.q.zero();
	PRIV.dp.zero();
	PRIV.dq.zero();
	PRIV.c.zero();
}

/* RSA encryption with the public key */
func RSA_ENCRYPT(PUB *rsa_public_key,F []byte,G []byte) {
	n:=PUB.n.getlen()
	f:=NewFFint(n)

	ff_fromBytes(f,F)
	f.power(PUB.e,PUB.n)
	f.toBytes(G)
}

/* RSA decryption with the private key */
func RSA_DECRYPT(PRIV *rsa_private_key,G []byte,F []byte) {
	n:=PRIV.p.getlen()
	g:=NewFFint(2*n)

	ff_fromBytes(g,G);
	jp:=g.dmod(PRIV.p)
	jq:=g.dmod(PRIV.q)

	jp.skpow(PRIV.dp,PRIV.p)
	jq.skpow(PRIV.dq,PRIV.q)

	g.zero()
	g.dscopy(jp)
	jp.mod(PRIV.q)
	if ff_comp(jp,jq)>0 {jq.add(PRIV.q)}
	jq.sub(jp)
	jq.norm()

	t:=ff_mul(PRIV.c,jq)
	jq=t.dmod(PRIV.q)

	t=ff_mul(jq,PRIV.p)
	g.add(t)
	g.norm()

	g.toBytes(F)
}

func main() {

	var sha=RSA_HASH_TYPE
	message:="Hello World\n"

	pub:=New_rsa_public_key(FFLEN)
	priv:=New_rsa_private_key(HFLEN)

	var ML [RSA_RFS]byte
	var C [RSA_RFS]byte
	var S [RSA_RFS]byte
	var RAW [100]byte
	
	rng:=NewRAND()

	rng.Clean();
	for i:=0;i<100;i++ {RAW[i]=byte(i)}

	rng.Seed(100,RAW[:]);
//for (i=0;i<10;i++)
//{
	fmt.Printf("Generating public/private key pair\n")
	RSA_KEY_PAIR(rng,65537,priv,pub)

	M:=[]byte(message)

	fmt.Printf("Encrypting test string\n")
	E:=RSA_OAEP_ENCODE(sha,M,rng,nil) /* OAEP encode message M to E  */

	RSA_ENCRYPT(pub,E,C[:])    /* encrypt encoded message */
	fmt.Printf("Ciphertext= 0x"); RSA_printBinary(C[:])

	fmt.Printf("Decrypting test string\n");
	RSA_DECRYPT(priv,C[:],ML[:])
	MS:=RSA_OAEP_DECODE(sha,nil,ML[:]) /* OAEP decode message  */

	message=string(MS)
	fmt.Printf(message)

	fmt.Printf("Signing message\n")
	PKCS15(sha,M,C[:]); 

	RSA_DECRYPT(priv,C[:],S[:])  /* create signature in S */ 

	fmt.Printf("Signature= 0x"); RSA_printBinary(S[:])

	RSA_ENCRYPT(pub,S[:],ML[:])

	cmp:=true
	if len(C)!=len(ML) {
		cmp=false
	} else {
		for j:=0;j<len(C);j++ {
			if C[j]!=ML[j] {cmp=false}
		}
	}
	if cmp {
		fmt.Printf("Signature is valid")
	} else {
		fmt.Printf("Signature is INVALID")
	}


//}
	RSA_PRIVATE_KEY_KILL(priv)
}
