Namespaces are sinulated to separate different curves.

To this end the BIG type is renamed to BIG_XXX, where XXX can be changed to 
describe the size of the BIG variable. Similarily the FP type is renamed
FP_YYY, where YYY reflects the modulus used. Also the ECP type is renamed
ECP_ZZZ, where ZZZ describes the actual curve. Function names are also 
decorated in the same way.

So for example to support both ED25519 and the NIST P256 curve, we would 
need to create BIG_256, FP_25519, ECP_ED25519 and FP_GM256, ECP_NIST256. 
Note that both curves could be built on top of  BIG_256, as both require 
support for 256-bit numbers.

Separate ROM files provide the constants required for each curve. The
associated header files (big_XXX.h, fp_YYY.h and ecp_ZZZ.h) also specify 
certain constants that must be set for the particular curve.

--------------------------------------

To build the library and see it in action, copy all of the files in this 
directory to a fresh directory and edit the file arch.h to choose either 
a 16, 32 or 64-bit build. Note that support for 16-bit builds is somewhat 
limited. Then execute the python3 script config.py, and select the curves 
that you wish to support. A library is built automatically including all 
of the modules that you will need.

As a quick example execute

py config.py

or

python3 config.py

Then select options 1, 3, 7, 23 and 26 (these are fixed for the example 
program). Select 0 then to exit.

Then compile

gcc -O2 -std=c99 testall.c amcl.a -o testall.exe

if using MINGW in Windows. Or for Linux

gcc -O2 -std=c99 testall.c amcl.a -o testall

The test program exercises 3 different ordinary elliptic curves, a 
pairing friendly curve and RSA, all in the one binary.

Next compile 


gcc -O2 -std=c99 benchtest_all.c amcl.a -o benchtest_all.exe

if using MINGW in Windows. Or for Linux

gcc -O2 -std=c99 benchtest_all.c amcl.a -o benchtest_all

This program provides some timings.
