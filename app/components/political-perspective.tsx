import React, { FC } from "react";

interface PartyCardProps {
  title: string;
  subtitle: string;
  content?: string;
  loading?: boolean;
  color: "blue" | "red";
}

const PoliticalPerspective: FC<PartyCardProps> = ({ title, subtitle, content, loading, color }) => {
  const colors = {
    blue: {
      border: "border-blue-600",
      bg: "bg-blue-50",
      text: "text-blue-800",
      borderSecondary: "border-blue-200",
      loadingText: "text-blue-600",
    },
    red: {
      border: "border-red-600",
      bg: "bg-red-50",
      text: "text-red-800",
      borderSecondary: "border-red-200",
      loadingText: "text-red-600",
    },
  };

  const c = colors[color];

  return (
    <div className="w-full md:w-[30%] flex flex-col">
      <div className={`border-b-2 ${c.border} pb-2 mb-4`}>
        <h2 className={`text-xl font-bold uppercase tracking-wider ${c.border}`}>{title}</h2>
        <p className={`text-xs ${c.border} opacity-75`}>{subtitle}</p>
      </div>
      <div className={`flex-1 ${c.bg} p-5 rounded-lg shadow-md overflow-y-auto h-64 md:h-96 border-2 ${c.borderSecondary} relative`}>
        {loading && (
          <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center" style={{ backgroundColor: c.bg }}>
            <div className={`animate-pulse ${c.loadingText}`}>Loading...</div>
          </div>
        )}
        <p className={`whitespace-pre-line ${c.text} leading-relaxed`}>
          {content || `The ${title} perspective will appear here...`}
        </p>
      </div>
    </div>
  );
};

export default PoliticalPerspective;
