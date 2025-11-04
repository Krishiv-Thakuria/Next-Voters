<div align="center">
  <img src="/public/logo/nextvoters.png" width="20%" alt="nextvoters" />
</div>
<hr>
<div align="center" style="line-height: 1;">
  <a href="https://nextvoters.com"><img alt="Demo"
    src="https://img.shields.io/badge/🚀%20Live%20Demo-DailySAT-2F80ED?color=2F80ED&logoColor=white"/></a>
  <a href="LICENSE-CODE"><img alt="Code License"
    src="https://img.shields.io/badge/Code%20License-MIT%202.0-00BFFF?color=00BFFF"/></a>
  <a href="https://web.goodnotes.com/s/F1IvZmoXF9UeAWsxmgriNK"><img alt="Political Concept Classifer Resource"
    src="https://img.shields.io/badge/📘%20Engineering%20Resource-GoodNotes-0A84FF?color=0A84FF"/></a>
  <br>
</div>

**Empowering the next generation of informed voters through AI-driven political education**

Next Vote is an AI-powered educational platform designed to help young citizens understand policy, legislation, and political platforms. In an era where 87% of people believe online disinformation has harmed politics, Next Vote provides a trusted, fact-based approach to civic education.

---

## ✨ Key Features

### 🔍 **Intelligent Policy Analysis**

* AI-driven analysis of official party platforms
* Real-time processing of political documents using Cohere AI
* Side-by-side comparison of party positions on key issues
* Streaming responses for immediate insights

### 📄 **Document Deep Dive**

* Interactive analysis of legislative documents and bills
* Query specific provisions or implications
* Navigate complex political documents with AI assistance
* Citation-backed responses for verification

### 🌍 **Multi-Jurisdictional Support**

* Canadian and US federal and provincial politics
* US political analysis capabilities
* Region-specific election information
* Easily extendable to additional countries

### 🎓 **Educational Focus**

* Tailored for students and young voters
* Fellowship program with $10,000+ grants for civic engagement
* Combat misinformation with factual, sourced information
* Promote informed civic participation

---

## 🛠 Technology Stack

* **Framework**: [Next.js 14+](https://nextjs.org/)
* **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/docs)
* **LLM Model**: [gpt-4o-mini](https://docs.openai.com/)
* **Embedding Model**: [text-embedding-3-small](https://docs.openai.com/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **UI Components**: [Shadcn](https://www.shadcn.com/)
* **Database**: [Neon with Vercel Storage](https://neon.tech/)
* **Vector Search**: [Qdrant](https://qdrant.tech/)
* **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Quick Start

### Prerequisites

* Next.js 14+
* pnpm: [Installation](https://pnpm.io/installation)
* Environment variables as specified in `.env.example`

### OpenAI Key Setup

Since OpenAI doesn’t offer a free tier, we use a reverse proxy API that mimics OpenAI endpoints:

```env
OPENAI_API_BASE_URL="https://models.github.ai/inference"
OPENAI_API_KEY=
```

Generate your personal access token from [GitHub Models Marketplace](https://github.com/marketplace?type=models).

---

### Authentication with Kinde

* Create a Kinde account
* Add environment variables for authentication:

```env
KINDE_CLIENT_ID=
KINDE_CLIENT_SECRET=
KINDE_ISSUER_URL=
KINDE_SITE_URL=
KINDE_POST_LOGOUT_REDIRECT_URL=
KINDE_POST_LOGIN_REDIRECT_REDIRECT_URL=
```

* Enable **role-based authentication** and create roles in the Kinde dashboard
* Assign roles (like admin) to users through the Kinde dashboard

---

### Database Setup

* Use Neon with Vercel Storage for PostgreSQL
* Add `DATABASE_URL=` to `.env`

---

### Vector Search Setup

* Use Qdrant for semantic document search
* Add `QDRANT_URL=` and `QDRANT_API_KEY=` to `.env`

---

### How It Works ⚙️

Next Vote uses **Retrieval-Augmented Generation (RAG)**:

1. LLM generates responses to user queries
2. Responses are enhanced with context from vector search
3. Vector search retrieves the most semantically similar documents, improving accuracy

---

# Happy Hacking 👨🏽‍💻
