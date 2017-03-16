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

//  Curve 25519 Modulus
static let Modulus:[Chunk]=[0x1FFFFFED,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x7FFFFF]
static let MConst:Chunk=19
    
//  Curve 25519
static let CURVE_A:Int = 486662
static let CURVE_B:[Chunk]=[0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0] // not used
static let CURVE_Order:[Chunk]=[0x1CF5D3ED,0x9318D2,0x1DE73596,0x1DF3BD45,0x14D,0x0,0x0,0x0,0x100000]
static let CURVE_Gx:[Chunk]=[0x9,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0]
static let CURVE_Gy:[Chunk]=[0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0] // not used

#endif

#if D64

// Curve 25519 Modulus
static let Modulus:[Chunk]=[0xFFFFFFFFFFFFED,0xFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFF,0x7FFFFFFF]
static let MConst:Chunk=19

//  Curve 25519
static let CURVE_A:Int = 486662
static let CURVE_B:[Chunk]=[0x0,0x0,0x0,0x0,0x0] // not used
static let CURVE_Order:[Chunk]=[0x12631A5CF5D3ED,0xF9DEA2F79CD658,0x14DE,0x0,0x10000000]
static let CURVE_Gx:[Chunk]=[0x9,0x0,0x0,0x0,0x0]
static let CURVE_Gy:[Chunk]=[0x0,0x0,0x0,0x0,0x0] // not used


#endif

}

