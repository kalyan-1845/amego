import requests
import time
import concurrent.futures

# The Go backend is usually on 8080, Python on 8000
AI_URL = "http://127.0.0.1:8000/ai"

def test_ai(i):
    try:
        start = time.time()
        payload = {
            "text": f"Stress test message {i}. Keep your response very short, under 5 words.",
            "history": []
        }
        res = requests.post(AI_URL, json=payload, timeout=10)
        end = time.time()
        if res.status_code == 200:
            print(f"Request {i}: Success ({end-start:.2f}s) - {res.json()['reply']}")
        else:
            print(f"Request {i}: Failed ({res.status_code})")
    except Exception as e:
        print(f"Request {i}: Error {e}")

print("🚀 Starting Groq Stress Test...")
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    executor.map(test_ai, range(10))

print("\n🏁 Initial Test Done! To run 1500 times, just keep the backend open.")
