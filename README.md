<div align="center">
  <img src="/public/logo/nextvoters.png" width="20%" alt="nextvoters" />
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

Next Vote is an innovative educational platform that LEVERAGES artificial intelligence to help young citizens understand policy, legislation, and political platforms. In an era where 87% of people believe online disinformation has harmed their country's politics, Next Vote provides a trusted, fact-based approach to civic education.

## ✨ Key Features

### 🔍 **Intelligent Policy Analysis**
- AI-powered analysis of official political party platforms
- Real-time document processing using Cohere AI platform
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

- **Framework**: [Next.js 14+](https://nextjs.org/) - Modern React and NodeJS fullstack framework
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/docs) - Streaming AI responses
- **AI Model**: [gpt-4o-mini](https://docs.openai.com/) - Advanced document analysis at an economical cost
- **Embedding Model**: [text-embedding-3-small](https://docs.openai.com/) - Proper vector embedding generation
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Responsive design system
- **UI Components**: [Shadcn](https://www.shadcn.com/) - Accessible component library
- **Database**: [Neon with Vercel Storage](https://neon.tech/) - Serverless PostgreSQL
- **Vector Search**: [Qdrant](https://qdrant.tech/) - Semantic document search
- **Deployment**: [Vercel](https://vercel.com/) - Seamless deployment and hosting

## 🚀 Quick Start

### Prerequisites
- NextJS LTS (14+)
- Set up pnpm by installing it from https://pnpm.io/installation
- get all creditionals specified in .env.example file

### Get FREE OpenAI Key
OpenAI itself does not offer a free tier for thier services, making it harder for developers to access the service, so we will use a reverse proxy which is an external API that offers the exact services as the OpenAI API. It is called **Pawan.krd** and you have to follow these exact steps to attain it:

- Go to https://pawan.krd/ and join the Discord server through invite link
- Go to Bots channel within the server, and type in the command /key
- You will now have a key which you will need to add to your .env file
- Add the following environment variables to your .env file:

```env
OPENAI_API_BASE_URL="https://models.github.ai/inference"
OPENAI_API_KEY=
```

### Set up authentication 
To make authentication work, you need to use kinde. Follow the steps below:

- Go to kinde.com and create an account

- Add the following environment variables to your .env file. Kinde should give them to you automatically:

```env
KINDE_CLIENT_ID=
KINDE_CLIENT_SECRET=
KINDE_ISSUER_URL=
KINDE_SITE_URL=
KINDE_POST_LOGOUT_REDIRECT_URL=
KINDE_POST_LOGIN_REDIRECT_URL=
```

- Our app uses role-based authentication where different roles (like admin) have different permissions. For it to properly work on our app, we need to enable roles to be returned as a claim in the JWT token. Follow this guide to accomplish it: https://docs.kinde.com/manage-users/roles-and-permissions/user-roles/

- If you wish to make a logged in user an admin, you first need to create a role. To do so, go to the Kinde dashboard and navigate to "Settings." Afterwards, scroll a bit down until you see the "Roles" section. Click on "Add Role" and add a **role key** called "admin". What you add to description or name is negligible because the app does not check for it. 

- To make a user an admin, go to the "Users" section in the Kinde dashboard and find the user you want to make an admin. Click on the user and scroll down until you see the "Roles" section. Then toggle the "admin" role on (it will show the name you have put for said role, **not the key**).

### Set up database
We use a Postgres database to store analytics information. To set it up, you can create a Neon database through Vercel Storage. Go to the Vercel dashboard and navigate to "Storage." Click on "Create Storage" and select "Neon." Follow the prompts to create a new database. Add the following environment variables to your .env file:

```env
DATABASE_URL=
```

### Add index key to vector database:
To search through the embeddings, you must add an index key to your vector database for all fields that will be used as a search operation. You can use curl to do this through the terminal environment.

Make 3 seperate requests to add index keys for the following fields of **politicalAffiliation**, **region**, and **collectionName**:

```bash
curl -X POST "https://<your-cluster-name>.qdrant.io/v1/collections/<your-collection-name>/index" \
  -H "Authorization: Bearer <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "field_name": "politicalAffiliation",
    "field_schema": "keyword"
  }'

curl -X POST "https://<your-cluster-name>.qdrant.io/v1/collections/<your-collection-name>/index" \
  -H "Authorization: Bearer <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "field_name": "region",
    "field_schema": "keyword"
  }'

curl -X POST "https://<your-cluster-name>.qdrant.io/v1/collections/<your-collection-name>/index" \
  -H "Authorization: Bearer <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "field_name": "collectionName",
    "field_schema": "keyword"
  }'
```

### Set up vector search
We use Qdrant to store and search through documents. To set it up, you can create a Qdrant database through Vercel Storage. Go to the Vercel dashboard and navigate to "Storage." Click on "Create Storage" and select "Qdrant." Follow the prompts to create a new database. You will get a JWT token which you will only be able to see for one time. **Ensure you have copied it and add that to your QDRANT_API_KEY env variable**. Add the following environment variables to your .env file:

```env
QDRANT_URL=
QDRANT_API_KEY=
```

### How it works ⚙️

We use a technology called RAG or Retrieval Augemented Generation. This means that we use an LLM model (in our case gpt-4o-mini) to generate responses to user queries. However, we increase the quality of these responses by feeding the LLM with extra context which comes through vector search. This extra context is documents that are most similar to the user query which are determined through their meaning, not the actual wording, leading to more accuracy in finding correct context. 

## Video Guide 🎥

ADD YOUTUBE LINKS

# Happy hacking 👨🏽‍💻
