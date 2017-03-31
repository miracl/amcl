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

package MS256W

var Modulus= [...]Chunk {0xFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFF,0xFFA7FFFF}
const MConst Chunk=0xFFA80000

const CURVE_A int= -3
var CURVE_B = [...]Chunk {0x25581,0x0,0x0,0x0,0x0}
var CURVE_Order=[...]Chunk {0xAB20294751A825,0x8275EA265C6020,0xFFFFFFFFFFE43C,0xFFFFFFFFFFFFFF,0xFFFFFFFF}
var CURVE_Gx =[...]Chunk {0x1,0x0,0x0,0x0,0x0}
var CURVE_Gy =[...]Chunk {0xF46306C2B56C77,0x2F9375894EC10B,0x6CCEEEDD6BD02C,0xC1E466D7FC82C9,0x696F1853}

