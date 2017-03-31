Namespaces are used to separate different curves.

To build the library and see it in action, copy all of the files in 
this directory to a fresh directory and execute the python3 script 
config32.py or config64.py (depending on whether you want a 32 or 
64-bit build), and select the curves that you wish to support. 
A jar file is built automatically including all of the modules 
that you will need

As a quick example execute

py config64.py

or

python3 config64.py

Then select options 1, 23 and 26 (these are fixed for the example 
programs provided). Select 0 to exit.

Then compile and run the test program by executing on windows

javac -cp amcl.jar; TestALL.java
java -cp amcl.jar; TestALL

Or on Linux

javac -cp amcl.jar: TestALL.java
java -cp amcl.jar: TestALL


Next compile and run the Benchmarking program by executing on windows

javac -cp amcl.jar; BenchtestALL.java
java -cp amcl.jar; BenchtestALL

Or on Linux

javac -cp amcl.jar: BenchtestALL.java
java -cp amcl.jar: BenchtestALL
