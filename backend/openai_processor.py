from openai import OpenAI
from dotenv import load_dotenv
import os
import time

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

def summarize_text(text: str) -> str:
    if not text.strip():
        return "No content to summarize."
    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes emails."},
                {"role": "user", "content": f"Summarize this email:\n{text}"}
            ],
            max_tokens=150,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Summarization error: {e}"


def generate_reply(
    subject: str,
    sender_name: str,
    body: str,
    to_email: str = "[Recipient Email]",
    from_email: str = "[Your Email]",
    to_name: str = "[Recipient Name]",
    from_name: str = "[Your Name]",
    retries: int = 3
) -> str:
    prompt = f"""
You are a professional email assistant.

Given the following email received:

From: {sender_name}
Subject: {subject}
Body: {body}

Please generate a reply draft as the body text only (do not include From, To, or Subject lines).
Start with a greeting addressing the recipient by their name ({to_name}), then write a professional reply, and end with a closing line and the sender's name ({from_name}).

Return only the reply body, not the full email format.
"""
    delay = 2
    for attempt in range(retries):
        try:
            response = client.chat.completions.create(
                model="llama3-70b-8192",
                messages=[
                    {"role": "system", "content": "You are a professional email assistant."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=400,
                temperature=0.7,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error generating reply (attempt {attempt+1}): {e}")
            if attempt < retries - 1:
                time.sleep(delay)
                delay *= 2
            else:
                return f"Reply generation failed after {retries} attempts: {e}"
