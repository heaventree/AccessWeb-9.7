import socket
import time
import sys

def check_resource(domain, resource_path="/", port=80, timeout=2):
    """
    Try to fetch a specific resource from the domain
    """
    print(f"Checking resource {domain}:{port}{resource_path}")
    
    try:
        # Create socket
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(timeout)
        
        # Connect
        s.connect((domain, port))
        
        # Send HTTP request
        request = f"GET {resource_path} HTTP/1.1\r\nHost: {domain}\r\nUser-Agent: Mozilla/5.0\r\nAccept: */*\r\nConnection: close\r\n\r\n"
        s.sendall(request.encode())
        
        # Receive response
        start_time = time.time()
        max_time = 3  # Maximum 3 seconds
        chunks = []
        
        print("Receiving data...")
        while time.time() - start_time < max_time:
            try:
                chunk = s.recv(4096)
                if not chunk:
                    break
                chunks.append(chunk)
            except socket.timeout:
                print("Socket receive timed out")
                break
        
        # Process response
        response_data = b''.join(chunks)
        if response_data:
            # Try to decode to utf-8, falling back to latin-1
            try:
                response_text = response_data.decode('utf-8')
            except UnicodeDecodeError:
                response_text = response_data.decode('latin-1', errors='replace')
                
            # Determine if it's a binary file
            is_binary = False
            content_type = ""
            
            # Extract HTTP status code
            status_line = response_text.split('\r\n')[0]
            print(f"Status: {status_line}")
            
            # Extract Content-Type if present
            for line in response_text.split('\r\n'):
                if line.lower().startswith('content-type:'):
                    content_type = line
                    print(f"Content-Type: {line}")
                    if 'image/' in line or 'application/' in line:
                        is_binary = True
            
            # Determine content length
            headers_end = response_text.find('\r\n\r\n')
            if headers_end > 0:
                body = response_text[headers_end+4:]
                print(f"Body length: {len(body)} characters")
                
                # Save file depending on binary status
                filename = f"response_{resource_path.replace('/', '_')}"
                if filename == "response__":
                    filename = "response_root"
                
                with open(f"{filename}.txt", "w", encoding="utf-8") as f:
                    f.write(response_text)
                print(f"Saved response to {filename}.txt")
            
        else:
            print("No data received")
            
    except socket.timeout:
        print(f"Connection to {domain}:{port} timed out")
    except ConnectionRefusedError:
        print(f"Connection to {domain}:{port} refused")
    except Exception as e:
        print(f"Error: {type(e).__name__}: {e}")
    finally:
        try:
            s.close()
        except:
            pass
    
    print("")  # Empty line for readability

if __name__ == "__main__":
    domain = "heaventree10.com" if len(sys.argv) < 2 else sys.argv[1]
    
    # Try different common resources
    resources = [
        "/",                     # Root
        "/favicon.ico",          # Favicon
        "/robots.txt",           # Robots
        "/sitemap.xml",          # Sitemap
        "/wp-content/",          # WordPress content
        "/images/",              # Common image folder
        "/assets/",              # Common assets folder
        "/api/",                 # API endpoint
        "/css/style.css",        # CSS file
        "/js/main.js"            # JavaScript file
    ]
    
    for resource in resources:
        check_resource(domain, resource)