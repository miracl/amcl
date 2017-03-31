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

//  nist384 Curve Modulus
static let Modulus:[Chunk]=[0x1FFFFFFF,0x7,0x0,0x1FFFFE00,0x1FFFEFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x7F]
static let MConst:Chunk = 0x1
     
//  nist384 Curve
static let CURVE_A:Int = -3
static let CURVE_B:[Chunk] = [0x13EC2AEF,0x142E476E,0xBB4674A,0xC731B14,0x1875AC65,0x447A809,0x4480C50,0xDDFD028,0x19181D9C,0x1F1FC168,0x623815A,0x47DCFC9,0x1312FA7E,0x59]
static public let CURVE_Order:[Chunk]=[0xCC52973,0x760CB56,0xC29DEBB,0x141B6491,0x12DDF581,0x6C0FA1B,0x1FFF1D8D,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x7F]
static public let CURVE_Gx:[Chunk] = [0x12760AB7,0x12A2F1C3,0x154A5B0E,0x5E4BB7E,0x2A38550,0xF0412A,0xE6167DD,0xC5174F3,0x146E1D3B,0x1799056B,0x3AC71C7,0x1D160A6F,0x87CA22B,0x55]
static public let CURVE_Gy:[Chunk] = [0x10EA0E5F,0x1218EBE4,0x1FA0675E,0x1639C3A,0xB8C00A6,0x1889DAF8,0x11F3A768,0x17A51342,0x9F8F41D,0x1C9496E1,0x1767A62F,0xC4C58DE,0x17DE4A9,0x1B]
  

#endif

#if D64

//  nist384 Curve Modulus
static let Modulus:[Chunk]=[0xFFFFFFFFFFFFFFD,0xFFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFFF,0xFFFFFFFFF]
static let MConst:Chunk = 0x100000001
 

//  nist384 Curve
static let CURVE_A:Int = -3
static let CURVE_B:[Chunk] = [0xA85C8EDD3EC2AEF,0x56398D8A2ED19D2,0x4088F5013875AC6,0x9C6EFE814112031,0x56BE3F82D19181D,0xA7E23EE7E4988E0,0xB3312F]
static public let CURVE_Order:[Chunk]=[0xCEC196ACCC52973,0x1A0DB248B0A77AE,0x34D81F4372DDF58,0xFFFFFFFFFFFFC76,0xFFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFFF,0xFFFFFF]
static public let CURVE_Gx:[Chunk] = [0xA545E3872760AB7,0x2F25DBF55296C3,0x741E082542A3855,0x3B628BA79B9859F,0x71EF320AD746E1D,0x22BE8B05378EB1C,0xAA87CA]
static public let CURVE_Gy:[Chunk] = [0xA431D7C90EA0E5F,0x60B1CE1D7E819D7,0xA3113B5F0B8C00A,0x1DBD289A147CE9D,0x8BF9292DC29F8F4,0x4A96262C6F5D9E9,0x3617DE]


#endif

}

