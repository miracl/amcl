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

public func TimeRSA(_ rng: RAND)
{
    let RFS=RSA.RFS
    let MIN_TIME=10.0
    let MIN_ITERS=10 
    var fail=false;

    let pub=rsa_public_key(Int(FF.FFLEN))
    let priv=rsa_private_key(Int(FF.HFLEN))

    var M=[UInt8](repeating: 0,count: RFS)
    var C=[UInt8](repeating: 0,count: RFS)
    var P=[UInt8](repeating: 0,count: RFS)
 
    print("\nTiming/Testing 2048-bit RSA")
    print("Generating public/private key pair")

    var start=Date()
    var iterations=0
    var elapsed=0.0
    while elapsed<MIN_TIME || iterations<MIN_ITERS {
        RSA.KEY_PAIR(rng,65537,priv,pub)
        iterations+=1
        elapsed = -start.timeIntervalSinceNow
    }
    elapsed=1000.0*elapsed/Double(iterations)
    print(String(format: "RSA gen - %d iterations",iterations),terminator: "");
    print(String(format: " %.2f ms per iteration",elapsed))
    
    for i in 0..<RFS {M[i]=UInt8(i%128)}
    
    start=Date()
    iterations=0
    elapsed=0.0
    while elapsed<MIN_TIME || iterations<MIN_ITERS {
        RSA.ENCRYPT(pub,M,&C)
        iterations+=1
        elapsed = -start.timeIntervalSinceNow
    }
    elapsed=1000.0*elapsed/Double(iterations)
    print(String(format: "RSA enc - %d iterations",iterations),terminator: "");
    print(String(format: " %.2f ms per iteration",elapsed))
   
    start=Date()
    iterations=0
    elapsed=0.0
    while elapsed<MIN_TIME || iterations<MIN_ITERS {
        RSA.DECRYPT(priv,C,&P)
        iterations+=1
        elapsed = -start.timeIntervalSinceNow
    }
    elapsed=1000.0*elapsed/Double(iterations)
    print(String(format: "RSA dec - %d iterations",iterations),terminator: "");
    print(String(format: " %.2f ms per iteration",elapsed))
   
    var cmp=true
    for i in 0..<RFS {
        if P[i] != M[i] {cmp=false}
    }
    
    if !cmp {
        print("FAILURE - RSA decryption")
        fail=true;
    }
    
    if !fail {
       print("All tests pass")
    }
}


public func TimeECDH(_ rng: RAND)
{
    let MIN_TIME=10.0
    let MIN_ITERS=10
    
    var fail=false;

    print("\nTiming/Testing ED25519 ECC")
    if ed25519.ECP.CURVETYPE==ed25519.ECP.WEIERSTRASS {
        print("Weierstrass parameterisation")
    }
    if ed25519.ECP.CURVETYPE==ed25519.ECP.EDWARDS {
        print("Edwards parameterisation")
    }
    if ed25519.ECP.CURVETYPE==ed25519.ECP.MONTGOMERY {
        print("Montgomery representation")
    }
    if ed25519.FP.MODTYPE==ed25519.FP.PSEUDO_MERSENNE {
        print("Pseudo-Mersenne Modulus")
    }
    if ed25519.FP.MODTYPE==ed25519.FP.MONTGOMERY_FRIENDLY {
        print("Montgomery Friendly Modulus")
    }
    if ed25519.FP.MODTYPE==ed25519.FP.GENERALISED_MERSENNE {
        print("Generalised-Mersenne Modulus")
    }
    if ed25519.FP.MODTYPE==ed25519.FP.NOT_SPECIAL {
        print("Not special Modulus")
    }
    print("Modulus size \(ed25519.FP.MODBITS) bits")
    print("\(ed25519.BIG.CHUNK) bit build")
    

    var s:ed25519.BIG
    var G=ed25519.ECP.generator();
    
    let r=ed25519.BIG(ed25519.ROM.CURVE_Order)
    s=ed25519.BIG.randomnum(r,rng)
    
    var W=G.mul(r)
    if !W.is_infinity() {
        print("FAILURE - rG!=O")
        fail=true;
    }
    
    let start=Date()
    var iterations=0
    var elapsed=0.0
    while elapsed<MIN_TIME || iterations<MIN_ITERS {
        W=G.mul(s)
        iterations+=1
        elapsed = -start.timeIntervalSinceNow
    }
    elapsed=1000.0*elapsed/Double(iterations)
    print(String(format: "EC  mul - %d iterations",iterations),terminator: "");
    print(String(format: " %.2f ms per iteration",elapsed))

    if !fail {
       print("All tests pass")
    }    
}

public func TimeMPIN(_ rng: RAND)
{
    let MIN_TIME=10.0
    let MIN_ITERS=10   
    var fail=false;

    print("\nTiming/Testing BN254 Pairings")
    if bn254.ECP.CURVE_PAIRING_TYPE==bn254.ECP.BN {
        print("BN Pairing-Friendly Curve")
    }
    if bn254.ECP.CURVE_PAIRING_TYPE==bn254.ECP.BLS {
        print("BLS Pairing-Friendly Curve")
    }
    print("Modulus size \(bn254.FP.MODBITS) bits")
    print("\(bn254.BIG.CHUNK) bit build")
    
    let G=bn254.ECP.generator();
    
    let r=bn254.BIG(bn254.ROM.CURVE_Order)
    let s=bn254.BIG.randomnum(r,rng)
    
    var P=PAIR.G1mul(G,r);
    
    if !P.is_infinity() {
        print("FAILURE - rP!=O")
        fail=true
    }
    
    var start=Date()
    var iterations=0
    var elapsed=0.0
    while elapsed<MIN_TIME || iterations<MIN_ITERS {
        P=PAIR.G1mul(G,s)
        iterations+=1
        elapsed = -start.timeIntervalSinceNow
    }
    elapsed=1000.0*elapsed/Double(iterations)
    print(String(format: "G1  mul              - %d iterations",iterations),terminator: "");
    print(String(format: " %.2f ms per iteration",elapsed))
    
    var Q=ECP2.generator();
    
    var W=PAIR.G2mul(Q,r)
    
    if !W.is_infinity() {
        print("FAILURE - rQ!=O")
        fail=true
    }
    
    start=Date()
    iterations=0
    elapsed=0.0
    while elapsed<MIN_TIME || iterations<MIN_ITERS {
        W=PAIR.G2mul(Q,s)
        iterations+=1
        elapsed = -start.timeIntervalSinceNow
    }
    elapsed=1000.0*elapsed/Double(iterations)
    print(String(format: "G2  mul              - %d iterations",iterations),terminator: "");
    print(String(format: " %.2f ms per iteration",elapsed))
    
    var w=PAIR.ate(Q,P)
    w=PAIR.fexp(w)
    
    var g=PAIR.GTpow(w,r)
    
    if !g.isunity() {
        print("FAILURE - g^r!=1")
        fail=true
    }
    
    start=Date()
    iterations=0
    elapsed=0.0
    while elapsed<MIN_TIME || iterations<MIN_ITERS {
        g=PAIR.GTpow(w,s)
        iterations+=1
        elapsed = -start.timeIntervalSinceNow
    }
    elapsed=1000.0*elapsed/Double(iterations)
    print(String(format: "GT  pow              - %d iterations",iterations),terminator: "");
    print(String(format: " %.2f ms per iteration",elapsed))
   
    g.copy(w)
    
    start=Date()
    iterations=0
    elapsed=0.0
    while elapsed<MIN_TIME || iterations<MIN_ITERS {
        _=g.compow(s,r)
        iterations+=1
        elapsed = -start.timeIntervalSinceNow
    }
    elapsed=1000.0*elapsed/Double(iterations)
    print(String(format: "GT  pow (compressed) - %d iterations",iterations),terminator: "");
    print(String(format: " %.2f ms per iteration",elapsed))
    
    start=Date()
    iterations=0
    elapsed=0.0
    while elapsed<MIN_TIME || iterations<MIN_ITERS {
        w=PAIR.ate(Q,P)
        iterations+=1
        elapsed = -start.timeIntervalSinceNow
    }
    elapsed=1000.0*elapsed/Double(iterations)
    print(String(format: "PAIRing ATE          - %d iterations",iterations),terminator: "");
    print(String(format: " %.2f ms per iteration",elapsed))

    start=Date()
    iterations=0
    elapsed=0.0
    while elapsed<MIN_TIME || iterations<MIN_ITERS {
        g=PAIR.fexp(w)
        iterations+=1
        elapsed = -start.timeIntervalSinceNow
    }
    elapsed=1000.0*elapsed/Double(iterations)
    print(String(format: "PAIRing FEXP         - %d iterations",iterations),terminator: "");
    print(String(format: " %.2f ms per iteration",elapsed))
 
    P.copy(G)
    Q.copy(W)
    
    P=PAIR.G1mul(P,s)
    g=PAIR.ate(Q,P)
    g=PAIR.fexp(g)
    
    P.copy(G)
    Q=PAIR.G2mul(Q,s)
    w=PAIR.ate(Q,P)
    w=PAIR.fexp(w)
    
    if !g.equals(w) {
        print("FAILURE - e(sQ,P)!=e(Q,sP)")
        fail=true
    }
    
    if !fail {
        print("All tests pass")
    }
}

var RAW=[UInt8](repeating: 0,count: 100)
let rng=RAND()
    
rng.clean();
for i in 0 ..< 100 {RAW[i]=UInt8(i&0xff)}
rng.seed(100,RAW)


TimeECDH(rng)  
TimeRSA(rng)
TimeMPIN(rng)

