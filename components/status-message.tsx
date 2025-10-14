import { CheckCircle2, AlertCircle } from 'lucide-react';

interface StatusMessageProps {
  status: {
    type: 'success' | 'error';
    message: string;
  } | null;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ status }) => {
  if (!status) return null;

  return (
    <div
      className={`mt-4 flex items-center space-x-2 text-sm px-3 py-2 rounded-lg ${
        status.type === "success"
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-red-50 text-red-700 border border-red-200"
      }`}
    >
      {status.type === "success" ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <AlertCircle className="w-4 h-4" />
      )}
      <span>{status.message}</span>
    </div>
  );
};
