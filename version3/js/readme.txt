Namespaces are sinulated to separate different curves.

To this end the BIG type is renamed to BIG_XXX, where XXX can be changed to 
describe the size of the BIG variable. Similarily the FP type is renamed
FP_YYY, where YYY reflects the modulus used. Also the ECP type is renamed
ECP_ZZZ, where ZZZ describes the actual curve. Function names are also 
decorated in the same way.

So for example to support both ED25519 and the NIST P256 curve, we would 
need to create BIG_256, FP_25519, ECP_ED25519 and FP_GM256, ECP_NIST256. 
Note that both of these curves could be built on top of BIG_256, as both 
require support for 256-bit numbers.

Separate ROM files provide the constants required for each curve. The
files BIG_XXX.js, FP_YYY.js and ECP_ZZZ.js also specify 
certain constants that must be set for the particular curve.

--------------------------------------

To build the library and see it in action,  copy all of the files in 
this directory to a fresh directory and execute the python3 script 
config.py, and select the curves that you wish to support. Javascript 
files are created for all of the modules you will need.

As a quick example execute

py config.py

or

python3 config.py

Then select options 1, 23 and 26 (these are fixed for the example 
programs provided). Select 0 to exit.

Then load TestALL.html or BenchtestALL.html into your favourite browser.
You might have to wait a minute or two for the scripts to complete.

For TestALL.html the PIN number is 1234.


