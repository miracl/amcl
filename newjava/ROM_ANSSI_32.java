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

public class ROM_ANSSI
{

// ANSSI Curve

  public static final int CURVE_A = -3;
  public static final int[] CURVE_B = {0x1B7BB73F,0x3AF6CB3,0xC68600C,0x181935C9,0xC00FDFE,0x1D3AA522,0x4C0352A,0x194A8515,0xEE353F};
  public static final int[] CURVE_Order={0x6D655E1,0x1FEEA2CE,0x14AFE507,0x18CFC281,0x435B53D,0x16F46721,0x163C4049,0x1181675A,0xF1FD17};
  public static final int[] CURVE_Gx ={0x198F5CFF,0x64BD16E,0x62DC059,0xFA5B95F,0x23958C2,0x1EA3A4EA,0x7ACC460,0x186AD827,0xB6B3D4};
  public static final int[] CURVE_Gy ={0x14062CFB,0x188AD0AA,0x19327860,0x3860FD1,0xEF8C270,0x18F879F6,0x12447E49,0x1EF91640,0x6142E0};

}
