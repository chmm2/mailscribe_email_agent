Got it. Here is the complete, final `README.md` that incorporates all the details we've discussed: the dual-mode operation, the FastAPI backend, and a clear, step-by-step guide on how to run the full local development environment with both the frontend and backend servers.

This version is comprehensive and provides a professional, clear guide for anyone visiting your repository.

---
---

# MailScribe - AI Email Agent with FastAPI Backend

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue)](https://www.python.org/downloads/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)
[![Built with LangChain](https://img.shields.io/badge/Built%20with-LangChain-purple)](https://www.langchain.com/)
[![Powered by FastAPI](https://img.shields.io/badge/API-FastAPI-teal)](https://fastapi.tiangolo.com/)
[![Powered by Groq](https://img.shields.io/badge/Powered%20by-Groq-orange)](https://groq.com/)

</div>

**MailScribe** is a powerful, autonomous AI agent and API designed to manage your Gmail inbox. It can run as a standalone script to automatically read and reply to unread emails, or be deployed as a **FastAPI service** to generate email replies on demand. The agent uses Groq's Llama 3 model via LangChain to generate context-aware replies, making it perfect for handling routine inquiries, providing quick acknowledgments, or managing high-volume inboxes.

---

## ✨ Key Features

-   **Dual-Mode Operation**:
    -   **Autonomous Agent (`main.py`)**: Runs as a continuous script to automatically process and reply to unread emails.
    -   **API Backend (`api.py`)**: Exposes a FastAPI endpoint (`/generate-reply`) to generate email replies on demand, allowing for integration with other services or a user interface.
-   **Generative AI Replies**: Leverages the speed of Groq and the power of Llama 3 via LangChain to generate intelligent, human-like responses based on an email's subject and body.
-   **HTML Email Parsing**: Uses `BeautifulSoup` to cleanly extract text content from complex HTML emails.
-   **Proper Email Threading**: Sends replies that correctly thread into the original conversation using `In-Reply-To` and `References` headers.
-   **Avoids Duplication**: The agent marks emails as "read" after processing to ensure it never replies to the same message twice.
-   **Secure Authentication**: Utilizes Google's recommended OAuth 2.0 flow for API access and App Passwords for sending mail, ensuring your main Google password is never exposed.

## 🏗️ Architecture: Decoupled Frontend & Backend

MailScribe is designed with a modern **decoupled architecture**, meaning the user interface (frontend) and the core logic (backend) are separate applications that run independently.

-   **Backend (This Repository)**: The engine of the application, built with **Python** and **FastAPI**. It runs on a server and handles all the complex tasks: authenticating with Google, communicating with the Groq AI, and generating reply text. It exposes an API that a frontend can communicate with.
-   **Frontend (Not included in this repo)**: A frontend would be a separate web application (built with tools like React, Vue, or simple HTML/CSS/JavaScript) that provides the user interface. It runs in the user's web browser and makes API calls to this backend to function.

This separation allows for greater flexibility. You can build multiple frontends (a web app, a mobile app, a browser extension) that all use the same powerful backend service.

## 🛠️ Tech Stack

| Category         | Technology / Library                                       |
| ---------------- | ---------------------------------------------------------- |
| **API Framework**  | `FastAPI` & `Uvicorn`                                      |
| **Orchestration**  | `LangChain`                                                |
| **LLM / Inference**| `Groq` (Llama 3 8B)                                        |
| **Email Service**  | `Gmail API`                                                |
| **Authentication** | `google-api-python-client`, `google-auth-oauthlib`         |
| **HTML Parsing**   | `BeautifulSoup4`                                           |
| **Secrets Mgmt**   | `python-dotenv`                                            |

---

## ⚠️ Important: Security and Permissions

This script requires powerful permissions to function. Please read this section carefully.

-   **`gmail.modify` Scope**: The application requests permission to read, compose, send, and **modify** your emails. This includes the ability to mark emails as read or even delete them.
-   **Recommendation**: It is **strongly recommended** to run this agent on a **dedicated test Gmail account**, not your primary personal or professional account, especially while testing.

By proceeding with the setup, you acknowledge that you understand the permissions you are granting to the script.

---

## 🚀 Setup and Installation

Follow these steps precisely to get MailScribe running.

### 1. Prerequisites
- Python 3.10 or newer.
- A Google Account (preferably a test account).
- Node.js and npm (if you intend to run a frontend).

### 2. Clone the Repository
```bash
git clone https://github.com/chmm2/mailscribe_email_agent.git
cd mailscribe_email_agent
```

### 3. Set Up a Python Virtual Environment
```bash
# Create a virtual environment
python -m venv venv

# Activate it
# On Windows:
# venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 4. Install Dependencies
```bash
# Install Python packages
pip install -r requirements.txt

# Install JavaScript packages (if you have a frontend with a package.json)
# npm install
```

### 5. Configure Google Cloud & Gmail API
This is the most critical step. You need to authorize the application to access the Gmail API.

a. **Go to the Google Cloud Console** and create a new project.
b. In the search bar, find and **enable the "Gmail API"**.
c. Go to "APIs & Services" -> "**Credentials**".
d. Click "**Create Credentials**" -> "**OAuth client ID**".
e. If prompted, configure the "OAuth consent screen". Select **"External"** and fill in the required app name, user support email, and developer contact information.
f. In the "Create OAuth client ID" screen, select **"Desktop app"** for the Application type.
g. Click "Create". A pop-up will appear. Click "**DOWNLOAD JSON**" and save the file.
h. **Rename the downloaded file to `credentials.json`** and place it in the root of your project folder.

### 6. Generate a Gmail App Password
The script uses an App Password to send emails, which is more secure than using your main password.

a. Go to your **Google Account Security settings**: [myaccount.google.com/security](https://myaccount.google.com/security)
b. Ensure **2-Step Verification** is turned **ON**. You cannot create App Passwords without it.
c. In the "How you sign in to Google" section, click on **"App passwords"**.
d. For "Select app", choose **"Mail"**. For "Select device", choose **"Windows Computer"** (or any other option).
e. Click "**Generate**".
f. A 16-character password will be displayed (e.g., `xxxx yyyy zzzz wwww`). **Copy this password without the spaces.** This is your App Password.

### 7. Configure Environment Variables
a. Create a file named `.env` in the root of your project folder.
b. Add your Groq API key and the Gmail App Password you just generated to this file.

***`.env` file contents:***
```dotenv
GROQ_API_KEY="gsk_YourGroqApiKeyHere"
GMAIL_APP_PASSWORD="Your16CharacterAppPasswordHere"
```

---

## ▶️ How to Run

You can run MailScribe in two different modes. **For all modes, you must run the authorization step first.**

### First-Time Authorization Step
Before using either mode, you must authorize the application with Google.
```bash
# Run the standalone agent once to trigger the OAuth flow
python main.py
```
- A new tab will open in your browser asking you to grant permission. Click **Allow**.
- A `token.json` file will be created in your project folder. This stores your authorization so you don't have to log in through the browser again.
- You can stop the script with `Ctrl+C` after the `token.json` file appears.

---

### Mode 1: Run as a Standalone Autonomous Agent
This will continuously check for and reply to unread emails.
```bash
# Make sure your Python virtual environment is activated
python main.py
```
The agent will now run in your terminal, checking for new emails every 15 seconds.

### Mode 2: Run as a Full Local Application (Backend + Frontend)
This is the typical development workflow if you have a separate frontend application. You need to run both servers simultaneously in separate terminals.

#### Step 2.1: Run the Backend Server
This server handles all the core logic and API requests.

1.  Open your first terminal window.
2.  Activate your Python virtual environment (`source venv/bin/activate`).
3.  Start the FastAPI server using Uvicorn.
    ```bash
    uvicorn api:app --reload
    ```
4.  The backend is now running at `http://127.0.0.1:8000`. Leave this terminal open.

#### Step 2.2: Run the Frontend Development Server
This server provides the user interface that you interact with in your browser.

1.  Open a **second, new terminal window**.
2.  (If you have a frontend with a `package.json` file) Start the frontend application.
    ```bash
    npm start
    ```
3.  A new tab should automatically open in your web browser, pointing to the frontend, typically at `http://localhost:3000`. Leave this terminal open as well.

You can now use the web interface. When you perform actions on the website, the frontend will make API calls to your backend running at `http://127.0.0.1:8000` to get the work done.

---

## 🔧 Customization

-   **AI Persona**: You can change the agent's personality, tone, and instructions by editing the prompt template inside the `generate_reply()` function in `core_logic.py`.
-   **Check Interval**: For the autonomous agent, you can change how frequently it checks for new mail by modifying the `time.sleep(15)` value at the end of the `main()` function in `main.py`.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
