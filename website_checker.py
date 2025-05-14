import requests
import trafilatura
import time

def check_website(url):
    print(f"Checking website: {url}")
    
    try:
        # Try regular HTTP request with shorter timeout
        print("Attempting HTTP request with 5 second timeout...")
        response = requests.get(url, timeout=5)
        print(f"HTTP Status: {response.status_code}")
        print(f"Content type: {response.headers.get('Content-Type', 'unknown')}")
        content_length = len(response.text)
        print(f"Content length: {content_length} characters")
        
        if content_length > 0:
            print("\nFirst 200 characters of raw HTML:")
            print(response.text[:200])
        
        # Try with trafilatura with shorter timeout
        print("\nAttempting trafilatura extraction with 5 second timeout...")
        downloaded = trafilatura.fetch_url(url, timeout=5)
        if downloaded:
            text = trafilatura.extract(downloaded)
            print("Trafilatura extraction result:")
            if text:
                print(f"Successfully extracted {len(text)} characters of text")
                print("First 200 characters of extracted content:")
                print(text[:200])
            else:
                print("No text content could be extracted")
                print("Possible reasons:")
                print("1. Content might be loaded dynamically with JavaScript")
                print("2. Site might have anti-scraping measures")
                print("3. Content structure might not be recognized by trafilatura")
        else:
            print("\nTrafilatura could not download the content")
            
    except requests.exceptions.Timeout:
        print("Request timed out - the site took too long to respond")
    except requests.exceptions.ConnectionError:
        print("Connection error - could not connect to the site")
    except Exception as e:
        print(f"Error occurred: {type(e).__name__}: {e}")

if __name__ == "__main__":
    url = "https://heaventree10.com/"
    check_website(url)
    
    # Also try accessing the site with a different User-Agent
    print("\n=== Trying with a different User-Agent ===")
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=5)
        print(f"HTTP Status with browser User-Agent: {response.status_code}")
        print(f"Content length: {len(response.text)} characters")
    except Exception as e:
        print(f"Error with User-Agent request: {e}")