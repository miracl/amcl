This Python version of the library is ideal for beginners, or for people
interested in quickly putting together a "proof of concept" implementation
that requires Elliptic curve or pairng based cryptography.

Note this Python version is NOT for serious production use. Since the
handling of big numbers is outside of our control, side-channel attacks
cannot be prevented, so we have not even attempted to make this version 
side-channel secure. Also since Python will never be fast, no extreme attempts
at optimization have been made, and some optimizations which result in larger 
code size have been omitted. Once the Proof of Concept has been established,
the programmer should switch to one of the other supported languages.

This Python version is however very small and accessible, and easy to use.

Curve parameters are provided in individual files like ed25519.py and
bn254.py

Its easy to add more.



--------------------------------------

To see it in action, copy all of the files in this directory to a fresh directory. 
Then execute the python3 script config.py and select the curves that you wish 
to support. 

py config.py

Select options 1 and 4, which are fixed for the example program. Select 0 
to exit.

Then run the test program 

py test.py

