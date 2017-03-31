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

package  MF256M

var Modulus= [...]Chunk {0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0xFFA7FF}
const MConst Chunk=0xFFA800

const CURVE_A int=-54314;
var CURVE_B = [...]Chunk {0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0}; // not used
var CURVE_Order=[...]Chunk {0x18EC7BAB,0x16C976F6,0x19CCF259,0x9775F70,0x1FFFFB15,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x3FE9FF};
var CURVE_Gx =[...]Chunk {0x8,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
var CURVE_Gy =[...]Chunk {0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0}; // not used
