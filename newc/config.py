import os
import sys

def replace(namefile,oldtext,newtext):
	f = open(namefile,'r')
	filedata = f.read()
	f.close()

	newdata = filedata.replace(oldtext,newtext)

	f = open(namefile,'w')
	f.write(newdata)
	f.close()


def rsaset(tb,tff,nb,b16,b32,b64,ml) :
	copytext=""
	if sys.platform.startswith("linux")  :
		copytext="cp"

	if sys.platform.startswith("win") :
		copytext="copy"

	fnameh="config_big_"+tb+".h"
	os.system(copytext+" config_big_XXX.h "+fnameh)
	replace(fnameh,"XXX",tb)
	replace(fnameh,"@NB@",nb)
	replace(fnameh,"@B16@",b16)
	replace(fnameh,"@B32@",b32)
	replace(fnameh,"@B64@",b64)

	fnameh="config_rsa_"+tff+".h"
	os.system(copytext+" config_rsa_WWW.h "+fnameh)
	replace(fnameh,"XXX",tb)
	replace(fnameh,"WWW",tff)
	replace(fnameh,"@ML@",ml);

	fnamec="big_"+tb+".c"
	fnameh="big_"+tb+".h"

	os.system(copytext+" big_XXX.c "+fnamec)
	os.system(copytext+" big_XXX.h "+fnameh)

	replace(fnamec,"XXX",tb)
	replace(fnameh,"XXX",tb)
	os.system("gcc -O2 -std=c99 -c "+fnamec)

	fnamec="ff_"+tff+".c"
	fnameh="ff_"+tff+".h"

	os.system(copytext+" ff_WWW.c "+fnamec)
	os.system(copytext+" ff_WWW.h "+fnameh)

	replace(fnamec,"WWW",tff)
	replace(fnamec,"XXX",tb)
	replace(fnameh,"WWW",tff)
	replace(fnameh,"XXX",tb)
	os.system("gcc -O2 -std=c99 -c "+fnamec)

	fnamec="rsa_"+tff+".c"
	fnameh="rsa_"+tff+".h"

	os.system(copytext+" rsa_WWW.c "+fnamec)
	os.system(copytext+" rsa_WWW.h "+fnameh)

	replace(fnamec,"WWW",tff)
	replace(fnamec,"XXX",tb)
	replace(fnameh,"WWW",tff)
	replace(fnameh,"XXX",tb)
	os.system("gcc -O2 -std=c99 -c "+fnamec)

def curveset(tb,tf,tc,nb,b16,b32,b64,nbt,m8,mt,ct,pf) :
	copytext=""
	if sys.platform.startswith("linux")  :
		copytext="cp"

	if sys.platform.startswith("win") :
		copytext="copy"

	fnameh="config_big_"+tb+".h"
	os.system(copytext+" config_big_XXX.h "+fnameh)
	replace(fnameh,"XXX",tb)
	replace(fnameh,"@NB@",nb)
	replace(fnameh,"@B16@",b16)
	replace(fnameh,"@B32@",b32)
	replace(fnameh,"@B64@",b64)


	fnameh="config_field_"+tf+".h"
	os.system(copytext+" config_field_YYY.h "+fnameh)
	replace(fnameh,"XXX",tb)
	replace(fnameh,"YYY",tf)
	replace(fnameh,"@NBT@",nbt)
	replace(fnameh,"@M8@",m8)
	replace(fnameh,"@MT@",mt)

	fnameh="config_curve_"+tc+".h"	
	os.system(copytext+" config_curve_ZZZ.h "+fnameh)
	replace(fnameh,"XXX",tb)
	replace(fnameh,"YYY",tf)
	replace(fnameh,"ZZZ",tc)
	replace(fnameh,"@CT@",ct)
	replace(fnameh,"@PF@",pf)


	fnamec="big_"+tb+".c"
	fnameh="big_"+tb+".h"

	os.system(copytext+" big_XXX.c "+fnamec)
	os.system(copytext+" big_XXX.h "+fnameh)

	replace(fnamec,"XXX",tb)
	replace(fnameh,"XXX",tb)
	os.system("gcc -O2 -std=c99 -c "+fnamec)

	fnamec="fp_"+tf+".c"
	fnameh="fp_"+tf+".h"

	os.system(copytext+" fp_YYY.c "+fnamec)
	os.system(copytext+" fp_YYY.h "+fnameh)

	replace(fnamec,"YYY",tf)
	replace(fnamec,"XXX",tb)
	replace(fnameh,"YYY",tf)
	replace(fnameh,"XXX",tb)
	os.system("gcc -O2 -std=c99 -c "+fnamec)

	os.system("gcc -O2 -std=c99 -c rom_field_"+tf+".c");

	fnamec="ecp_"+tc+".c"
	fnameh="ecp_"+tc+".h"

	os.system(copytext+" ecp_ZZZ.c "+fnamec)
	os.system(copytext+" ecp_ZZZ.h "+fnameh)

	replace(fnamec,"ZZZ",tc)
	replace(fnamec,"YYY",tf)
	replace(fnamec,"XXX",tb)
	replace(fnameh,"ZZZ",tc)
	replace(fnameh,"YYY",tf)
	replace(fnameh,"XXX",tb)
	os.system("gcc -O2 -std=c99 -c "+fnamec)

	fnamec="ecdh_"+tc+".c"
	fnameh="ecdh_"+tc+".h"

	os.system(copytext+" ecdh_ZZZ.c "+fnamec)
	os.system(copytext+" ecdh_ZZZ.h "+fnameh)

	replace(fnamec,"ZZZ",tc)
	replace(fnamec,"YYY",tf)
	replace(fnamec,"XXX",tb)
	replace(fnameh,"ZZZ",tc)
	replace(fnameh,"YYY",tf)
	replace(fnameh,"XXX",tb)
	os.system("gcc -O2 -std=c99 -c "+fnamec)

	os.system("gcc -O2 -std=c99 -c rom_curve_"+tc+".c");

	if pf != "NOT" :
		fnamec="fp2_"+tf+".c"
		fnameh="fp2_"+tf+".h"

		os.system(copytext+" fp2_YYY.c "+fnamec)
		os.system(copytext+" fp2_YYY.h "+fnameh)
		replace(fnamec,"YYY",tf)
		replace(fnamec,"XXX",tb)
		replace(fnameh,"YYY",tf)
		replace(fnameh,"XXX",tb)
		os.system("gcc -O2 -std=c99 -c "+fnamec)

		fnamec="fp4_"+tf+".c"
		fnameh="fp4_"+tf+".h"

		os.system(copytext+" fp4_YYY.c "+fnamec)
		os.system(copytext+" fp4_YYY.h "+fnameh)
		replace(fnamec,"YYY",tf)
		replace(fnamec,"XXX",tb)
		replace(fnameh,"YYY",tf)
		replace(fnameh,"XXX",tb)
		os.system("gcc -O2 -std=c99 -c "+fnamec)

		fnamec="fp12_"+tf+".c"
		fnameh="fp12_"+tf+".h"

		os.system(copytext+" fp12_YYY.c "+fnamec)
		os.system(copytext+" fp12_YYY.h "+fnameh)
		replace(fnamec,"YYY",tf)
		replace(fnamec,"XXX",tb)
		replace(fnameh,"YYY",tf)
		replace(fnameh,"XXX",tb)
		os.system("gcc -O2 -std=c99 -c "+fnamec)

		fnamec="ecp2_"+tc+".c"
		fnameh="ecp2_"+tc+".h"

		os.system(copytext+" ecp2_ZZZ.c "+fnamec)
		os.system(copytext+" ecp2_ZZZ.h "+fnameh)
		replace(fnamec,"ZZZ",tc)
		replace(fnamec,"YYY",tf)
		replace(fnamec,"XXX",tb)
		replace(fnameh,"ZZZ",tc)
		replace(fnameh,"YYY",tf)
		replace(fnameh,"XXX",tb)
		os.system("gcc -O2 -std=c99 -c "+fnamec)

		fnamec="pair_"+tc+".c"
		fnameh="pair_"+tc+".h"

		os.system(copytext+" pair_ZZZ.c "+fnamec)
		os.system(copytext+" pair_ZZZ.h "+fnameh)
		replace(fnamec,"ZZZ",tc)
		replace(fnamec,"YYY",tf)
		replace(fnamec,"XXX",tb)
		replace(fnameh,"ZZZ",tc)
		replace(fnameh,"YYY",tf)
		replace(fnameh,"XXX",tb)
		os.system("gcc -O2 -std=c99 -c "+fnamec)

		fnamec="mpin_"+tc+".c"
		fnameh="mpin_"+tc+".h"

		os.system(copytext+" mpin_ZZZ.c "+fnamec)
		os.system(copytext+" mpin_ZZZ.h "+fnameh)
		replace(fnamec,"ZZZ",tc)
		replace(fnamec,"YYY",tf)
		replace(fnamec,"XXX",tb)
		replace(fnameh,"ZZZ",tc)
		replace(fnameh,"YYY",tf)
		replace(fnameh,"XXX",tb)
		os.system("gcc -O2 -std=c99 -c "+fnamec)

print("Elliptic Curves")
print("1. ED25519")
print("2. C25519")
print("3. NIST256")
print("4. BRAINPOOL")
print("5. ANNSI")
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

# curveset(big,field,curve,big_length_bytes,16_bit_bits_in_base,32_bit_bits_in_base,64_bit_bits_in_base,modulus_bits,modulus_mod_8,modulus_type,curve_type,pairing_friendly)
# for each curve give distinct names for big, field and curve. 
# Typically "big" is the size in bits, always a multiple of 8, "field" describes the modulus, and "curve" is the common name for the elliptic curve   
# big_length_bytes is "big" divided by 8
# Next give the number base used for 16/32/64 bit architectures, as n where the base is 2^n (note that these must be fixed for the same "big" name, if is ever re-used for another curve)
# modulus_bits is the bit length of the modulus, typically the same or slightly smaller than "big"
# modulus_mod_8 is the remainder when the modulus is divided by 8
# modulus_type is NOT_SPECIAL, or PSEUDO_MERSENNE, or MONTGOMERY_Friendly, or GENERALISED_MERSENNE (supported for GOLDILOCKS only)
# curve_type is WEIERSTRASS, EDWARDS or MONTGOMERY
# pairing_friendly is BN, BLS or NOT (if not pairing friendly

	if x==1:
		curveset("256","25519","ED25519","32","13","29","56","255","5","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==2:
		curveset("256","25519","C25519","32","13","29","56","255","5","PSEUDO_MERSENNE","MONTGOMERY","NOT")
		curve_selected=True
	if x==3:
		curveset("256","GM256","NIST256","32","13","29","56","256","7","NOT_SPECIAL","WEIERSTRASS","NOT")
		curve_selected=True
	if x==4:
		curveset("256","B256","BRAINPOOL","32","13","29","56","256","7","NOT_SPECIAL","WEIERSTRASS","NOT")
		curve_selected=True
	if x==5:
		curveset("256","A256","ANNSI","32","13","29","56","256","7","NOT_SPECIAL","WEIERSTRASS","NOT")
		curve_selected=True

	if x==6:
		curveset("336","336PM","HIFIVE","42","","29","60","336","5","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==7:
		curveset("448","448GM","GOLDILOCKS","56","","29","60","448","7","GENERALISED_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==8:
		curveset("384","GM384","NIST384","48","","28","56","384","7","NOT_SPECIAL","WEIERSTRASS","NOT")
		curve_selected=True
	if x==9:
		curveset("416","414PM","C41417","52","","29","60","414","7","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==10:
		curveset("528","521M","NIST521","66","","28","60","521","7","PSEUDO_MERSENNE","WEIERSTRASS","NOT")
		curve_selected=True

	if x==11:
		curveset("256","254MF","MF254W","32","","29","56","254","7","MONTGOMERY_FRIENDLY","WEIERSTRASS","NOT")
		curve_selected=True
	if x==12:
		curveset("256","254MF","MF254E","32","","29","56","254","7","MONTGOMERY_FRIENDLY","EDWARDS","NOT")
		curve_selected=True
	if x==13:
		curveset("256","254MF","MF254M","32","","29","56","254","7","MONTGOMERY_FRIENDLY","MONTGOMERY","NOT")
		curve_selected=True
	if x==14:
		curveset("256","256MF","MF256W","32","","29","56","256","7","MONTGOMERY_FRIENDLY","WEIERSTRASS","NOT")
		curve_selected=True
	if x==15:
		curveset("256","256MF","MF256E","32","","29","56","256","7","MONTGOMERY_FRIENDLY","EDWARDS","NOT")
		curve_selected=True
	if x==16:
		curveset("256","256MF","MF256M","32","","29","56","256","7","MONTGOMERY_FRIENDLY","MONTGOMERY","NOT")
		curve_selected=True
	if x==17:
		curveset("256","255MS","MS255W","32","13","29","56","255","3","PSEUDO_MERSENNE","WEIERSTRASS","NOT")
		curve_selected=True
	if x==18:
		curveset("256","255MS","MS255E","32","13","29","56","255","3","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==19:
		curveset("256","255MS","MS255M","32","13","29","56","255","3","PSEUDO_MERSENNE","MONTGOMERY","NOT")
		curve_selected=True
	if x==20:
		curveset("256","256MS","MS256W","32","13","29","56","256","3","PSEUDO_MERSENNE","WEIERSTRASS","NOT")
		curve_selected=True
	if x==21:
		curveset("256","256MS","MS256E","32","13","29","56","256","3","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==22:
		curveset("256","256MS","MS256M","32","13","29","56","256","3","PSEUDO_MERSENNE","MONTGOMERY","NOT")
		curve_selected=True

	if x==23:
		curveset("256","254BN","BN254","32","13","29","56","254","3","NOT_SPECIAL","WEIERSTRASS","BN")
		pfcurve_selected=True
	if x==24:
		curveset("256","254BNCX","BN254CX","32","13","29","56","254","3","NOT_SPECIAL","WEIERSTRASS","BN")
		pfcurve_selected=True
	if x==25:
		curveset("384","383BLS","BLS383","48","","28","56","383","3","NOT_SPECIAL","WEIERSTRASS","BLS")
		pfcurve_selected=True

# rsaset(big,ring,big_length_bytes,16_bit_bits_in_base,32_bit_bits_in_base,64_bit_bits_in_base,multiplier)
# for each choice give distinct names for "big" and "ring".
# Typically "big" is the length in bits of the underlying big number type
# "ring" is the RSA modulus size = "big" times 2^m
# big_length_bytes is "big" divided by 8
# Next give the number base used for 16/32/64 bit architectures, as n where the base is 2^n
# multiplier is 2^m (see above)

	if x==26:
		rsaset("256","2048","32","13","29","56","8")
		rsa_selected=True
	if x==27:
		rsaset("384","3072","48","","28","56","8")
		rsa_selected=True
	if x==28:
		rsaset("256","4096","32","","29","56","16")
		rsa_selected=True

deltext=""
if sys.platform.startswith("linux")  :
	deltext="rm"

if sys.platform.startswith("win") :
	deltext="del"

os.system(deltext+" big_XXX.*")
os.system(deltext+" fp_YYY.*")
os.system(deltext+" ecp_ZZZ.*")
os.system(deltext+" ecdh_ZZZ.*")
os.system(deltext+" ff_WWW.*")
os.system(deltext+" rsa_WWW.*")
os.system(deltext+" config_big_XXX.h")
os.system(deltext+" config_field_YYY.h")
os.system(deltext+" config_curve_ZZZ.h")
os.system(deltext+" fp2_YYY.*")
os.system(deltext+" fp4_YYY.*")
os.system(deltext+" fp12_YYY.*")
os.system(deltext+" ecp2_ZZZ.*")
os.system(deltext+" pair_ZZZ.*")
os.system(deltext+" mpin_ZZZ.*")

# create library
os.system("gcc -O2 -std=c99 -c randapi.c")
if curve_selected :
	os.system("gcc -O2 -std=c99 -c ecdh_support.c")
if rsa_selected :
	os.system("gcc -O2 -std=c99 -c rsa_support.c")
if pfcurve_selected :
	os.system("gcc -O2 -std=c99 -c mpin_support.c")

os.system("gcc -O2 -std=c99 -c hash.c")
os.system("gcc -O2 -std=c99 -c rand.c")
os.system("gcc -O2 -std=c99 -c oct.c")
os.system("gcc -O2 -std=c99 -c aes.c")
os.system("gcc -O2 -std=c99 -c gcm.c")

os.system("ar rc amcl.a *.o")
os.system(deltext+" *.o")


#print("Your section was ");	
#for i in range(0,ptr):
#	print (selection[i])

