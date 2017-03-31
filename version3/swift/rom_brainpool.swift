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

//  Brainpool Modulus
  
static let Modulus:[Chunk]=[0x1F6E5377,0x9A40E8,0x9880A08,0x17EC47AA,0x18D726E3,0x5484EC1,0x6F0F998,0x1B743DD5,0xA9FB57]
static let MConst:Chunk = 0xEFD89B9
    
//  Brainpool Curve

static let CURVE_A:Int = -3
static let CURVE_B:[Chunk]=[0x1EE92B04,0x172C080F,0xBD2495A,0x7D7895E,0x176B7BF9,0x13B99E85,0x1A93F99A,0x18861B09,0x662C61]
static public let CURVE_Order:[Chunk]=[0x174856A7,0xF07414,0x1869BDE4,0x12F5476A,0x18D718C3,0x5484EC1,0x6F0F998,0x1B743DD5,0xA9FB57]
static public let CURVE_Gx:[Chunk]=[0xE1305F4,0xD0C8AB1,0xBEF0ADE,0x28588F5,0x16149AFA,0x9D91D32,0x1EDDCC88,0x79839FC,0xA3E8EB]
static public let CURVE_Gy:[Chunk]=[0x1B25C9BE,0xD5F479A,0x1409C007,0x196DBC73,0x417E69B,0x1170A322,0x15B5FDEC,0x10468738,0x2D996C]


#endif

#if D64

//  Brainpool  Modulus

static let Modulus:[Chunk]=[0x13481D1F6E5377,0xF623D526202820,0x909D838D726E3B,0xA1EEA9BC3E660A,0xA9FB57DB]
static let MConst:Chunk = 0xA75590CEFD89B9


//  Brainpool Curve

static let CURVE_A:Int = -3
static let CURVE_B:[Chunk]=[0xE58101FEE92B04,0xEBC4AF2F49256A,0x733D0B76B7BF93,0x30D84EA4FE66A7,0x662C61C4]
static public let CURVE_Order:[Chunk]=[0x1E0E82974856A7,0x7AA3B561A6F790,0x909D838D718C39,0xA1EEA9BC3E660A,0xA9FB57DB]
static public let CURVE_Gx:[Chunk]=[0xA191562E1305F4,0x42C47AAFBC2B79,0xB23A656149AFA1,0xC1CFE7B7732213,0xA3E8EB3C]
static public let CURVE_Gy:[Chunk]=[0xABE8F35B25C9BE,0xB6DE39D027001D,0xE14644417E69BC,0x3439C56D7F7B22,0x2D996C82]


#endif

}

