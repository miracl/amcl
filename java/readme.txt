AMCL is very simple to build for Java. This version is optimal for a 32-bit 
(or less) Virtual Machine.

First - decide the modulus type and curve type you want to use. Edit ROM.java 
where indicated. You might want to use one of the curves whose details are
already in there.

Three example API files are provided, MPIN.java which 
supports our M-Pin (tm) protocol, ECDH.java which supports elliptic 
curve key exchange, digital signature and public key crypto, and RSA.java
which supports the RSA method. The first  can be tested using the 
TestMPIN.java driver programs, the second can be tested using TestECDH.java, 
and the third with TestRSA.java

In the ROM.java file you must provide the curve constants. Several examples
are provided there, if you are willing to use one of these.

To help generate the ROM constants for your own curve some MIRACL helper 
programs are included. The program bngen.cpp generates ROM data for a 
BN curve, and the program ecgen.cpp generates ROM data for EC curves. 

The program bigtobig.cpp converts a big number to the AMCL 
BIG format.

Don't forget to delete all .class files before rebuilding projects.

For a quick jumpstart:-

del *.class
javac TestECDH.java
java TestECDH

del *.class
javac TestMPIN.java
java TestMPIN

del *.class
javac BenchtestEC.java
java BenchtestEC

del *.class
javac BenchtestPAIR.java
java BenchtestPAIR

