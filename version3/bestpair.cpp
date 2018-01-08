//
// Program to generate "best" BN, BLS12, BLS24 curves (with modulus p=3 mod 8)
//
// g++ -O2 bestpair.cpp zzn4.cpp zzn2.cpp zzn.cpp ecn4.cpp ecn2.cpp ecn.cpp big.cpp miracl.a -o bestpair.exe
//
// Further tests may be needed to ensure full satisfaction (e.g. twist security, even x, etc.)
//
// Note that finding curves that are both GT and G2 Strong, can take a while
//
// Some possible rational points on y^2=x^3+b (x^3+b is a perfect square)

// b=1, x=0, -1 or 2
// b=2, x=-1
// b=3, x=1
// b=4, x=0
// b=5, x=-1
// b=8, x=-2, 1, 2
// b=9, x=0, 3, 6, 40
// b=10, x=-1
// b=12, x=-2, 13

// b=-1, x=1
// b=-2, x=3;
// b=-4, x=2, 5
// b=-7, x=2, 32
// b=-8, x=2
// b=-11, x=3, 15

// of course these points need to be checked for correct order...

#include <iostream>
#include "big.h"
#include "ecn.h"
#include "ecn2.h"
#include "ecn4.h"

#define BN 0
#define BLS12 1
#define BLS24 2

using namespace std;

Miracl precision=200;

int main(int argc, char *argv[])
{
	int HW,BITS,S,type,opw;
    int i,j,k,m,jj,bt,ns,hw,twist,notanaf,pb,nb,b,cb[40],oc,ip;
	BOOL G2,GT,gotH,gotB,gotT,progress;
    Big set,msb,c,r,limit,m1,n,p,q,t,x,y,w,X,Y,cof,cof2,coft,tau[5];
    Big PP,TT,FF;
	Big xp[256];
	int pw[256];
    miracl *mip=&precision;
    ECn P;

	argc--; argv++;

    if (argc<1)
    {
       cout << "Missing arguments" << endl;
	   cout << "Program to find best pairing-friendly curves" << endl;
       cout << "bestpair type bits Hamming-weight" << endl;
	   cout << "where type is the curve (BN, BLS12, BLS24)" << endl;
	   cout << "where bits is number of bits in curve x parameter (>30 and <200)" << endl;
       cout << "and hamming-weight is the number of non-zero bits (>2 and <10)" << endl;
       cout << "e.g. bestpair BLS12 77 3" << endl;
	   cout << "Use flag /GT for GT-Strong curves" << endl;
	   cout << "Use flag /G2 for G2-Strong curves" << endl;
	   cout << "Use flag /P to show progress" << endl;

       exit(0);
    }

	ip=0; HW=0; BITS=0; 
	G2=GT=gotB=gotH=gotT=progress=FALSE;

	while (ip<argc)
	{
		if (!gotT && strcmp(argv[ip],"BN")==0)
		{
			ip++;
			gotT=TRUE;
			type=BN;
		}
		if (!gotT && strcmp(argv[ip],"BLS12")==0)
		{
			ip++;
			gotT=TRUE;
			type=BLS12;
		}
		if (!gotT && strcmp(argv[ip],"BLS24")==0)
		{
			ip++;
			gotT=TRUE;
			type=BLS24;
		}
		if (!G2 && strcmp(argv[ip],"/G2")==0)
		{
			ip++;
			G2=TRUE;
			continue;
		}
		if (!GT && strcmp(argv[ip],"/GT")==0)
		{
			ip++;
			GT=TRUE;
			continue;
		}
		if (!progress && strcmp(argv[ip],"/P")==0)
		{
			ip++;
			progress=TRUE;
			continue;
		}
		if (!gotB)
		{
			BITS=atoi(argv[ip++]);
			gotB=TRUE;
			continue;
		}

		if (!gotH)
		{
			HW=atoi(argv[ip++]);
			gotH=TRUE;
			continue;
		}

        cout << "Error in command line" << endl;
        return 0;

	}
    if (!gotH || !gotB || !gotT || HW>9 || HW<2 || BITS>=200 || BITS<30)
    {
        cout << "Error in command line" << endl;
        return 0;
    }

	mip->IOBASE=16;

	hw=HW-1;
	msb=pow((Big)2,BITS);
	set=msb+(1<<hw)-1;   
	limit=msb+(Big)((1<<hw)-1)*pow((Big)2,(BITS-hw));

	S=0;
	oc=0;
	opw=0;
	while (set<limit)
	{
		c=land(set,2*msb-set);  /* Gosper's hack */
		if (c==1) oc=0;
		else oc++;
		r=set+c;
		set=lxor(r,set)>>(oc+2);
		set=lxor(r,set)+land(r,set);

		x=set;

		w=land(x,2*x);
		if (w!=0 && w!=msb) continue; // not a NAF

		for (i=j=0;i<=BITS;i++)
		{ // assign values to set bits
			if (bit(x,i)==1)
			{
				xp[j]=pow((Big)2,i);
				pw[j]=i;
				j++;
			}
		}

		if (progress)
		{
			if (opw!=pw[j-2])
				cout << pw[j-2] << " " << BITS << endl;
			opw=pw[j-2];
		}
		// iterate through all combinations of + and - terms
		for (i=0;i<(1<<j);i++)
		{
			x=0;
			bt=1;
			//cout << "x= ";
			for (k=0;k<j;k++)
			{
				if ((bt&i)!=0) {x+=xp[k]; /*cout << "+2^" << pw[k];*/}
				else {x-=xp[k]; /*cout << "-2^" << pw[k];*/}
				bt<<=1;
			}

			if (type==BLS12)
			{
				p=pow(x,6)-2*pow(x,5)+2*pow(x,3)+x+1;
				t=x+1;
				if (p%3!=0) continue;
				p/=3;
				n=p+1-t;
				q=pow(x,4)-x*x+1;
			}
			if (type==BLS24)
			{
				p=1+x+x*x-pow(x,4)+2*pow(x,5)-pow(x,6)+pow(x,8)-2*pow(x,9)+pow(x,10);
				t=x+1;
				if (p%3!=0) continue;
				p/=3;
				n=p+1-t;
				q=pow(x,8)-pow(x,4)+1;
			}

			if (type==BN)
			{
				p=36*pow(x,4)+36*pow(x,3)+24*x*x+6*x+1;
				t=6*x*x+1;
				n=p+1-t;
				q=n;
			}

			if (p%8!=3) continue;                           // restriction here could be eased

			if (small_factors(q)) continue;
			if (small_factors(p)) continue;

			cof=n/q;

			if (type==BLS24)
			{
				coft=(pow(p,8)-pow(p,4)+1)/q;
			}

			if (type==BLS12 || type==BN)
			{
				coft=(p*p*p*p-p*p+1)/q;
			}

			if (GT)
			{
				if (small_factors(coft)) continue;
			}

			if (type==BLS12)
			{
				TT=t*t-2*p;
				PP=p*p;
				FF=t*(2*x*x*x-2*x*x-x+1)/3;
				m1=PP+1-(-3*FF+TT)/2;
			}

			if (type==BLS24)
			{
				tau[0]=2;  // count points on twist over extension p^4
				tau[1]=t;
				for (jj=1;jj<4;jj++ ) tau[jj+1]=t*tau[jj]-p*tau[jj-1];

				TT=tau[4];
				PP=p*p*p*p;

				FF=sqrt((4*PP-TT*TT)/3);
				m1=PP+1-(3*FF+TT)/2;
			}

			if (type==BN)
			{
				TT=t*t-2*p;
				PP=p*p;
				FF=sqrt((4*PP-TT*TT)/3);
				m1=PP+1-(3*FF+TT)/2;
			}
			cof2=m1/q;

			if (G2)
			{
				if (small_factors(cof2)) continue;
			}

			if (!prime(q)) continue;
			if (!prime(p)) continue;
			modulo(p);

			ZZn2 xi;

			xi.set(1,1);                // for p=3 mod 8
		
// make sure its irreducible
			if (pow(xi,(p*p-1)/2)==1)
				continue;
		
			if (pow(xi,(p*p-1)/3)==1) 
				continue;  // make sure that x^6-c is irreducible

			if (G2)
			{
				if (!prime(cof2)) continue;
			}

			if (GT)
			{
				if (!prime(coft)) continue;
			}

			
// we have a solution
// Find curve b parameter - uses first positive one found (but collect some other possibilities)
			pb=0;
			b=0;
			m=0;
			while (pb<=20 || b==0)
			{
				pb+=1;
				ecurve(0,pb,p,MR_AFFINE);
				while (!P.set(rand(p))) ;
				P*=cof;
				if ((q*P).iszero())
				{
					if (b==0) b=pb;
					else cb[m++]=pb;
				}

			}
			nb=0;
			while (nb>=-20)
			{
				nb-=1;
				ecurve(0,nb,p,MR_AFFINE);
				while (!P.set(rand(p))) ;
				P*=cof;
				if ((q*P).iszero())
					cb[m++]=nb;
			}

			ecurve(0,b,p,MR_AFFINE);
// find number of points on sextic twist..
			twist=MR_SEXTIC_D;
			mip->TWIST=MR_SEXTIC_D;

			if (type==BLS12 || type==BN)
			{
				ECn2 Q;
				ZZn2 rr;

				do
				{
					rr=randn2();
				} while (!Q.set(rr));
        
				Q*=cof2;
				if (!(n*Q).iszero()) 
				{
					twist=MR_SEXTIC_M;
					mip->TWIST=MR_SEXTIC_M;
					do
					{
						rr=randn2();
					} while (!Q.set(rr));
        
					Q*=cof2;
					if (!(n*Q).iszero()) 
					{
						cout << "Never Happens" << endl;
						continue;
					}
				}
			}
			if (type==BLS24)
			{
				ECn4 Q;
				ZZn4 rr;
				do
				{
					rr=randn4();
				} while (!Q.set(rr));

				Q*=cof2;
				if (!(n*Q).iszero()) 
				{
					twist=MR_SEXTIC_M;
					mip->TWIST=MR_SEXTIC_M;
					do
					{
						rr=randn4();
					} while (!Q.set(rr));
        
					Q*=cof2;
					if (!(n*Q).iszero()) 
					{
						cout << "Never Happens" << endl;
						continue;
					}
				}
			}
			S++;
			cout << endl;
			cout << "Solution " << S << endl;
			x=0;
			bt=1;

			cout << "x= ";
			for (k=0;k<j;k++)
			{
				if ((bt&i)!=0) {x+=xp[k]; cout << "+2^" << pw[k];}
				else {x-=xp[k]; cout << "-2^" << pw[k];}
				bt<<=1;
			}
			cout << " = " << x << endl;

			cout << "Curve is y^2=x^3+" << b << endl;
			if (m>0)
			{
				cout << "(or) ";
				for (jj=0;jj<m;jj++)
					cout << cb[jj] << " ";
			}
			cout << "\np= " << p << " (" << bits(p) << " bits)";
			if (twist==MR_SEXTIC_D) cout << " D-Type" << endl;
			if (twist==MR_SEXTIC_M) cout << " M-Type" << endl;
		//	mip->IOBASE=10;
		//	cout << "twist= " << p+1+t << endl;
		//	mip->IOBASE=16;

		}
	}
}
