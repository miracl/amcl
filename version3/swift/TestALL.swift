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

//
//  TestECDH.swift
//
//  Created by Michael Scott on 02/07/2015.
//  Copyright (c) 2015 Michael Scott. All rights reserved.
//

import Foundation
import amcl // comment out for Xcode
import ed25519
import bn254
import rsa2048

public func printBinary(_ array: [UInt8])
{
    for i in 0 ..< array.count
    {
        let h=String(format:"%02x",array[i])
        print("\(h)", terminator: "")
    }
    print(" ");
}

public func TestRSA(_ rng: RAND)
{
    let RFS=RSA.RFS

    var message="Hello World\n"

    let pub=rsa_public_key(Int(FF.FFLEN))
    let priv=rsa_private_key(Int(FF.HFLEN))

    var ML=[UInt8](repeating: 0,count: RFS)
    var C=[UInt8](repeating: 0,count: RFS)
    var S=[UInt8](repeating: 0,count: RFS)
 

    print("\nGenerating RSA public/private key pair")
    RSA.KEY_PAIR(rng,65537,priv,pub)

    let M=[UInt8](message.utf8)
    print("Encrypting test string\n");
    let E=RSA.OAEP_ENCODE(RSA.HASH_TYPE,M,rng,nil); /* OAEP encode message m to e  */

    RSA.ENCRYPT(pub,E,&C);     /* encrypt encoded message */
    print("Ciphertext= 0x", terminator: ""); printBinary(C)

    print("Decrypting test string\n");
    RSA.DECRYPT(priv,C,&ML)
    var MS=RSA.OAEP_DECODE(RSA.HASH_TYPE,nil,&ML) /* OAEP encode message m to e  */

    message=""
    for i in 0 ..< MS.count
    {
        message+=String(UnicodeScalar(MS[i]))
    }
    print(message);
    
    print("Signing message")
    RSA.PKCS15(RSA.HASH_TYPE,M,&C)
    
    RSA.DECRYPT(priv,C,&S); //  create signature in S
    print("Signature= 0x",terminator: ""); printBinary(S)
    
    RSA.ENCRYPT(pub,S,&ML);
    
    var cmp=true
    if C.count != ML.count {cmp=false}
    else
    {
        for j in 0 ..< C.count
        {
            if C[j] != ML[j] {cmp=false}
        }
    }
    
    if cmp {print("\nSignature is valid\n")}
    else {print("\nSignature is INVALID\n")}
    

    RSA.PRIVATE_KEY_KILL(priv);
}


public func TestECDH(_ rng: RAND)
{
    let pp=String("M0ng00se");
    
    let EGS=ed25519.ECDH.EGS
    let EFS=ed25519.ECDH.EFS
    let EAS=ed25519.ECP.AESKEY
    let sha=ed25519.ECP.HASH_TYPE
    
    var S1=[UInt8](repeating: 0,count: EGS)
    var W0=[UInt8](repeating: 0,count: 2*EFS+1)
    var W1=[UInt8](repeating: 0,count: 2*EFS+1)
    var Z0=[UInt8](repeating: 0,count: EFS)
    var Z1=[UInt8](repeating: 0,count: EFS)
 
    var SALT=[UInt8](repeating: 0,count: 8)
    var P1=[UInt8](repeating: 0,count: 3)
    var P2=[UInt8](repeating: 0,count: 4)
    var V=[UInt8](repeating: 0,count: 2*EFS+1)
    var M=[UInt8](repeating: 0,count: 17)
    var T=[UInt8](repeating: 0,count: 12)
    var CS=[UInt8](repeating: 0,count: EGS)
    var DS=[UInt8](repeating: 0,count: EGS)
    
   
    
    for i in 0 ..< 8 {SALT[i]=UInt8(i+1)}  // set Salt
    
    print("\nAlice's Passphrase= " + pp)
    let PW=[UInt8]( (pp).utf8 )
    
    /* private key S0 of size EGS bytes derived from Password and Salt */
    
/* Note use of curve name here to disambiguate between supported curves!! */
/* Not needed if only one curve supported */

    var S0=ed25519.ECDH.PBKDF2(sha,PW,SALT,1000,EGS)
    print("Alice's private key= 0x",terminator: ""); printBinary(S0)
    
    /* Generate Key pair S/W */
    ECDH.KEY_PAIR_GENERATE(nil,&S0,&W0);
    
    print("Alice's public key= 0x",terminator: ""); printBinary(W0)
    
    var res=ECDH.PUBLIC_KEY_VALIDATE(W0);

    if res != 0
    {
        print("ECP Public Key is invalid!");
        return;
    }
    
    /* Random private key for other party */
    ECDH.KEY_PAIR_GENERATE(rng,&S1,&W1)
    
    print("Servers private key= 0x",terminator: ""); printBinary(S1)
    
    print("Servers public key= 0x",terminator: ""); printBinary(W1);
    
    res=ECDH.PUBLIC_KEY_VALIDATE(W1)
    if res != 0
    {
        print("ECP Public Key is invalid!")
        return
    }
    
    /* Calculate common key using DH - IEEE 1363 method */
    
    ECDH.ECPSVDP_DH(S0,W1,&Z0)
    ECDH.ECPSVDP_DH(S1,W0,&Z1)
    
    var same=true
    for i in 0 ..< EFS
    {
        if Z0[i] != Z1[i] {same=false}
    }
    
    if (!same)
    {
        print("*** ECPSVDP-DH Failed")
        return
    }
    
    let KEY=ECDH.KDF2(sha,Z0,nil,EAS)
    
    print("Alice's DH Key=  0x",terminator: ""); printBinary(KEY)
    print("Servers DH Key=  0x",terminator: ""); printBinary(KEY)

    if ed25519.ECP.CURVETYPE != ed25519.ECP.MONTGOMERY
    {
        print("Testing ECIES")
    
        P1[0]=0x0; P1[1]=0x1; P1[2]=0x2
        P2[0]=0x0; P2[1]=0x1; P2[2]=0x2; P2[3]=0x3
    
        for i in 0...16 {M[i]=UInt8(i&0xff)}
    
        let C=ECDH.ECIES_ENCRYPT(sha,P1,P2,rng,W1,M,&V,&T)

        print("Ciphertext= ")
        print("V= 0x",terminator: ""); printBinary(V)
        print("C= 0x",terminator: ""); printBinary(C)
        print("T= 0x",terminator: ""); printBinary(T)

        M=ECDH.ECIES_DECRYPT(sha,P1,P2,V,C,T,S1)
        if M.count==0
        {
            print("*** ECIES Decryption Failed\n")
            return
        }
        else {print("Decryption succeeded")}
    
        print("Message is 0x"); printBinary(M)
    
        print("Testing ECDSA")

        if ECDH.ECPSP_DSA(sha,rng,S0,M,&CS,&DS) != 0
        {
            print("***ECDSA Signature Failed")
            return
        }
        print("Signature= ")
        print("C= 0x",terminator: ""); printBinary(CS)
        print("D= 0x",terminator: ""); printBinary(DS)
    
        if ECDH.ECPVP_DSA(sha,W0,M,CS,DS) != 0
        {
            print("***ECDSA Verification Failed")
            return
        }
        else {print("ECDSA Signature/Verification succeeded ")}
    }
}

public func TestMPIN(_ rng: RAND)
{
    let PERMITS=true
    let PINERROR=true
    let FULL=true
    let SINGLE_PASS=true
   
   
    let EGS=bn254.MPIN.EFS
    let EFS=bn254.MPIN.EGS
    let G1S=2*EFS+1    // Group 1 Size
    let G2S=4*EFS;     // Group 2 Size
    let EAS=bn254.ECP.AESKEY
    
    let sha=bn254.ECP.HASH_TYPE
    
    var S=[UInt8](repeating: 0,count: EGS)
    var SST=[UInt8](repeating: 0,count: G2S)
    var TOKEN=[UInt8](repeating: 0,count: G1S)
    var PERMIT=[UInt8](repeating: 0,count: G1S)
    var SEC=[UInt8](repeating: 0,count: G1S)
    var xID=[UInt8](repeating: 0,count: G1S)
    var xCID=[UInt8](repeating: 0,count: G1S)
    var X=[UInt8](repeating: 0,count: EGS)
    var Y=[UInt8](repeating: 0,count: EGS)
    var E=[UInt8](repeating: 0,count: 12*EFS)
    var F=[UInt8](repeating: 0,count: 12*EFS)
    var HID=[UInt8](repeating: 0,count: G1S)
    var HTID=[UInt8](repeating: 0,count: G1S)

    var G1=[UInt8](repeating: 0,count: 12*EFS)
    var G2=[UInt8](repeating: 0,count: 12*EFS)
    var R=[UInt8](repeating: 0,count: EGS)
    var Z=[UInt8](repeating: 0,count: G1S)
    var W=[UInt8](repeating: 0,count: EGS)
    var T=[UInt8](repeating: 0,count: G1S)
    var CK=[UInt8](repeating: 0,count: EAS)
    var SK=[UInt8](repeating: 0,count: EAS)

    var HSID=[UInt8]()

    // Trusted Authority set-up
    
    MPIN.RANDOM_GENERATE(rng,&S)
    print("\nMPIN Master Secret s: 0x",terminator: "");  printBinary(S)
    
    // Create Client Identity
    let IDstr = "testUser@miracl.com"
    let CLIENT_ID=[UInt8](IDstr.utf8)
    
    var HCID=MPIN.HASH_ID(sha,CLIENT_ID)  // Either Client or TA calculates Hash(ID) - you decide!
    
    print("Client ID= "); printBinary(CLIENT_ID)
    
    // Client and Server are issued secrets by DTA
    MPIN.GET_SERVER_SECRET(S,&SST);
    print("Server Secret SS: 0x",terminator: "");  printBinary(SST);
    
    MPIN.GET_CLIENT_SECRET(&S,HCID,&TOKEN);
    print("Client Secret CS: 0x",terminator: ""); printBinary(TOKEN);
    
    // Client extracts PIN from secret to create Token
    var pin:Int32=1234
    print("Client extracts PIN= \(pin)")
    var rtn=MPIN.EXTRACT_PIN(sha,CLIENT_ID,pin,&TOKEN)
    if rtn != 0 {print("FAILURE: EXTRACT_PIN rtn: \(rtn)")}
    
    print("Client Token TK: 0x",terminator: ""); printBinary(TOKEN);

    if FULL
    {
        MPIN.PRECOMPUTE(TOKEN,HCID,&G1,&G2);
    }
    
    var date:Int32=0
    if (PERMITS)
    {
        date=MPIN.today()
        // Client gets "Time Token" permit from DTA
        MPIN.GET_CLIENT_PERMIT(sha,date,S,HCID,&PERMIT)
        print("Time Permit TP: 0x",terminator: "");  printBinary(PERMIT)
        
        // This encoding makes Time permit look random - Elligator squared
        MPIN.ENCODING(rng,&PERMIT);
        print("Encoded Time Permit TP: 0x",terminator: "");  printBinary(PERMIT)
        MPIN.DECODING(&PERMIT)
        print("Decoded Time Permit TP: 0x",terminator: "");  printBinary(PERMIT)
    }

    // ***** NOW ENTER PIN *******
    
        pin=1234
    
    // **************************
    
    // Set date=0 and PERMIT=null if time permits not in use
    
    //Client First pass: Inputs CLIENT_ID, optional RNG, pin, TOKEN and PERMIT. Output xID =x .H(CLIENT_ID) and re-combined secret SEC
    //If PERMITS are is use, then date!=0 and PERMIT is added to secret and xCID = x.(H(CLIENT_ID)+H(date|H(CLIENT_ID)))
    //Random value x is supplied externally if RNG=null, otherwise generated and passed out by RNG
    
    //IMPORTANT: To save space and time..
    //If Time Permits OFF set xCID = null, HTID=null and use xID and HID only
    //If Time permits are ON, AND pin error detection is required then all of xID, xCID, HID and HTID are required
    //If Time permits are ON, AND pin error detection is NOT required, set xID=null, HID=null and use xCID and HTID only.
    
    
    var pxID:[UInt8]?=xID
    var pxCID:[UInt8]?=xCID
    var pHID:[UInt8]=HID
    var pHTID:[UInt8]?=HTID
    var pE:[UInt8]?=E
    var pF:[UInt8]?=F
    var pPERMIT:[UInt8]?=PERMIT
    
    if date != 0
    {
        if (!PINERROR)
        {
            pxID=nil;  // problem here - either comment out here or dont use with ! later on
   //         pHID=nil;
        }
    }
    else
    {
        pPERMIT=nil;
        pxCID=nil;
        pHTID=nil;
    }
    if (!PINERROR)
    {
        pE=nil;
        pF=nil;
    }
    
    if (SINGLE_PASS)
    {
        print("MPIN Single Pass")
        let timeValue = MPIN.GET_TIME()

        rtn=MPIN.CLIENT(sha,date,CLIENT_ID,rng,&X,pin,TOKEN,&SEC,&pxID,&pxCID,pPERMIT,timeValue,&Y)
        
        if rtn != 0 {print("FAILURE: CLIENT rtn: \(rtn)")}
        
        if (FULL)
        {
            HCID=MPIN.HASH_ID(sha,CLIENT_ID);
            MPIN.GET_G1_MULTIPLE(rng,1,&R,HCID,&Z); // Also Send Z=r.ID to Server, remember random r
        }
        rtn=MPIN.SERVER(sha,date,&pHID,&pHTID,&Y,SST,pxID,pxCID!,SEC,&pE,&pF,CLIENT_ID,timeValue)
        if rtn != 0 {print("FAILURE: SERVER rtn: \(rtn)")}
        
        if (FULL)
        { // Also send T=w.ID to client, remember random w
            HSID=MPIN.HASH_ID(sha,CLIENT_ID);   
            if date != 0 {MPIN.GET_G1_MULTIPLE(rng,0,&W,pHTID!,&T)}
            else {MPIN.GET_G1_MULTIPLE(rng,0,&W,pHID,&T)}
            
        }
    }
    else
    {
        print("MPIN Multi Pass");
        // Send U=x.ID to server, and recreate secret from token and pin
        rtn=MPIN.CLIENT_1(sha,date,CLIENT_ID,rng,&X,pin,TOKEN,&SEC,&pxID,&pxCID,pPERMIT)
        if rtn != 0 {print("FAILURE: CLIENT_1 rtn: \(rtn)")}
  
        if (FULL)
        {
            HCID=MPIN.HASH_ID(sha,CLIENT_ID);
            MPIN.GET_G1_MULTIPLE(rng,1,&R,HCID,&Z);  // Also Send Z=r.ID to Server, remember random r
        }      
        // Server calculates H(ID) and H(T|H(ID)) (if time permits enabled), and maps them to points on the curve HID and HTID resp.
        MPIN.SERVER_1(sha,date,CLIENT_ID,&pHID,&pHTID);     
            // Server generates Random number Y and sends it to Client
        MPIN.RANDOM_GENERATE(rng,&Y);
   
        if (FULL)
        { // Also send T=w.ID to client, remember random w
            HSID=MPIN.HASH_ID(sha,CLIENT_ID);
            if date != 0 {MPIN.GET_G1_MULTIPLE(rng,0,&W,pHTID!,&T)}
            else {MPIN.GET_G1_MULTIPLE(rng,0,&W,pHID,&T)}
        }
      
        // Client Second Pass: Inputs Client secret SEC, x and y. Outputs -(x+y)*SEC
        rtn=MPIN.CLIENT_2(X,Y,&SEC);
        if rtn != 0 {print("FAILURE: CLIENT_2 rtn: \(rtn)")}
           
        // Server Second pass. Inputs hashed client id, random Y, -(x+y)*SEC, xID and xCID and Server secret SST. E and F help kangaroos to find error.
        // If PIN error not required, set E and F = null
    print("Entering SERVER 2")        
        rtn=MPIN.SERVER_2(date,pHID,pHTID,Y,SST,pxID,pxCID,SEC,&pE,&pF);
          
        if rtn != 0 {print("FAILURE: SERVER_1 rtn: \(rtn)")}
    }
    if (rtn == MPIN.BAD_PIN)
    {
        print("Server says - Bad Pin. I don't know you. Feck off.\n");
        if (PINERROR)
        {
            let err=MPIN.KANGAROO(pE,pF);
            if err != 0 {print("(Client PIN is out by \(err))\n")}
        }
        return;
    }
    else {print("Server says - PIN is good! You really are "+IDstr)}

    if (FULL)
    {
        var H=MPIN.HASH_ALL(sha,HCID,pxID,pxCID,SEC,Y,Z,T);
        MPIN.CLIENT_KEY(sha,G1,G2,pin,R,X,H,T,&CK);
        print("Client Key =  0x",terminator: "");  printBinary(CK)
        
        H=MPIN.HASH_ALL(sha,HSID,pxID,pxCID,SEC,Y,Z,T);
        MPIN.SERVER_KEY(sha,Z,SST,W,H,pHID,pxID!,pxCID,&SK);
        print("Server Key =  0x",terminator: "");  printBinary(SK)
    }
    
}

var RAW=[UInt8](repeating: 0,count: 100)
let rng=RAND()
    
rng.clean();
for i in 0 ..< 100 {RAW[i]=UInt8(i&0xff)}
rng.seed(100,RAW)


TestECDH(rng)  
TestRSA(rng)
TestMPIN(rng)

