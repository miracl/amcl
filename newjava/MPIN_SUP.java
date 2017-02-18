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

/* MPIN general purpose support functions */

package amcl;

import java.util.Date;

public final class MPIN_SUP {

	public static final int SHA256=32;
	public static final int SHA384=48;
	public static final int SHA512=64;

/* Hash number (optional) and string to array size of Bigs */

	public static byte[] hashit(int sha,int n,byte[] B,int len)
	{
		byte[] R=null;

		if (sha==SHA256)
		{
			HASH256 H=new HASH256();
			if (n>0) H.process_num(n);
			H.process_array(B);
			R=H.hash();
		}
		if (sha==SHA384)
		{
			HASH384 H=new HASH384();
			if (n>0) H.process_num(n);
			H.process_array(B);
			R=H.hash();
		}
		if (sha==SHA512)
		{
			HASH512 H=new HASH512();
			if (n>0) H.process_num(n);
			H.process_array(B);
			R=H.hash();
		}
		if (R==null) return null;
		byte[] W=new byte[len];

		if (sha>=len)
			for (int i=0;i<len;i++) W[i]=R[i];
		else
		{
			for (int i=0;i<sha;i++) W[i]=R[i];
			for (int i=sha;i<len;i++) W[i]=0;
		}
		return W;
	}

	/* return time in slots since epoch */
	public static int today() {
		Date date=new Date();
		return (int) (date.getTime()/(1000*60*1440));
	}

	public static byte[] HASH_ID(int sha,byte[] ID,int len)
	{
		return hashit(sha,0,ID,len);
	}

/* Hash the M-Pin transcript - new */

	public static byte[] HASH_ALL(int sha,byte[] HID,byte[] xID,byte[] xCID,byte[] SEC,byte[] Y,byte[] R,byte[] W,int len)
	{
		int i,tlen=0;
		byte[] T = new byte[1284];

		for (i=0;i<HID.length;i++) T[i]=HID[i];
		tlen+=HID.length;
		if (xCID!=null)
		{
			for (i=0;i<xCID.length;i++) T[i+tlen]=xCID[i];
			tlen+=xCID.length;
		}	
		else
		{
			for (i=0;i<xID.length;i++) T[i+tlen]=xID[i];
			tlen+=xID.length;
		}	
		for (i=0;i<SEC.length;i++) T[i+tlen]=SEC[i];
		tlen+=SEC.length;		
		for (i=0;i<Y.length;i++) T[i+tlen]=Y[i];
		tlen+=Y.length;	
		for (i=0;i<R.length;i++) T[i+tlen]=R[i];
		tlen+=R.length;		
		for (i=0;i<W.length;i++) T[i+tlen]=W[i];
		tlen+=W.length;		

		return hashit(sha,0,T,len);
	}

/* return time since epoch */
	public static int GET_TIME() {
		Date date=new Date();
		return (int) (date.getTime()/1000);
	}



}