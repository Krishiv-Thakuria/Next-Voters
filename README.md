<div align="center">
  <img src="/public/logo/nextvoters.png" width="20%" alt="NextVoters" />
</div>
<hr>
<div align="center" style="line-height: 1;">
  <a href="https://nextvoters.com"><img alt="Demo"
    src="https://img.shields.io/badge/🚀%20Live%20Demo-DailySAT-2F80ED?color=2F80ED&logoColor=white"/></a>
  <a href="LICENSE-CODE"><img alt="Code License"
    src="https://img.shields.io/badge/Code%20License-MIT%202.0-00BFFF?color=00BFFF"/></a>
  <br>
</div>

**Empowering the next generation of informed voters through AI-driven political education**

Next Voters is an innovative educational platform that leverages artificial intelligence to help young citizens understand policy, legislation, and political platforms. In an era where 87% of people believe online disinformation has harmed their country's politics, Next Voters provides a trusted, fact-based approach to civic education.

## 🎯 Mission

To combat political misinformation and empower Gen Z with the tools they need to make informed voting decisions based on facts, not social media algorithms.

## ✨ Key Features

### 🔍 **Intelligent Policy Analysis**
- AI-powered analysis of official political party platforms
- Real-time document processing using Claude AI
- Side-by-side comparison of party positions on key issues
- Streaming responses for immediate insights

### 📄 **Document Deep Dive**
- Interactive analysis of legislative documents and bills
- Ask questions about specific provisions or implications
- Navigate complex political documents with AI assistance
- Citation-backed responses for verification

### 🌍 **Multi-Jurisdictional Support**
- Canadian federal and provincial politics
- US political analysis capabilities
- Region-specific election information
- Scalable to additional countries and jurisdictions

### 🎓 **Educational Focus**
- Designed specifically for young voters and students
- Fellowship program with $10,000+ in grants for civic engagement
- Combat misinformation through factual, source-based information
- Encourage informed civic participation

## 🛠 Technology Stack

- **Framework**: [Next.js 13+](https://nextjs.org/) - Modern React framework
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/docs) - Streaming AI responses
- **AI Model**: [Anthropic Claude](https://docs.anthropic.com/) - Advanced document analysis
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Responsive design system
- **UI Components**: [Radix UI](https://www.radix-ui.com/) - Accessible component library
- **Database**: [Neon](https://neon.tech/) - Serverless PostgreSQL
- **Vector Search**: [Qdrant](https://qdrant.tech/) - Semantic document search
- **Deployment**: [Vercel](https://vercel.com/) - Seamless deployment and hosting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm package manager
- Anthropic API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Next-Voters.git
   cd Next-Voters
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   DATABASE_URL=your_database_url
   QDRANT_URL=your_qdrant_instance_url
   QDRANT_API_KEY=your_qdrant_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Document Sources

The platform analyzes official political documents including:

### 🇨🇦 Canadian Politics
- **Conservative Party**: [2023 Platform Document](https://cpcassets.conservative.ca/wp-content/uploads/2023/11/23175001/990863517f7a575.pdf)
- **Liberal Party**: [2025 Platform Document](https://liberal.ca/wp-content/uploads/sites/292/2025/04/Canada-Strong.pdf)
- Provincial party platforms and legislative documents

### 🇺🇸 US Politics
- Democratic and Republican party platforms
- Congressional bills and legislation
- State-level political documents

## 🏗 Architecture

### AI-Powered Document Analysis
- **Claude AI Integration**: Leverages Anthropic's Claude for comprehensive PDF analysis
- **RAG Implementation**: Retrieval-Augmented Generation for accurate, source-backed responses
- **Vector Search**: Semantic search capabilities for finding relevant document sections
- **Streaming Interface**: Real-time response streaming for better user experience

### User Experience Features
- **Responsive Design**: Mobile-first approach for Gen Z users
- **Interactive Chat**: Conversational interface for asking policy questions
- **Document Navigation**: Easy switching between different political documents
- **Citation System**: Transparent sourcing for all AI-generated responses

## Learn More

- [Anthropic Claude API Documentation](https://docs.anthropic.com/)
- [Claude's PDF Support Documentation](https://docs.anthropic.com/claude/docs/pdf-support)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
