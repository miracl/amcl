import os
import sys

deltext=""
slashtext=""
copytext=""
if sys.platform.startswith("linux") or sys.platform.startswith("darwin") :
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


def rsaset(tb,nb,base32,base64,ml) :
	global deltext,slashtext,copytext
	global cptr,chosen

	chosen.append(tb)
	cptr=cptr+1

	fpath="amcl"+slashtext+tb+slashtext
	os.system("mkdir amcl"+slashtext+tb)

	os.system(copytext+"big.swift "+fpath+"big.swift")
	os.system(copytext+"dbig.swift "+fpath+"dbig.swift")
	os.system(copytext+"ff.swift "+fpath+"ff.swift")
	os.system(copytext+"rsa.swift "+fpath+"rsa.swift")

	replace(fpath+"big.swift","@NB@",nb)
	replace(fpath+"big.swift","@BASE32@",base32)
	replace(fpath+"big.swift","@BASE64@",base64)

	replace(fpath+"ff.swift","@ML@",ml);

	os.system("swiftc -DD32 "+fpath+"*.swift -L. -lamcl -I. -O -Ounchecked -whole-module-optimization -emit-library -emit-module -module-name "+tb)
	os.system(deltext+fpath+"*.*")
	os.system("rmdir amcl"+slashtext+tb)


def curveset(tc,nb,base32,base64,nbt,m8,mt,ct,pf) :
	global deltext,slashtext,copytext
	global cptr,chosen

	chosen.append(tc)
	cptr=cptr+1

	fpath="amcl"+slashtext+tc+slashtext
	os.system("mkdir amcl"+slashtext+tc)

	os.system(copytext+"big.swift "+fpath+"big.swift")
	os.system(copytext+"dbig.swift "+fpath+"dbig.swift")
	os.system(copytext+"fp.swift "+fpath+"fp.swift")
	os.system(copytext+"ecp.swift "+fpath+"ecp.swift")
	os.system(copytext+"rom_"+tc+".swift "+fpath+"rom.swift")

	replace(fpath+"big.swift","@NB@",nb)
	replace(fpath+"big.swift","@BASE32@",base32)
	replace(fpath+"big.swift","@BASE64@",base64)

	replace(fpath+"fp.swift","@NBT@",nbt)
	replace(fpath+"fp.swift","@M8@",m8)
	replace(fpath+"fp.swift","@MT@",mt)

	replace(fpath+"ecp.swift","@CT@",ct)
	replace(fpath+"ecp.swift","@PF@",pf)


	if pf != "NOT" :
		os.system(copytext+"ecp2.swift "+fpath+"ecp2.swift")
		os.system(copytext+"fp2.swift "+fpath+"fp2.swift")
		os.system(copytext+"fp4.swift "+fpath+"fp4.swift")
		os.system(copytext+"fp12.swift "+fpath+"fp12.swift")
		os.system(copytext+"pair.swift "+fpath+"pair.swift")
		os.system(copytext+"mpin.swift "+fpath+"mpin.swift")
	else :
		os.system(copytext+"ecdh.swift "+fpath+"ecdh.swift")


	os.system("swiftc -DD32 "+fpath+"*.swift -L. -lamcl -I. -O -Ounchecked -whole-module-optimization -emit-library -emit-module -module-name "+tc)
	os.system(deltext+fpath+"*.*")
	os.system("rmdir amcl"+slashtext+tc)


os.system("mkdir amcl")
os.system(copytext+ "hash*.swift amcl"+slashtext+".")
os.system(copytext+ "rand.swift amcl"+slashtext+".")
os.system(copytext+ "aes.swift amcl"+slashtext+".")
os.system(copytext+ "gcm.swift amcl"+slashtext+".")

os.system("swiftc amcl"+slashtext+"*.swift -O -Ounchecked -whole-module-optimization -emit-library -emit-module -module-name amcl")

print("Elliptic Curves")
print("1. ed25519")
print("2. c25519")
print("3. nist256")
print("4. brainpool")
print("5. anssi")
print("6. hifive")
print("7. goldilocks")
print("8. nist384")
print("9. c41417")
print("10. nist521\n")

print("Pairing-Friendly Elliptic Curves")
print("11. bn254")
print("12. bn254CX")
print("13. bls383\n")

print("RSA")
print("14. rsa2048")
print("15. rsa3072")
print("16. rsa4096")

selection=[]
ptr=0
max=17

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
# bits_in_base gives the number base used for 32 bit architectures, as n where the base is 2^n
# modulus_bits is the actual bit length of the modulus.
# modulus_mod_8 is the remainder when the modulus is divided by 8
# modulus_type is NOT_SPECIAL, or PSEUDO_MERSENNE, or MONTGOMERY_Friendly, or GENERALISED_MERSENNE (supported for GOLDILOCKS only)
# curve_type is WEIERSTRASS, EDWARDS or MONTGOMERY
# pairing_friendly is BN, BLS or NOT (if not pairing friendly


	if x==1:
		curveset("ed25519","32","29","56","255","5","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==2:
		curveset("c25519","32","29","56","255","5","PSEUDO_MERSENNE","MONTGOMERY","NOT")
		curve_selected=True
	if x==3:
		curveset("nist256","32","29","56","256","7","NOT_SPECIAL","WEIERSTRASS","NOT")
		curve_selected=True
	if x==4:
		curveset("brainpool","32","29","56","256","7","NOT_SPECIAL","WEIERSTRASS","NOT")
		curve_selected=True
	if x==5:
		curveset("anssi","32","29","56","256","7","NOT_SPECIAL","WEIERSTRASS","NOT")
		curve_selected=True

	if x==6:
		curveset("hifive","42","29","60","336","5","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==7:
		curveset("goldilocks","56","29","60","448","7","GENERALISED_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==8:
		curveset("nist384","48","28","56","384","7","NOT_SPECIAL","WEIERSTRASS","NOT")
		curve_selected=True
	if x==9:
		curveset("c41417","52","29","60","414","7","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==10:
		curveset("nist521","66","28","60","521","7","PSEUDO_MERSENNE","WEIERSTRASS","NOT")
		curve_selected=True

	if x==11:
		curveset("bn254","32","29","56","254","3","NOT_SPECIAL","WEIERSTRASS","BN")
		pfcurve_selected=True
	if x==12:
		curveset("bn254CX","32","29","56","254","3","NOT_SPECIAL","WEIERSTRASS","BN")
		pfcurve_selected=True
	if x==13:
		curveset("bls383","48","28","56","383","3","NOT_SPECIAL","WEIERSTRASS","BLS")
		pfcurve_selected=True

# rsaset(rsaname,big_length_bytes,bits_in_base,multiplier)
# The RSA name reflects the modulus size, which is a 2^m multiplier
# of the underlying big length

# There are choices here, different ways of getting the same result, but some faster than others
	if x==14:
		#256 is slower but may allow reuse of 256-bit BIGs used for elliptic curve
		#512 is faster.. but best is 1024
		rsaset("rsa2048","128","28","58","2")
		#rsaset("rsa2048","64","29","60",4")
		#rsaset("rsa2048","32","29","56","8")
		rsa_selected=True
	if x==15:
		rsaset("rsa3072","48","28","56","8")
		rsa_selected=True
	if x==16:
		#rsaset("rsa4096","32","29","56",16")
		rsaset("rsa4096","64","29","60","8")
		rsa_selected=True

os.system(deltext+" hash*.swift")
os.system(deltext+" aes.swift")
os.system(deltext+" rand.swift")
os.system(deltext+" gcm.swift")

os.system(deltext+" big.swift")
os.system(deltext+" dbig.swift")
os.system(deltext+" fp*.swift")

os.system(deltext+" ecp.swift")
os.system(deltext+" ecdh.swift")
os.system(deltext+" ff.swift")
os.system(deltext+" rsa.swift")
os.system(deltext+" ecp2.swift")
os.system(deltext+" pair.swift")
os.system(deltext+" mpin.swift")
os.system(deltext+" rom*.swift")

os.system(deltext+"amcl"+slashtext+"*.*")
os.system("rmdir amcl")

# create library


