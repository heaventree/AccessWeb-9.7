import trafilatura
import sys
import requests
from requests.packages.urllib3.util.retry import Retry
from requests.adapters import HTTPAdapter

def test_website(url):
    print(f"Testing extraction from: {url}")
    
    try:
        # Create a session with retries and longer timeout
        session = requests.Session()
        retries = Retry(total=3, backoff_factor=0.5)
        session.mount('https://', HTTPAdapter(max_retries=retries))
        
        # Add headers to mimic a browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0'
        }
        
        print("Attempting with requests...")
        response = session.get(url, headers=headers, timeout=10)
        print(f"HTTP Status: {response.status_code}")
        print(f"Content type: {response.headers.get('Content-Type')}")
        content_length = len(response.text)
        print(f"Content length: {content_length} characters")
        
        if content_length > 0:
            print("\nFirst 100 characters of HTML:")
            print(response.text[:100])
        
        # Try with trafilatura
        print("\nAttempting with trafilatura...")
        downloaded = trafilatura.fetch_url(url)
        if downloaded:
            print("Content downloaded successfully with trafilatura")
            text = trafilatura.extract(downloaded)
            if text:
                print(f"Successfully extracted {len(text)} characters of content")
                print("First 200 characters:")
                print(text[:200])
                return True
            else:
                print("No text content could be extracted")
                print("This could mean:")
                print("- The site is mostly JavaScript-rendered content")
                print("- The site has a structure trafilatura can't parse")
                print("- The site might be returning a special page to scrapers")
                return False
        else:
            print("Failed to download content with trafilatura")
            return False
            
    except requests.exceptions.Timeout:
        print("Request timed out - site took too long to respond")
        return False
    except requests.exceptions.ConnectionError:
        print("Connection error - couldn't connect to server")
        return False
    except Exception as e:
        print(f"Error: {type(e).__name__}: {e}")
        return False

if __name__ == "__main__":
    # Test with a reliable site first
    print("Testing with a reliable site...")
    test_website("https://example.com")
    
    # Then test with the user's site
    print("\nTesting with the target site...")
    if len(sys.argv) > 1:
        test_website(sys.argv[1])
    else:
        test_website("https://heaventree10.com/")