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

package MS256E

var Modulus= [...]Chunk {0x1FFFFF43,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0xFFFFFF}
const MConst Chunk=0xBD

const CURVE_A int= -1;
var CURVE_B = [...]Chunk{0x3BEE,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
var CURVE_Order=[...]Chunk{0x1122B4AD,0xDC27378,0x9AF1939,0x154AB5A1,0x1FFFFBE6,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x3FFFFF};
var CURVE_Gx =[...]Chunk{0xD,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
var CURVE_Gy =[...]Chunk{0x131CADBA,0x3FB7DA9,0x134C0FDC,0x14DAC704,0x46BFBE2,0x1859CFD0,0x1B6E8F4C,0x3C5424E,0x7D0AB4};
