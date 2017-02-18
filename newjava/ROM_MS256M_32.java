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

public class ROM_MS256M
{

// MS256M Curve

	public static final int CURVE_A =-61370;
	public static final int[] CURVE_B = {0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0}; // not used
	public static final int[] CURVE_Order={0x1122B4AD,0xDC27378,0x9AF1939,0x154AB5A1,0x1FFFFBE6,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x3FFFFF};
	public static final int[] CURVE_Gx ={0xb,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
	public static final int[] CURVE_Gy ={0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0}; // not used

}
