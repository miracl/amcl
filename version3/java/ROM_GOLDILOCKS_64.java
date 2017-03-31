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


package amcl.GOLDILOCKS;

public class ROM
{
// GOLDILOCKS Modulus
	public static final long[] Modulus={0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFEFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFL};
	public static final long MConst=0x1;

// GOLDILOCKS Curve

	public static final int CURVE_A = 1;
	public static final long[] CURVE_B = {0xFFFFFFFFFFF6756L,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFEFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFL};
	public static final long[] CURVE_Order={0x378C292AB5844F3L,0x6CC2728DC58F552L,0xEDB49AED6369021L,0xFFFF7CCA23E9C44L,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0x3FFFFFFL};
	public static final long[] CURVE_Gx ={0x555555555555555L,0x555555555555555L,0x555555555555555L,0xAAA955555555555L,0xAAAAAAAAAAAAAAAL,0xAAAAAAAAAAAAAAAL,0xAAAAAAAAAAAAAAAL,0xAAAAAAAL};
	public static final long[] CURVE_Gy ={0xAEAFBCDEA9386EDL,0xBCB2BED1CDA06BDL,0x565833A2A3098BBL,0x6D728AD8C4B80D6L,0x7A035884DD7B7E3L,0x205086C2B0036EDL,0x34AD7048DB359D6L,0xAE05E96L};

}

