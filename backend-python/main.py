from fastapi import FastAPI
from pydantic import BaseModel
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load .env file if it exists
load_dotenv()

app = FastAPI()

# Configuration for AIML API (OpenAI compatible)
# Get API key from env, default to empty string
AIML_API_KEY = os.getenv("AIML_API_KEY", "")
BASE_URL = "https://api.aimlapi.com/v1"

# Initialize Client
client = OpenAI(
    api_key=AIML_API_KEY,
    base_url=BASE_URL,
)

class AIRequest(BaseModel):
    text: str

class AIResponse(BaseModel):
    reply: str

@app.post("/ai", response_model=AIResponse)
async def ask_ai(req: AIRequest):
    if not AIML_API_KEY:
        return AIResponse(reply="AI Error: Please set the AIML_API_KEY in the .env file in backend-python/")
        
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant for AmeGo collaboration platform."},
                {"role": "user", "content": req.text},
            ],
            stream=False,
        )
        reply = response.choices[0].message.content
        return AIResponse(reply=reply)
    except Exception as e:
        print(f"Error calling AI: {e}")
        return AIResponse(reply="AI failed to generate a response.")

@app.post("/summarize", response_model=AIResponse)
async def summarize(req: AIRequest):
    if not AIML_API_KEY:
        return AIResponse(reply="AI Error: Please set the AIML_API_KEY in the .env file.")
        
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert summarizer. Provide a concise, professional summary of the text provided. Use bullet points if necessary."},
                {"role": "user", "content": f"Please summarize this: {req.text}"},
            ],
            stream=False,
        )
        summary = response.choices[0].message.content
        return AIResponse(reply=summary)
    except Exception as e:
        print(f"Error summarizing: {e}")
        return AIResponse(reply="Summarization failed, please try again.")

if __name__ == "__main__":
    import uvicorn
    # Changed host to 0.0.0.0 for easier access, but 127.0.0.1 is safe for local
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
