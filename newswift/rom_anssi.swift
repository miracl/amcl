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

//  anssi Curve Modulus
static let Modulus:[Chunk]=[0x186E9C03,0x7E79A9E,0x12329B7A,0x35B7957,0x435B396,0x16F46721,0x163C4049,0x1181675A,0xF1FD17]
static let MConst:Chunk = 0x164E1155
     
//  anssi Curve

static let CURVE_A:Int = -3;
static let CURVE_B:[Chunk]=[0x1B7BB73F,0x3AF6CB3,0xC68600C,0x181935C9,0xC00FDFE,0x1D3AA522,0x4C0352A,0x194A8515,0xEE353F]
static let CURVE_Order:[Chunk]=[0x6D655E1,0x1FEEA2CE,0x14AFE507,0x18CFC281,0x435B53D,0x16F46721,0x163C4049,0x1181675A,0xF1FD17]
static let CURVE_Gx:[Chunk]=[0x198F5CFF,0x64BD16E,0x62DC059,0xFA5B95F,0x23958C2,0x1EA3A4EA,0x7ACC460,0x186AD827,0xB6B3D4]
static let CURVE_Gy:[Chunk]=[0x14062CFB,0x188AD0AA,0x19327860,0x3860FD1,0xEF8C270,0x18F879F6,0x12447E49,0x1EF91640,0x6142E0]

#endif

#if D64

//  anssi Curve Modulus
static let Modulus:[Chunk]=[0xFCF353D86E9C03,0xADBCABC8CA6DE8,0xE8CE42435B3961,0xB3AD58F10126D,0xF1FD178C]
static let MConst:Chunk = 0x97483A164E1155

//  anssi Curve
static let CURVE_A:Int = -3;
static let CURVE_B:[Chunk]=[0x75ED967B7BB73F,0xC9AE4B1A18030,0x754A44C00FDFEC,0x5428A9300D4ABA,0xEE353FCA]
static let CURVE_Order:[Chunk]=[0xFDD459C6D655E1,0x67E140D2BF941F,0xE8CE42435B53DC,0xB3AD58F10126D,0xF1FD178C]
static let CURVE_Gx:[Chunk]=[0xC97A2DD98F5CFF,0xD2DCAF98B70164,0x4749D423958C27,0x56C139EB31183D,0xB6B3D4C3]
static let CURVE_Gy:[Chunk]=[0x115A1554062CFB,0xC307E8E4C9E183,0xF0F3ECEF8C2701,0xC8B204911F9271,0x6142E0F7]


#endif

}

