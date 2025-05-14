import http.client
import socket
import ssl
import sys

def get_headers(host, port=443, use_ssl=True, path="/", timeout=5):
    print(f"Connecting to {host}:{port} (SSL: {use_ssl})...")
    
    try:
        if use_ssl:
            context = ssl.create_default_context()
            conn = http.client.HTTPSConnection(host, port, timeout=timeout, context=context)
        else:
            conn = http.client.HTTPConnection(host, port, timeout=timeout)
            
        print(f"Sending HEAD request for {path}...")
        conn.request("HEAD", path)
        
        print("Waiting for response...")
        response = conn.getresponse()
        
        print(f"Response status: {response.status} {response.reason}")
        print("Headers:")
        for header, value in response.getheaders():
            print(f"  {header}: {value}")
            
        return True
        
    except socket.timeout:
        print("Connection timed out")
        return False
    except ConnectionRefusedError:
        print("Connection refused")
        return False
    except Exception as e:
        print(f"Error: {type(e).__name__}: {e}")
        return False
    finally:
        try:
            conn.close()
        except:
            pass

if __name__ == "__main__":
    domain = "heaventree10.com" if len(sys.argv) < 2 else sys.argv[1]
    
    print("Testing HEAD request to example.com first...")
    get_headers("example.com")
    
    print("\nNow testing the target site...")
    
    # Try with different protocols
    print("\nTrying with HTTP (port 80):")
    get_headers(domain, port=80, use_ssl=False)
    
    print("\nTrying with HTTPS (port 443):")
    get_headers(domain, port=443, use_ssl=True)