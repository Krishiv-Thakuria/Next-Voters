import React, { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Citation } from "@/types/citations";

interface PartyCardProps {
  title: string;
  content?: string;
  loading?: boolean;
  color: "blue" | "red";
  citations: Citation[];
}

const PoliticalPerspective: FC<PartyCardProps> = ({ 
    title, 
    content, 
    loading, 
    color,
    citations
}) => {
  const colorClass = color === "blue" ? "blue-600" : "red-600";
  
  console.log(citations)

  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm w-full md:w-[30%]">
      <CardHeader className="border-b border-gray-200 p-4">
        <CardTitle className={`text-${colorClass} text-lg font-semibold font-poppins`}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="text-sm text-gray-900 whitespace-pre-line min-h-[100px] font-poppins relative">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className={`animate-pulse text-${colorClass}`}>Loading...</div>
            </div>
          )}
          {content || `The ${title} perspective will appear here...`}
        </div>
      </CardContent>
      
      {/* This is a citation section */}
      <CardContent className="p-4">
        <p className="text-sm text-black font-poppins mb-3">Citations:</p>
        <div className="whitespace-pre-line min-h-[100px] font-poppins relative space-y-2">
          {citations?.map((citation, index) => (
            <div key={index}>
              <p className="text-xs text-gray-500 font-poppins">Author: {citation.author}</p>
              <p className="text-xs text-gray-500 font-poppins">Document Name: {citation.document_name}</p>
              <a href={citation.url} target="_blank" className="text-xs text-gray-500 font-poppins underline">Access here</a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PoliticalPerspective;