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


package amcl.MS255W;

public class ROM
{
// 255MS Modulus
	public static final int[] Modulus= {0x1FFFFD03,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x7FFFFF};
	public static final int MConst=0x2FD;

// MS255W Curve

	public static final int CURVE_A = -3;
	public static final int[] CURVE_B = {0x1FFFAB46,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x7FFFFF};
	public static final int[] CURVE_Order={0x1C594AEB,0x1C7D64C1,0x14ACF7EA,0x14705075,0x1FFFF864,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x7FFFFF};
	public static final int[] CURVE_Gx ={0x1,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
	public static final int[] CURVE_Gy ={0x9CB44BA,0x199FFB3B,0x1F698345,0xD8F19BB,0x17D177DB,0x1FFCD97F,0xCE487A,0x181DB74F,0x6F7A6A};

}
