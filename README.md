<div align="center">
  <img src="/public/logo/nextvoters.png" alt="nextvoters logo" />
</div>

---

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-DailySAT-2F80ED?color=2F80ED)](https://nextvoters.com)
[![Code License](https://img.shields.io/badge/Code%20License-MIT%202.0-00BFFF?color=00BFFF)](LICENSE-CODE)
[![Engineering Resource](https://img.shields.io/badge/📘%20Engineering%20Resource-GoodNotes-0A84FF?color=0A84FF)](https://web.goodnotes.com/s/F1IvZmoXF9UeAWsxmgriNK)

---

**Empowering the next generation of informed voters through AI-driven political education.**

Next Vote helps young citizens understand policy, legislation, and political platforms. With online disinformation at an all-time high, Next Vote delivers trusted, fact-based civic education.

---

## ✨ Key Features

### 🔍 Intelligent Policy Analysis

* AI-driven analysis of official party platforms
* Real-time document processing using Cohere AI
* Side-by-side comparisons of party positions
* Streaming responses for instant insights

### 📄 Document Deep Dive

* Interactive bill and legislation analysis
* Ask questions about specific clauses
* AI-guided navigation through complex documents
* Citation-backed responses

### 🌍 Multi-Jurisdictional Support

* Canadian federal/provincial coverage
* U.S. political analysis
* Region-specific election info
* Extendable to more countries

### 🎓 Educational Focus

* Built for students and young voters
* Fellowship program with $10,000+ civic engagement grants
* Misinformation-resistant, factual outputs
* Encourages informed civic participation

---

## 📧 Automated Civic Email Alerts (Civic Line)

Next Voters integrates **Civic Line**, an automated email sender service that keeps users informed about new legislation, council activity, and policy updates — without any manual setup.

### How it works

* Powered by the **`civic-line-cli`** PyPI package
* Runs automatically on a schedule (or on-demand)
* Scrapes legislative and council data
* Generates AI summaries
* Sends formatted email updates to subscribers

All of this is handled by a single command:

```bash
civicline
```

The CLI handles:

* Data ingestion and scraping
* AI-powered summarization
* Email composition
* Secure email delivery

No configuration or scripting required beyond environment variables.

### Why this matters

* Keeps voters informed **passively**
* Reduces information overload
* Bridges the gap between legislation and public understanding
* Ideal for students, families, and local communities

---

## 🛠 Technology Stack

* **Framework:** Next.js 14+
* **AI SDK:** Vercel AI SDK
* **LLM:** gpt-4o-mini
* **Embeddings:** text-embedding-3-small
* **Styling:** Tailwind CSS
* **UI:** Shadcn
* **Database:** Neon + Vercel Storage
* **Vector Search:** Qdrant
* **Email Automation:** civic-line-cli (PyPI)
* **Deployment:** Vercel

---

## 🚀 Quick Start

### Prerequisites

* Next.js 14+
* pnpm (`https://pnpm.io/installation`)
* Configure `.env` with required variables

---

## 🔑 OpenAI Key Setup

Since OpenAI does not offer a free tier, this project uses a reverse-proxy compatible with OpenAI’s format:

```env
OPENAI_API_BASE_URL="https://models.github.ai/inference"
OPENAI_API_KEY=
```

Generate your token from **GitHub Models Marketplace**.

---

## 🔐 Authentication with Kinde

Add the following to `.env`:

```env
KINDE_CLIENT_ID=
KINDE_CLIENT_SECRET=
KINDE_ISSUER_URL=
KINDE_SITE_URL=
KINDE_POST_LOGOUT_REDIRECT_URL=
KINDE_POST_LOGIN_REDIRECT_REDIRECT_URL=
```

Then:

1. Enable role-based auth in Kinde
2. Create roles in the dashboard
3. Assign roles (like `admin`) to users

---

## 🗄 Database Setup

Use **Neon** PostgreSQL:

```env
DATABASE_URL=
```

---

## 🔎 Vector Search Setup

Configure Qdrant:

```env
QDRANT_URL=
QDRANT_API_KEY=
```

---

## ⚙️ How It Works (RAG Architecture)

1. User asks a question
2. LLM generates an initial reasoning request
3. Qdrant retrieves relevant semantic chunks
4. LLM produces a final, context-enhanced answer

This boosts accuracy and prevents hallucinations.

---

## 🎥 Video Documentation

### **How to Upload Documents (Beginner-Friendly Tutorial)**

New to the platform? This video walks you through uploading documents step-by-step:

👉 **[https://www.youtube.com/watch?v=9mDKAfSvE3U](https://www.youtube.com/watch?v=9mDKAfSvE3U)**

---

# Happy Hacking 👨🏽‍💻
