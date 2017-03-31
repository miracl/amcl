import os
import sys

deltext=""
slashtext=""
copytext=""
if sys.platform.startswith("linux")  :
	copytext="cp "
	deltext="rm "
	slashtext="/"
if sys.platform.startswith("win") :
	copytext="copy "
	deltext="del "
	slashtext="\\"

chosen=[]
cptr=0

def replace(namefile,oldtext,newtext):
	f = open(namefile,'r')
	filedata = f.read()
	f.close()

	newdata = filedata.replace(oldtext,newtext)

	f = open(namefile,'w')
	f.write(newdata)
	f.close()


def rsaset(tb,nb,base,ml) :
	global deltext,slashtext,copytext
	global cptr,chosen

	chosen.append(tb)
	cptr=cptr+1

	fpath="amcl"+slashtext+tb+slashtext
	os.system("mkdir amcl"+slashtext+tb)

	os.system(copytext+"BIG64.java "+fpath+"BIG.java")
	os.system(copytext+"DBIG64.java "+fpath+"DBIG.java")
	os.system(copytext+"FF64.java "+fpath+"FF.java")
	os.system(copytext+"RSA.java "+fpath+"RSA.java")
	os.system(copytext+"private_key.java "+fpath+"private_key.java")
	os.system(copytext+"public_key.java "+fpath+"public_key.java")	

	replace(fpath+"BIG.java","XXX",tb)
	replace(fpath+"DBIG.java","XXX",tb)
	replace(fpath+"FF.java","XXX",tb)
	replace(fpath+"RSA.java","XXX",tb)
	replace(fpath+"private_key.java","XXX",tb)
	replace(fpath+"public_key.java","XXX",tb)


	replace(fpath+"BIG.java","@NB@",nb)
	replace(fpath+"BIG.java","@BASE@",base)

	replace(fpath+"FF.java","@ML@",ml);

	os.system("javac "+fpath+"*.java")


def curveset(tc,nb,base,nbt,m8,mt,ct,pf) :
	global deltext,slashtext,copytext
	global cptr,chosen

	chosen.append(tc)
	cptr=cptr+1

	fpath="amcl"+slashtext+tc+slashtext
	os.system("mkdir amcl"+slashtext+tc)

	os.system(copytext+"BIG64.java "+fpath+"BIG.java")
	os.system(copytext+"DBIG64.java "+fpath+"DBIG.java")
	os.system(copytext+"FP64.java "+fpath+"FP.java")
	os.system(copytext+"ECP.java "+fpath+"ECP.java")
	os.system(copytext+"ECDH.java "+fpath+"ECDH.java")
	os.system(copytext+"ROM_"+tc+"_64.java "+fpath+"ROM.java")

	
	replace(fpath+"BIG.java","XXX",tc)
	replace(fpath+"DBIG.java","XXX",tc)
	replace(fpath+"FP.java","XXX",tc)
	replace(fpath+"ECP.java","XXX",tc)
	replace(fpath+"ECDH.java","XXX",tc)

	replace(fpath+"BIG.java","@NB@",nb)
	replace(fpath+"BIG.java","@BASE@",base)

	replace(fpath+"FP.java","@NBT@",nbt)
	replace(fpath+"FP.java","@M8@",m8)
	replace(fpath+"FP.java","@MT@",mt)

	replace(fpath+"ECP.java","@CT@",ct)
	replace(fpath+"ECP.java","@PF@",pf)


	if pf != "NOT" :
		os.system(copytext+"ECP2.java "+fpath+"ECP2.java")
		os.system(copytext+"FP2.java "+fpath+"FP2.java")
		os.system(copytext+"FP4.java "+fpath+"FP4.java")
		os.system(copytext+"FP12.java "+fpath+"FP12.java")
		os.system(copytext+"PAIR.java "+fpath+"PAIR.java")
		os.system(copytext+"MPIN.java "+fpath+"MPIN.java")

		replace(fpath+"FP2.java","XXX",tc)
		replace(fpath+"FP4.java","XXX",tc)
		replace(fpath+"FP12.java","XXX",tc)
		replace(fpath+"ECP2.java","XXX",tc)
		replace(fpath+"PAIR.java","XXX",tc)
		replace(fpath+"MPIN.java","XXX",tc)
	
	os.system("javac "+fpath+"*.java")


os.system("mkdir amcl")
os.system(copytext+ "HASH*.java amcl"+slashtext+".")
os.system(copytext+ "RAND.java amcl"+slashtext+".")
os.system(copytext+ "AES.java amcl"+slashtext+".")
os.system(copytext+ "GCM.java amcl"+slashtext+".")

print("Elliptic Curves")
print("1. ED25519")
print("2. C25519")
print("3. NIST256")
print("4. BRAINPOOL")
print("5. ANSSI")
print("6. HIFIVE")
print("7. GOLDILOCKS")
print("8. NIST384")
print("9. C41417")
print("10. NIST521\n")
print("11. MF254 WEIERSTRASS")
print("12. MF254 EDWARDS")
print("13. MF254 MONTGOMERY")
print("14. MF256 WEIERSTRASS")
print("15. MF256 EDWARDS")
print("16. MF256 MONTGOMERY")
print("17. MS255 WEIERSTRASS")
print("18. MS255 EDWARDS")
print("19. MS255 MONTGOMERY")
print("20. MS256 WEIERSTRASS")
print("21. MS256 EDWARDS")
print("22. MS256 MONTGOMERY")


print("Pairing-Friendly Elliptic Curves")
print("23. BN254")
print("24. BN254CX")
print("25. BLS383\n")

print("RSA")
print("26. RSA2048")
print("27. RSA3072")
print("28. RSA4096")

selection=[]
ptr=0
max=29

curve_selected=False
pfcurve_selected=False
rsa_selected=False

while ptr<max:
	x=int(input("Choose a Scheme to support - 0 to finish: "))
	if x == 0:
		break
#	print("Choice= ",x)
	already=False
	for i in range(0,ptr):
		if x==selection[i]:
			already=True
			break
	if already:
		continue
	
	selection.append(x)
	ptr=ptr+1

# curveset(curve,big_length_bytes,bits_in_base,modulus_bits,modulus_mod_8,modulus_type,curve_type,pairing_friendly)
# where "curve" is the common name for the elliptic curve   
# big_length_bytes is the modulus size rounded up to a number of bytes
# bits_in_base gives the number base used for 64 bit architectures, as n where the base is 2^n
# modulus_bits is the actual bit length of the modulus.
# modulus_mod_8 is the remainder when the modulus is divided by 8
# modulus_type is NOT_SPECIAL, or PSEUDO_MERSENNE, or MONTGOMERY_Friendly, or GENERALISED_MERSENNE (supported for GOLDILOCKS only)
# curve_type is WEIERSTRASS, EDWARDS or MONTGOMERY
# pairing_friendly is BN, BLS or NOT (if not pairing friendly

	if x==1:
		curveset("ED25519","32","56","255","5","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==2:
		curveset("C25519","32","56","255","5","PSEUDO_MERSENNE","MONTGOMERY","NOT")
		curve_selected=True
	if x==3:
		curveset("NIST256","32","56","256","7","NOT_SPECIAL","WEIERSTRASS","NOT")
		curve_selected=True
	if x==4:
		curveset("BRAINPOOL","32","56","256","7","NOT_SPECIAL","WEIERSTRASS","NOT")
		curve_selected=True
	if x==5:
		curveset("ANSSI","32","56","256","7","NOT_SPECIAL","WEIERSTRASS","NOT")
		curve_selected=True

	if x==6:
		curveset("HIFIVE","42","60","336","5","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==7:
		curveset("GOLDILOCKS","56","60","448","7","GENERALISED_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==8:
		curveset("NIST384","48","56","384","7","NOT_SPECIAL","WEIERSTRASS","NOT")
		curve_selected=True
	if x==9:
		curveset("C41417","52","60","414","7","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==10:
		curveset("NIST521","66","60","521","7","PSEUDO_MERSENNE","WEIERSTRASS","NOT")
		curve_selected=True

	if x==11:
		curveset("MF254W","32","56","254","7","MONTGOMERY_FRIENDLY","WEIERSTRASS","NOT")
		curve_selected=True
	if x==12:
		curveset("MF254E","32","56","254","7","MONTGOMERY_FRIENDLY","EDWARDS","NOT")
		curve_selected=True
	if x==13:
		curveset("MF254M","32","56","254","7","MONTGOMERY_FRIENDLY","MONTGOMERY","NOT")
		curve_selected=True
	if x==14:
		curveset("MF256W","32","56","256","7","MONTGOMERY_FRIENDLY","WEIERSTRASS","NOT")
		curve_selected=True
	if x==15:
		curveset("MF256E","32","56","256","7","MONTGOMERY_FRIENDLY","EDWARDS","NOT")
		curve_selected=True
	if x==16:
		curveset("MF256M","32","56","256","7","MONTGOMERY_FRIENDLY","MONTGOMERY","NOT")
		curve_selected=True
	if x==17:
		curveset("MS255W","32","56","255","3","PSEUDO_MERSENNE","WEIERSTRASS","NOT")
		curve_selected=True
	if x==18:
		curveset("MS255E","32","56","255","3","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==19:
		curveset("MS255M","32","56","255","3","PSEUDO_MERSENNE","MONTGOMERY","NOT")
		curve_selected=True
	if x==20:
		curveset("MS256W","32","56","256","3","PSEUDO_MERSENNE","WEIERSTRASS","NOT")
		curve_selected=True
	if x==21:
		curveset("MS256E","32","56","256","3","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==22:
		curveset("MS256M","32","56","256","3","PSEUDO_MERSENNE","MONTGOMERY","NOT")
		curve_selected=True

	if x==23:
		curveset("BN254","32","56","254","3","NOT_SPECIAL","WEIERSTRASS","BN")
		pfcurve_selected=True
	if x==24:
		curveset("BN254CX","32","56","254","3","NOT_SPECIAL","WEIERSTRASS","BN")
		pfcurve_selected=True
	if x==25:
		curveset("BLS383","48","56","383","3","NOT_SPECIAL","WEIERSTRASS","BLS")
		pfcurve_selected=True

# rsaset(rsaname,big_length_bytes,bits_in_base,multiplier)
# The RSA name reflects the modulus size, which is a 2^m multiplier
# of the underlying big length

# There are choices here, different ways of getting the same result, but some faster than others
	if x==26:
		#256 is slower but may allow reuse of 256-bit BIGs used for elliptic curve
		#512 is faster.. but best is 1024
		rsaset("RSA2048","128","58","2")
		#rsaset("RSA2048","64","60","4")
		#rsaset("RSA2048","32","56","8")
		rsa_selected=True
	if x==27:
		rsaset("RSA3072","48","56","8")
		rsa_selected=True
	if x==28:
		#rsaset("RSA4096","32","56","16")
		rsaset("RSA4096","64","60","8")
		rsa_selected=True


os.system(deltext+" HASH*.java")
os.system(deltext+" AES.java")
os.system(deltext+" RAND.java")
os.system(deltext+" GCM.java")

os.system(deltext+" BIG*.java")
os.system(deltext+" DBIG*.java")
os.system(deltext+" FP*.java")
os.system(deltext+" ECP.java")
os.system(deltext+" ECDH.java")
os.system(deltext+" FF*.java")
os.system(deltext+" RSA.java")
os.system(deltext+" public_key.java")
os.system(deltext+" private_key.java")
os.system(deltext+" ECP2.java")
os.system(deltext+" PAIR.java")
os.system(deltext+" MPIN.java")
os.system(deltext+" ROM*.java")

# create library

os.system("jar cf amcl.jar amcl")

for i in range(0,cptr):
	os.system(deltext+" amcl"+slashtext+chosen[i]+slashtext+"*.java")
	os.system(deltext+" amcl"+slashtext+chosen[i]+slashtext+"*.class")
	os.system("rmdir amcl"+slashtext+chosen[i])

os.system(deltext+" amcl"+slashtext+"*.java")
os.system(deltext+" amcl"+slashtext+"*.class")
os.system("rmdir amcl")

