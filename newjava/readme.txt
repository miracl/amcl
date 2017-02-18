The original AMCL library supports any application which requires just one 
elliptic curve, and optionally RSA with a modulus which is 2^n times the
ECC curve modulus size.

This can be a little restrictive. It might be required to support two or more 
different elliptic curves, or an RSA modulus that does not have such a neat 
relationship with the ECC curve modulus.

At the same time we don't want AMCL to become a completely general library, 
like OpenSSL which has a built-in general purpose bignum library. Such a 
library is slower, not optimized for a particular curve, and difficult to 
make constant time and side-channel resistant. Indeed we note that Curve25519, 
recently added to OpenSSL, comes with its own integrated bignum library. 

So our compromise solution is to allow multiple curves to live side-by-side.
This obviously increases code size, roughly it will now be a multiple of
the number of curves supported. But otherwise the code itself does not 
change.

To this end the BIG type is renamed to BIG_XXX, where XXX can be changed to 
describe the size of the BIG variable. Similarily the FP type is renamed
FP_YYY, where YYY reflects the modulus used. Also the ECP type is renamed
ECP_ZZZ, where ZZZ describes the actual curve. 

So for example to support both ED25519 and the NIST P256 curve, we would 
need to create BIG_256, FP_25519, ECP_ED25519 and FP_GM256, ECP_NIST256. 
Note that both curves could be built on top of BIG_256, as both require 
support for 256-bit numbers.

Separate ROM files provide the constants required for each curve. Some
files (BIG_XXX.java, FP_YYY.java and ECP_ZZZ.java) also specify 
certain constants that must be set for the particular curve.

--------------------------------------

To see it in action, copy all of the files in this directory to a fresh 
directory and execute the python3 script config32.py or config64.py
(depending om whether you want a 32 or 64-bit build), and select the 
curves that you wish to support. A jar file is built automatically 
including all of the modules that you will need

As a quick example execute

py config64.py

or

python3 config64.py

Then select options 1, 3, 7, 23 and 26 (these are fixed for the example 
program). Select 0 then to exit.

Then compile and run the test program by executing on windows

javac -cp amcl.jar; TestALL.java
java -cp amcl.jar; TestALL

Or on Linux

javac -cp amcl.jar: TestALL.java
java -cp amcl.jar: TestALL

