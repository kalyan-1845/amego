from fastapi import FastAPI
from pydantic import BaseModel
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load .env file if it exists and always override environment defaults
load_dotenv(override=True)

app = FastAPI()

@app.get("/health")
async def health():
    return {"status": "ok", "provider": "Groq", "model": "llama-3.1-8b-instant"}

# Configuration for Groq (OpenAI compatible)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
BASE_URL = "https://api.groq.com/openai/v1"

# Initialize Client
client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url=BASE_URL,
)

class AIMessage(BaseModel):
    role: str
    content: str

class AIRequest(BaseModel):
    text: str
    history: list[AIMessage] = []

class AIResponse(BaseModel):
    reply: str

@app.post("/ai", response_model=AIResponse)
async def ask_ai(req: AIRequest):
    if not GROQ_API_KEY:
        return AIResponse(reply="AI Error: Please set the GROQ_API_KEY in the .env file in backend-python/")
        
    try:
        # Construct messages from history + current text
        messages = [{"role": "system", "content": "You are a helpful assistant for AmeGo collaboration platform."}]
        
        # Add past history
        for msg in req.history:
            messages.append({"role": msg.role, "content": msg.content})
            
        # Add current user message
        messages.append({"role": "user", "content": req.text})

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            stream=False,
        )
        reply = response.choices[0].message.content
        print(f"AI Success for {req.text[:20]}...: {reply[:30]}...")
        return AIResponse(reply=reply)
    except Exception as e:
        print(f"AI CRITICAL ERROR: {e}")
        return AIResponse(reply=f"AI failed: {str(e)}")

@app.post("/summarize", response_model=AIResponse)
async def summarize(req: AIRequest):
    if not GROQ_API_KEY:
        return AIResponse(reply="AI Error: Please set the GROQ_API_KEY in the .env file.")
        
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
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
