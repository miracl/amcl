/*
	Licensed to the Apache Software Foundation (ASF) under one
	or more contributor license agreements.  See the NOTICE file
	distributed with this work for additional information
	regarding copyright ownership.  The ASF licenses this file
	to you under the Apache License, Version 2.0 (the
	"License"); you may not use this file except in compliance
	with the License.  You may obtain a copy of the License at
	
	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an
	"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, either express or implied.  See the License for the
	specific language governing permissions and limitations
	under the License.
*/
//
//  fp.swift
//
//  Created by Michael Scott on 20/06/2015.
//  Copyright (c) 2015 Michael Scott. All rights reserved.
//  Small Finite Field arithmetic
//  AMCL mod p functions
//

final public class FP {


    static public let NOT_SPECIAL=0
    static public let PSEUDO_MERSENNE=1
    static public let MONTGOMERY_FRIENDLY=2
    static public let GENERALISED_MERSENNE=3

    static public let MODBITS:UInt = @NBT@
    static let MOD8:UInt = @M8@
    static public let MODTYPE =  @MT@   

    static let FEXCESS:Chunk = (1<<Chunk(BIG.BASEBITS*UInt(BIG.NLEN)-FP.MODBITS));
    static let OMASK:Chunk=Chunk(-1)<<Chunk(FP.MODBITS%BIG.BASEBITS)
    static let TBITS:UInt=FP.MODBITS%BIG.BASEBITS; // Number of active bits in top word
    static let TMASK:Chunk=(1<<Chunk(FP.TBITS))-1

    var x:BIG
    static let p=BIG(ROM.Modulus)

    static func EXCESS(_ a: BIG) -> Chunk
    {
        return ((a.w[BIG.NLEN-1] & FP.OMASK)>>Chunk(FP.MODBITS%BIG.BASEBITS))
    }

#if D32
    static func pexceed(_ a: BIG,_ b : BIG) -> Bool
    {
        let ea=EXCESS(a)
        let eb=EXCESS(b)
        if (DChunk(ea)+1)*(DChunk(eb)+1) > DChunk(FEXCESS) {return true}
        return false;
    }
    static func sexceed(_ a: BIG) -> Bool
    {
        let ea=EXCESS(a)
        if (DChunk(ea)+1)*(DChunk(ea)+1) > DChunk(FEXCESS) {return true}
        return false;
    }
#endif

#if D64
    static func pexceed(_ a: BIG,_ b : BIG) -> Bool
    {
        let ea=EXCESS(a)
        let eb=EXCESS(b)
        if (ea+1) > FEXCESS/(eb+1) {return true}
        return false;
    }
    static func sexceed(_ a: BIG) -> Bool
    {
        let ea=EXCESS(a)
        if (ea+1) > FEXCESS/(ea+1) {return true}
        return false;
    }
#endif

/* convert to Montgomery n-residue form */
    func nres()
    {
        if FP.MODTYPE != FP.PSEUDO_MERSENNE && FP.MODTYPE != FP.GENERALISED_MERSENNE
        {
            let d=DBIG(x)
            d.shl(UInt(BIG.NLEN)*BIG.BASEBITS)
            x.copy(d.mod(FP.p))
        }
    }
/* convert back to regular form */
    func redc() -> BIG
    {
        if FP.MODTYPE != FP.PSEUDO_MERSENNE && FP.MODTYPE != FP.GENERALISED_MERSENNE
        {
            let d=DBIG(x)
            return FP.mod(d)
        }
        else
        {
            let r=BIG(x)
            return r;
        }
    }
    
    /* reduce a DBIG to a BIG using the appropriate form of the modulus */
    static func mod(_ d: DBIG) -> BIG
    {
 
        if FP.MODTYPE==FP.PSEUDO_MERSENNE
        {
            let t=d.split(FP.MODBITS)
            var b=BIG(d)
            let v=t.pmul(Int(ROM.MConst))

    t.add(b)
    t.norm()


            let tw=t.w[BIG.NLEN-1]
            t.w[BIG.NLEN-1] &= TMASK
            t.inc(Int(ROM.MConst*((tw>>Chunk(FP.TBITS))+(v<<Chunk(BIG.BASEBITS-FP.TBITS)))))
    
    t.norm()
    return t

    //        b.add(t)
    //        b.norm()
    //        return b
        }
        if FP.MODTYPE==FP.MONTGOMERY_FRIENDLY
        {
            for i in 0 ..< BIG.NLEN {
                let (top,bot)=BIG.muladd(d.w[i],ROM.MConst-1,d.w[i],d.w[BIG.NLEN+i-1])
                d.w[BIG.NLEN+i]+=top; d.w[BIG.NLEN+i-1]=bot
 //                   d.w[BIG.NLEN+i]+=d.muladd(d.w[i],ROM.MConst-1,d.w[i],BIG.NLEN+i-1)
            }
    
            var b=BIG(0);
    
            for i in 0 ..< BIG.NLEN
            {
                b.w[i]=d.w[BIG.NLEN+i]
            }
            b.norm()
            return b;
        }
        if FP.MODTYPE==FP.GENERALISED_MERSENNE
        { // GoldiLocks Only
            let t=d.split(FP.MODBITS)
            let RM2=FP.MODBITS/2
            var b=BIG(d)
            b.add(t)
            let dd=DBIG(t)
            dd.shl(RM2)
            
            let tt=dd.split(FP.MODBITS)
            let lo=BIG(dd)
            b.add(tt)
            b.add(lo)
            b.norm()
            tt.shl(RM2)
            b.add(tt)
            
            let carry=b.w[BIG.NLEN-1]>>Chunk(FP.TBITS)
            b.w[BIG.NLEN-1]&=TMASK
            b.w[0]+=carry
            
            b.w[Int(224/BIG.BASEBITS)]+=carry<<Chunk(224%BIG.BASEBITS)
            b.norm()
            return b;
        }
        if FP.MODTYPE==FP.NOT_SPECIAL
        {
            let md=BIG(ROM.Modulus);

            return BIG.monty(md,ROM.MConst,d)
        }
        return BIG(0)
    }


    init()
    {
        x=BIG(0)
    }
    init(_ a: Int)
    {
        x=BIG(a)
        nres()
    }
    init(_ a: BIG)
    {
        x=BIG(a)
        nres()
    }
    init(_ a: FP)
    {
        x=BIG(a.x)
    }
    /* convert to string */
    func toString() -> String
    {
        let s=redc().toString();
        return s;
    }
    
    func toRawString() -> String
    {
        let s=x.toRawString();
        return s;
    }
/* reduce this mod Modulus */
    func reduce()
    {
        x.mod(FP.p)
    }
    
/* test this=0? */
    func iszilch() -> Bool
    {
        reduce();
        return x.iszilch()
    }
    
/* copy from FP b */
    func copy(_ b: FP)
    {
        x.copy(b.x);
    }
    
/* set this=0 */
    func zero()
    {
        x.zero();
    }
    
/* set this=1 */
    func one()
    {
        x.one(); nres()
    }
    
/* normalise this */
    func norm()
    {
        x.norm();
    }
/* swap FPs depending on d */
    func cswap(_ b: FP,_ d: Int)
    {
        x.cswap(b.x,d)
    }
    
/* copy FPs depending on d */
    func cmove(_ b: FP,_ d:Int)
    {
        x.cmove(b.x,d);
    }
/* this*=b mod Modulus */
    func mul(_ b: FP)
    {
    //    norm()
    //    b.norm()

        if FP.pexceed(x,b.x) {reduce()}

        //let ea=FP.EXCESS(x)
        //let eb=FP.EXCESS(b.x)
        
       // if Int64(ea+1)*Int64(eb+1)>Int64(FP.FEXCESS) {reduce()}
        /*if (ea+1)>=(FP.FEXCESS-1)/(eb+1) {reduce()}*/
        
        let d=BIG.mul(x,b.x)
        x.copy(FP.mod(d))
    }
    static func logb2(_ w: UInt32) -> Int
    {
        var v = w
        v |= (v >> 1)
        v |= (v >> 2)
        v |= (v >> 4)
        v |= (v >> 8)
        v |= (v >> 16)
        
        v = v - ((v >> 1) & 0x55555555)
        v = (v & 0x33333333) + ((v >> 2) & 0x33333333)
        let r = Int((   ((v + (v >> 4)) & 0xF0F0F0F)   &* 0x1010101) >> 24)
        return (r+1)
    }
    /* this = -this mod Modulus */
    func neg()
    {
        let m=BIG(FP.p);
    
    //    norm();
        let sb=FP.logb2(UInt32(FP.EXCESS(x))+1)
 //       var ov=BIG.EXCESS(x);
 //       var sb=1; while(ov != 0) {sb += 1;ov>>=1}
    
        m.fshl(sb)
        x.rsub(m)
    
        if FP.EXCESS(x)>=FP.FEXCESS {reduce()}
    }
    /* this*=c mod Modulus, where c is a small int */
    func imul(_ c: Int)
    {
        var cc=c
    //    norm();
        var s=false
        if (cc<0)
        {
            cc = -cc
            s=true
        }
        let afx=(FP.EXCESS(x)+1)*(cc+1)+1;
        if cc<=BIG.NEXCESS && afx<FP.FEXCESS
        {
            x.imul(cc)
            x.norm()
        }
        else
        {
            if afx<FP.FEXCESS {x.pmul(cc)}
            else
            {
				let d=x.pxmul(cc);
				x.copy(d.mod(FP.p));
            }
        }
        if s {neg();  norm()}
       
    }
    
/* this*=this mod Modulus */
    func sqr()
    {
    //    norm()

        if FP.sexceed(x) {reduce()}


     //   let ea=FP.EXCESS(x);
        
    //    if Int64(ea+1)*Int64(ea+1)>Int64(FP.FEXCESS) {reduce()}
        /*if (ea+1)>=(FP.FEXCESS-1)/(ea+1) {reduce()}*/
        
        let d=BIG.sqr(x);
        x.copy(FP.mod(d));
    }
    
    /* this+=b */
    func add(_ b: FP)
    {
        x.add(b.x);
        if FP.EXCESS(x)+2>=FP.FEXCESS {reduce()}
    }
/* this-=b */
    func sub(_ b: FP)
    {
        let n=FP(b)
        n.neg()
        self.add(n)
    }
/* this/=2 mod Modulus */
    func div2()
    {
    //    x.norm()
        if (x.parity()==0)
            {x.fshr(1)}
        else
        {
            x.add(FP.p)
            x.norm()
            x.fshr(1)
        }
    }
/* this=1/this mod Modulus */
    func inverse()
    {
        let r=redc()
        r.invmodp(FP.p)
        x.copy(r)
        nres()
    }
    
/* return TRUE if this==a */
    func equals(_ a: FP) -> Bool
    {
        a.reduce()
        reduce()
        if (BIG.comp(a.x,x)==0) {return true}
        return false;
    }
/* return this^e mod Modulus */
    func pow(_ e: BIG) -> FP
    {
        let r=FP(1)
        e.norm()
        x.norm()
	let m=FP(self)
        while (true)
        {
            let bt=e.parity()
            e.fshr(1)
            if bt==1 {r.mul(m)}
            if e.iszilch() {break}
            m.sqr();
        }
        r.x.mod(FP.p);
        return r;
    }
/* return sqrt(this) mod Modulus */
    func sqrt() -> FP
    {
        reduce();
        let b=BIG(FP.p)
        if (FP.MOD8==5)
        {
            b.dec(5); b.norm(); b.shr(3)
            let i=FP(self); i.x.shl(1)
            let v=i.pow(b)
            i.mul(v); i.mul(v)
            i.x.dec(1)
            let r=FP(self)
            r.mul(v); r.mul(i)
            r.reduce()
            return r
        }
        else
        {
            b.inc(1); b.norm(); b.shr(2)
            return pow(b)
        }
    }
/* return jacobi symbol (this/Modulus) */
    func jacobi() -> Int
    {
        let w=redc()
        return w.jacobi(FP.p)
    }
    
}
