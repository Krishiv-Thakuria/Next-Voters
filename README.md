# Canadian Political Perspectives - Powered by Claude AI

This application compares Canadian political party platforms using Anthropic's Claude AI to analyze official PDF documents. It provides side-by-side perspectives from Conservative and Liberal parties on various political issues.

## Key Features

- Real-time analysis of official political party platforms
- PDF document analysis using Claude 3.7 Sonnet
- Side-by-side comparison of Conservative and Liberal perspectives
- Streaming responses for faster user experience

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [Vercel AI SDK](https://sdk.vercel.ai/docs) - For AI streaming
- [Anthropic Claude API](https://docs.anthropic.com/) - AI model for document analysis
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## How to Run Locally

1. Clone this repository
2. Install dependencies: `npm install` or `pnpm install`
3. Create a `.env.local` file with your Anthropic API key:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```
4. Run the development server: `npm run dev` or `pnpm dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## PDF Documents

The application analyzes the following official party platforms:

- Conservative Party: [2023 Platform](https://cpcassets.conservative.ca/wp-content/uploads/2023/11/23175001/990863517f7a575.pdf)
- Liberal Party: [2025 Platform](https://liberal.ca/wp-content/uploads/sites/292/2025/04/Canada-Strong.pdf)

## Implementation Details

This application uses Claude's PDF analysis capabilities to process political documents. Claude can analyze the structure, text, and visual content of PDF files to provide comprehensive insights about political platforms.

## Learn More

- [Anthropic Claude API Documentation](https://docs.anthropic.com/)
- [Claude's PDF Support Documentation](https://docs.anthropic.com/claude/docs/pdf-support)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
