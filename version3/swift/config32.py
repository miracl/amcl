import os
import subprocess
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

def run_in_shell(cmd):
    subprocess.check_call(cmd, shell=True)

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
	run_in_shell("mkdir amcl"+slashtext+tb)

	run_in_shell(copytext+"big.swift "+fpath+"big.swift")
	run_in_shell(copytext+"config_big.swift "+fpath+"config_big.swift")
	run_in_shell(copytext+"config_ff.swift "+fpath+"config_ff.swift")
	run_in_shell(copytext+"dbig.swift "+fpath+"dbig.swift")
	run_in_shell(copytext+"ff.swift "+fpath+"ff.swift")
	run_in_shell(copytext+"rsa.swift "+fpath+"rsa.swift")

	replace(fpath+"config_big.swift","@NB@",nb)
	replace(fpath+"config_big.swift","@BASE32@",base)
	replace(fpath+"config_big.swift","@BASE64@",base)

	replace(fpath+"config_ff.swift","@ML@",ml)

	run_in_shell("swiftc -DD32 "+fpath+"*.swift -L. -lamcl -I. -O -Ounchecked -whole-module-optimization -emit-library -emit-module -module-name "+tb)
	run_in_shell(deltext+fpath+"*.*")
	run_in_shell("rmdir amcl"+slashtext+tb)


def curveset(tc,nb,base,nbt,m8,mt,ct,pf,stw,sx,ab,cs) :
	global deltext,slashtext,copytext
	global cptr,chosen

	chosen.append(tc)
	cptr=cptr+1

	fpath="amcl"+slashtext+tc+slashtext
	run_in_shell("mkdir amcl"+slashtext+tc)

	run_in_shell(copytext+"big.swift "+fpath+"big.swift")
	run_in_shell(copytext+"config_big.swift "+fpath+"config_big.swift")
	run_in_shell(copytext+"config_field.swift "+fpath+"config_field.swift")
	run_in_shell(copytext+"config_curve.swift "+fpath+"config_curve.swift")
	run_in_shell(copytext+"dbig.swift "+fpath+"dbig.swift")
	run_in_shell(copytext+"fp.swift "+fpath+"fp.swift")
	run_in_shell(copytext+"ecp.swift "+fpath+"ecp.swift")
	run_in_shell(copytext+"rom_"+tc+".swift "+fpath+"rom.swift")

	replace(fpath+"config_big.swift","@NB@",nb)
	replace(fpath+"config_big.swift","@BASE32@",base)
	replace(fpath+"config_big.swift","@BASE64@",base)

	replace(fpath+"config_field.swift","@NBT@",nbt)
	replace(fpath+"config_field.swift","@M8@",m8)
	replace(fpath+"config_field.swift","@MT@",mt)

	ib=int(base)
	inb=int(nb)
	inbt=int(nbt)
	sh=ib*(1+((8*inb-1)//ib))-inbt
	if sh > 14 :
		sh=14
	replace(fpath+"config_field.swift","@SH@",str(sh))


	replace(fpath+"config_curve.swift","@CT@",ct)
	replace(fpath+"config_curve.swift","@PF@",pf)

	replace(fpath+"config_curve.swift","@ST@",stw)
	replace(fpath+"config_curve.swift","@SX@",sx)
	replace(fpath+"config_curve.swift","@AB@",ab)

	if cs == "128" :
		replace(fpath+"config_curve.swift","@HT@","32")
		replace(fpath+"config_curve.swift","@AK@","16")
	if cs == "192" :
		replace(fpath+"config_curve.swift","@HT@","48")
		replace(fpath+"config_curve.swift","@AK@","24")
	if cs == "256" :
		replace(fpath+"config_curve.swift","@HT@","64")
		replace(fpath+"config_curve.swift","@AK@","32")

	if pf != "NOT" :

		run_in_shell(copytext+"fp2.swift "+fpath+"fp2.swift")
		run_in_shell(copytext+"fp4.swift "+fpath+"fp4.swift")
		if cs == "128" :
			run_in_shell(copytext+"ecp2.swift "+fpath+"ecp2.swift")
			run_in_shell(copytext+"fp12.swift "+fpath+"fp12.swift")
			run_in_shell(copytext+"pair.swift "+fpath+"pair.swift")
			run_in_shell(copytext+"mpin.swift "+fpath+"mpin.swift")
			run_in_shell(copytext+"bls.swift "+fpath+"bls.swift")
		if cs == "192" :
			run_in_shell(copytext+"fp8.swift "+fpath+"fp8.swift")
			run_in_shell(copytext+"ecp4.swift "+fpath+"ecp4.swift")
			run_in_shell(copytext+"fp24.swift "+fpath+"fp24.swift")
			run_in_shell(copytext+"pair192.swift "+fpath+"pair192.swift")
			run_in_shell(copytext+"mpin192.swift "+fpath+"mpin192.swift")
			run_in_shell(copytext+"bls192.swift "+fpath+"bls192.swift")
		if cs == "256" :
			run_in_shell(copytext+"fp8.swift "+fpath+"fp8.swift")
			run_in_shell(copytext+"fp16.swift "+fpath+"fp16.swift")
			run_in_shell(copytext+"ecp8.swift "+fpath+"ecp8.swift")
			run_in_shell(copytext+"fp48.swift "+fpath+"fp48.swift")
			run_in_shell(copytext+"pair256.swift "+fpath+"pair256.swift")
			run_in_shell(copytext+"mpin256.swift "+fpath+"mpin256.swift")
			run_in_shell(copytext+"bls256.swift "+fpath+"bls256.swift")
	else :
		run_in_shell(copytext+"ecdh.swift "+fpath+"ecdh.swift")


	run_in_shell("swiftc -DD32 "+fpath+"*.swift -L. -lamcl -I. -O -Ounchecked -whole-module-optimization -emit-library -emit-module -module-name "+tc)
	run_in_shell(deltext+fpath+"*.*")
	run_in_shell("rmdir amcl"+slashtext+tc)


run_in_shell("mkdir amcl")
run_in_shell(copytext+ "hash*.swift amcl"+slashtext+".")
run_in_shell(copytext+ "sha3.swift amcl"+slashtext+".")
run_in_shell(copytext+ "rand.swift amcl"+slashtext+".")
run_in_shell(copytext+ "aes.swift amcl"+slashtext+".")
run_in_shell(copytext+ "gcm.swift amcl"+slashtext+".")
run_in_shell(copytext+ "nhs.swift amcl"+slashtext+".")

run_in_shell("swiftc amcl"+slashtext+"*.swift -O -Ounchecked -whole-module-optimization -emit-library -emit-module -module-name amcl")

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
print("11. nums256w")
print("12. nums256e")
print("13. nums384w")
print("14. nums384e")
print("15. nums512w")
print("16. nums512e")
print("17. secp256k1\n")

print("Pairing-Friendly Elliptic Curves")
print("18. bn254")
print("19. bn254CX")
print("20. bls383")
print("21. bls381")
print("22. fp256BN")
print("23. fp512BN")
print("24. bls461\n")

print("25. bls24")
print("26. bls48\n")

print("RSA")
print("27. rsa2048")
print("28. rsa3072")
print("29. rsa4096")

selection=[]
ptr=0
max=30

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

# curveset(curve,big_length_bytes,bits_in_base,modulus_bits,modulus_mod_8,modulus_type,curve_type,pairing_friendly,curve security)
# where "curve" is the common name for the elliptic curve
# big_length_bytes is the modulus size rounded up to a number of bytes
# bits_in_base gives the number base used for 32 bit architectures, as n where the base is 2^n
# modulus_bits is the actual bit length of the modulus.
# modulus_mod_8 is the remainder when the modulus is divided by 8
# modulus_type is NOT_SPECIAL, or PSEUDO_MERSENNE, or MONTGOMERY_Friendly, or GENERALISED_MERSENNE (supported for GOLDILOCKS only)
# curve_type is WEIERSTRASS, EDWARDS or MONTGOMERY
# pairing_friendly is BN, BLS or NOT (if not pairing friendly
# curve security is AES equiavlent, rounded up.


	if x==1:
		curveset("ed25519","32","29","255","5","PSEUDO_MERSENNE","EDWARDS","NOT","NOT","NOT","NOT","128")
		curve_selected=True
	if x==2:
		curveset("c25519","32","29","255","5","PSEUDO_MERSENNE","MONTGOMERY","NOT","NOT","NOT","NOT","128")
		curve_selected=True
	if x==3:
		curveset("nist256","32","28","256","7","NOT_SPECIAL","WEIERSTRASS","NOT","NOT","NOT","NOT","128")
		curve_selected=True
	if x==4:
		curveset("brainpool","32","28","256","7","NOT_SPECIAL","WEIERSTRASS","NOT","NOT","NOT","NOT","128")
		curve_selected=True
	if x==5:
		curveset("anssi","32","28","256","7","NOT_SPECIAL","WEIERSTRASS","NOT","NOT","NOT","NOT","128")
		curve_selected=True

	if x==6:
		curveset("hifive","42","29","336","5","PSEUDO_MERSENNE","EDWARDS","NOT","NOT","NOT","NOT","192")
		curve_selected=True
	if x==7:
		curveset("goldilocks","56","29","448","7","GENERALISED_MERSENNE","EDWARDS","NOT","NOT","NOT","NOT","256")
		curve_selected=True
	if x==8:
		curveset("nist384","48","29","384","7","NOT_SPECIAL","WEIERSTRASS","NOT","NOT","NOT","NOT","192")
		curve_selected=True
	if x==9:
		curveset("c41417","52","29","414","7","PSEUDO_MERSENNE","EDWARDS","NOT","NOT","NOT","NOT","256")
		curve_selected=True
	if x==10:
		curveset("nist521","66","28","521","7","PSEUDO_MERSENNE","WEIERSTRASS","NOT","NOT","NOT","NOT","256")
		curve_selected=True


	if x==11:
		curveset("nums256w","32","28","256","3","PSEUDO_MERSENNE","WEIERSTRASS","NOT","NOT","NOT","NOT","128")
		curve_selected=True
	if x==12:
		curveset("nums256e","32","29","256","3","PSEUDO_MERSENNE","EDWARDS","NOT","NOT","NOT","NOT","128")
		curve_selected=True
	if x==13:
		curveset("nums384w","48","29","384","3","PSEUDO_MERSENNE","WEIERSTRASS","NOT","NOT","NOT","NOT","192")
		curve_selected=True
	if x==14:
		curveset("nums384e","48","29","384","3","PSEUDO_MERSENNE","EDWARDS","NOT","NOT","NOT","NOT","192")
		curve_selected=True
	if x==15:
		curveset("nums512w","64","29","512","7","PSEUDO_MERSENNE","WEIERSTRASS","NOT","NOT","NOT","NOT","256")
		curve_selected=True
	if x==16:
		curveset("nums512e","64","29","512","7","PSEUDO_MERSENNE","EDWARDS","NOT","NOT","NOT","NOT","256")
		curve_selected=True

	if x==17:
		curveset("secp256k1","32","28","256","7","NOT_SPECIAL","WEIERSTRASS","NOT","NOT","NOT","NOT","128")
		curve_selected=True


	if x==18:
		curveset("bn254","32","28","254","3","NOT_SPECIAL","WEIERSTRASS","BN","D_TYPE","NEGATIVEX","66","128")
		pfcurve_selected=True
	if x==19:
		curveset("bn254CX","32","28","254","3","NOT_SPECIAL","WEIERSTRASS","BN","D_TYPE","NEGATIVEX","66","128")
		pfcurve_selected=True
	if x==20:
		curveset("bls383","48","29","383","3","NOT_SPECIAL","WEIERSTRASS","BLS","M_TYPE","POSITIVEX","65","128")
		pfcurve_selected=True

	if x==21:
		curveset("bls381","48","29","381","3","NOT_SPECIAL","WEIERSTRASS","BLS","M_TYPE","NEGATIVEX","65","128")
		pfcurve_selected=True

	if x==22:
		curveset("fp256bn","32","28","256","3","NOT_SPECIAL","WEIERSTRASS","BN","M_TYPE","NEGATIVEX","66","128")
		pfcurve_selected=True
	if x==23:
		curveset("fp512bn","64","29","512","3","NOT_SPECIAL","WEIERSTRASS","BN","M_TYPE","POSITIVEX","130","128")
		pfcurve_selected=True
# https://eprint.iacr.org/2017/334.pdf
	if x==24:
		curveset("bls461","58","28","461","3","NOT_SPECIAL","WEIERSTRASS","BLS","M_TYPE","NEGATIVEX","78","128")
		pfcurve_selected=True

	if x==25:
		curveset("bls24","60","29","479","3","NOT_SPECIAL","WEIERSTRASS","BLS","M_TYPE","POSITIVEX","49","192")
		pfcurve_selected=True

	if x==26:
		curveset("bls48","70","29","556","3","NOT_SPECIAL","WEIERSTRASS","BLS","M_TYPE","POSITIVEX","32","256")
		pfcurve_selected=True


# rsaset(rsaname,big_length_bytes,bits_in_base,multiplier)
# The RSA name reflects the modulus size, which is a 2^m multiplier
# of the underlying big length

# There are choices here, different ways of getting the same result, but some faster than others
	if x==27:
		#256 is slower but may allow reuse of 256-bit BIGs used for elliptic curve
		#512 is faster.. but best is 1024
		rsaset("rsa2048","128","28","2")
		#rsaset("rsa2048","64","29","60",4")
		#rsaset("rsa2048","32","29","56","8")
		rsa_selected=True
	if x==28:
		rsaset("rsa3072","48","28","8")
		rsa_selected=True
	if x==29:
		#rsaset("rsa4096","32","29","56",16")
		rsaset("rsa4096","64","29","8")
		rsa_selected=True

run_in_shell(deltext+" hash*.swift")
run_in_shell(deltext+" sha3.swift")
run_in_shell(deltext+" aes.swift")
run_in_shell(deltext+" rand.swift")
run_in_shell(deltext+" gcm.swift")
run_in_shell(deltext+" nhs.swift")

run_in_shell(deltext+" big.swift")
run_in_shell(deltext+" dbig.swift")
run_in_shell(deltext+" fp*.swift")
run_in_shell(deltext+" config*.swift")

run_in_shell(deltext+" ecp*.swift")
run_in_shell(deltext+" ecdh.swift")
run_in_shell(deltext+" ff.swift")
run_in_shell(deltext+" rsa.swift")
run_in_shell(deltext+" pair*.swift")
run_in_shell(deltext+" mpin*.swift")
run_in_shell(deltext+" bls*.swift")
run_in_shell(deltext+" rom*.swift")

run_in_shell(deltext+"amcl"+slashtext+"*.*")
run_in_shell("rmdir amcl")

# create library


