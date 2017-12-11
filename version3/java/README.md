Namespaces are used to separate different curves.

To build the library and see it in action, execute the python3 script 
config32.py or config64.py (depending on whether you want a 32 or 
64-bit build), and select the curves that you wish to support. The 
configured library can be built using maven. 

As a quick example execute

`py config64.py`

or perhaps

python3 config64.py

Once the library is configured, you can compile and install with maven:

`cd amcl`

`mvn clean install`