package main

import "fmt"

type BIG struct {
	w [5]int64;
}

func NewBIGint(x int64) BIG {
	b:=BIG{}
	b.w[0]=x
//	for i:=1;i<5;i++ {
//		b.w[i]=0
//	}
	return b
}

func (r BIG) nlen() int {
	return 5
}

func (r BIG) add(x BIG) BIG {
	c:=BIG{}
	for i:=0;i<5;i++ {
		c.w[i]=r.w[i]+x.w[i]	
	}
	return c
}

/*
func NewBIGint(x int64) *BIG {
	b:=new(BIG)
	b.w[0]=x
	for i:=1;i<5;i++ {
		b.w[i]=0
	}
	return b
}

func NewBIGcopy(x BIG) *BIG {
	b:=new(BIG)
	for i:=1;i<5;i++ {
		b.w[i]=x.w[i]
	}
	return b
}
*/
func BIG_add(c,a,b BIG)  {
	for i:=1;i<5;i++ {
		c.w[i]=a.w[i]+b.w[i]
	}
}

func main() {
	b := NewBIGint(42)
	a := NewBIGint(7)
	
	c := b.add(a)

    fmt.Printf("hello, world= ",c)
}
