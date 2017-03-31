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


package amcl.BLS383;

public class ROM
{
// BLS383 Curve

	public static final long[] Modulus= {0xACAAB52AAD556BL,0x1BB01475F75D7AL,0xCF73083D5D7520L,0x531820F99EB16L,0x2C01355A68EA32L,0x5C6105C552A785L,0x7AC52080A9F7L};
	public static final long MConst=0xA59AB3B123D0BDL;
	public static final long[] Fra={0x2BA59A92B4508BL,0x63DB7A06EEF343L,0x40341CB1DFBC74L,0x1639E9D32D55D3L,0xB19B3F05CC36D4L,0xF323EE4D86AB98L,0x5A5FB198672L};
	public static final long[] Frb={0x81051A97F904E0L,0xB7D49A6F086A37L,0x8F3EEB8B7DB8ABL,0xEEF7983C6C9543L,0x7A65F6549CB35DL,0x693D1777CBFBECL,0x751F25672384L};

// BLS383 Curve

	public static final int CURVE_A = 0;

	public static final long[] CURVE_Order={0xFFF80000FFF001L,0xBFDE0070FE7800L,0x3000049C5EDF1CL,0xC40007F910007AL,0x14641004CL,0x0L,0x0L};
	public static final long[] CURVE_B= {0x9L,0x0L,0x0L,0x0L,0x0L,0x0L,0x0L};
	public static final long[] CURVE_Cof= {0x2A00000052BL,0x5560AAAAAB2CA0L,0x6055L,0x0L,0x0L,0x0L,0x0L};
	public static final long[] CURVE_Gx={0xD59B348D10786BL,0x3477C0E3F54AD0L,0xBF25B734578B9BL,0x4F6AC007BB6F65L,0xEFD5830FF57E9CL,0xADB9F88FB6EC02L,0xB08CEE4BC98L};
	public static final long[] CURVE_Gy={0x5DA023D145DDBL,0x13F518C5FEF7CCL,0x56EC3462B2A66FL,0x96F3019C7A925FL,0x9061047981223EL,0x4810AD8F5BE59L,0x1F3909337671L};

	public static final long[] CURVE_Bnx={0x1000000040L,0x110L,0x0L,0x0L,0x0L,0x0L,0x0L};
	public static final long[] CURVE_Cru={0xA3AAC4EDA155A9L,0xDF2FE8761E5E3DL,0xBCDFAADE632625L,0x5123128D3035A6L,0xDBF3A2BBEAD683L,0x5C5FAB20424190L,0x7AC52080A9F7L};

	public static final long[] CURVE_Pxa={0x6059885BAC9472L,0x7C4D31DE2DC36DL,0xBDC90C308C88A7L,0x29F01971C688FCL,0x3693539C43F167L,0xD81E5A561EB8BFL,0x4D50722B56BFL};
	public static final long[] CURVE_Pxb={0x9B4BD7A272AB23L,0x7AF19D4F44DCE8L,0x3F6F7B93206A34L,0x571DD3E2A819FBL,0x3A2BA3B635D7EEL,0xAC28C780C1A126L,0xEE3617C3E5BL};
	public static final long[] CURVE_Pya={0x81D230977BD4FDL,0xB660720DFDFC6L,0x41FC9590C89A0CL,0x2E1FBCF878287AL,0x11C23014EEE65L,0x28878816BB325EL,0x8F40859A05CL};
	public static final long[] CURVE_Pyb={0xA5E20A252C4CE6L,0x5907A74AFF40C8L,0x41760A42448EF3L,0xFFEF82B0FDA199L,0xA0F29A18D4EA49L,0xAC7F7B86E4997BL,0x1DCABBA88C12L};
// not used
	public static final long[][] CURVE_W={{},{}};
	public static final long[][][] CURVE_SB={{{},{}},{{},{}}};
	public static final long[][] CURVE_WB={{},{},{},{}};
	public static final long[][][] CURVE_BB={{{},{},{},{}},{{},{},{},{}},{{},{},{},{}},{{},{},{},{}}};

}

