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

package MF256W

var Modulus= [...]Chunk {0xFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFF,0xFFA7FFFF}
const MConst Chunk=0xFFA80000

const CURVE_A int= -3
var CURVE_B = [...]Chunk {0x14E6A,0x0,0x0,0x0,0x0}
var CURVE_Order=[...]Chunk {0x10C5E1A79857EB,0x7513E6E5074B9D,0xFFFFFFFFFFFC51,0xFFFFFFFFFFFFFF,0xFFA7FFFF}
var CURVE_Gx =[...]Chunk {0x1,0x0,0x0,0x0,0x0}
var CURVE_Gy =[...]Chunk {0x7954C2B724D2A,0x47EB8D94DC6610,0x26123DAE289569,0xBE1808CE7BABBA,0x20887C87}
