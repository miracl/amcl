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

To this end each supported primitive is implemented inside of its own 
rust namespace. 

So for example to support both ED25519 and the NIST P256 curves, one
could import into a particular module both "amcl/ED25519" and "amcl/NIST256"

Separate ROM files provide the constants required for each curve. Some
files (big.rs, fp.rs, ecp.rs) also specify certain constants 
that must be set for the particular curve.

--------------------------------------

To see it in action, copy all of the files in this directory to a fresh 
root directory. Then execute the python3 script config32.py or config64.py
(depending om whether you want a 32 or 64-bit build), and select the 
curves that you wish to support. Libraries will be built automatically 
including all of the modules that you will need.

As a quick example execute from your root directory

py config64.py

or

python3 config64.py

Then select options 1, 11 and 14 (these are fixed for the example 
program provided). Select 0 to exit.

Then copy the library from amcl/target/release/libamcl.rlib to the
root directory, and execute

rustc TestALL.rs --extern amcl=libamcl.rlib

Run the test program by executing the program TestALL.exe

