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

/* Fixed Data in ROM - Field and Curve parameters */


package amcl.NIST256;

public class ROM
{
// NIST256 Curve Modulus
public static final int[] Modulus={0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FF,0x0,0x0,0x40000,0x1FE00000,0xFFFFFF};
public static final int MConst=1;

// NIST256 Curve

public static final int CURVE_A = -3;
public static final int[] CURVE_B={0x7D2604B,0x1E71E1F1,0x14EC3D8E,0x1A0D6198,0x86BC651,0x1EAABB4C,0xF9ECFAE,0x1B154752,0x5AC635};
public static final int[] CURVE_Order={0x1C632551,0x1DCE5617,0x5E7A13C,0xDF55B4E,0x1FFFFBCE,0x1FFFFFFF,0x3FFFF,0x1FE00000,0xFFFFFF}; 
public static final int[] CURVE_Gx={0x1898C296,0x509CA2E,0x1ACCE83D,0x6FB025B,0x40F2770,0x1372B1D2,0x91FE2F3,0x1E5C2588,0x6B17D1};
public static final int[] CURVE_Gy={0x17BF51F5,0x1DB20341,0xC57B3B2,0x1C66AED6,0x19E162BC,0x15A53E07,0x1E6E3B9F,0x1C5FC34F,0x4FE342};

}
