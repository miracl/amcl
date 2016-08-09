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

/* Elliptic Curve API high-level functions  */

package main

import "fmt"

const ECDH_INVALID_PUBLIC_KEY int=-2
const ECDH_ERROR int=-3
const ECDH_INVALID int=-4
const ECDH_EFS int=int(MODBYTES)
const ECDH_EGS int=int(MODBYTES)
const ECDH_EAS int=16
const ECDH_EBS int=16
const ECDH_SHA256 int=32
const ECDH_SHA384 int=48
const ECDH_SHA512 int=64

const ECDH_HASH_TYPE int=ECDH_SHA512

/* Convert Integer to n-byte array */
func inttoBytes(n int,len int) []byte {
	var b []byte
	var i int
	for i=0;i<len;i++ {b=append(b,0)}
	i=len
	for (n>0 && i>0) {
		i--;
		b[i]=byte(n&0xff)
		n/=256
	}	
	return b
}

func hashit(sha int,A []byte,n int,B []byte,pad int) []byte {
	var R []byte
	if sha==ECDH_SHA256 {
		H:=NewHASH256()
		H.Process_array(A)
		if n>0 {H.Process_num(int32(n))}
		if B!=nil {H.Process_array(B)}
		R=H.Hash()
	}
	if sha==ECDH_SHA384 {
		H:=NewHASH384()
		H.Process_array(A)
		if n>0 {H.Process_num(int32(n))}
		if B!=nil {H.Process_array(B)}
		R=H.Hash()
	}
	if sha==ECDH_SHA512 {
		H:=NewHASH512()
		H.Process_array(A)
		if n>0 {H.Process_num(int32(n))}
		if B!=nil {H.Process_array(B)}
		R=H.Hash()
	}
	if R==nil {return nil}

	if pad==0 {return R}
	var W []byte
	for i:=0;i<pad;i++ {W=append(W,0)}
	if pad<=sha {
		for i:=0;i<pad;i++ {W[i]=R[i]}
	} else {
		for i:=0;i<sha;i++ {W[i]=R[i]}
		for i:=sha;i<pad;i++ {W[i]=0}
	}
	return W
}

/* Key Derivation Functions */
/* Input octet Z */
/* Output key of length olen */
func KDF1(sha int,Z []byte,olen int) []byte {
/* NOTE: the parameter olen is the length of the output K in bytes */
	hlen:=sha
	var K []byte
	k:=0
    
	for i:=0;i<olen;i++ {K=append(K,0)}

	cthreshold:=olen/hlen; if olen%hlen!=0 {cthreshold++}

	for counter:=0;counter<cthreshold;counter++ {
		B:=hashit(sha,Z,counter,nil,0)
		if k+hlen>olen {
			for i:=0;i<olen%hlen;i++ {K[k]=B[i]; k++}
		} else {
			for i:=0;i<hlen;i++ {K[k]=B[i]; k++}
		}
	}
	return K;
}

func KDF2(sha int,Z []byte,P []byte,olen int) []byte {
/* NOTE: the parameter olen is the length of the output k in bytes */
	hlen:=sha
	var K []byte
	k:=0
    
	for i:=0;i<olen;i++ {K=append(K,0)}

	cthreshold:=olen/hlen; if olen%hlen!=0 {cthreshold++}

	for counter:=1;counter<=cthreshold;counter++ {
		B:=hashit(sha,Z,counter,P,0)
		if k+hlen>olen {
			for i:=0;i<olen%hlen;i++ {K[k]=B[i]; k++}
		} else {
			for i:=0;i<hlen;i++ {K[k]=B[i]; k++}
		}
	}
	return K
}

/* Password based Key Derivation Function */
/* Input password p, salt s, and repeat count */
/* Output key of length olen */
func PBKDF2(sha int,Pass []byte,Salt []byte,rep int,olen int) []byte {
	d:=olen/sha; if olen%sha!=0 {d++}
	var F [ECDH_EFS]byte
	var U [ECDH_EFS]byte

	var S []byte

	//byte[] S=new byte[Salt.length+4];

	var K []byte
	//byte[] K=new byte[d*EFS];
	//opt:=0

	for i:=1;i<=d;i++ {
		for j:=0;j<len(Salt);j++ {S=append(S,Salt[j])} 
		N:=inttoBytes(i,4)
		for j:=0;j<4;j++ {S=append(S,N[j])}   

		HMAC(sha,S,Pass,F[:])

		for j:=0;j<ECDH_EFS;j++ {U[j]=F[j]}
		for j:=2;j<=rep;j++ {
			HMAC(sha,U[:],Pass,U[:]);
			for k:=0;k<ECDH_EFS;k++ {F[k]^=U[k]}
		}
		for j:=0;j<ECDH_EFS;j++ {K=append(K,F[j])} 
	}
	var key []byte
	for i:=0;i<olen;i++ {key=append(key,K[i])}
	return key
}

/* Calculate HMAC of m using key k. HMAC is tag of length olen (which is length of tag) */
func HMAC(sha int,M []byte,K []byte,tag []byte) int {
	/* Input is from an octet m        *
	* olen is requested output length in bytes. k is the key  *
	* The output is the calculated tag */
	var B []byte
	b:=64
	if sha>32 {b=128}

	var K0 [128]byte
	olen:=len(tag)

	if (olen<4 /*|| olen>sha */) {return 0}

	for i:=0;i<b;i++ {K0[i]=0}

	if len(K) > b {
		B=hashit(sha,K,0,nil,0) 
		for i:=0;i<sha;i++ {K0[i]=B[i]}
	} else {
		for i:=0;i<len(K);i++  {K0[i]=K[i]}
	}
		
	for i:=0;i<b;i++ {K0[i]^=0x36}
	B=hashit(sha,K0[0:b],0,M,0);

	for i:=0;i<b;i++ {K0[i]^=0x6a}
	B=hashit(sha,K0[0:b],0,B,olen)

	for i:=0;i<olen;i++ {tag[i]=B[i]}

	return 1
}

/* AES encryption/decryption. Encrypt byte array M using key K and returns ciphertext */
func AES_CBC_IV0_ENCRYPT(K []byte,M []byte) []byte { /* AES CBC encryption, with Null IV and key K */
	/* Input is from an octet string M, output is to an octet string C */
	/* Input is padded as necessary to make up a full final block */
	a:=NewAES()
	fin:=false

	var buff [16]byte
	var C []byte

	a.Init(aes_CBC,len(K),K,nil)

	ipt:=0; //opt:=0
	var i int
	for true {
		for i=0;i<16;i++ {
			if ipt<len(M) {
				buff[i]=M[ipt]; ipt++;
			} else {fin=true; break;}
		}
		if fin {break}
		a.Encrypt(buff[:])
		for i=0;i<16;i++ {
			C=append(C,buff[i])
		}
	}    

/* last block, filled up to i-th index */

	padlen:=16-i
	for j:=i;j<16;j++ {buff[j]=byte(padlen)}

	a.Encrypt(buff[:])

	for i=0;i<16;i++ {
		C=append(C,buff[i])
	}
	a.End()   
	return C
}

/* returns plaintext if all consistent, else returns null string */
func AES_CBC_IV0_DECRYPT(K []byte,C []byte) []byte { /* padding is removed */
	a:=NewAES()
	var buff [16]byte
	var MM []byte
	var M []byte

	var i int
	ipt:=0; opt:=0

	a.Init(aes_CBC,len(K),K,nil);

	if len(C)==0 {return nil}
	ch:=C[ipt]; ipt++
  
	fin:=false

	for true {
		for i=0;i<16;i++ {
			buff[i]=ch    
			if ipt>=len(C) {
				fin=true; break
			}  else {ch=C[ipt]; ipt++ }
		}
		a.Decrypt(buff[:])
		if fin {break}
		for i=0;i<16;i++ {
			MM=append(MM,buff[i]); opt++
		}
	}    

	a.End();
	bad:=false
	padlen:=int(buff[15])
	if (i!=15 || padlen<1 || padlen>16) {bad=true}
	if (padlen>=2 && padlen<=16) {
		for i=16-padlen;i<16;i++ {
			if buff[i]!=byte(padlen) {bad=true}
		}
	}
    
	if !bad { 
		for i=0;i<16-padlen;i++ {
			MM=append(MM,buff[i]); opt++
		}
	}

	if bad {return nil}

	for i=0;i<opt;i++ {M=append(M,MM[i])}

	return M;
}

/* Calculate a public/private EC GF(p) key pair W,S where W=S.G mod EC(p),
 * where S is the secret key and W is the public key
 * and G is fixed generator.
 * If RNG is NULL then the private key is provided externally in S
 * otherwise it is generated randomly internally */
func ECDH_KEY_PAIR_GENERATE(RNG *RAND,S []byte,W []byte) int {
	res:=0
//	var T [ECDH_EFS]byte
	var s *BIG
	var G *ECP

	gx:=NewBIGints(CURVE_Gx)
	if CURVETYPE!=MONTGOMERY {
		gy:=NewBIGints(CURVE_Gy)
		G=NewECPbigs(gx,gy)
	} else {
		G=NewECPbig(gx)
	}

	r:=NewBIGints(CURVE_Order)

	if RNG==nil {
		s=fromBytes(S)
		s.mod(r)
	} else {
		s=randomnum(r,RNG)
		
	//	s.toBytes(T[:])
	//	for i:=0;i<ECDH_EGS;i++ {S[i]=T[i]}
	}

	if AES_S>0 {
		s.mod2m(2*AES_S)
	}
	s.toBytes(S)

	WP:=G.mul(s)

	WP.toBytes(W)

	return res
}

/* validate public key. Set full=true for fuller check */
func ECDH_PUBLIC_KEY_VALIDATE(full bool,W []byte) int {
	WP:=ECP_fromBytes(W)
	res:=0

	r:=NewBIGints(CURVE_Order)

	if WP.is_infinity() {res=ECDH_INVALID_PUBLIC_KEY}
	if res==0 && full {
		WP=WP.mul(r)
		if !WP.is_infinity() {res=ECDH_INVALID_PUBLIC_KEY} 
	}
	return res
}

/* IEEE-1363 Diffie-Hellman online calculation Z=S.WD */
func ECPSVDP_DH(S []byte,WD []byte,Z []byte) int {
	res:=0;
	var T [ECDH_EFS]byte

	s:=fromBytes(S)

	W:=ECP_fromBytes(WD)
	if W.is_infinity() {res=ECDH_ERROR}

	if res==0 {
		r:=NewBIGints(CURVE_Order)
		s.mod(r)
		W=W.mul(s)
		if W.is_infinity() { 
			res=ECDH_ERROR
		} else {
			W.getX().toBytes(T[:])
			for i:=0;i<ECDH_EFS;i++ {Z[i]=T[i]}
		}
	}
	return res
}

/* IEEE ECDSA Signature, C and D are signature on F using private key S */
func ECPSP_DSA(sha int,RNG *RAND,S []byte,F []byte,C []byte,D []byte) int {
	var T [ECDH_EFS]byte

	B:=hashit(sha,F,0,nil,int(MODBYTES));

	gx:=NewBIGints(CURVE_Gx)
	gy:=NewBIGints(CURVE_Gy)

	G:=NewECPbigs(gx,gy)
	r:=NewBIGints(CURVE_Order)

	s:=fromBytes(S)
	f:=fromBytes(B[:])

	c:=NewBIGint(0)
	d:=NewBIGint(0)
	V:=NewECP()

	for d.iszilch() {
		u:=randomnum(r,RNG);
		if AES_S>0 {
			u.mod2m(2*AES_S)
		}			
		V.copy(G)
		V=V.mul(u)   		
		vx:=V.getX()
		c.copy(vx)
		c.mod(r);
		if c.iszilch() {continue}
		u.invmodp(r)
		d.copy(modmul(s,c,r))
		d.add(f)
		d.copy(modmul(u,d,r))
	} 
       
	c.toBytes(T[:])
	for i:=0;i<ECDH_EFS;i++ {C[i]=T[i]}
	d.toBytes(T[:])
	for i:=0;i<ECDH_EFS;i++ {D[i]=T[i]}
	return 0
}

/* IEEE1363 ECDSA Signature Verification. Signature C and D on F is verified using public key W */
func ECPVP_DSA(sha int,W []byte,F []byte,C []byte,D []byte) int {
	res:=0

	B:=hashit(sha,F,0,nil,int(MODBYTES));

	gx:=NewBIGints(CURVE_Gx)
	gy:=NewBIGints(CURVE_Gy)

	G:=NewECPbigs(gx,gy)
	r:=NewBIGints(CURVE_Order)

	c:=fromBytes(C)
	d:=fromBytes(D)
	f:=fromBytes(B[:])
     
	if (c.iszilch() || comp(c,r)>=0 || d.iszilch() || comp(d,r)>=0) {
            res=ECDH_INVALID;
	}

	if res==0 {
		d.invmodp(r)
		f.copy(modmul(f,d,r))
		h2:=modmul(c,d,r)

		WP:=ECP_fromBytes(W)
		if WP.is_infinity() {
			res=ECDH_ERROR
		} else {
			P:=NewECP()
			P.copy(WP)

			P=P.mul2(h2,G,f)

			if P.is_infinity() {
				res=ECDH_INVALID;
			} else {
				d=P.getX()
				d.mod(r)

				if comp(d,c)!=0 {res=ECDH_INVALID}
			}
		}
	}

	return res
}

/* IEEE1363 ECIES encryption. Encryption of plaintext M uses public key W and produces ciphertext V,C,T */
func ECIES_ENCRYPT(sha int,P1 []byte,P2 []byte,RNG *RAND,W []byte,M []byte,V []byte,T []byte) []byte { 
	var Z [ECDH_EFS]byte
	var VZ [3*ECDH_EFS+1]byte
	var K1 [ECDH_EAS]byte
	var K2 [ECDH_EAS]byte
	var U [ECDH_EGS]byte

	if ECDH_KEY_PAIR_GENERATE(RNG,U[:],V)!=0 {return nil}
	if ECPSVDP_DH(U[:],W,Z[:])!=0 {return nil}     

	for i:=0;i<2*ECDH_EFS+1;i++ {VZ[i]=V[i]}
	for i:=0;i<ECDH_EFS;i++ {VZ[2*ECDH_EFS+1+i]=Z[i]}


	K:=KDF2(sha,VZ[:],P1,ECDH_EFS)

	for i:=0;i<ECDH_EAS;i++ {K1[i]=K[i]; K2[i]=K[ECDH_EAS+i]} 

	C:=AES_CBC_IV0_ENCRYPT(K1[:],M)

	L2:=inttoBytes(len(P2),8)	
	
	var AC []byte

	for i:=0;i<len(C);i++ {AC=append(AC,C[i])}   
	for i:=0;i<len(P2);i++ {AC=append(AC,P2[i])}
	for i:=0;i<8;i++ {AC=append(AC,L2[i])}
	
	HMAC(sha,AC,K2[:],T)

	return C
}

/* IEEE1363 ECIES decryption. Decryption of ciphertext V,C,T using private key U outputs plaintext M */
func ECIES_DECRYPT(sha int,P1 []byte,P2 []byte,V []byte,C []byte,T []byte,U []byte) []byte { 
	var Z [ECDH_EFS]byte
	var VZ [3*ECDH_EFS+1]byte
	var K1 [ECDH_EAS]byte
	var K2 [ECDH_EAS]byte

	var TAG []byte =T[:]  

	if ECPSVDP_DH(U,V,Z[:])!=0 {return nil}

	for i:=0;i<2*ECDH_EFS+1;i++ {VZ[i]=V[i]}
	for i:=0;i<ECDH_EFS;i++ {VZ[2*ECDH_EFS+1+i]=Z[i]}

	K:=KDF2(sha,VZ[:],P1,ECDH_EFS)

	for i:=0;i<ECDH_EAS;i++ {K1[i]=K[i]; K2[i]=K[ECDH_EAS+i]} 

	M:=AES_CBC_IV0_DECRYPT(K1[:],C)

	if M==nil {return nil}

	L2:=inttoBytes(len(P2),8)	
	
	var AC []byte
	
	for i:=0;i<len(C);i++ {AC=append(AC,C[i])}   
	for i:=0;i<len(P2);i++ {AC=append(AC,P2[i])}
	for i:=0;i<8;i++ {AC=append(AC,L2[i])}
	
	HMAC(sha,AC,K2[:],TAG)

	same:=true
	for i:=0;i<len(T);i++ {
		if T[i]!=TAG[i] {same=false}
	}
	if !same {return nil}
	
	return M
}

func ECDH_printBinary(array []byte) {
	for i:=0;i<len(array);i++ {
		fmt.Printf("%02x", array[i])
	}
	fmt.Printf("\n")
}  

func main() {

//	j:=0
	pp:="M0ng00se"
	res:=0

	var sha=ECDH_HASH_TYPE

	var S1 [ECDH_EGS]byte
	var W0 [2*ECDH_EFS+1]byte
	var W1 [2*ECDH_EFS+1]byte
	var Z0 [ECDH_EFS]byte
	var Z1 [ECDH_EFS]byte
	var RAW [100]byte
	var SALT [8]byte
	var P1 [3]byte
	var P2 [4]byte
	var V [2*ECDH_EFS+1]byte
	var M [17]byte
	var T [12]byte
	var CS [ECDH_EGS]byte
	var DS [ECDH_EGS]byte

	rng:=NewRAND()

	rng.Clean();
	for i:=0;i<100;i++ {RAW[i]=byte(i)}

	rng.Seed(100,RAW[:])

//for j:=0;j<100;j++ {

	for i:=0;i<8;i++ {SALT[i]=byte(i+1)}  // set Salt

	fmt.Printf("Alice's Passphrase= "+pp)
	fmt.Printf("\n");
	PW:=[]byte(pp)

/* private key S0 of size EGS bytes derived from Password and Salt */

	S0:=PBKDF2(sha,PW,SALT[:],1000,ECDH_EGS)

	fmt.Printf("Alice's private key= 0x")
	ECDH_printBinary(S0)

/* Generate Key pair S/W */
	ECDH_KEY_PAIR_GENERATE(nil,S0,W0[:])

	fmt.Printf("Alice's public key= 0x")
	ECDH_printBinary(W0[:]);

	res=ECDH_PUBLIC_KEY_VALIDATE(true,W0[:])
	if res!=0 {
		fmt.Printf("ECP Public Key is invalid!\n")
		return
	}

/* Random private key for other party */
	ECDH_KEY_PAIR_GENERATE(rng,S1[:],W1[:])

	fmt.Printf("Servers private key= 0x");
	ECDH_printBinary(S1[:])

	fmt.Printf("Servers public key= 0x")
	ECDH_printBinary(W1[:])


	res=ECDH_PUBLIC_KEY_VALIDATE(true,W1[:])
	if res!=0 {
		fmt.Printf("ECP Public Key is invalid!\n")
		return
	}
/* Calculate common key using DH - IEEE 1363 method */

	ECPSVDP_DH(S0,W1[:],Z0[:])
	ECPSVDP_DH(S1[:],W0[:],Z1[:])

	same:=true
	for i:=0;i<ECDH_EFS;i++ {
		if Z0[i]!=Z1[i] {same=false}
	}

	if !same {
		fmt.Printf("*** ECPSVDP-DH Failed\n");
		return
	}

	KEY:=KDF2(sha,Z0[:],nil,ECDH_EAS);

	fmt.Printf("Alice's DH Key=  0x"); ECDH_printBinary(KEY)
	fmt.Printf("Servers DH Key=  0x"); ECDH_printBinary(KEY)
	
	if CURVETYPE!=MONTGOMERY {
		fmt.Printf("Testing ECIES\n");

		P1[0]=0x0; P1[1]=0x1; P1[2]=0x2
		P2[0]=0x0; P2[1]=0x1; P2[2]=0x2; P2[3]=0x3

		for i:=0;i<=16;i++ {M[i]=byte(i)} 

		C:=ECIES_ENCRYPT(sha,P1[:],P2[:],rng,W1[:],M[:],V[:],T[:])

		fmt.Printf("Ciphertext= \n")
		fmt.Printf("V= 0x"); ECDH_printBinary(V[:])
		fmt.Printf("C= 0x"); ECDH_printBinary(C)
		fmt.Printf("T= 0x"); ECDH_printBinary(T[:])


		RM:=ECIES_DECRYPT(sha,P1[:],P2[:],V[:],C,T[:],S1[:])
		if RM==nil {
			fmt.Printf("*** ECIES Decryption Failed\n")
			return
		} else {fmt.Printf("Decryption succeeded\n")}

		fmt.Printf("Message is 0x"); ECDH_printBinary(RM)

		fmt.Printf("Testing ECDSA\n");

		if ECPSP_DSA(sha,rng,S0,M[:],CS[:],DS[:])!=0 {
			fmt.Printf("***ECDSA Signature Failed\n")
			return
		}
		fmt.Printf("Signature= \n")
		fmt.Printf("C= 0x"); ECDH_printBinary(CS[:])
		fmt.Printf("D= 0x"); ECDH_printBinary(DS[:])

		if ECPVP_DSA(sha,W0[:],M[:],CS[:],DS[:])!=0 {
			fmt.Printf("***ECDSA Verification Failed\n")
			return
		} else {fmt.Printf("ECDSA Signature/Verification succeeded \n")}
	}
}
