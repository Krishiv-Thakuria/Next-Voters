import React, { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Citation } from "@/types/citations";

interface PartyCardProps {
  title: string;
  partyStance?: string[];
  supportingDetails?: string[];
  color: "blue" | "red";
  citations: Citation[];
}

const PoliticalPerspective: FC<PartyCardProps> = ({ 
    title, 
    partyStance, 
    supportingDetails, 
    color,
    citations
}) => {

  const colorClasses = {
    blue: "text-blue-600",
    red: "text-red-500"
  };
  
  const colorClass = colorClasses[color] || "";

  return (
    <Card className="md:w-1/2 w-full">
      <CardHeader className="border-b border-gray-200 p-4">
        <CardTitle className={`${colorClass} text-lg font-semibold font-plus-jakarta-sans`}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="text-sm text-gray-900 whitespace-pre-line min-h-[100px] font-plus-jakarta-sans relative">
        <h2 className="font-semibold font-plus-jakarta-sans mt-2">Party Stance:</h2>
        {partyStance && (
          <ul className="list-disc pl-4 space-y-2">
            {partyStance.map((stance, index) => (
              <li key={index} className="text-sm text-gray-900 font-plus-jakarta-sans">
                {stance}
              </li>
            ))}
          </ul>
        )}
        <h2 className="font-semibold font-plus-jakarta-sans mt-10">Supporting Details:</h2>
        {supportingDetails && (
          <ul className="list-disc pl-4 space-y-2">
            {supportingDetails.map((detail, index) => (
              <li key={index} className="text-sm text-gray-900 font-plus-jakarta-sans">
                {detail}
              </li>
            ))}
          </ul>
        )}
        </div>
      </CardContent>
      
      {/* This is a citation section */}
      <CardContent className="p-4">
        <p className="text-sm text-black font-plus-jakarta-sans mb-2">Citations:</p>
        <div className="whitespace-pre-line min-h-[100px] font-plus-jakarta-sans relative space-y-2">
          {citations?.map((citation, index) => (
            <div key={index}>
              <p className="text-xs text-gray-500 font-plus-jakarta-sans">Author: {citation.author}</p>
              <p className="text-xs text-gray-500 font-plus-jakarta-sans">Document Name: {citation.document_name}</p>
              <a href={citation.url} target="_blank" className="text-xs text-gray-500 font-plus-jakarta-sans underline">Access here</a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PoliticalPerspective;