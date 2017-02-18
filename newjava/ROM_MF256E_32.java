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


package amcl;

public class ROM_MF256E
{

// MF256E Curve

	public static final int CURVE_A = -1;
	public static final int[] CURVE_B = {0x350A,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
	public static final int[] CURVE_Order={0x18EC7BAB,0x16C976F6,0x19CCF259,0x9775F70,0x1FFFFB15,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x3FE9FF};
	public static final int[] CURVE_Gx ={0x1,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
	public static final int[] CURVE_Gy ={0x12F3C908,0xF553917,0x1FA9A35F,0xBCC91B,0x1AACA0C,0x1779ED96,0x156BABAF,0x1F1F1989,0xDAD8D4};

}
