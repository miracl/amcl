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


package amcl;

public class ROM_MF254W
{

// MF254W Curve

	public static final int CURVE_A = -3;
	public static final long[] CURVE_B = {0xFFFFFFFFFFD08DL,0xFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFL,0x3F80FFFFL};
	public static final long[] CURVE_Order={0xA419C4AF8DF83FL,0x8BEA0DA375C06FL,0xFFFFFFFFFFEB81L,0xFFFFFFFFFFFFFFL,0x3F80FFFFL};
	public static final long[] CURVE_Gx ={0x2L,0x0L,0x0L,0x0L,0x0L};
	public static final long[] CURVE_Gy ={0x65DF37F90D4EBCL,0x38E3F8511931ADL,0x75BD778AEBDFB7L,0x3B2E56014AE15AL,0x140E3FD3L};

}

