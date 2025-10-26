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
  const colorClass = color === "blue" ? "blue-600" : "red-600";
  
  return (
    <Card className="md:w-1/2 w-full">
      <CardHeader className="border-b border-gray-200 p-4">
        <CardTitle className={`text-${colorClass} text-lg font-semibold font-poppins`}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="text-sm text-gray-900 whitespace-pre-line min-h-[100px] font-poppins relative">
        <h2 className="font-semibold font-poppins mt-2">Party Stance:</h2>
        {partyStance && (
          <ul className="list-disc pl-4 space-y-2">
            {partyStance.map((stance, index) => (
              <li key={index} className="text-sm text-gray-900 font-poppins">
                {stance}
              </li>
            ))}
          </ul>
        )}
        <h2 className="font-semibold font-poppins mt-10">Supporting Details:</h2>
        {supportingDetails && (
          <ul className="list-disc pl-4 space-y-2">
            {supportingDetails.map((detail, index) => (
              <li key={index} className="text-sm text-gray-900 font-poppins">
                {detail}
              </li>
            ))}
          </ul>
        )}
        </div>
      </CardContent>
      
      {/* This is a citation section */}
      <CardContent className="p-4">
        <p className="text-sm text-black font-poppins mb-2">Citations:</p>
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