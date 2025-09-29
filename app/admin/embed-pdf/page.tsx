"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2, AlertCircle } from "lucide-react";

const embedPdf = async ({
  documentLink,
  author,
  documentName,
  collectionName,
}: {
  documentLink: string;
  author: string;
  documentName: string;
  collectionName: string;
}) => {
  const response = await fetch("/api/embed-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ documentLink, author, documentName, collectionName }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to add embeddings.");
  return data;
};

const EmbedPdfForm = () => {
  const [documentLink, setDocumentLink] = useState("");
  const [author, setAuthor] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [status, setStatus] = useState<null | { type: "success" | "error"; message: string }>(null);

  const mutation = useMutation({
    mutationFn: () => embedPdf({ documentLink, author, documentName, collectionName }),
    onMutate: () => setStatus(null),
    onSuccess: (data) => {
      setStatus({ type: "success", message: data.message || "Embeddings added successfully!" });
      setDocumentLink("");
      setAuthor("");
      setDocumentName("");
      setCollectionName("");
    },
    onError: (error: any) => {
      setStatus({ type: "error", message: error.message || "Unexpected error occurred." });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white shadow-md border border-slate-200">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Embed PDF</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="url"
              placeholder="Document Link"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={documentLink}
              onChange={(e) => setDocumentLink(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Author"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Document Name"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Collection Name"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              required
            />

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg py-2"
            >
              {mutation.isPending ? <Spinner size="sm" className="text-white" /> : "Add Embeddings"}
            </Button>
          </form>

          {status && (
            <div
              className={`mt-4 flex items-center space-x-2 text-sm px-3 py-2 rounded-lg ${
                status.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {status.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{status.message}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmbedPdfForm;
