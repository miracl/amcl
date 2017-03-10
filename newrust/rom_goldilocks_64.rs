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

use goldilocks::big::NLEN;
use arch::Chunk;

// Goldilocks modulus
pub const MODULUS: [Chunk;NLEN]= [0xFFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFFF,0xFFFEFFFFFFFFFFF,0xFFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFFF,0xFFFFFFF];
pub const MCONST: Chunk=0x1;


// Goldilocks curve
pub const CURVE_A: isize = 1;
pub const CURVE_B: [Chunk;NLEN]=[0xFFFFFFFFFFF6756,0xFFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFFF,0xFFFEFFFFFFFFFFF,0xFFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFFF,0xFFFFFFF];
pub const CURVE_ORDER: [Chunk;NLEN]=[0x378C292AB5844F3,0x6CC2728DC58F552,0xEDB49AED6369021,0xFFFF7CCA23E9C44,0xFFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFFF,0xFFFFFFFFFFFFFFF,0x3FFFFFF];
pub const CURVE_GX: [Chunk;NLEN]=[0x555555555555555,0x555555555555555,0x555555555555555,0xAAA955555555555,0xAAAAAAAAAAAAAAA,0xAAAAAAAAAAAAAAA,0xAAAAAAAAAAAAAAA,0xAAAAAAA];
pub const CURVE_GY: [Chunk;NLEN]=[0xAEAFBCDEA9386ED,0xBCB2BED1CDA06BD,0x565833A2A3098BB,0x6D728AD8C4B80D6,0x7A035884DD7B7E3,0x205086C2B0036ED,0x34AD7048DB359D6,0xAE05E96];
