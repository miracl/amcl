Namespaces are used to separate different curves.

To build the library and see it in action, execute the python3 scripts 
config32.py or config64.py (depending on whether you want a 32 or 
64-bit build), and select the curves that you wish to support. The 
configured library can be built using maven. 

To build with tests, execute instead configwithtests32.py or 
configwithtests64.py

These tests will take a while to  run.

As a quick example execute

py configwithtests64.py

or perhaps

python3 configwithtests64.py

Choose options 1, 17 and 21.

Once the library is configured, you can compile and install with maven:

cd amcl
mvn clean install

If the testing scripts have been used, the tests will be carried out
during the installation processes
