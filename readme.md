# The Apache Milagro Cryptographic Library

[![Build Status](https://travis-ci.org/miracl/amcl.svg?branch=master)](https://travis-ci.org/miracl/amcl)


IMPORTANT NOTICE. Further active development of this library will now take place
at https://github.com/miracl/core. This is now also under the same Apache-2.0 
license


It is not intended to add any new features to this version, and it will not 
continue to be maintained for bug fixes.


---------------------------------------

AMCL is a multi-lingual Cryptographic library that supports elliptic
curve cryptography, pairing-friendly curve cryptography, RSA, AES symmetric
encryption and hash functions. All code is entirely in the supported high-
level languages. No assembly language and no third party code is required -
these libraries are completely self-contained. AMCL was designed from
the ground up with side-channel attack resistance in mind. Multiple curves
can be supported in a single application. Read the PDF manual for more details.

Note that the AMCL currently comes in two versions, version 2.2
and version 3.2

---------------------------------------

AMCL v2.2 is presented in what might be called a pre-library state.

In the various supported languages the source code is made available,
but it is not organised into rigid packages/crates/jars/whatever
It is expected that the consumer will themselves take this final step,
depending on the exact requirements of their project.

Note that version 2.2 is no longer supported.

-----------------------------------

AMCL v3.2 incorporates many minor improvements

- Python version
- Web Assembly support
- Improved side channel resistance
- Faster Swift code
- Better Rust build system
- Improved modular inversion algorithm
- General speed optimizations
- Improved Javascript testbed
- More curves supported
- New BLS signature API
- Post quantum New Hope Implementation

-----------------------------------

AMCL v3.1 uses a standard Python 3 script to build libraries in all
supported languages. New users should use this version.

The main improvement is that AMCL v3 can optionally simultaneously support
multiple elliptic curves and RSA key sizes within a single appliction.

Note that AMCL is largely configured at compile time. In version 3 this
configuration is handled by the Python script.

AMCL is available in 32-bit and 64-bit versions in most languages. Limited
support for 16-bit processors is provided by the C version.

Now languages like to remain "standard" irrespective of the underlying
hardware. However when it comes to optimal performance, it is impossible
to remain architecture-agnostic. If a processor supports 64-bit
instructions that operate on 64-bit registers, it will be a waste not to
use them. Therefore the 64-bit language versions should always be used
on 64-bit processors.

Version 3.1 is a major "under the hood" upgrade. Field arithmetic is
performed using ideas from http://eprint.iacr.org/2017/437 to ensure
that critical calculations are performed in constant time. This strongly
mitigates against side-channel attacks. Exception-free formulae are
now used for Weierstrass elliptic curves. A new standardised script
builds for the same set of curves across all languages.

---------------------------------------------

# Contributors

The following people have contributed to the AMCL library

- Mike Scott
- Kealan McCusker
- Alessandro Budroni
- Samuele Andreoli
