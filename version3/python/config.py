import os
import subprocess
import sys

deltext = ""
slashtext = ""
copytext = ""
org1text = "org"
org2text = "apache"
org3text = "milagro"

if sys.platform.startswith("linux"):
    copytext = "cp "
    deltext = "rm "
    slashtext = "/"
if sys.platform.startswith("win"):
    copytext = "copy "
    deltext = "del "
    slashtext = "\\"

def run_in_shell(cmd):
    subprocess.check_call(cmd, shell=True)

chosen = []
cptr = 0


def replace(namefile, oldtext, newtext):
    f = open(namefile, 'r')
    filedata = f.read()
    f.close()

    newdata = filedata.replace(oldtext, newtext)

    f = open(namefile, 'w')
    f.write(newdata)
    f.close()


def curveset(tc, pf):
    global deltext, slashtext, copytext
    global cptr, chosen

    chosen.append(tc)
    cptr = cptr + 1

    fpath = tc + slashtext
    run_in_shell("mkdir " + tc)

    run_in_shell(copytext + "big.py " + fpath + "big.py")
    run_in_shell(copytext + "fp.py " + fpath + "fp.py")
    run_in_shell(copytext + "ecp.py " + fpath + "ecp.py")
    run_in_shell(copytext + "ecdh.py " + fpath + "ecdh.py")
    run_in_shell(copytext + tc + ".py " + fpath + "curve.py")

    replace(fpath + "big.py", "XXX", tc)
    replace(fpath + "fp.py", "XXX", tc)
    replace(fpath + "ecp.py", "XXX", tc)
    replace(fpath + "ecdh.py", "XXX", tc)

    if pf != "NOT":
        run_in_shell(copytext + "fp2.py " + fpath + "fp2.py")
        run_in_shell(copytext + "fp4.py " + fpath + "fp4.py")

        replace(fpath + "fp2.py", "XXX", tc)
        replace(fpath + "fp4.py", "XXX", tc)

        run_in_shell(copytext + "ecp2.py " + fpath + "ecp2.py")
        run_in_shell(copytext + "fp12.py " + fpath + "fp12.py")
        run_in_shell(copytext + "pair.py " + fpath + "pair.py")
        run_in_shell(copytext + "mpin.py " + fpath + "mpin.py")
        run_in_shell(copytext + "bls.py " + fpath + "bls.py")

        replace(fpath + "fp12.py", "XXX", tc)
        replace(fpath + "ecp2.py", "XXX", tc)
        replace(fpath + "pair.py", "XXX", tc)
        replace(fpath + "mpin.py", "XXX", tc)
        replace(fpath + "bls.py", "XXX", tc)


print("Elliptic Curves")
print("1. ED25519")
print("2. C25519")
print("3. NIST256")
print("4. GOLDILOCKS")
print("5. NIST384")
print("6. NIST521")
print("7. SEC256K1")


print("Pairing-Friendly Elliptic Curves")
print("8. BN254")
print("9. BN254CX")
print("10. BLS383")
print("11. BLS381")

selection = []
ptr = 0
max = 12

curve_selected = False
pfcurve_selected = False

while ptr < max:
    x = int(input("Choose a Scheme to support - 0 to finish: "))
    if x == 0:
        break
#	print("Choice= ",x)
    already = False
    for i in range(0, ptr):
        if x == selection[i]:
            already = True
            break
    if already:
        continue

    selection.append(x)
    ptr = ptr + 1

# curveset(curve,pairing_friendly)
# where "curve" is the common name for the elliptic curve
# pairing_friendly is BN, BLS or NOT (if not pairing friendly)

    if x == 1:
        curveset("ed25519", "NOT")
        curve_selected = True
    if x == 2:
        curveset("c25519", "NOT")
        curve_selected = True
    if x == 3:
        curveset("nist256", "NOT")
        curve_selected = True
    if x == 4:
        curveset("goldilocks", "NOT")
        curve_selected = True
    if x == 5:
        curveset("nist384", "NOT")
        curve_selected = True
    if x == 6:
        curveset("nist521", "NOT")
        curve_selected = True
    if x == 6:
        curveset("sec256k1", "NOT")
        curve_selected = True

    if x == 8:
        curveset("bn254", "BN")
        pfcurve_selected = True
    if x == 9:
        curveset("bn254cx", "BN")
        pfcurve_selected = True
    if x == 10:
        curveset("bls383", "BLS")
        pfcurve_selected = True
    if x == 11:
        curveset("bls381", "BLS")
        pfcurve_selected = True


run_in_shell(deltext + " big.py")
run_in_shell(deltext + " fp.py")
run_in_shell(deltext + " ecp.py")
run_in_shell(deltext + " ecdh.py")
run_in_shell(deltext + " fp2.py")
run_in_shell(deltext + " fp4.py")
run_in_shell(deltext + " fp12.py")
run_in_shell(deltext + " mpin.py")
run_in_shell(deltext + " bls.py")
run_in_shell(deltext + " pair.py")
run_in_shell(deltext + " ecp2.py")
run_in_shell(deltext + " c25519.py")
run_in_shell(deltext + " ed25519.py")
run_in_shell(deltext + " nist256.py")
run_in_shell(deltext + " bn254.py")
run_in_shell(deltext + " bn254cx.py")
run_in_shell(deltext + " bls383.py")
run_in_shell(deltext + " goldilocks.py")
run_in_shell(deltext + " bls381.py")
run_in_shell(deltext + " nist384.py")
run_in_shell(deltext + " nist521.py")
run_in_shell(deltext + " sec256k1.py")
