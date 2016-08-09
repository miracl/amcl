AMCL is very simple to build for Rust.

First - decide the modulus and curve type you want to use. Edit rom.rs 
where indicated. You will probably want to use one of the curves whose 
details are already in there. You might want to "raid" the rom file from
the C version of the library for more curves.

Three example API files are provided, mpin.rs which 
supports our M-Pin (tm) protocol, ecdh.rs which supports elliptic 
curve key exchange, digital signature and public key crypto, and rsa.rs
which supports the RSA method.

In the rom.rs file you must provide the curve constants. Several examples
are provided there, if you are willing to use one of these.

For a quick jumpstart:-

rustc -O -A dead_code mpin.rs

or 

rustc -O -A dead_code ecdh.rs

or

rustc -O -A dead_code rsa.rs

