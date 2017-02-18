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

/* Elliptic Curve API high-level functions  */

package amcl;

public final class ECDH_ZZZ {
	public static final int INVALID_PUBLIC_KEY=-2;
	public static final int ERROR=-3;
	public static final int INVALID=-4;
	public static final int EFS=BIG_XXX.MODBYTES;
	public static final int EGS=BIG_XXX.MODBYTES;
	public static final int EAS=16;
	public static final int EBS=16;

	public static final int HASH_TYPE=ECDH_SUP.SHA512;

/* Calculate a public/private EC GF(p) key pair W,S where W=S.G mod EC(p),
 * where S is the secret key and W is the public key
 * and G is fixed generator.
 * If RNG is NULL then the private key is provided externally in S
 * otherwise it is generated randomly internally */
	public static int KEY_PAIR_GENERATE(RAND RNG,byte[] S,byte[] W)
	{
		BIG_XXX r,gx,gy,s,wx,wy;
		ECP_ZZZ G,WP;
		int res=0;
	//	byte[] T=new byte[EFS];

		gx=new BIG_XXX(ROM_ZZZ.CURVE_Gx);

		if (ECP_ZZZ.CURVETYPE!=ECP_ZZZ.MONTGOMERY)
		{
			gy=new BIG_XXX(ROM_ZZZ.CURVE_Gy);
			G=new ECP_ZZZ(gx,gy);
		}
		else
			G=new ECP_ZZZ(gx);

		r=new BIG_XXX(ROM_ZZZ.CURVE_Order);

		if (RNG==null)
		{
			s=BIG_XXX.fromBytes(S);
			s.mod(r);
		}
		else
		{
			s=BIG_XXX.randomnum(r,RNG);
		}

		//if (ROM.AES_S>0)
		//{
		//	s.mod2m(2*ROM.AES_S);
		//}
		s.toBytes(S);

		WP=G.mul(s);
		WP.toBytes(W);

		return res;
	}

/* validate public key. Set full=true for fuller check */
	public static int PUBLIC_KEY_VALIDATE(boolean full,byte[] W)
	{
		BIG_XXX r;
		ECP_ZZZ WP=ECP_ZZZ.fromBytes(W);
		int res=0;

		r=new BIG_XXX(ROM_ZZZ.CURVE_Order);

		if (WP.is_infinity()) res=INVALID_PUBLIC_KEY;

		if (res==0 && full)
		{
			WP=WP.mul(r);
			if (!WP.is_infinity()) res=INVALID_PUBLIC_KEY; 
		}
		return res;
	}

/* IEEE-1363 Diffie-Hellman online calculation Z=S.WD */
	public static int SVDP_DH(byte[] S,byte[] WD,byte[] Z)    
	{
		BIG_XXX r,s,wx,wy,z;
		int valid;
		ECP_ZZZ W;
		int res=0;
		byte[] T=new byte[EFS];

		s=BIG_XXX.fromBytes(S);

		W=ECP_ZZZ.fromBytes(WD);
		if (W.is_infinity()) res=ERROR;

		if (res==0)
		{
			r=new BIG_XXX(ROM_ZZZ.CURVE_Order);
			s.mod(r);

			W=W.mul(s);
			if (W.is_infinity()) res=ERROR; 
			else 
			{
				W.getX().toBytes(T);
				for (int i=0;i<EFS;i++) Z[i]=T[i];
			}
		}
		return res;
	}

/* IEEE ECDSA Signature, C and D are signature on F using private key S */
	public static int SP_DSA(int sha,RAND RNG,byte[] S,byte[] F,byte[] C,byte[] D)
	{
		byte[] T=new byte[EFS];
		BIG_XXX gx,gy,r,s,f,c,d,u,vx,w;
		ECP_ZZZ G,V;
		byte[] B=ECDH_SUP.hashit(sha,F,0,null,BIG_XXX.MODBYTES);

		gx=new BIG_XXX(ROM_ZZZ.CURVE_Gx);
		gy=new BIG_XXX(ROM_ZZZ.CURVE_Gy);

		G=new ECP_ZZZ(gx,gy);
		r=new BIG_XXX(ROM_ZZZ.CURVE_Order);

		s=BIG_XXX.fromBytes(S);
		f=BIG_XXX.fromBytes(B);

		c=new BIG_XXX(0);
		d=new BIG_XXX(0);
		V=new ECP_ZZZ();

		do {
			u=BIG_XXX.randomnum(r,RNG);
			w=BIG_XXX.randomnum(r,RNG);
			//if (ROM.AES_S>0)
			//{
			//	u.mod2m(2*ROM.AES_S);
			//}			
			V.copy(G);
			V=V.mul(u);   		
			vx=V.getX();
			c.copy(vx);
			c.mod(r);
			if (c.iszilch()) continue;

			u.copy(BIG_XXX.modmul(u,w,r));

			u.invmodp(r);
			d.copy(BIG_XXX.modmul(s,c,r));
			d.add(f);

			d.copy(BIG_XXX.modmul(d,w,r));

			d.copy(BIG_XXX.modmul(u,d,r));
		} while (d.iszilch());
       
		c.toBytes(T);
		for (int i=0;i<EFS;i++) C[i]=T[i];
		d.toBytes(T);
		for (int i=0;i<EFS;i++) D[i]=T[i];
		return 0;
	}

/* IEEE1363 ECDSA Signature Verification. Signature C and D on F is verified using public key W */
	public static int VP_DSA(int sha,byte[] W,byte[] F, byte[] C,byte[] D)
	{
		BIG_XXX r,gx,gy,f,c,d,h2;
		int res=0;
		ECP_ZZZ G,WP,P;
		int valid; 

		byte[] B=ECDH_SUP.hashit(sha,F,0,null,BIG_XXX.MODBYTES);

		gx=new BIG_XXX(ROM_ZZZ.CURVE_Gx);
		gy=new BIG_XXX(ROM_ZZZ.CURVE_Gy);

		G=new ECP_ZZZ(gx,gy);
		r=new BIG_XXX(ROM_ZZZ.CURVE_Order);

		c=BIG_XXX.fromBytes(C);
		d=BIG_XXX.fromBytes(D);
		f=BIG_XXX.fromBytes(B);
     
		if (c.iszilch() || BIG_XXX.comp(c,r)>=0 || d.iszilch() || BIG_XXX.comp(d,r)>=0) 
            res=INVALID;

		if (res==0)
		{
			d.invmodp(r);
			f.copy(BIG_XXX.modmul(f,d,r));
			h2=BIG_XXX.modmul(c,d,r);

			WP=ECP_ZZZ.fromBytes(W);
			if (WP.is_infinity()) res=ERROR;
			else
			{
				P=new ECP_ZZZ();
				P.copy(WP);
				P=P.mul2(h2,G,f);
				if (P.is_infinity()) res=INVALID;
				else
				{
					d=P.getX();
					d.mod(r);
					if (BIG_XXX.comp(d,c)!=0) res=INVALID;
				}
			}
		}

		return res;
	}

/* IEEE1363 ECIES encryption. Encryption of plaintext M uses public key W and produces ciphertext V,C,T */
	public static byte[] ECIES_ENCRYPT(int sha,byte[] P1,byte[] P2,RAND RNG,byte[] W,byte[] M,byte[] V,byte[] T)
	{ 
		int i,len;

		byte[] Z=new byte[EFS];
		byte[] VZ=new byte[3*EFS+1];
		byte[] K1=new byte[EAS];
		byte[] K2=new byte[EAS];
		byte[] U=new byte[EGS];

		if (KEY_PAIR_GENERATE(RNG,U,V)!=0) return new byte[0];  
		if (SVDP_DH(U,W,Z)!=0) return new byte[0];     

		for (i=0;i<2*EFS+1;i++) VZ[i]=V[i];
		for (i=0;i<EFS;i++) VZ[2*EFS+1+i]=Z[i];


		byte[] K=ECDH_SUP.KDF2(sha,VZ,P1,EFS);

		for (i=0;i<EAS;i++) {K1[i]=K[i]; K2[i]=K[EAS+i];} 

		byte[] C=ECDH_SUP.AES_CBC_IV0_ENCRYPT(K1,M);

		byte[] L2=ECDH_SUP.inttoBytes(P2.length,8);	
	
		byte[] AC=new byte[C.length+P2.length+8];
		for (i=0;i<C.length;i++) AC[i]=C[i];
		for (i=0;i<P2.length;i++) AC[C.length+i]=P2[i];
		for (i=0;i<8;i++) AC[C.length+P2.length+i]=L2[i];
	
		ECDH_SUP.HMAC(sha,AC,K2,T);

		return C;
	}

/* IEEE1363 ECIES decryption. Decryption of ciphertext V,C,T using private key U outputs plaintext M */
	public static byte[] ECIES_DECRYPT(int sha,byte[] P1,byte[] P2,byte[] V,byte[] C,byte[] T,byte[] U)
	{ 

		int i,len;

		byte[] Z=new byte[EFS];
		byte[] VZ=new byte[3*EFS+1];
		byte[] K1=new byte[EAS];
		byte[] K2=new byte[EAS];
		byte[] TAG=new byte[T.length];

		if (SVDP_DH(U,V,Z)!=0) return new byte[0];  

		for (i=0;i<2*EFS+1;i++) VZ[i]=V[i];
		for (i=0;i<EFS;i++) VZ[2*EFS+1+i]=Z[i];

		byte[] K=ECDH_SUP.KDF2(sha,VZ,P1,EFS);

		for (i=0;i<EAS;i++) {K1[i]=K[i]; K2[i]=K[EAS+i];} 

		byte[] M=ECDH_SUP.AES_CBC_IV0_DECRYPT(K1,C); 

		if (M.length==0) return M;

		byte[] L2=ECDH_SUP.inttoBytes(P2.length,8);	
	
		byte[] AC=new byte[C.length+P2.length+8];

		for (i=0;i<C.length;i++) AC[i]=C[i];
		for (i=0;i<P2.length;i++) AC[C.length+i]=P2[i];
		for (i=0;i<8;i++) AC[C.length+P2.length+i]=L2[i];
	
		ECDH_SUP.HMAC(sha,AC,K2,TAG);

		boolean same=true;
		for (i=0;i<T.length;i++) if (T[i]!=TAG[i]) same=false;
		if (!same) return new byte[0];
	
		return M;

	}
}
