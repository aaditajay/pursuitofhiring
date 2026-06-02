from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import fitz
import os
import json
import re
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_pdf_text(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text.strip()

def ask_groq(messages: list) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()

@app.post("/api/start")
async def start_interview(
    job_role: str = Form(...),
    resume: UploadFile = File(...)
):
    file_bytes = await resume.read()
    resume_text = extract_pdf_text(file_bytes)

    prompt = f"""You are a professional interviewer.
A candidate has applied for the role of: {job_role}

Here is their resume:
{resume_text}

Generate exactly 8 interview questions based on their resume and the job role.
Mix technical questions, behavioural questions, and role-specific questions.
Make them realistic and relevant to the candidate's actual background.

Respond ONLY with a valid JSON array, no markdown, no extra text:
["question 1", "question 2", "question 3", "question 4", "question 5", "question 6", "question 7", "question 8"]"""

    messages = [{"role": "user", "content": prompt}]
    raw = ask_groq(messages)

    match = re.search(r'\[[\s\S]*\]', raw)
    if not match:
        return {"error": "Could not generate questions"}

    questions = json.loads(match.group(0))
    return {"questions": questions, "resume_text": resume_text}

@app.post("/api/evaluate")
async def evaluate_answer(data: dict):
    job_role = data.get("job_role")
    question = data.get("question")
    answer = data.get("answer")
    resume_text = data.get("resume_text")

    prompt = f"""You are a professional interviewer evaluating a candidate for the role of: {job_role}

Candidate resume summary:
{resume_text[:500]}

Interview question: {question}
Candidate's answer: {answer}

Evaluate this answer and respond ONLY with valid JSON, no markdown:
{{
  "score": <number from 0 to 10>,
  "feedback": "<2-3 sentences of constructive feedback>",
  "strength": "<one thing they did well>",
  "improvement": "<one specific thing to improve>"
}}"""

    messages = [{"role": "user", "content": prompt}]
    raw = ask_groq(messages)

    match = re.search(r'\{[\s\S]*\}', raw)
    if not match:
        return {"error": "Could not evaluate answer"}

    return json.loads(match.group(0))

@app.post("/api/summary")
async def get_summary(data: dict):
    job_role = data.get("job_role")
    qa_pairs = data.get("qa_pairs")

    total_score = sum(item.get("score", 0) for item in qa_pairs)
    max_score = len(qa_pairs) * 10
    percentage = round((total_score / max_score) * 100)

    qa_text = "\n".join([
        f"Q: {item['question']}\nA: {item['answer']}\nScore: {item['score']}/10"
        for item in qa_pairs
    ])

    prompt = f"""You are a professional interviewer. A candidate just completed a mock interview for: {job_role}

Here is the full interview:
{qa_text}

Overall score: {percentage}/100

Write a final performance summary. Respond ONLY with valid JSON, no markdown:
{{
  "overall_score": {percentage},
  "summary": "<3-4 sentences overall assessment>",
  "top_strengths": ["strength 1", "strength 2", "strength 3"],
  "areas_to_improve": ["area 1", "area 2", "area 3"],
  "final_tip": "<one motivating piece of advice>"
}}"""

    messages = [{"role": "user", "content": prompt}]
    raw = ask_groq(messages)

    match = re.search(r'\{[\s\S]*\}', raw)
    if not match:
        return {"error": "Could not generate summary"}

    return json.loads(match.group(0))
