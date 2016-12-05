AMCL is presented in what might be called a pre-library state.

In the various supported languages the source code is made available,
but it is not organised into rigid packages/crates/jars/whatever

It is expected that the consumer will themselves take this final step,
depending on the exact requirements of their project.

Note that AMCL is largely configure at compile time, and so it doesn't
fit the mold for a general purpose library that can be configure at
runtime.

AMCL is available in 32-bit and 64-bit versions in most languages.

Now languages like to remain "standard" irrespective of the underlying 
hardware. However when it comes to optimal performance, it is impossible 
to remain architecture-agnostic. If a processor supports 64-bit 
intructions that operate on 64-bit registers, it will be a waste not to
use them.

For us this dichotomy is represented by an unwillingness of high-level 
languages to support a 128-bit integer type, as required to store the 
product of two 64-bit numbers. More generally what is missing is a 
commitment to support an integer type twice the length of the processor
bit-length

To our knowledge only the 64-bit GCC port of C supports such an entity 
- although 128-bit integers are still not part of any C standard.

Therefore only a kind of pseudo-64-bit support is possible, without 
plunging into assembly language, which we don't wnat to do. 

Nevertheless this pseudo-64-bit code will generally be faster than
the 32-bit version of the library when run on a 64-bit processor under 
control of a 64-bit operating system. 

On a 32-bit processor the 32-bit version will probably be best.

