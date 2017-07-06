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

def replace(namefile,oldtext,newtext):
	f = open(namefile,'r')
	filedata = f.read()
	f.close()

	newdata = filedata.replace(oldtext,newtext)

	f = open(namefile,'w')
	f.write(newdata)
	f.close()

def addit(fname):
	if fname not in open("include.html").read():
		with open("include.html","a") as incfile:
			incfile.write("<script type=\"text/javascript\" src=\""+fname+"\"></script>\n")

def rsaset(tb,tff,nb,base,ml) :
	bd=tb+"_"+base
	fname="BIG_"+bd+".js"
	os.system(copytext+" BIG_XXX.js "+fname)

	replace(fname,"XXX",bd)
	replace(fname,"@NB@",nb)
	replace(fname,"@BASE@",base)
	addit(fname)

	fname="DBIG_"+bd+".js"
	os.system(copytext+" DBIG_XXX.js "+fname)

	replace(fname,"XXX",bd)
	addit(fname)


	fname="FF_"+tff+".js"
	os.system(copytext+" FF_WWW.js "+fname)

	replace(fname,"WWW",tff)
	replace(fname,"XXX",bd)
	replace(fname,"@ML@",ml)
	addit(fname)

	fname="RSA_"+tff+".js"
	os.system(copytext+" RSA_WWW.js "+fname)

	replace(fname,"WWW",tff)
	replace(fname,"XXX",bd)
	addit(fname)


def curveset(tb,tf,tc,nb,base,nbt,m8,mt,ct,pf) :
	bd=tb+"_"+base
	fname="BIG_"+bd+".js"
	os.system(copytext+" BIG_XXX.js "+fname)

	replace(fname,"XXX",bd)
	replace(fname,"@NB@",nb)
	replace(fname,"@BASE@",base)
	addit(fname)

	fname="DBIG_"+bd+".js"
	os.system(copytext+" DBIG_XXX.js "+fname)

	replace(fname,"XXX",bd)
	addit(fname)

	fname="FP_"+tf+".js"
	os.system(copytext+" FP_YYY.js "+fname)

	replace(fname,"XXX",bd)
	replace(fname,"YYY",tf)
	replace(fname,"@NBT@",nbt)
	replace(fname,"@M8@",m8)
	replace(fname,"@MT@",mt)

	ib=int(base)
	inb=int(nb)
	inbt=int(nbt)
	sh=ib*(1+((8*inb-1)//ib))-inbt
	if sh > 30 :
		sh=30
	replace(fname,"@SH@",str(sh))

	addit(fname)

	fname="ECP_"+tc+".js"
	os.system(copytext+" ECP_ZZZ.js "+fname)

	replace(fname,"XXX",bd)
	replace(fname,"YYY",tf)
	replace(fname,"ZZZ",tc)
	replace(fname,"@CT@",ct)
	replace(fname,"@PF@",pf)
	addit(fname)

	fname="ECDH_"+tc+".js"
	os.system(copytext+" ECDH_ZZZ.js "+fname)

	replace(fname,"ZZZ",tc)
	replace(fname,"YYY",tf)
	replace(fname,"XXX",bd)
	addit(fname)

	fname="ROM_FIELD_"+tf+".js"
	addit(fname)
	fname="ROM_CURVE_"+tc+".js"
	addit(fname)

	if pf != "NOT" :
		fname="FP2_"+tf+".js"
		os.system(copytext+" FP2_YYY.js "+fname)
		replace(fname,"YYY",tf)
		replace(fname,"XXX",bd)
		addit(fname)

		fname="FP4_"+tf+".js"
		os.system(copytext+" FP4_YYY.js "+fname)
		replace(fname,"YYY",tf)
		replace(fname,"XXX",bd)
		addit(fname)

		fname="FP12_"+tf+".js"
		os.system(copytext+" FP12_YYY.js "+fname)
		replace(fname,"YYY",tf)
		replace(fname,"XXX",bd)
		addit(fname)

		fname="ECP2_"+tc+".js"
		os.system(copytext+" ECP2_ZZZ.js "+fname)
		replace(fname,"YYY",tf)
		replace(fname,"XXX",bd)
		replace(fname,"ZZZ",tc)
		addit(fname)

		fname="PAIR_"+tc+".js"
		os.system(copytext+" PAIR_ZZZ.js "+fname)
		replace(fname,"YYY",tf)
		replace(fname,"XXX",bd)
		replace(fname,"ZZZ",tc)
		addit(fname)

		fname="MPIN_"+tc+".js"
		os.system(copytext+" MPIN_ZZZ.js "+fname)
		replace(fname,"YYY",tf)
		replace(fname,"XXX",bd)
		replace(fname,"ZZZ",tc)
		addit(fname)

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

# curveset(big,field,curve,big_length_bytes,16_bit_bits_in_base,32_bit_bits_in_base,64_bit_bits_in_base,modulus_bits,modulus_mod_8,modulus_type,curve_type,pairing_friendly)
# for each curve give names for big, field and curve. In the latter two cases the names may be the same.
# Typically "big" is the size in bits, always a multiple of 8, "field" describes the modulus, and "curve" is the common name for the elliptic curve   
# big_length_bytes is "big" divided by 8
# Next give the number base used for 16/32/64 bit architectures, as n where the base is 2^n (note that these must be fixed for the same "big" name, if is ever re-used for another curve)
# modulus_bits is the bit length of the modulus, typically the same or slightly smaller than "big"
# modulus_mod_8 is the remainder when the modulus is divided by 8
# modulus_type is NOT_SPECIAL, or PSEUDO_MERSENNE, or MONTGOMERY_Friendly, or GENERALISED_MERSENNE (supported for GOLDILOCKS only)
# curve_type is WEIERSTRASS, EDWARDS or MONTGOMERY
# pairing_friendly is BN, BLS or NOT (if not pairing friendly

	if x==1:
		curveset("256","25519","ED25519","32","24","255","5","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==2:
		curveset("256","25519","C25519","32","24","255","5","PSEUDO_MERSENNE","MONTGOMERY","NOT")
		curve_selected=True
	if x==3:
		curveset("256","NIST256","NIST256","32","24","256","7","NOT_SPECIAL","WEIERSTRASS","NOT")
		curve_selected=True
	if x==4:
		curveset("256","BRAINPOOL","BRAINPOOL","32","24","256","7","NOT_SPECIAL","WEIERSTRASS","NOT")
		curve_selected=True
	if x==5:
		curveset("256","ANSSI","ANSSI","32","24","256","7","NOT_SPECIAL","WEIERSTRASS","NOT")
		curve_selected=True

	if x==6:
		curveset("336","HIFIVE","HIFIVE","42","23","336","5","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==7:
		curveset("448","GOLDILOCKS","GOLDILOCKS","56","23","448","7","GENERALISED_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==8:
		curveset("384","NIST384","NIST384","48","23","384","7","NOT_SPECIAL","WEIERSTRASS","NOT")
		curve_selected=True
	if x==9:
		curveset("416","C41417","C41417","52","23","414","7","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==10:
		curveset("528","NIST521","NIST521","66","23","521","7","PSEUDO_MERSENNE","WEIERSTRASS","NOT")
		curve_selected=True

	if x==11:
		curveset("256","256PM","NUMS256W","32","24","256","3","PSEUDO_MERSENNE","WEIERSTRASS","NOT")
		curve_selected=True
	if x==12:
		curveset("256","256PM","NUMS256E","32","24","256","3","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==13:
		curveset("384","384PM","NUMS384W","48","23","384","3","PSEUDO_MERSENNE","WEIERSTRASS","NOT")
		curve_selected=True
	if x==14:
		curveset("384","384PM","NUMS384E","48","23","384","3","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==15:
		curveset("512","512PM","NUMS512W","64","23","512","7","PSEUDO_MERSENNE","WEIERSTRASS","NOT")
		curve_selected=True
	if x==16:
		curveset("512","512PM","NUMS512E","64","23","512","7","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True

	if x==17:
		curveset("256","BN254","BN254","32","24","254","3","NOT_SPECIAL","WEIERSTRASS","BN")
		pfcurve_selected=True
	if x==18:
		curveset("256","BN254CX","BN254CX","32","24","254","3","NOT_SPECIAL","WEIERSTRASS","BN")
		pfcurve_selected=True
	if x==19:
		curveset("384","BLS383","BLS383","48","23","383","3","NOT_SPECIAL","WEIERSTRASS","BLS")
		pfcurve_selected=True

# rsaset(big,ring,big_length_bytes,bits_in_base,multiplier)
# for each choice give distinct names for "big" and "ring".
# Typically "big" is the length in bits of the underlying big number type
# "ring" is the RSA modulus size = "big" times 2^m
# big_length_bytes is "big" divided by 8
# Next give the number base as n where the base is 2^n (run check.cpp)
# multiplier is 2^m (see above)

# There are choices here, different ways of getting the same result, but some faster than others
	if x==20:
		#256 is slower but may allow reuse of 256-bit BIGs used for elliptic curve
		#512 is faster.. but best is 1024
		rsaset("1024","2048","128","22","2")
		#rsaset("512","2048","64","23","4")
		#rsaset("256","2048","32","24","8")
		rsa_selected=True
	if x==21:
		rsaset("384","3072","48","23","8")
		rsa_selected=True
	if x==22:
		#rsaset("256","4096","32","24","16")
		rsaset("512","4096","64","23","8")
		rsa_selected=True


os.system(deltext+" BIG_XXX.js")
os.system(deltext+" DBIG_XXX.js")
os.system(deltext+" FP_YYY.js")
os.system(deltext+" ECP_ZZZ.js")
os.system(deltext+" ECDH_ZZZ.js")
os.system(deltext+" FF_WWW.js")
os.system(deltext+" RSA_WWW.js")
os.system(deltext+" FP2_YYY.js")
os.system(deltext+" FP4_YYY.js")
os.system(deltext+" FP12_YYY.js")
os.system(deltext+" ECP2_ZZZ.js")
os.system(deltext+" PAIR_ZZZ.js")
os.system(deltext+" MPIN_ZZZ.js")

# create library

