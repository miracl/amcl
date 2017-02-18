
package amcl;

public final class rsa_private_key_WWW
{
    public FF_WWW p,q,dp,dq,c;
	
	public rsa_private_key_WWW(int n)
	{
		p=new FF_WWW(n);
		q=new FF_WWW(n);
		dp=new FF_WWW(n);
		dq=new FF_WWW(n);
		c=new FF_WWW(n);
	}
}