AMCL is very simple to build for Swift.

First - decide the modulus and curve type you want to use. Edit rom.swift 
where indicated (3 places). You will probably want to use one of the curves whose 
details are already in there.

Three example API files are provided, mpin.swift which 
supports our M-Pin (tm) protocol, ecdh.swift which supports elliptic 
curve key exchange, digital signature and public key crypto, and rsa.swift
which supports the RSA method. The first  can be tested using the 
TestMPIN.swift driver programs, the second can be tested using TestECDH.swift,
and the third with TestRSA.swift

In the rom.swift file you must provide the curve constants. Several examples
are provided there, if you are willing to use one of these.

To run inside Xcode simply copy all of the .swift files into a project, 
and execute the main program. This runs TestRSA, TestECDH and TestMPIN 
in that order.


For a quick jumpstart from a terminal window - first edit TestMPIN.swift, TestRSA.swift and TestECDH.swift
where indicated

From a terminal window in a /lib directory create a dynamic library using the command

swiftc big.swift rom.swift dbig.swift rand.swift hash256.swift hash384.swift hash512.swift fp.swift fp2.swift ecp.swift ecp2.swift aes.swift gcm.swift fp4.swift fp12.swift ff.swift pair.swift rsa.swift ecdh.swift mpin.swift -Ounchecked -whole-module-optimization -emit-library -emit-module -module-name amcl

This creates the files 

libamcl.dylib
amcl.swiftmodule

Copy these to a project directory, which contains only the files 

TestECDH.swift
TestRSA.swift
TestMPIN.swift

And create and run the projects by issuing the commands

swift -lamcl -I. TestMPIN.swift 
swift -lamcl -I. TestECDH.swift 
swift -lamcl -I. TestRSA.swift 

Note that classes and methods that need to be exposed to consuming programs, 
should be made "public" when and if needed. Here we have done this as needed 
just for these example programs



