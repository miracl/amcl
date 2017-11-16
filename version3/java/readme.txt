
Namespaces are used to separate different curves.

To build the library and see it in action, copy all of the files in 
this directory to a fresh directory and execute the python3 script 
config32.py or config64.py (depending on whether you want a 32 or 
64-bit build), and select the curves that you wish to support. 
A jar file is built automatically including all of the modules 
that you will need

As a quick example execute

py config64.py

or perhaps

python3 config64.py

Then select options 1, 17 and 20 (these are fixed for the example 
programs provided, but easily changed). Select 0 to exit.

If these options have been selected, then compile and build the test 
programs by executing

py build.py

Run all of the test programs

java -cp amcl/target/classes org.apache.milagro.TestALL

The correct PIN is 1234

Next compile and run the Benchmarking program by executing

java -cp amcl/target/classes org.apache.milagro.BenchtestALL

