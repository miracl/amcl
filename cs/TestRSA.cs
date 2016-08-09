using System;

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

/* test driver and function exerciser for RSA API Functions */

public class TestRSA
{
	public static void Main(string[] args)
	{
		int i;
		int RFS = RSA.RFS;
		int sha = RSA.HASH_TYPE;

		string message = "Hello World\n";

		rsa_public_key pub = new rsa_public_key(ROM.FFLEN);
		rsa_private_key priv = new rsa_private_key(ROM.HFLEN);

		sbyte[] ML = new sbyte[RFS];
		sbyte[] C = new sbyte[RFS];
		sbyte[] S = new sbyte[RFS];
		sbyte[] RAW = new sbyte[100];

		RAND rng = new RAND();

		rng.clean();
		for (i = 0;i < 100;i++)
		{
			RAW[i] = (sbyte)(i);
		}

		rng.seed(100,RAW);

//for (i=0;i<10;i++)
//{
		Console.WriteLine("Generating public/private key pair");
		RSA.KEY_PAIR(rng,65537,priv,pub);

		sbyte[] M = message.GetBytes();
		Console.Write("Encrypting test string\n");


		sbyte[] E = RSA.OAEP_ENCODE(sha,M,rng,null); // OAEP encode message M to E

		RSA.ENCRYPT(pub,E,C); // encrypt encoded message
		Console.Write("Ciphertext= 0x");
		RSA.printBinary(C);

		Console.Write("Decrypting test string\n");
		RSA.DECRYPT(priv,C,ML);
		sbyte[] MS = RSA.OAEP_DECODE(sha,null,ML); // OAEP decode message

		message = StringHelperClass.NewString(MS);
		Console.Write(message);
//}

		Console.WriteLine("Signing message");
		RSA.PKCS15(sha,M,C);

		RSA.DECRYPT(priv,C,S); // create signature in S

		Console.Write("Signature= 0x");
		RSA.printBinary(S);

		RSA.ENCRYPT(pub,S,ML);

		bool cmp = true;
		if (C.Length != ML.Length)
		{
			cmp = false;
		}
		else
		{
			for (int j = 0;j < C.Length;j++)
			{
				if (C[j] != ML[j])
				{
					cmp = false;
				}
			}
		}
		if (cmp)
		{
			Console.WriteLine("Signature is valid");
		}
		else
		{
			Console.WriteLine("Signature is INVALID");
		}

		RSA.PRIVATE_KEY_KILL(priv);
	}
}