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

ROM_FIELD_25519 = function() {

    var ROM_FIELD_25519 = {

        // 25519 Curve Modulus

        Modulus: [0xFFFFED, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0x7FFF],
        R2modp: [0xA40000, 0x5, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        MConst: 0x13,

    };
    return ROM_FIELD_25519;
};

ROM_FIELD_256PM = function() {

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

    var ROM_FIELD_256PM = {

        // NUMS256 Curve Modulus
        // Base Bits= 24
        Modulus: [0xFFFF43, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFF],
        R2modp: [0x890000, 0x8B, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        MConst: 0xBD,

    };
    return ROM_FIELD_256PM;
};

ROM_FIELD_384PM = function() {

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

    var ROM_FIELD_384PM = {

        // NUMS384 Curve Modulus
        // Base Bits= 23
        Modulus: [0x7FFEC3, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0xFFFF],
        R2modp: [0x224000, 0xC4, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        MConst: 0x13D,

    };
    return ROM_FIELD_384PM;
};

ROM_FIELD_512PM = function() {

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

    var ROM_FIELD_512PM = {

        // NUMS512 Curve Modulus
        // Base Bits= 23
        Modulus: [0x7FFDC7, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x3F],
        R2modp: [0x0, 0x58800, 0x4F, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        MConst: 0x239,

    };
    return ROM_FIELD_512PM;
};

ROM_FIELD_ANSSI = function() {

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

    var ROM_FIELD_ANSSI = {

        // ANSSI modulus
        // Base Bits= 24
        Modulus: [0x6E9C03, 0xF353D8, 0x6DE8FC, 0xABC8CA, 0x61ADBC, 0x435B39, 0xE8CE42, 0x10126D, 0x3AD58F, 0x178C0B, 0xF1FD],
        R2modp: [0xACECE3, 0x924166, 0xB10FCE, 0x6CFBB6, 0x87EC2, 0x3DE43D, 0xD2CF67, 0xA67DDE, 0xAD30F2, 0xBCAAE, 0xDF98],
        MConst: 0x4E1155,

    };
    return ROM_FIELD_ANSSI;
};

ROM_FIELD_BLS383 = function() {

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

    var ROM_FIELD_BLS383 = {

        // BLS383 Modulus 
        // Base Bits= 23
        Modulus: [0x2D556B, 0x556A55, 0x75EAB2, 0x23AFBA, 0x1BB01, 0x2BAEA4, 0x5CC20F, 0x758B67, 0x20F99, 0x640A63, 0x69A3A8, 0x6009AA, 0x2A7852, 0x20B8AA, 0x7DD718, 0x104054, 0x7AC5],
        R2modp: [0x3353B, 0x66C8A7, 0x51A94C, 0x31E097, 0x340361, 0x5EBDB7, 0x3B6484, 0x3C1977, 0x73CD0B, 0x3C91A6, 0x269561, 0x1EC635, 0x182E9D, 0x5C56A2, 0x778340, 0x321B03, 0x5892],
        MConst: 0x23D0BD,
        Fra: [0x34508B, 0x4B3525, 0x4D0CAE, 0x503777, 0x463DB7, 0x3BF78E, 0xD072C, 0x2AE9A0, 0x69D32D, 0x282C73, 0x1730DB, 0xCD9F8, 0x6AB98B, 0x7DC9B0, 0x1CBCC8, 0x7D8CC3, 0x5A5],
        Frb: [0x7904E0, 0xA352F, 0x28DE04, 0x537843, 0x3B7D49, 0x6FB715, 0x4FBAE2, 0x4AA1C7, 0x183C6C, 0x3BDDEF, 0x5272CD, 0x532FB2, 0x3FBEC7, 0x22EEF9, 0x611A4F, 0x12B391, 0x751F],

    };

    return ROM_FIELD_BLS383;
};

ROM_FIELD_BN254 = function() {

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

    var ROM_FIELD_BN254 = {

        // BN254 Modulus 

        // Base Bits= 24
        Modulus: [0x13, 0x0, 0x13A700, 0x0, 0x210000, 0x861, 0x800000, 0xBA344D, 0x1, 0x648240, 0x2523],
        R2modp: [0x2F2AA7, 0x537047, 0xF8F174, 0xC3E364, 0xAB8C1C, 0x3C2035, 0x69549, 0x379287, 0x3BE629, 0x75617A, 0x1F47],
        MConst: 0x9435E5,
        Fra: [0x2A6DE9, 0xE6C06F, 0xC2E17D, 0x4D3F77, 0x97492, 0x953F85, 0x50A846, 0xB6499B, 0x2E7C8C, 0x761921, 0x1B37],
        Frb: [0xD5922A, 0x193F90, 0x50C582, 0xB2C088, 0x178B6D, 0x6AC8DC, 0x2F57B9, 0x3EAB2, 0xD18375, 0xEE691E, 0x9EB],

    };

    return ROM_FIELD_BN254;
};

ROM_FIELD_BN254CX = function() {

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

    var ROM_FIELD_BN254CX = {

        // BN254CX Modulus 
        // Base Bits= 24
        Modulus: [0x1B55B3, 0x23EF5C, 0xE1BE66, 0x18093E, 0x3FD6EE, 0x66D324, 0x647A63, 0xB0BDDF, 0x702A0D, 0x8, 0x2400],
        R2modp: [0x8EE63D, 0x721FDE, 0xCC0891, 0x10C28B, 0xD4F5A, 0x4C18FB, 0x9036FA, 0x3F845F, 0xA507E4, 0x78EB29, 0x1587],
        MConst: 0x789E85,
        Fra: [0xC80EA3, 0x83355, 0x215BD9, 0xF173F8, 0x677326, 0x189868, 0x8AACA7, 0xAFE18B, 0x3A0164, 0x82FA6, 0x1359],
        Frb: [0x534710, 0x1BBC06, 0xC0628D, 0x269546, 0xD863C7, 0x4E3ABB, 0xD9CDBC, 0xDC53, 0x3628A9, 0xF7D062, 0x10A6],
    };

    return ROM_FIELD_BN254CX;
};

ROM_FIELD_BRAINPOOL = function() {

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

    var ROM_FIELD_BRAINPOOL = {

        // Brainpool modulus
        // Base Bits= 24
        Modulus: [0x6E5377, 0x481D1F, 0x282013, 0xD52620, 0x3BF623, 0x8D726E, 0x909D83, 0x3E660A, 0xEEA9BC, 0x57DBA1, 0xA9FB],
        R2modp: [0x35B819, 0xB03428, 0xECAF0F, 0x3854A4, 0x4A0ED5, 0x2421EA, 0xAA562C, 0xF9C45, 0xDDAE58, 0x4350FD, 0x52B8],
        MConst: 0xFD89B9,

    };
    return ROM_FIELD_BRAINPOOL;
};

ROM_FIELD_C41417 = function() {

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


    var ROM_FIELD_C41417 = {

        // C41417 modulus
        // Base Bits= 23
        Modulus: [0x7FFFEF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF],
        R2modp: [0x121, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        MConst: 0x11,
    };
    return ROM_FIELD_C41417;
};

ROM_FIELD_GOLDILOCKS = function() {

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

    var ROM_FIELD_GOLDILOCKS = {

        // GOLDILOCKS modulus
        // Base Bits= 23
        Modulus: [0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7DFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FF],
        R2modp: [0x0, 0x4, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0xC0000, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        MConst: 0x1,
    };
    return ROM_FIELD_GOLDILOCKS;
};

ROM_FIELD_HIFIVE = function() {

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

    var ROM_FIELD_HIFIVE = {

        // HIFIVE modulus
        // Base Bits= 23
        Modulus: [0x7FFFFD, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x3FFF],
        R2modp: [0x240000, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        MConst: 0x3,
    };
    return ROM_FIELD_HIFIVE;
};

ROM_FIELD_NIST256 = function() {

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

    var ROM_FIELD_NIST256 = {

        // NIST256 Modulus 
        // Base Bits= 24
        Modulus: [0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0x0, 0x0, 0x0, 0x0, 0x1, 0xFFFF00, 0xFFFF],
        R2modp: [0x30000, 0x0, 0x0, 0xFFFF00, 0xFBFFFF, 0xFFFFFF, 0xFFFFFE, 0xFFFFFF, 0xFDFFFF, 0xFFFFFF, 0x4],
        MConst: 0x1,

    };
    return ROM_FIELD_NIST256;
};

ROM_FIELD_NIST384 = function() {

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

    var ROM_FIELD_NIST384 = {

        // NIST384 modulus
        // Base Bits= 23
        Modulus: [0x7FFFFF, 0x1FF, 0x0, 0x0, 0x7FFFF0, 0x7FDFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0xFFFF],
        R2modp: [0x4000, 0x0, 0x7FFFFE, 0x1FF, 0x80000, 0x0, 0x0, 0x7FC000, 0x3FFFFF, 0x0, 0x200, 0x20000, 0x0, 0x0, 0x0, 0x0, 0x0],
        MConst: 0x1,

    };
    return ROM_FIELD_NIST384;
};

ROM_FIELD_NIST521 = function() {

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

    var ROM_FIELD_NIST521 = {

        // NIST521 modulus
        // Base Bits= 23
        Modulus: [0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFFFF, 0x7FFF],
        R2modp: [0x10000, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        MConst: 0x1,
    };
    return ROM_FIELD_NIST521;
};