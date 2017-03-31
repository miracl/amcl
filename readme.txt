The Apache Milagro Cryptographic Library

Note that the AMCL currently comes in two supported versions, version 2.2 
and version 3.0

AMCL v2.2 is presented in what might be called a pre-library state.

In the various supported languages the source code is made available,
but it is not organised into rigid packages/crates/jars/whatever
It is expected that the consumer will themselves take this final step,
depending on the exact requirements of their project.

AMCL v3.0 uses a standard Python 3 script to build libraries in all
supported languages.

The main improvement is that AMCL v3 can optionally simultaneously support 
multiple elliptic curves and RSA key sizes within a single appliction.

Note that AMCL is largely configure at compile time. In version 3 this
configuration is handled by the Python script.

AMCL is available in 32-bit and 64-bit versions in most languages. Limited 
support for 16-bit processors is provided by the C version.

Now languages like to remain "standard" irrespective of the underlying 
hardware. However when it comes to optimal performance, it is impossible 
to remain architecture-agnostic. If a processor supports 64-bit 
instructions that operate on 64-bit registers, it will be a waste not to
use them. Therefore the 64-bit language versions should always be used
on 64-bit processors.


