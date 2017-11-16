import os
import sys

slashtext=""
septext=""
org1text="org"
org2text="apache"
org3text="milagro"

if sys.platform.startswith("linux")  :
	slashtext="/"
	septext=":"
if sys.platform.startswith("win") :

	slashtext="\\"
	septext=";"	

os.system("javac -cp amcl"+slashtext+"target"+slashtext+"amcl.jar"+septext+"amcl"+slashtext+"target"+slashtext+"classes amcl"+slashtext+"src"+slashtext+"main"+slashtext+"java"+slashtext+org1text+slashtext+org2text+slashtext+org3text+slashtext+"TimeRSA.java -d amcl"+slashtext+"target"+slashtext+"classes")
os.system("javac -cp amcl"+slashtext+"target"+slashtext+"amcl.jar"+septext+"amcl"+slashtext+"target"+slashtext+"classes amcl"+slashtext+"src"+slashtext+"main"+slashtext+"java"+slashtext+org1text+slashtext+org2text+slashtext+org3text+slashtext+"TimeECDH.java -d amcl"+slashtext+"target"+slashtext+"classes")
os.system("javac -cp amcl"+slashtext+"target"+slashtext+"amcl.jar"+septext+"amcl"+slashtext+"target"+slashtext+"classes amcl"+slashtext+"src"+slashtext+"main"+slashtext+"java"+slashtext+org1text+slashtext+org2text+slashtext+org3text+slashtext+"TimeMPIN.java -d amcl"+slashtext+"target"+slashtext+"classes")
os.system("javac -cp amcl"+slashtext+"target"+slashtext+"amcl.jar"+septext+"amcl"+slashtext+"target"+slashtext+"classes amcl"+slashtext+"src"+slashtext+"main"+slashtext+"java"+slashtext+org1text+slashtext+org2text+slashtext+org3text+slashtext+"BenchtestALL.java -d amcl"+slashtext+"target"+slashtext+"classes")

os.system("javac -cp amcl"+slashtext+"target"+slashtext+"amcl.jar"+septext+"amcl"+slashtext+"target"+slashtext+"classes amcl"+slashtext+"src"+slashtext+"main"+slashtext+"java"+slashtext+org1text+slashtext+org2text+slashtext+org3text+slashtext+"TestRSA.java -d amcl"+slashtext+"target"+slashtext+"classes")
os.system("javac -cp amcl"+slashtext+"target"+slashtext+"amcl.jar"+septext+"amcl"+slashtext+"target"+slashtext+"classes amcl"+slashtext+"src"+slashtext+"main"+slashtext+"java"+slashtext+org1text+slashtext+org2text+slashtext+org3text+slashtext+"TestECDH.java -d amcl"+slashtext+"target"+slashtext+"classes")
os.system("javac -cp amcl"+slashtext+"target"+slashtext+"amcl.jar"+septext+"amcl"+slashtext+"target"+slashtext+"classes amcl"+slashtext+"src"+slashtext+"main"+slashtext+"java"+slashtext+org1text+slashtext+org2text+slashtext+org3text+slashtext+"TestMPIN.java -d amcl"+slashtext+"target"+slashtext+"classes")
os.system("javac -cp amcl"+slashtext+"target"+slashtext+"amcl.jar"+septext+"amcl"+slashtext+"target"+slashtext+"classes amcl"+slashtext+"src"+slashtext+"main"+slashtext+"java"+slashtext+org1text+slashtext+org2text+slashtext+org3text+slashtext+"TestALL.java -d amcl"+slashtext+"target"+slashtext+"classes")

os.system("javac -cp amcl"+slashtext+"target"+slashtext+"amcl.jar"+septext+"amcl"+slashtext+"target"+slashtext+"classes amcl"+slashtext+"src"+slashtext+"main"+slashtext+"java"+slashtext+org1text+slashtext+org2text+slashtext+org3text+slashtext+"TestNHS.java -d amcl"+slashtext+"target"+slashtext+"classes")

