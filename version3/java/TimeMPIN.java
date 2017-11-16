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
package org.apache.milagro;

import java.util.Scanner;
import org.apache.milagro.amcl.RAND;
import org.apache.milagro.amcl.BN254.*;


public class TimeMPIN
{
	public static final int MIN_TIME=10; /* seconds */
	public static final int MIN_ITERS=10; 

	static boolean PERMITS=true;
	static boolean PINERROR=true;
	static boolean FULL=true;
	static boolean SINGLE_PASS=false;

	public static void mpin(RAND rng)
	{
		int i,iterations;
		long start,elapsed;
		double dur;

		System.out.println("\nTesting/Timing BN254 Pairings");
		if (ECP.CURVE_PAIRING_TYPE==ECP.BN)
		{
			System.out.print("BN Pairing-Friendly Curve\n");
		}
		if (ECP.CURVE_PAIRING_TYPE==ECP.BLS)
		{
			System.out.print("BLS Pairing-Friendly Curve\n");
		}

		System.out.format("Modulus size %d bits\n",FP.MODBITS); 
		System.out.format("%d bit build\n",BIG.CHUNK); 

		ECP G=new ECP(new BIG(ROM.CURVE_Gx),new BIG(ROM.CURVE_Gy));

		BIG r=new BIG(ROM.CURVE_Order);
		BIG s=BIG.randomnum(r,rng);

		ECP P=PAIR.G1mul(G,r);

		if (!P.is_infinity())
		{
			System.out.print("FAILURE - rP!=O\n");
			return;
		}

		iterations=0;
		start=System.currentTimeMillis();
		do {
			P=PAIR.G1mul(G,s);
			iterations++;
			elapsed=(System.currentTimeMillis()-start);
		} while (elapsed<MIN_TIME*1000 || iterations<MIN_ITERS);
		dur=(double)elapsed/iterations;
		System.out.format("G1 mul              - %8d iterations  ",iterations);
		System.out.format(" %8.2f ms per iteration\n",dur);
	
		ECP2 Q=new ECP2(new FP2(new BIG(ROM.CURVE_Pxa),new BIG(ROM.CURVE_Pxb)),new FP2(new BIG(ROM.CURVE_Pya),new BIG(ROM.CURVE_Pyb)));
		ECP2 W=PAIR.G2mul(Q,r);

		if (!W.is_infinity())
		{
			System.out.print("FAILURE - rQ!=O\n");
			return;
		}

		iterations=0;
		start=System.currentTimeMillis();
		do {
			W=PAIR.G2mul(Q,s);
			iterations++;
			elapsed=(System.currentTimeMillis()-start);
		} while (elapsed<MIN_TIME*1000 || iterations<MIN_ITERS);
		dur=(double)elapsed/iterations;
		System.out.format("G2 mul              - %8d iterations  ",iterations);
		System.out.format(" %8.2f ms per iteration\n",dur);

		FP12 w=PAIR.ate(Q,P);
		w=PAIR.fexp(w);

		FP12 g=PAIR.GTpow(w,r);

		if (!g.isunity())
		{
			System.out.print("FAILURE - g^r!=1\n");
			return;
		}

		iterations=0;
		start=System.currentTimeMillis();
		do {
			g=PAIR.GTpow(w,s);
			iterations++;
			elapsed=(System.currentTimeMillis()-start);
		} while (elapsed<MIN_TIME*1000 || iterations<MIN_ITERS);
		dur=(double)elapsed/iterations;
		System.out.format("GT pow              - %8d iterations  ",iterations);
		System.out.format(" %8.2f ms per iteration\n",dur);
	
		g.copy(w);
		FP4 cr;
		iterations=0;
		start=System.currentTimeMillis();
		do {
			cr=g.compow(s,r);

			iterations++;
			elapsed=(System.currentTimeMillis()-start);
		} while (elapsed<MIN_TIME*1000 || iterations<MIN_ITERS);
		dur=(double)elapsed/iterations;
		System.out.format("GT pow (compressed) - %8d iterations  ",iterations);
		System.out.format(" %8.2f ms per iteration\n",dur);

		iterations=0;
		start=System.currentTimeMillis();
		do {
			w=PAIR.ate(Q,P);
			iterations++;
			elapsed=(System.currentTimeMillis()-start);
		} while (elapsed<MIN_TIME*1000 || iterations<MIN_ITERS);
		dur=(double)elapsed/iterations;
		System.out.format("PAIRing ATE         - %8d iterations  ",iterations);
		System.out.format(" %8.2f ms per iteration\n",dur);

		iterations=0;
		start=System.currentTimeMillis();
		do {
			g=PAIR.fexp(w);
			iterations++;
			elapsed=(System.currentTimeMillis()-start);
		} while (elapsed<MIN_TIME*1000 || iterations<MIN_ITERS);
		dur=(double)elapsed/iterations;
		System.out.format("PAIRing FEXP        - %8d iterations  ",iterations);
		System.out.format(" %8.2f ms per iteration\n",dur);

		P.copy(G);
		Q.copy(W);

		P=PAIR.G1mul(P,s);

		g=PAIR.ate(Q,P);
		g=PAIR.fexp(g);

		P.copy(G);
		Q=PAIR.G2mul(Q,s);

		w=PAIR.ate(Q,P);
		w=PAIR.fexp(w);

		if (!g.equals(w))
		{
			System.out.print("FAILURE - e(sQ,p)!=e(Q,sP) \n");
			return;
		}

		Q.copy(W);
		g=PAIR.ate(Q,P);
		g=PAIR.fexp(g);
		g=PAIR.GTpow(g,s);

		if (!g.equals(w))
		{
			System.out.print("FAILURE - e(sQ,p)!=e(Q,P)^s \n");
			return;
		}

		System.out.print("All tests pass\n"); 
	}

}
