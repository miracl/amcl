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

/* test driver and function exerciser for ECDH/ECIES/ECDSA API Functions */

import java.util.Scanner;
import amcl.*;
/*
import amcl.ECDH_ED25519;
import amcl.ECDH_NIST256;
import amcl.ECDH_GOLDILOCKS;
import amcl.MPIN_BN254;
import amcl.RSA_2048;
*/

public class TestALL
{
	private static void printBinary(byte[] array)
	{
		int i;
		for (i=0;i<array.length;i++)
		{
			System.out.printf("%02x", array[i]);
		}
		System.out.println();
	}    

	private static void ecdh_ED25519(amcl.RAND rng)
	{
		int i,j=0,res;
		int result;
		String pp=new String("M0ng00se");

		int EGS=amcl.ECDH_ED25519.EGS;
		int EFS=amcl.ECDH_ED25519.EFS;
		int EAS=amcl.AES.KS;
		int sha=amcl.ECDH_ED25519.HASH_TYPE;

		byte[] S1=new byte[EGS];
		byte[] W0=new byte[2*EFS+1];
		byte[] W1=new byte[2*EFS+1];
		byte[] Z0=new byte[EFS];
		byte[] Z1=new byte[EFS];

		byte[] SALT=new byte[8];
		byte[] P1=new byte[3];
		byte[] P2=new byte[4];
		byte[] V=new byte[2*EFS+1];
		byte[] M=new byte[17];
		byte[] T=new byte[12];
		byte[] CS=new byte[EGS];
		byte[] DS=new byte[EGS];

		for (i=0;i<8;i++) SALT[i]=(byte)(i+1);  // set Salt

		System.out.println("Alice's Passphrase= "+pp);
		byte[] PW=pp.getBytes();

/* private key S0 of size EGS bytes derived from Password and Salt */

		byte[] S0=amcl.ECDH_SUP.PBKDF2(sha,PW,SALT,1000,EGS);

		System.out.print("Alice's private key= 0x");
		printBinary(S0);

/* Generate Key pair S/W */
		amcl.ECDH_ED25519.KEY_PAIR_GENERATE(null,S0,W0); 

		System.out.print("Alice's public key= 0x");
		printBinary(W0);

		res=amcl.ECDH_ED25519.PUBLIC_KEY_VALIDATE(true,W0);
		if (res!=0)
		{
			System.out.println("ECP Public Key is invalid!\n");
			return;
		}
/* Random private key for other party */
		amcl.ECDH_ED25519.KEY_PAIR_GENERATE(rng,S1,W1);

		System.out.print("Servers private key= 0x");
		printBinary(S1);

		System.out.print("Servers public key= 0x");
		printBinary(W1);


		res=amcl.ECDH_ED25519.PUBLIC_KEY_VALIDATE(true,W1);
		if (res!=0)
		{
			System.out.print("ECP Public Key is invalid!\n");
			return;
		}

/* Calculate common key using DH - IEEE 1363 method */

		amcl.ECDH_ED25519.SVDP_DH(S0,W1,Z0);
		amcl.ECDH_ED25519.SVDP_DH(S1,W0,Z1);

		boolean same=true;
		for (i=0;i<EFS;i++)
			if (Z0[i]!=Z1[i]) same=false;

		if (!same)
		{
			System.out.println("*** ECPSVDP-DH Failed");
			return;
		}

		byte[] KEY=amcl.ECDH_SUP.KDF2(sha,Z0,null,EAS);

		System.out.print("Alice's DH Key=  0x"); printBinary(KEY);
		System.out.print("Servers DH Key=  0x"); printBinary(KEY);

		if (amcl.ECP_ED25519.CURVETYPE!=amcl.ECP_ED25519.MONTGOMERY)
		{
			System.out.println("Testing ECIES");

			P1[0]=0x0; P1[1]=0x1; P1[2]=0x2; 
			P2[0]=0x0; P2[1]=0x1; P2[2]=0x2; P2[3]=0x3; 

			for (i=0;i<=16;i++) M[i]=(byte)i; 

			byte[] C=amcl.ECDH_ED25519.ECIES_ENCRYPT(sha,P1,P2,rng,W1,M,V,T);

			System.out.println("Ciphertext= ");
			System.out.print("V= 0x"); printBinary(V);
			System.out.print("C= 0x"); printBinary(C);
			System.out.print("T= 0x"); printBinary(T);


			M=amcl.ECDH_ED25519.ECIES_DECRYPT(sha,P1,P2,V,C,T,S1);
			if (M.length==0)
			{
				System.out.println("*** ECIES Decryption Failed\n");
				return;
			}
			else System.out.println("Decryption succeeded");

			System.out.print("Message is 0x"); printBinary(M);

			System.out.println("Testing ECDSA");

			if (amcl.ECDH_ED25519.SP_DSA(sha,rng,S0,M,CS,DS)!=0)
			{
				System.out.println("***ECDSA Signature Failed");
				return;
			}
			System.out.println("Signature= ");
			System.out.print("C= 0x"); printBinary(CS);
			System.out.print("D= 0x"); printBinary(DS);

			if (amcl.ECDH_ED25519.VP_DSA(sha,W0,M,CS,DS)!=0)
			{
				System.out.println("***ECDSA Verification Failed");
				return;
			}
			else System.out.println("ECDSA Signature/Verification succeeded "+j);

		}
	}

	private static void ecdh_NIST256(amcl.RAND rng)
	{
		int i,j=0,res;
		int result;
		String pp=new String("M0ng00se");

		int EGS=amcl.ECDH_NIST256.EGS;
		int EFS=amcl.ECDH_NIST256.EFS;
		int EAS=amcl.AES.KS;
		int sha=amcl.ECDH_NIST256.HASH_TYPE;

		byte[] S1=new byte[EGS];
		byte[] W0=new byte[2*EFS+1];
		byte[] W1=new byte[2*EFS+1];
		byte[] Z0=new byte[EFS];
		byte[] Z1=new byte[EFS];

		byte[] SALT=new byte[8];
		byte[] P1=new byte[3];
		byte[] P2=new byte[4];
		byte[] V=new byte[2*EFS+1];
		byte[] M=new byte[17];
		byte[] T=new byte[12];
		byte[] CS=new byte[EGS];
		byte[] DS=new byte[EGS];

		for (i=0;i<8;i++) SALT[i]=(byte)(i+1);  // set Salt

		System.out.println("Alice's Passphrase= "+pp);
		byte[] PW=pp.getBytes();

/* private key S0 of size EGS bytes derived from Password and Salt */

		byte[] S0=amcl.ECDH_SUP.PBKDF2(sha,PW,SALT,1000,EGS);

		System.out.print("Alice's private key= 0x");
		printBinary(S0);

/* Generate Key pair S/W */
		amcl.ECDH_NIST256.KEY_PAIR_GENERATE(null,S0,W0); 

		System.out.print("Alice's public key= 0x");
		printBinary(W0);

		res=amcl.ECDH_NIST256.PUBLIC_KEY_VALIDATE(true,W0);
		if (res!=0)
		{
			System.out.println("ECP Public Key is invalid!\n");
			return;
		}
/* Random private key for other party */
		amcl.ECDH_NIST256.KEY_PAIR_GENERATE(rng,S1,W1);

		System.out.print("Servers private key= 0x");
		printBinary(S1);

		System.out.print("Servers public key= 0x");
		printBinary(W1);


		res=amcl.ECDH_NIST256.PUBLIC_KEY_VALIDATE(true,W1);
		if (res!=0)
		{
			System.out.print("ECP Public Key is invalid!\n");
			return;
		}

/* Calculate common key using DH - IEEE 1363 method */

		amcl.ECDH_NIST256.SVDP_DH(S0,W1,Z0);
		amcl.ECDH_NIST256.SVDP_DH(S1,W0,Z1);

		boolean same=true;
		for (i=0;i<EFS;i++)
			if (Z0[i]!=Z1[i]) same=false;

		if (!same)
		{
			System.out.println("*** ECPSVDP-DH Failed");
			return;
		}

		byte[] KEY=amcl.ECDH_SUP.KDF2(sha,Z0,null,EAS);

		System.out.print("Alice's DH Key=  0x"); printBinary(KEY);
		System.out.print("Servers DH Key=  0x"); printBinary(KEY);

		if (amcl.ECP_NIST256.CURVETYPE!=amcl.ECP_NIST256.MONTGOMERY)
		{
			System.out.println("Testing ECIES");

			P1[0]=0x0; P1[1]=0x1; P1[2]=0x2; 
			P2[0]=0x0; P2[1]=0x1; P2[2]=0x2; P2[3]=0x3; 

			for (i=0;i<=16;i++) M[i]=(byte)i; 

			byte[] C=amcl.ECDH_NIST256.ECIES_ENCRYPT(sha,P1,P2,rng,W1,M,V,T);

			System.out.println("Ciphertext= ");
			System.out.print("V= 0x"); printBinary(V);
			System.out.print("C= 0x"); printBinary(C);
			System.out.print("T= 0x"); printBinary(T);


			M=amcl.ECDH_NIST256.ECIES_DECRYPT(sha,P1,P2,V,C,T,S1);
			if (M.length==0)
			{
				System.out.println("*** ECIES Decryption Failed\n");
				return;
			}
			else System.out.println("Decryption succeeded");

			System.out.print("Message is 0x"); printBinary(M);

			System.out.println("Testing ECDSA");

			if (amcl.ECDH_NIST256.SP_DSA(sha,rng,S0,M,CS,DS)!=0)
			{
				System.out.println("***ECDSA Signature Failed");
				return;
			}
			System.out.println("Signature= ");
			System.out.print("C= 0x"); printBinary(CS);
			System.out.print("D= 0x"); printBinary(DS);

			if (amcl.ECDH_NIST256.VP_DSA(sha,W0,M,CS,DS)!=0)
			{
				System.out.println("***ECDSA Verification Failed");
				return;
			}
			else System.out.println("ECDSA Signature/Verification succeeded "+j);

		}
	}

	private static void ecdh_GOLDILOCKS(amcl.RAND rng)
	{
		int i,j=0,res;
		int result;
		String pp=new String("M0ng00se");

		int EGS=amcl.ECDH_GOLDILOCKS.EGS;
		int EFS=amcl.ECDH_GOLDILOCKS.EFS;
		int EAS=amcl.AES.KS;
		int sha=amcl.ECDH_GOLDILOCKS.HASH_TYPE;

		byte[] S1=new byte[EGS];
		byte[] W0=new byte[2*EFS+1];
		byte[] W1=new byte[2*EFS+1];
		byte[] Z0=new byte[EFS];
		byte[] Z1=new byte[EFS];

		byte[] SALT=new byte[8];
		byte[] P1=new byte[3];
		byte[] P2=new byte[4];
		byte[] V=new byte[2*EFS+1];
		byte[] M=new byte[17];
		byte[] T=new byte[12];
		byte[] CS=new byte[EGS];
		byte[] DS=new byte[EGS];

		for (i=0;i<8;i++) SALT[i]=(byte)(i+1);  // set Salt

		System.out.println("Alice's Passphrase= "+pp);
		byte[] PW=pp.getBytes();

/* private key S0 of size EGS bytes derived from Password and Salt */

		byte[] S0=amcl.ECDH_SUP.PBKDF2(sha,PW,SALT,1000,EGS);

		System.out.print("Alice's private key= 0x");
		printBinary(S0);

/* Generate Key pair S/W */
		amcl.ECDH_GOLDILOCKS.KEY_PAIR_GENERATE(null,S0,W0); 

		System.out.print("Alice's public key= 0x");
		printBinary(W0);

		res=amcl.ECDH_GOLDILOCKS.PUBLIC_KEY_VALIDATE(true,W0);
		if (res!=0)
		{
			System.out.println("ECP Public Key is invalid!\n");
			return;
		}
/* Random private key for other party */
		amcl.ECDH_GOLDILOCKS.KEY_PAIR_GENERATE(rng,S1,W1);

		System.out.print("Servers private key= 0x");
		printBinary(S1);

		System.out.print("Servers public key= 0x");
		printBinary(W1);


		res=amcl.ECDH_GOLDILOCKS.PUBLIC_KEY_VALIDATE(true,W1);
		if (res!=0)
		{
			System.out.print("ECP Public Key is invalid!\n");
			return;
		}

/* Calculate common key using DH - IEEE 1363 method */

		amcl.ECDH_GOLDILOCKS.SVDP_DH(S0,W1,Z0);
		amcl.ECDH_GOLDILOCKS.SVDP_DH(S1,W0,Z1);

		boolean same=true;
		for (i=0;i<EFS;i++)
			if (Z0[i]!=Z1[i]) same=false;

		if (!same)
		{
			System.out.println("*** ECPSVDP-DH Failed");
			return;
		}

		byte[] KEY=amcl.ECDH_SUP.KDF2(sha,Z0,null,EAS);

		System.out.print("Alice's DH Key=  0x"); printBinary(KEY);
		System.out.print("Servers DH Key=  0x"); printBinary(KEY);

		if (amcl.ECP_GOLDILOCKS.CURVETYPE!=amcl.ECP_GOLDILOCKS.MONTGOMERY)
		{
			System.out.println("Testing ECIES");

			P1[0]=0x0; P1[1]=0x1; P1[2]=0x2; 
			P2[0]=0x0; P2[1]=0x1; P2[2]=0x2; P2[3]=0x3; 

			for (i=0;i<=16;i++) M[i]=(byte)i; 

			byte[] C=amcl.ECDH_GOLDILOCKS.ECIES_ENCRYPT(sha,P1,P2,rng,W1,M,V,T);

			System.out.println("Ciphertext= ");
			System.out.print("V= 0x"); printBinary(V);
			System.out.print("C= 0x"); printBinary(C);
			System.out.print("T= 0x"); printBinary(T);


			M=amcl.ECDH_GOLDILOCKS.ECIES_DECRYPT(sha,P1,P2,V,C,T,S1);
			if (M.length==0)
			{
				System.out.println("*** ECIES Decryption Failed\n");
				return;
			}
			else System.out.println("Decryption succeeded");

			System.out.print("Message is 0x"); printBinary(M);

			System.out.println("Testing ECDSA");

			if (amcl.ECDH_GOLDILOCKS.SP_DSA(sha,rng,S0,M,CS,DS)!=0)
			{
				System.out.println("***ECDSA Signature Failed");
				return;
			}
			System.out.println("Signature= ");
			System.out.print("C= 0x"); printBinary(CS);
			System.out.print("D= 0x"); printBinary(DS);

			if (amcl.ECDH_GOLDILOCKS.VP_DSA(sha,W0,M,CS,DS)!=0)
			{
				System.out.println("***ECDSA Verification Failed");
				return;
			}
			else System.out.println("ECDSA Signature/Verification succeeded "+j);

		}
	}

	static boolean PERMITS=true;
	static boolean PINERROR=true;
	static boolean FULL=true;
	static boolean SINGLE_PASS=false;

	private static void mpin_BN254(amcl.RAND rng)
	{
		int EGS=amcl.MPIN_BN254.EGS;
		int EFS=amcl.MPIN_BN254.EFS;
		int G1S=2*EFS+1; /* Group 1 Size */
		int G2S=4*EFS; /* Group 2 Size */
		int EAS=16;

		int sha=amcl.MPIN_BN254.HASH_TYPE;

		byte[] S = new byte[EGS];
		byte[] SST = new byte[G2S];
		byte[] TOKEN = new byte[G1S];
		byte[] PERMIT = new byte[G1S];
		byte[] SEC = new byte[G1S];
		byte[] xID = new byte[G1S];
		byte[] xCID = new byte[G1S];
		byte[] X= new byte[EGS];
		byte[] Y= new byte[EGS];
		byte[] E=new byte[12*EFS];
		byte[] F=new byte[12*EFS];
		byte[] HID=new byte[G1S];
		byte[] HTID=new byte[G1S];

		byte[] G1=new byte[12*EFS];
		byte[] G2=new byte[12*EFS];
		byte[] R=new byte[EGS];
		byte[] Z=new byte[G1S];
		byte[] W=new byte[EGS];
		byte[] T=new byte[G1S];
		byte[] CK=new byte[EAS];
		byte[] SK=new byte[EAS];

		byte[] HSID=null;

/* Trusted Authority set-up */

		amcl.MPIN_BN254.RANDOM_GENERATE(rng,S);
		System.out.print("Master Secret s: 0x");  printBinary(S);
 
 /* Create Client Identity */
 		String IDstr = "testUser@miracl.com";
		byte[] CLIENT_ID = IDstr.getBytes();   

		byte[] HCID=amcl.MPIN_SUP.HASH_ID(sha,CLIENT_ID,EFS);  /* Either Client or TA calculates Hash(ID) - you decide! */

		System.out.print("Client ID Hash= "); printBinary(HCID);
		System.out.print("Client ID= "); printBinary(CLIENT_ID);

/* Client and Server are issued secrets by DTA */
		amcl.MPIN_BN254.GET_SERVER_SECRET(S,SST);
		System.out.print("Server Secret SS: 0x");  printBinary(SST); 

		amcl.MPIN_BN254.GET_CLIENT_SECRET(S,HCID,TOKEN);
		System.out.print("Client Secret CS: 0x");        
		printBinary(TOKEN); 

/* Client extracts PIN from secret to create Token */
		int pin=1234;
		System.out.println("Client extracts PIN= "+pin); 
		int rtn=amcl.MPIN_BN254.EXTRACT_PIN(sha,CLIENT_ID,pin,TOKEN);
		if (rtn != 0)
			System.out.println("FAILURE: EXTRACT_PIN rtn: " + rtn);

		System.out.print("Client Token TK: 0x"); printBinary(TOKEN);

		if (FULL)
		{
			amcl.MPIN_BN254.PRECOMPUTE(TOKEN,HCID,G1,G2);
		}
		int date;
		if (PERMITS)
		{
			date=amcl.MPIN_SUP.today();
/* Client gets "Time Token" permit from DTA */ 
			amcl.MPIN_BN254.GET_CLIENT_PERMIT(sha,date,S,HCID,PERMIT);
			System.out.print("Time Permit TP: 0x");  printBinary(PERMIT); 

/* This encoding makes Time permit look random - Elligator squared */
			amcl.MPIN_BN254.ENCODING(rng,PERMIT);
			System.out.print("Encoded Time Permit TP: 0x");  printBinary(PERMIT); 
			amcl.MPIN_BN254.DECODING(PERMIT);
			System.out.print("Decoded Time Permit TP: 0x");  printBinary(PERMIT); 
		}
		else date=0;

		System.out.print("\nPIN= ");
		Scanner scan=new Scanner(System.in);
		pin=scan.nextInt();

/* Set date=0 and PERMIT=null if time permits not in use

Client First pass: Inputs CLIENT_ID, optional RNG, pin, TOKEN and PERMIT. Output xID =x .H(CLIENT_ID) and re-combined secret SEC
If PERMITS are is use, then date!=0 and PERMIT is added to secret and xCID = x.(H(CLIENT_ID)+H(date|H(CLIENT_ID)))
Random value x is supplied externally if RNG=null, otherwise generated and passed out by RNG

IMPORTANT: To save space and time..
If Time Permits OFF set xCID = null, HTID=null and use xID and HID only
If Time permits are ON, AND pin error detection is required then all of xID, xCID, HID and HTID are required
If Time permits are ON, AND pin error detection is NOT required, set xID=null, HID=null and use xCID and HTID only.


*/

		byte[] pxID=xID;
		byte[] pxCID=xCID;
		byte[] pHID=HID;
		byte[] pHTID=HTID;
		byte[] pE=E;
		byte[] pF=F;
		byte[] pPERMIT=PERMIT;
		byte[] prHID;

		if (date!=0)
		{

			prHID=pHTID;
			if (!PINERROR)
			{
				pxID=null;
		//		pHID=null;  // new
			}
		}
		else
		{
			prHID=pHID;
			pPERMIT=null;
			pxCID=null;
			pHTID=null;
		}
		if (!PINERROR)
		{
			pE=null;
			pF=null;
		}
                 
		if (SINGLE_PASS)
		{
  			System.out.println("MPIN Single Pass");
			int timeValue = amcl.MPIN_SUP.GET_TIME();
			rtn=amcl.MPIN_BN254.CLIENT(sha,date,CLIENT_ID,rng,X,pin,TOKEN,SEC,pxID,pxCID,pPERMIT,timeValue,Y);
			if (rtn != 0)
  				System.out.println("FAILURE: CLIENT rtn: " + rtn);

			if (FULL)
			{
				HCID=amcl.MPIN_SUP.HASH_ID(sha,CLIENT_ID,EFS);
				amcl.MPIN_BN254.GET_G1_MULTIPLE(rng,1,R,HCID,Z);  /* Also Send Z=r.ID to Server, remember random r */
			}

			rtn=amcl.MPIN_BN254.SERVER(sha,date,pHID,pHTID,Y,SST,pxID,pxCID,SEC,pE,pF,CLIENT_ID,timeValue);
			if (rtn != 0)
  		    System.out.println("FAILURE: SERVER rtn: " + rtn);

			if (FULL)
			{
				HSID=amcl.MPIN_SUP.HASH_ID(sha,CLIENT_ID,EFS);
				amcl.MPIN_BN254.GET_G1_MULTIPLE(rng,0,W,prHID,T);  /* Also send T=w.ID to client, remember random w  */
			}
		}
		else
		{
  			System.out.println("MPIN Multi Pass");
                  /* Send U=x.ID to server, and recreate secret from token and pin */
  			rtn=amcl.MPIN_BN254.CLIENT_1(sha,date,CLIENT_ID,rng,X,pin,TOKEN,SEC,pxID,pxCID,pPERMIT);
  			if (rtn != 0)
  				System.out.println("FAILURE: CLIENT_1 rtn: " + rtn);
  
  			if (FULL)
  			{
  				HCID=amcl.MPIN_SUP.HASH_ID(sha,CLIENT_ID,EFS);
  				amcl.MPIN_BN254.GET_G1_MULTIPLE(rng,1,R,HCID,Z);  /* Also Send Z=r.ID to Server, remember random r */
  			}
  
                  /* Server calculates H(ID) and H(T|H(ID)) (if time permits enabled), and maps them to points on the curve HID and HTID resp. */
  			amcl.MPIN_BN254.SERVER_1(sha,date,CLIENT_ID,pHID,pHTID);
  
                  /* Server generates Random number Y and sends it to Client */
  			amcl.MPIN_BN254.RANDOM_GENERATE(rng,Y);
  
			if (FULL)
			{
				HSID=amcl.MPIN_SUP.HASH_ID(sha,CLIENT_ID,EFS);
  				amcl.MPIN_BN254.GET_G1_MULTIPLE(rng,0,W,prHID,T);  /* Also send T=w.ID to client, remember random w  */
			}
  
                  /* Client Second Pass: Inputs Client secret SEC, x and y. Outputs -(x+y)*SEC */
  			rtn=amcl.MPIN_BN254.CLIENT_2(X,Y,SEC);
  			if (rtn != 0)
  				System.out.println("FAILURE: CLIENT_2 rtn: " + rtn);
  
                  /* Server Second pass. Inputs hashed client id, random Y, -(x+y)*SEC, xID and xCID and Server secret SST. E and F help kangaroos to find error. */
                  /* If PIN error not required, set E and F = null */
  
  			rtn=amcl.MPIN_BN254.SERVER_2(date,pHID,pHTID,Y,SST,pxID,pxCID,SEC,pE,pF);
  
  			if (rtn != 0)
  				System.out.println("FAILURE: SERVER_2 rtn: " + rtn);
		}
  
		if (rtn == amcl.MPIN_BN254.BAD_PIN)
		{
			System.out.println("Server says - Bad Pin. I don't know you. Feck off.\n");
			if (PINERROR)
			{
				int err=amcl.MPIN_BN254.KANGAROO(E,F);
				if (err!=0) System.out.format("(Client PIN is out by %d)\n",err);
			}
			return;
		}
		else System.out.println("Server says - PIN is good! You really are "+IDstr);


		if (FULL)
		{
			byte[] H=amcl.MPIN_SUP.HASH_ALL(sha,HCID,pxID,pxCID,SEC,Y,Z,T,EFS);
			amcl.MPIN_BN254.CLIENT_KEY(sha,G1,G2,pin,R,X,H,T,CK);
			System.out.print("Client Key =  0x");  printBinary(CK); 

			H=amcl.MPIN_SUP.HASH_ALL(sha,HSID,pxID,pxCID,SEC,Y,Z,T,EFS);
			amcl.MPIN_BN254.SERVER_KEY(sha,Z,SST,W,H,pHID,pxID,pxCID,SK);
			System.out.print("Server Key =  0x");  printBinary(SK); 
		}
	}

	private static void rsa_2048(amcl.RAND rng)
	{
		int i;
		int RFS=amcl.RSA_2048.RFS;
		int sha=amcl.RSA_2048.HASH_TYPE;

		String message="Hello World\n";

		amcl.rsa_public_key_2048 pub=new amcl.rsa_public_key_2048(amcl.FF_2048.FFLEN);
		amcl.rsa_private_key_2048 priv=new amcl.rsa_private_key_2048(amcl.FF_2048.HFLEN);

		byte[] ML=new byte[RFS];
		byte[] C=new byte[RFS];
		byte[] S=new byte[RFS];
	
//for (i=0;i<10;i++)
//{
		System.out.println("Generating public/private key pair");
		amcl.RSA_2048.KEY_PAIR(rng,65537,priv,pub);

		byte[] M=message.getBytes();
		System.out.print("Encrypting test string\n");


		byte[] E=amcl.RSA_2048.OAEP_ENCODE(sha,M,rng,null); /* OAEP encode message M to E  */

		if (E.length==0) System.out.println("Encoding failed\n");

		amcl.RSA_2048.ENCRYPT(pub,E,C);     /* encrypt encoded message */
		System.out.print("Ciphertext= 0x"); printBinary(C);

		System.out.print("Decrypting test string\n");
		amcl.RSA_2048.DECRYPT(priv,C,ML); 
		byte[] MS=amcl.RSA_2048.OAEP_DECODE(sha,null,ML); /* OAEP decode message  */

		message=new String(MS);
		System.out.print(message);
//}

		System.out.println("Signing message");
		amcl.RSA_2048.PKCS15(sha,M,C);

		amcl.RSA_2048.DECRYPT(priv,C,S); /* create signature in S */ 

		System.out.print("Signature= 0x"); printBinary(S);

		amcl.RSA_2048.ENCRYPT(pub,S,ML); 

		boolean cmp=true;
		if (C.length!=ML.length) cmp=false;
		else
		{
			for (int j=0;j<C.length;j++)
				if (C[j]!=ML[j]) cmp=false;
		}
		if (cmp) System.out.println("Signature is valid");
		else System.out.println("Signature is INVALID");

		amcl.RSA_2048.PRIVATE_KEY_KILL(priv);
	}

	public static void main(String[] args) 
	{

		byte[] RAW=new byte[100];
		amcl.RAND rng=new amcl.RAND();

		rng.clean();
		for (int i=0;i<100;i++) RAW[i]=(byte)(i);

		rng.seed(100,RAW);

		ecdh_ED25519(rng);
		ecdh_NIST256(rng);
		ecdh_GOLDILOCKS(rng);
		mpin_BN254(rng);
		rsa_2048(rng);


	}
}
