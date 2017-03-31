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

package NIST384

var Modulus= [...]Chunk {0xFFFFFFFF,0xFFFFFF000000000,0xFFFFFFFFFFFFEFF,0xFFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFFF,0xFFFFFF}
const MConst Chunk=0x100000001

const CURVE_A int= -3
var CURVE_B = [...]Chunk  {0xA85C8EDD3EC2AEF,0x56398D8A2ED19D2,0x4088F5013875AC6,0x9C6EFE814112031,0x56BE3F82D19181D,0xA7E23EE7E4988E0,0xB3312F}
var CURVE_Order=[...]Chunk  {0xCEC196ACCC52973,0x1A0DB248B0A77AE,0x34D81F4372DDF58,0xFFFFFFFFFFFFC76,0xFFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFFF,0xFFFFFF}
var CURVE_Gx =[...]Chunk  {0xA545E3872760AB7,0x2F25DBF55296C3,0x741E082542A3855,0x3B628BA79B9859F,0x71EF320AD746E1D,0x22BE8B05378EB1C,0xAA87CA}
var CURVE_Gy =[...]Chunk  {0xA431D7C90EA0E5F,0x60B1CE1D7E819D7,0xA3113B5F0B8C00A,0x1DBD289A147CE9D,0x8BF9292DC29F8F4,0x4A96262C6F5D9E9,0x3617DE}
