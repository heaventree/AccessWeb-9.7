import requests
import sys
import socket
import time
import trafilatura

def print_separator():
    print("\n" + "=" * 60 + "\n")

def scrape_with_fallbacks(url):
    """Try different methods to scrape content from a website"""
    
    print(f"Attempting to scrape: {url}")
    
    # Method 1: Basic requests with custom User-Agent
    print("Method 1: Using requests with custom User-Agent")
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
        }
        
        # Create session with retries
        session = requests.Session()
        response = session.get(url, headers=headers, timeout=10, verify=False)
        print(f"Status code: {response.status_code}")
        print(f"Content type: {response.headers.get('Content-Type')}")
        print(f"Content length: {len(response.text)} characters")
        
        if len(response.text) > 0:
            print(f"First 200 characters of content:")
            print(response.text[:200])
            print("...")
            
            # Try to extract main content with trafilatura
            print_separator()
            print("Attempting to extract main content with trafilatura...")
            extracted_text = trafilatura.extract(response.text)
            if extracted_text and len(extracted_text) > 0:
                print(f"Successfully extracted {len(extracted_text)} characters")
                print("First 200 characters of extracted content:")
                print(extracted_text[:200])
                print("...")
                return extracted_text
            else:
                print("Failed to extract content with trafilatura")
        
    except requests.exceptions.SSLError as e:
        print(f"SSL Error: {e}")
    except requests.exceptions.Timeout as e:
        print(f"Timeout Error: {e}")
    except Exception as e:
        print(f"Error with requests: {type(e).__name__}: {e}")
    
    print_separator()
    
    # Method 2: Try with HTTP instead of HTTPS
    http_url = url.replace("https://", "http://")
    print(f"Method 2: Trying with HTTP: {http_url}")
    try:
        response = requests.get(http_url, headers=headers, timeout=10, allow_redirects=False)
        print(f"Status code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
    except Exception as e:
        print(f"Error with HTTP request: {type(e).__name__}: {e}")
    
    print_separator()
    print("Method 3: Using low-level socket connection")
    
    # Parse the domain from the URL
    if "://" in url:
        domain = url.split("://")[1].split("/")[0]
    else:
        domain = url.split("/")[0]
    
    if ":" in domain:
        domain, port_str = domain.split(":")
        port = int(port_str)
    else:
        port = 80
    
    print(f"Connecting to {domain}:{port}...")
    
    try:
        # Create socket
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(5)
        
        # Connect
        s.connect((domain, port))
        
        # Send HTTP request
        request = f"GET / HTTP/1.1\r\nHost: {domain}\r\nUser-Agent: Mozilla/5.0\r\nAccept: */*\r\nConnection: close\r\n\r\n"
        s.sendall(request.encode())
        
        # Receive response
        print("Receiving data...")
        chunks = []
        while True:
            try:
                chunk = s.recv(4096)
                if not chunk:
                    break
                chunks.append(chunk)
            except socket.timeout:
                print("Socket receive timed out, but we have some data")
                break
        
        # Process response
        response_data = b''.join(chunks)
        print(f"Received {len(response_data)} bytes")
        
        if response_data:
            # Try to decode to utf-8, falling back to latin-1
            try:
                response_text = response_data.decode('utf-8')
            except UnicodeDecodeError:
                response_text = response_data.decode('latin-1')
            
            # Print first part
            print("First 200 characters:")
            print(response_text[:200])
            print("...")
            
            # Try to extract HTML body
            if "<body" in response_text and "</body>" in response_text:
                body_start = response_text.find("<body")
                body_end = response_text.find("</body>") + 7
                body_content = response_text[body_start:body_end]
                print("Found body content, extracting with trafilatura...")
                extracted_text = trafilatura.extract(body_content)
                if extracted_text:
                    print(f"Extracted {len(extracted_text)} characters")
                    print(extracted_text[:200])
                    return extracted_text
                else:
                    print("Failed to extract text from body content")
            
            return response_text
    except socket.timeout:
        print("Socket connection timed out")
    except Exception as e:
        print(f"Socket error: {type(e).__name__}: {e}")
    finally:
        try:
            s.close()
        except:
            pass
    
    return "Failed to fetch content from the website."

if __name__ == "__main__":
    # Disable SSL warnings
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    
    # Use HTTP instead of HTTPS to avoid SSL handshake issues
    url = "http://heaventree10.com/" if len(sys.argv) < 2 else sys.argv[1]
    print(f"Using HTTP URL: {url}")
    
    # Skip method 1 and go directly to method 3 (socket connection)
    print("Skipping to Method 3: Using low-level socket connection")
    
    # Parse the domain from the URL
    if "://" in url:
        domain = url.split("://")[1].split("/")[0]
    else:
        domain = url.split("/")[0]
    
    if ":" in domain:
        domain, port_str = domain.split(":")
        port = int(port_str)
    else:
        port = 80
    
    print(f"Connecting to {domain}:{port}...")
    
    try:
        # Create socket
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(2)  # Very short timeout
        
        # Connect
        s.connect((domain, port))
        
        # Send HTTP request
        request = f"GET / HTTP/1.1\r\nHost: {domain}\r\nUser-Agent: Mozilla/5.0\r\nAccept: */*\r\nConnection: close\r\n\r\n"
        s.sendall(request.encode())
        
        # Receive response
        print("Receiving data...")
        chunks = []
        start_time = time.time()
        max_time = 3  # Maximum 3 seconds
        
        while time.time() - start_time < max_time:
            try:
                chunk = s.recv(4096)
                if not chunk:
                    break
                chunks.append(chunk)
            except socket.timeout:
                print("Socket receive timed out, but we have some data")
                break
        
        # Process response
        response_data = b''.join(chunks)
        print(f"Received {len(response_data)} bytes")
        
        if response_data:
            # Try to decode to utf-8, falling back to latin-1
            try:
                response_text = response_data.decode('utf-8')
            except UnicodeDecodeError:
                response_text = response_data.decode('latin-1')
            
            # Print first part
            print("First 200 characters:")
            print(response_text[:200])
            print("...")
            
            # Save the raw response to a file
            with open("raw_response.txt", "w", encoding="utf-8") as f:
                f.write(response_text)
            print("Raw response saved to raw_response.txt")
            
            # Save only headers to a separate file
            headers_end = response_text.find("\r\n\r\n")
            if headers_end > 0:
                headers = response_text[:headers_end]
                with open("headers_only.txt", "w", encoding="utf-8") as f:
                    f.write(headers)
                print("Headers saved to headers_only.txt")
    except socket.timeout:
        print("Socket connection timed out")
    except Exception as e:
        print(f"Socket error: {type(e).__name__}: {e}")
    finally:
        try:
            s.close()
        except:
            pass