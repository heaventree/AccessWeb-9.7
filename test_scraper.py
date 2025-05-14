import trafilatura
import sys
import requests

def test_website(url):
    print(f"Testing extraction from: {url}")
    try:
        # First try with requests
        print("Attempting with requests...")
        response = requests.get(url, timeout=5)
        print(f"HTTP Status: {response.status_code}")
        print(f"Content length: {len(response.text)} characters")
        
        # Then try with trafilatura
        print("Attempting with trafilatura...")
        downloaded = trafilatura.fetch_url(url)
        if downloaded:
            text = trafilatura.extract(downloaded)
            if text:
                print(f"Successfully extracted {len(text)} characters of content")
                print("First 200 characters:")
                print(text[:200])
                return True
            else:
                print("No content extracted (downloaded HTML but couldn't extract text)")
                return False
        else:
            print("Failed to download content with trafilatura")
            return False
    except requests.exceptions.Timeout:
        print("Request timed out")
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