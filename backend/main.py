from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from google import genai
import os
from dotenv import load_dotenv

# 🔐 Load ENV
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("❌ GEMINI_API_KEY not found in .env file")

# ✅ NEW CLIENT
client = genai.Client(api_key=api_key)

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------- ROOT --------
@app.get("/")
def home():
    return {"message": "NeuroVision AI Backend Running 🚀"}


# -------- CHAT --------
class ChatInput(BaseModel):
    message: str

@app.post("/chat")
def chat(data: ChatInput):
    try:
        print("👉 API KEY:", api_key)

        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=data.message
        )

        print("✅ RESPONSE:", response)

        return {"reply": response.text or "No response"}

    except Exception as e:
        import traceback
        print("🔥 FULL ERROR:")
        traceback.print_exc()   # 👈 THIS IS IMPORTANT

        return {"reply": "⚠️ Gemini API error"}

# -------- PREDICTION --------
class PredictInput(BaseModel):
    hours: float
    attendance: float
    assignments: float
    sleep: float

@app.post("/predict")
def predict(data: PredictInput):
    try:
        # 🔹 Score calculation
        score = (
            data.hours * 5 +
            data.attendance * 0.3 +
            data.assignments * 0.2 +
            data.sleep * 2
        )

        score = min(100, round(score, 2))

        # 🔹 Risk logic
        if score >= 80:
            risk = "Low"
        elif score >= 60:
            risk = "Medium"
        else:
            risk = "High"

        # 🔹 AI Suggestions
        prompt = f"""
        Student data:
        Study hours: {data.hours}
        Attendance: {data.attendance}
        Assignments: {data.assignments}
        Sleep: {data.sleep}

        Give 3 short professional improvement suggestions.
        """

        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )

        reply = response.text or ""

        suggestions = reply.split("\n")

        return {
            "score": score,
            "risk": risk,
            "recommendations": suggestions[:3]
        }

    except Exception as e:
        print("PREDICT ERROR:", e)
        return {
            "score": 0,
            "risk": "Error",
            "recommendations": ["⚠️ Prediction failed"]
        }


# -------- IMAGE --------
@app.post("/image")
async def image(file: UploadFile = File(...)):
    try:
        await file.read()

        detections = [
            {"label": "Person", "score": 0.95},
            {"label": "Laptop", "score": 0.88},
            {"label": "Table", "score": 0.82},
        ]

        prompt = f"""
        Objects detected: {[d['label'] for d in detections]}
        Write a short professional summary of this image.
        """

        ai = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )

        return {
            "objects": detections,
            "summary": ai.text or "No summary generated"
        }

    except Exception as e:
        print("IMAGE ERROR:", e)
        return {
            "objects": [],
            "summary": "⚠️ Image analysis failed"
        } 