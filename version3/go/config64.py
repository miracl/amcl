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

	fpath="src"+slashtext+"amcl"+slashtext+tb+slashtext
	os.system("mkdir src"+slashtext+"amcl"+slashtext+tb)

	os.system(copytext+"ARCH64.go "+fpath+"ARCH.go")
	os.system(copytext+"BIG64.go "+fpath+"BIG.go")
	os.system(copytext+"DBIG.go "+fpath+"DBIG.go")
	os.system(copytext+"FF64.go "+fpath+"FF.go")
	os.system(copytext+"RSA.go "+fpath+"RSA.go")

	replace(fpath+"ARCH.go","XXX",tb)
	replace(fpath+"BIG.go","XXX",tb)
	replace(fpath+"DBIG.go","XXX",tb)
	replace(fpath+"FF.go","XXX",tb)
	replace(fpath+"RSA.go","XXX",tb)

	replace(fpath+"BIG.go","@NB@",nb)
	replace(fpath+"BIG.go","@BASE@",base)

	replace(fpath+"FF.go","@ML@",ml);

	os.system("go install amcl"+slashtext+tb)


def curveset(tc,nb,base,nbt,m8,mt,ct,pf) :
	global deltext,slashtext,copytext
	global cptr,chosen

	chosen.append(tc)
	cptr=cptr+1

	fpath="src"+slashtext+"amcl"+slashtext+tc+slashtext
	os.system("mkdir src"+slashtext+"amcl"+slashtext+tc)

	os.system(copytext+"ARCH64.go "+fpath+"ARCH.go")
	os.system(copytext+"BIG64.go "+fpath+"BIG.go")
	os.system(copytext+"DBIG.go "+fpath+"DBIG.go")
	os.system(copytext+"FP.go "+fpath+"FP.go")
	os.system(copytext+"ECP.go "+fpath+"ECP.go")
	os.system(copytext+"ECDH.go "+fpath+"ECDH.go")
	os.system(copytext+"ROM_"+tc+"_64.go "+fpath+"ROM.go")

	replace(fpath+"ARCH.go","XXX",tc)
	replace(fpath+"BIG.go","XXX",tc)
	replace(fpath+"DBIG.go","XXX",tc)
	replace(fpath+"FP.go","XXX",tc)
	replace(fpath+"ECP.go","XXX",tc)
	replace(fpath+"ECDH.go","XXX",tc)

	replace(fpath+"BIG.go","@NB@",nb)
	replace(fpath+"BIG.go","@BASE@",base)

	replace(fpath+"FP.go","@NBT@",nbt)
	replace(fpath+"FP.go","@M8@",m8)
	replace(fpath+"FP.go","@MT@",mt)

	ib=int(base)
	inb=int(nb)
	inbt=int(nbt)
	sh=ib*(1+((8*inb-1)//ib))-inbt
	if sh > 30 :
		sh=30
	replace(fpath+"FP.go","@SH@",str(sh))


	replace(fpath+"ECP.go","@CT@",ct)
	replace(fpath+"ECP.go","@PF@",pf)


	if pf != "NOT" :
		os.system(copytext+"ECP2.go "+fpath+"ECP2.go")
		os.system(copytext+"FP2.go "+fpath+"FP2.go")
		os.system(copytext+"FP4.go "+fpath+"FP4.go")
		os.system(copytext+"FP12.go "+fpath+"FP12.go")
		os.system(copytext+"PAIR.go "+fpath+"PAIR.go")
		os.system(copytext+"MPIN.go "+fpath+"MPIN.go")

		replace(fpath+"FP2.go","XXX",tc)
		replace(fpath+"FP4.go","XXX",tc)
		replace(fpath+"FP12.go","XXX",tc)
		replace(fpath+"ECP2.go","XXX",tc)
		replace(fpath+"PAIR.go","XXX",tc)
		replace(fpath+"MPIN.go","XXX",tc)
	
	os.system("go install amcl"+slashtext+tc)

os.system("mkdir src")
os.system("mkdir bin")
os.system("mkdir pkg")

os.system("mkdir src"+slashtext+"amcl")
os.system(copytext+ "HASH*.go src"+slashtext+"amcl"+slashtext+".")
os.system(copytext+ "RAND.go src"+slashtext+"amcl"+slashtext+".")
os.system(copytext+ "AES.go src"+slashtext+"amcl"+slashtext+".")
os.system(copytext+ "GCM.go src"+slashtext+"amcl"+slashtext+".")

os.system("go install amcl")

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
print("11. NUMS256W")
print("12. NUMS256E")
print("13. NUMS384W")
print("14. NUMS384E")
print("15. NUMS512W")
print("16. NUMS512E\n")


print("Pairing-Friendly Elliptic Curves")
print("17. BN254")
print("18. BN254CX")
print("19. BLS383\n")

print("RSA")
print("20. RSA2048")
print("21. RSA3072")
print("22. RSA4096")

selection=[]
ptr=0
max=23

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
		curveset("GOLDILOCKS","56","58","448","7","GENERALISED_MERSENNE","EDWARDS","NOT")
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
		curveset("NUMS256W","32","56","256","3","PSEUDO_MERSENNE","WEIERSTRASS","NOT")
		curve_selected=True
	if x==12:
		curveset("NUMS256E","32","56","256","3","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==13:
		curveset("NUMS384W","48","58","384","3","PSEUDO_MERSENNE","WEIERSTRASS","NOT")
		curve_selected=True
	if x==14:
		curveset("NUMS384E","48","56","384","3","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==15:
		curveset("NUMS512W","64","60","512","7","PSEUDO_MERSENNE","WEIERSTRASS","NOT")
		curve_selected=True
	if x==16:
		curveset("NUMS512E","64","60","512","7","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True

	if x==17:
		curveset("BN254","32","56","254","3","NOT_SPECIAL","WEIERSTRASS","BN")
		pfcurve_selected=True
	if x==18:
		curveset("BN254CX","32","56","254","3","NOT_SPECIAL","WEIERSTRASS","BN")
		pfcurve_selected=True
	if x==19:
		curveset("BLS383","48","58","383","3","NOT_SPECIAL","WEIERSTRASS","BLS")
		pfcurve_selected=True

# rsaset(rsaname,big_length_bytes,bits_in_base,multiplier)
# The RSA name reflects the modulus size, which is a 2^m multiplier
# of the underlying big length

# There are choices here, different ways of getting the same result, but some faster than others
	if x==20:
		#256 is slower but may allow reuse of 256-bit BIGs used for elliptic curve
		#512 is faster.. but best is 1024
		rsaset("RSA2048","128","58","2")
		#rsaset("RSA2048","64","60","4")
		#rsaset("RSA2048","32","56","8")
		rsa_selected=True
	if x==21:
		rsaset("RSA3072","48","56","8")
		rsa_selected=True
	if x==22:
		#rsaset("RSA4096","32","56","16")
		rsaset("RSA4096","64","60","8")
		rsa_selected=True


os.system(deltext+" HASH*.go")
os.system(deltext+" AES.go")
os.system(deltext+" RAND.go")
os.system(deltext+" GCM.go")


os.system(deltext+" ARCH*.go")
os.system(deltext+" BIG*.go")
os.system(deltext+" DBIG.go")
os.system(deltext+" FP*.go")
os.system(deltext+" ECP.go")
os.system(deltext+" ECDH.go")
os.system(deltext+" FF*.go")
os.system(deltext+" RSA.go")
os.system(deltext+" ECP2.go")
os.system(deltext+" PAIR.go")
os.system(deltext+" MPIN.go")
os.system(deltext+" ROM*.go")

# create library

