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


package amcl.NIST384;

public class ROM
{
// NIST384 Modulus

	public static final long[] Modulus={0xFFFFFFFFL,0xFFFFFF000000000L,0xFFFFFFFFFFFFEFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFL};
	public static final long MConst=0x100000001L;

// NIST384 Curve

	public static final int CURVE_A = -3;
	public static final long[] CURVE_B = {0xA85C8EDD3EC2AEFL,0x56398D8A2ED19D2L,0x4088F5013875AC6L,0x9C6EFE814112031L,0x56BE3F82D19181DL,0xA7E23EE7E4988E0L,0xB3312FL};
	public static final long[] CURVE_Order= {0xCEC196ACCC52973L,0x1A0DB248B0A77AEL,0x34D81F4372DDF58L,0xFFFFFFFFFFFFC76L,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFL};
	public static final long[] CURVE_Gx = {0xA545E3872760AB7L,0x2F25DBF55296C3L,0x741E082542A3855L,0x3B628BA79B9859FL,0x71EF320AD746E1DL,0x22BE8B05378EB1CL,0xAA87CAL};
	public static final long[] CURVE_Gy = {0xA431D7C90EA0E5FL,0x60B1CE1D7E819D7L,0xA3113B5F0B8C00AL,0x1DBD289A147CE9DL,0x8BF9292DC29F8F4L,0x4A96262C6F5D9E9L,0x3617DEL};

}

