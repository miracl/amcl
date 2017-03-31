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
//  rom.swift
//
//  Created by Michael Scott on 12/06/2015.
//  Copyright (c) 2015 Michael Scott. All rights reserved.
//

final public class ROM{
 
#if D32

//  bls383 Curve Modulus
    static let Modulus:[Chunk] = [0xAAD556B,0xACAAB52,0x5F75D7A,0x1BB0147,0xD5D7520,0xCF73083,0xF99EB16,0x531820,0xA68EA32,0x2C01355,0x552A785,0x5C6105C,0x80A9F7,0x7AC52];
    static let MConst:Chunk=0x123D0BD;
    static let Fra:[Chunk]=[0x2B4508B,0x2BA59A9,0x6EEF343,0x63DB7A0,0x1DFBC74,0x40341CB,0x32D55D3,0x1639E9D,0x5CC36D4,0xB19B3F0,0xD86AB98,0xF323EE4,0xB198672,0x5A5F];
    static let Frb:[Chunk]=[0x7F904E0,0x81051A9,0xF086A37,0xB7D49A6,0xB7DB8AB,0x8F3EEB8,0xC6C9543,0xEEF7983,0x49CB35D,0x7A65F65,0x7CBFBEC,0x693D177,0x5672384,0x751F2];

//  bls383 Curve
    static let CURVE_A:Int = 0;
    
    static public let CURVE_Order:[Chunk]=[0xFFF001,0xFFF8000,0xFE7800,0xBFDE007,0xC5EDF1C,0x3000049,0x910007A,0xC40007F,0x641004C,0x14,0x0,0x0,0x0,0x0];
    static let CURVE_B:[Chunk]=[0x9,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0];
    static let CURVE_Cof:[Chunk]=[0x52B,0x2A00,0xAAB2CA0,0x5560AAA,0x6055,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0];
    static public let CURVE_Gx:[Chunk]=[0xD10786B,0xD59B348,0x3F54AD0,0x3477C0E,0x4578B9B,0xBF25B73,0x7BB6F65,0x4F6AC00,0xFF57E9C,0xEFD5830,0xFB6EC02,0xADB9F88,0xEE4BC98,0xB08C];
    static public let CURVE_Gy:[Chunk]=[0xD145DDB,0x5DA023,0x5FEF7CC,0x13F518C,0x2B2A66F,0x56EC346,0xC7A925F,0x96F3019,0x981223E,0x9061047,0x8F5BE59,0x4810AD,0x9337671,0x1F390];
    
    static let CURVE_Bnx:[Chunk]=[0x40,0x100,0x110,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0];
    static let CURVE_Cru:[Chunk]=[0xDA155A9,0xA3AAC4E,0x61E5E3D,0xDF2FE87,0xE632625,0xBCDFAAD,0xD3035A6,0x5123128,0xBEAD683,0xDBF3A2B,0x424190,0x5C5FAB2,0x80A9F7,0x7AC52];

    static public let CURVE_Pxa:[Chunk]=[0xBAC9472,0x6059885,0xE2DC36D,0x7C4D31D,0x8C88A7,0xBDC90C3,0x1C688FC,0x29F0197,0xC43F167,0x3693539,0x61EB8BF,0xD81E5A5,0x22B56BF,0x4D507];
    static public let CURVE_Pxb:[Chunk]=[0x272AB23,0x9B4BD7A,0xF44DCE8,0x7AF19D4,0x3206A34,0x3F6F7B9,0x2A819FB,0x571DD3E,0x635D7EE,0x3A2BA3B,0xC1A126,0xAC28C78,0x17C3E5B,0xEE36];
    static public let CURVE_Pya:[Chunk]=[0x77BD4FD,0x81D2309,0xDFDFC6,0xB66072,0xC89A0C,0x41FC959,0x878287A,0x2E1FBCF,0x14EEE65,0x11C230,0x6BB325E,0x2887881,0x859A05C,0x8F40];
    static public let CURVE_Pyb:[Chunk]=[0x52C4CE6,0xA5E20A2,0xAFF40C8,0x5907A74,0x2448EF3,0x41760A4,0xFDA199,0xFFEF82B,0x8D4EA49,0xA0F29A1,0x6E4997B,0xAC7F7B8,0xBA88C12,0x1DCAB];
    
    static let CURVE_W:[[Chunk]]=[[],[]];
    static let CURVE_SB:[[[Chunk]]]=[[[],[]],[[],[]]];
    static let CURVE_WB:[[Chunk]]=[[],[],[],[]];
    static let CURVE_BB:[[[Chunk]]]=[[[],[],[],[]],[[],[],[],[]],[[],[],[],[]],[[],[],[],[]]];
    

#endif

#if D64

//  bls383 Curve Modulus
    static let Modulus:[Chunk]=[0xACAAB52AAD556B,0x1BB01475F75D7A,0xCF73083D5D7520,0x531820F99EB16,0x2C01355A68EA32,0x5C6105C552A785,0x7AC52080A9F7]
    static let MConst:Chunk=0xA59AB3B123D0BD
    static let Fra:[Chunk]=[0x2BA59A92B4508B,0x63DB7A06EEF343,0x40341CB1DFBC74,0x1639E9D32D55D3,0xB19B3F05CC36D4,0xF323EE4D86AB98,0x5A5FB198672];
    static let Frb:[Chunk]=[0x81051A97F904E0,0xB7D49A6F086A37,0x8F3EEB8B7DB8AB,0xEEF7983C6C9543,0x7A65F6549CB35D,0x693D1777CBFBEC,0x751F25672384]; 
//  bls383 Curve
    static let CURVE_A:Int = 0;
    
    static public let CURVE_Order:[Chunk]=[0xFFF80000FFF001,0xBFDE0070FE7800,0x3000049C5EDF1C,0xC40007F910007A,0x14641004C,0x0,0x0];
    static let CURVE_B:[Chunk]=[0x9,0x0,0x0,0x0,0x0,0x0,0x0];
    static let CURVE_Cof:[Chunk]=[0x2A00000052B,0x5560AAAAAB2CA0,0x6055,0x0,0x0,0x0,0x0];
    static public let CURVE_Gx:[Chunk]=[0xD59B348D10786B,0x3477C0E3F54AD0,0xBF25B734578B9B,0x4F6AC007BB6F65,0xEFD5830FF57E9C,0xADB9F88FB6EC02,0xB08CEE4BC98];
    static public let CURVE_Gy:[Chunk]=[0x5DA023D145DDB,0x13F518C5FEF7CC,0x56EC3462B2A66F,0x96F3019C7A925F,0x9061047981223E,0x4810AD8F5BE59,0x1F3909337671];
    
    static let CURVE_Bnx:[Chunk]=[0x1000000040,0x110,0x0,0x0,0x0,0x0,0x0];
    static let CURVE_Cru:[Chunk]=[0xA3AAC4EDA155A9,0xDF2FE8761E5E3D,0xBCDFAADE632625,0x5123128D3035A6,0xDBF3A2BBEAD683,0x5C5FAB20424190,0x7AC52080A9F7];
 
    static public let CURVE_Pxa:[Chunk]=[0x6059885BAC9472,0x7C4D31DE2DC36D,0xBDC90C308C88A7,0x29F01971C688FC,0x3693539C43F167,0xD81E5A561EB8BF,0x4D50722B56BF];
    static public let CURVE_Pxb:[Chunk]=[0x9B4BD7A272AB23,0x7AF19D4F44DCE8,0x3F6F7B93206A34,0x571DD3E2A819FB,0x3A2BA3B635D7EE,0xAC28C780C1A126,0xEE3617C3E5B];
    static public let CURVE_Pya:[Chunk]=[0x81D230977BD4FD,0xB660720DFDFC6,0x41FC9590C89A0C,0x2E1FBCF878287A,0x11C23014EEE65,0x28878816BB325E,0x8F40859A05C];
    static public let CURVE_Pyb:[Chunk]=[0xA5E20A252C4CE6,0x5907A74AFF40C8,0x41760A42448EF3,0xFFEF82B0FDA199,0xA0F29A18D4EA49,0xAC7F7B86E4997B,0x1DCABBA88C12];
    
    static let CURVE_W:[[Chunk]]=[[],[]];
    static let CURVE_SB:[[[Chunk]]]=[[[],[]],[[],[]]];
    static let CURVE_WB:[[Chunk]]=[[],[],[],[]];
    static let CURVE_BB:[[[Chunk]]]=[[[],[],[],[]],[[],[],[],[]],[[],[],[],[]],[[],[],[],[]]];
    

#endif

    static let USE_GLV = true
    static let USE_GS_G2 = true
    static let USE_GS_GT = true
    static let GT_STRONG = false

}

