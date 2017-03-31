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

package MF254E

var Modulus= [...]Chunk {0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x3F80FF}
const MConst Chunk=0x3F8100

const CURVE_A int= -1
var CURVE_B = [...]Chunk {0x367B,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0}
var CURVE_Order=[...]Chunk {0x46E98C7,0x179E9FF6,0x158BEC3A,0xA60D917,0x1FFFFEB9,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0xFE03F}
var CURVE_Gx =[...]Chunk {0x1,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0}
var CURVE_Gy =[...]Chunk {0xF2701E5,0x29687ED,0xC84861F,0x535081C,0x3F4E363,0x6A811B,0xCD65474,0x121AD498,0x19F0E6}
