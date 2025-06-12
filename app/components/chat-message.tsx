import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const testMarkdown = "**Hello** *world* `code` ---";

  return (
    <div className={`message ${message.role}`}>
      <p style={{ border: '1px dashed blue', padding: '5px', margin: '5px 0' }}>
        <strong>Test Markdown Render (should be formatted):</strong><br />
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {testMarkdown}
        </ReactMarkdown>
      </p>
      <hr />
      <p style={{ border: '1px dashed green', padding: '5px', margin: '5px 0' }}>
        <strong>Actual Message Render (attempting formatting):</strong><br />
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content}
        </ReactMarkdown>
      </p>
      <hr />
      <details style={{ margin: '5px 0', padding: '5px', border: '1px solid #ccc' }}>
        <summary>Raw Message Content (for debugging)</summary>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', backgroundColor: '#f0f0f0', padding: '10px' }}>
          {message.content}
        </pre>
      </details>
    </div>
  );
}
