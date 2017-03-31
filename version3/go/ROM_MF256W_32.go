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

package  MF256W

var Modulus= [...]Chunk {0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0xFFA7FF}
const MConst Chunk=0xFFA800

const CURVE_A int= -3;
var CURVE_B = [...]Chunk {0x14E6A,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
var CURVE_Order=[...]Chunk {0x79857EB,0x8862F0D,0x1941D2E7,0x2EA27CD,0x1FFFFFC5,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0xFFA7FF};
var CURVE_Gx =[...]Chunk {0x1,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
var CURVE_Gy =[...]Chunk {0xB724D2A,0x3CAA61,0x5371984,0x128FD71B,0x1AE28956,0x1D13091E,0x339EEAE,0x10F7C301,0x20887C};
