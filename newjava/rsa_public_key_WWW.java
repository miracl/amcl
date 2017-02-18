
package amcl;

public final class rsa_public_key_WWW
{
    public int e;
    public FF_WWW n;

	public rsa_public_key_WWW(int m)
	{
		e=0;
		n=new FF_WWW(m);
	}
}
