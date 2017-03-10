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

	fpath="amcl"+slashtext+"src"+slashtext+tb+slashtext
	os.system("mkdir amcl"+slashtext+"src"+slashtext+tb)

	with open("amcl"+slashtext+"src"+slashtext+"lib.rs","a") as libfile:
		libfile.write("pub mod "+tb+";\n")

	os.system(copytext+"modrsa.rs "+fpath+"mod.rs")
	os.system(copytext+"big.rs "+fpath+"big.rs")
	os.system(copytext+"dbig.rs "+fpath+"dbig.rs")
	os.system(copytext+"ff.rs "+fpath+"ff.rs")
	os.system(copytext+"rsa.rs "+fpath+"rsa.rs")

	replace(fpath+"big.rs","xxx",tb)
	replace(fpath+"dbig.rs","xxx",tb)
	replace(fpath+"ff.rs","xxx",tb)
	replace(fpath+"rsa.rs","xxx",tb)

	replace(fpath+"big.rs","@NB@",nb)
	replace(fpath+"big.rs","@BASE@",base)

	replace(fpath+"ff.rs","@ML@",ml);

	#os.system("go install amcl"+slashtext+tb)


def curveset(tc,nb,base,nbt,m8,mt,ct,pf) :
	global deltext,slashtext,copytext
	global cptr,chosen

	chosen.append(tc)
	cptr=cptr+1

	fpath="amcl"+slashtext+"src"+slashtext+tc+slashtext
	os.system("mkdir amcl"+slashtext+"src"+slashtext+tc)

	with open("amcl"+slashtext+"src"+slashtext+"lib.rs","a") as libfile:
		libfile.write("pub mod "+tc+";\n")


	os.system(copytext+"big.rs "+fpath+"big.rs")
	os.system(copytext+"dbig.rs "+fpath+"dbig.rs")
	os.system(copytext+"fp.rs "+fpath+"fp.rs")
	os.system(copytext+"ecp.rs "+fpath+"ecp.rs")
	os.system(copytext+"ecdh.rs "+fpath+"ecdh.rs")
	os.system(copytext+"rom_"+tc+"_64.rs "+fpath+"rom.rs")

	replace(fpath+"big.rs","xxx",tc)
	replace(fpath+"dbig.rs","xxx",tc)
	replace(fpath+"fp.rs","xxx",tc)
	replace(fpath+"ecp.rs","xxx",tc)
	replace(fpath+"ecdh.rs","xxx",tc)

	replace(fpath+"big.rs","@NB@",nb)
	replace(fpath+"big.rs","@BASE@",base)

	replace(fpath+"fp.rs","@NBT@",nbt)
	replace(fpath+"fp.rs","@M8@",m8)
	replace(fpath+"fp.rs","@MT@",mt)

	replace(fpath+"ecp.rs","@CT@",ct)
	replace(fpath+"ecp.rs","@PF@",pf)


	if pf != "NOT" :
		os.system(copytext+"ecp2.rs "+fpath+"ecp2.rs")
		os.system(copytext+"fp2.rs "+fpath+"fp2.rs")
		os.system(copytext+"fp4.rs "+fpath+"fp4.rs")
		os.system(copytext+"fp12.rs "+fpath+"fp12.rs")
		os.system(copytext+"pair.rs "+fpath+"pair.rs")
		os.system(copytext+"mpin.rs "+fpath+"mpin.rs")

		replace(fpath+"fp2.rs","xxx",tc)
		replace(fpath+"fp4.rs","xxx",tc)
		replace(fpath+"fp12.rs","xxx",tc)
		replace(fpath+"ecp2.rs","xxx",tc)
		replace(fpath+"pair.rs","xxx",tc)
		replace(fpath+"mpin.rs","xxx",tc)

		os.system(copytext+"modpf.rs "+fpath+"mod.rs")
	else :
		os.system(copytext+"modecc.rs "+fpath+"mod.rs")
	
	#os.system("go install amcl"+slashtext+tc)

os.system("cargo new amcl")
os.system("mkdir amcl"+slashtext+"src")
os.system(copytext+ "hash*.rs amcl"+slashtext+"src"+slashtext+".")
os.system(copytext+ "rand.rs amcl"+slashtext+"src"+slashtext+".")
os.system(copytext+ "aes.rs amcl"+slashtext+"src"+slashtext+".")
os.system(copytext+ "gcm.rs amcl"+slashtext+"src"+slashtext+".")
os.system(copytext+ "arch64.rs amcl"+slashtext+"src"+slashtext+"arch.rs")
os.system(copytext+ "lib.rs amcl"+slashtext+"src"+slashtext+"lib.rs")


#os.system("go install amcl")

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
# bits_in_base gives the number base used for 64 bit architectures, as n where the base is 2^n
# modulus_bits is the actual bit length of the modulus.
# modulus_mod_8 is the remainder when the modulus is divided by 8
# modulus_type is NOT_SPECIAL, or PSEUDO_MERSENNE, or MONTGOMERY_Friendly, or GENERALISED_MERSENNE (supported for GOLDILOCKS only)
# curve_type is WEIERSTRASS, EDWARDS or MONTGOMERY
# pairing_friendly is BN, BLS or NOT (if not pairing friendly


	if x==1:
		curveset("ed25519","32","56","255","5","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==2:
		curveset("c25519","32","56","255","5","PSEUDO_MERSENNE","MONTGOMERY","NOT")
		curve_selected=True
	if x==3:
		curveset("nist256","32","56","256","7","NOT_SPECIAL","WEIERSTRASS","NOT")
		curve_selected=True
	if x==4:
		curveset("brainpool","32","56","256","7","NOT_SPECIAL","WEIERSTRASS","NOT")
		curve_selected=True
	if x==5:
		curveset("anssi","32","56","256","7","NOT_SPECIAL","WEIERSTRASS","NOT")
		curve_selected=True

	if x==6:
		curveset("hifive","42","60","336","5","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==7:
		curveset("goldilocks","56","60","448","7","GENERALISED_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==8:
		curveset("nist384","48","56","384","7","NOT_SPECIAL","WEIERSTRASS","NOT")
		curve_selected=True
	if x==9:
		curveset("c41417","52","60","414","7","PSEUDO_MERSENNE","EDWARDS","NOT")
		curve_selected=True
	if x==10:
		curveset("nist521","66","60","521","7","PSEUDO_MERSENNE","WEIERSTRASS","NOT")
		curve_selected=True

	if x==11:
		curveset("bn254","32","56","254","3","NOT_SPECIAL","WEIERSTRASS","BN")
		pfcurve_selected=True
	if x==12:
		curveset("bn254CX","32","56","254","3","NOT_SPECIAL","WEIERSTRASS","BN")
		pfcurve_selected=True
	if x==13:
		curveset("bls383","48","56","383","3","NOT_SPECIAL","WEIERSTRASS","BLS")
		pfcurve_selected=True

# rsaset(rsaname,big_length_bytes,bits_in_base,multiplier)
# The RSA name reflects the modulus size, which is a 2^m multiplier
# of the underlying big length

# There are choices here, different ways of getting the same result, but some faster than others
	if x==14:
		#256 is slower but may allow reuse of 256-bit BIGs used for elliptic curve
		#512 is faster.. but best is 1024
		rsaset("rsa2048","128","58","2")
		#rsaset("RSA2048","64","60","4")
		#rsaset("RSA2048","32","56","8")
		rsa_selected=True
	if x==15:
		rsaset("rsa3072","48","56","8")
		rsa_selected=True
	if x==16:
		#rsaset("RSA4096","32","56","16")
		rsaset("rsa4096","64","60","8")
		rsa_selected=True

os.system("cargo rustc --manifest-path amcl"+slashtext+"Cargo.toml --release --lib -- --cfg D64")

os.system(deltext+" hash*.rs")
os.system(deltext+" aes.rs")
os.system(deltext+" rand.rs")
os.system(deltext+" gcm.rs")

os.system(deltext+" arch*.rs")
os.system(deltext+" big.rs")
os.system(deltext+" dbig.rs")
os.system(deltext+" fp*.rs")
os.system(deltext+" mod*.rs")
os.system(deltext+" lib.rs")

os.system(deltext+" ecp.rs")
os.system(deltext+" ecdh.rs")
os.system(deltext+" ff.rs")
os.system(deltext+" rsa.rs")
os.system(deltext+" ecp2.rs")
os.system(deltext+" pair.rs")
os.system(deltext+" mpin.rs")
os.system(deltext+" rom*.rs")

# create library


