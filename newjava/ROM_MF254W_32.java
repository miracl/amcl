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

public class ROM_MF254W
{

// MF254W Curve

	public static final int CURVE_A = -3;
	public static final int[] CURVE_B = {0x1FFFD08D,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x3F80FF};
	public static final int[] CURVE_Order={0xF8DF83F,0x1D20CE25,0x8DD701B,0x317D41B,0x1FFFFEB8,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x3F80FF};
	public static final int[] CURVE_Gx ={0x2,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
	public static final int[] CURVE_Gy ={0x190D4EBC,0xB2EF9BF,0x14464C6B,0xE71C7F0,0x18AEBDFB,0xD3ADEBB,0x18052B85,0x1A6765CA,0x140E3F};

}
