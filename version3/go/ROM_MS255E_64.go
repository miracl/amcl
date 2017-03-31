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

package MS255E

var Modulus= [...]Chunk {0xFFFFFFFFFFFD03,0xFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFF,0x7FFFFFFF}
const MConst Chunk=0x2FD

const CURVE_A int= -1
var CURVE_B = [...]Chunk{0xEA97,0x0,0x0,0x0,0x0}
var CURVE_Order=[...]Chunk{0x49D1ED0436EB75,0xA785EDA6832EAC,0xFFFFFFFFFFDCF1,0xFFFFFFFFFFFFFF,0x1FFFFFFF}
var CURVE_Gx =[...]Chunk{0x4,0x0,0x0,0x0,0x0}
var CURVE_Gy =[...]Chunk{0x2A255BD08736A0,0x4B8AED445A45BA,0xDD8E0C47E55291,0x4A7BB545EC254C,0x26CB7853}

