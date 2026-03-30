import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
BASE_URL = "https://api.groq.com/openai/v1"

client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url=BASE_URL,
)

try:
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "Test"},
            {"role": "user", "content": "Hello"},
        ],
        stream=False,
    )
    print("Success:", response.choices[0].message.content)
except Exception as e:
    print("Error:", e)
