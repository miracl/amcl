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


package amcl.BRAINPOOL;

public class ROM
{
// Brainpool Curve Modulus

	public static final int[] Modulus= {0x1F6E5377,0x9A40E8,0x9880A08,0x17EC47AA,0x18D726E3,0x5484EC1,0x6F0F998,0x1B743DD5,0xA9FB57};
	public static final int MConst=0xEFD89B9;


// Brainpool Curve

	public static final int CURVE_A = -3;
	public static final int[] CURVE_B = {0x1EE92B04,0x172C080F,0xBD2495A,0x7D7895E,0x176B7BF9,0x13B99E85,0x1A93F99A,0x18861B09,0x662C61};
	public static final int[] CURVE_Order={0x174856A7,0xF07414,0x1869BDE4,0x12F5476A,0x18D718C3,0x5484EC1,0x6F0F998,0x1B743DD5,0xA9FB57};
	public static final int[] CURVE_Gx ={0xE1305F4,0xD0C8AB1,0xBEF0ADE,0x28588F5,0x16149AFA,0x9D91D32,0x1EDDCC88,0x79839FC,0xA3E8EB};
	public static final int[] CURVE_Gy ={0x1B25C9BE,0xD5F479A,0x1409C007,0x196DBC73,0x417E69B,0x1170A322,0x15B5FDEC,0x10468738,0x2D996C};

}
