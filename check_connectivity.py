import socket
import time
import sys
import dns.resolver

def check_dns(domain):
    print(f"Checking DNS resolution for {domain}...")
    try:
        answers = dns.resolver.resolve(domain, 'A')
        print(f"DNS resolved to the following IP addresses:")
        for rdata in answers:
            print(f"  {rdata}")
        return True
    except Exception as e:
        print(f"DNS resolution failed: {e}")
        return False

def check_tcp_connection(domain, port=80, timeout=2):
    print(f"Checking TCP connection to {domain}:{port} with {timeout}s timeout...")
    start_time = time.time()
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        
        # Get IP address
        try:
            ip = socket.gethostbyname(domain)
            print(f"Resolved {domain} to {ip}")
        except socket.gaierror as e:
            print(f"Could not resolve hostname: {e}")
            return False
            
        # Try to connect
        result = sock.connect_ex((ip, port))
        elapsed = time.time() - start_time
        
        if result == 0:
            print(f"Successfully connected to {domain}:{port} in {elapsed:.2f}s")
            return True
        else:
            print(f"Failed to connect, error code: {result} ({elapsed:.2f}s)")
            return False
    except socket.timeout:
        elapsed = time.time() - start_time
        print(f"Connection timed out after {elapsed:.2f}s")
        return False
    except Exception as e:
        elapsed = time.time() - start_time
        print(f"Error connecting: {type(e).__name__}: {e} ({elapsed:.2f}s)")
        return False
    finally:
        try:
            sock.close()
        except:
            pass

if __name__ == "__main__":
    domain = "heaventree10.com" if len(sys.argv) < 2 else sys.argv[1]
    
    # First try a well-known site
    print("Testing connection to a reliable site first...")
    check_dns("example.com")
    check_tcp_connection("example.com")
    
    print("\nNow testing the target site...")
    dns_ok = check_dns(domain)
    
    if dns_ok:
        # Try different ports
        for port in [80, 443]:
            check_tcp_connection(domain, port)