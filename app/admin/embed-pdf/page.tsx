"use client";

import React, { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import AdminAuth from "@/wrappers/AdminAuth";
import supportedRegions from "@/data/supported-regions";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { embedPdfAction } from "@/lib/embed-actions";

const initialForm = {
  documentLink: "",
  author: "",
  documentName: "",
  collectionName: "",
  region: "",
  politicalAffiliation: "",
};

const EmbedPdfForm = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<null | { type: "success" | "error"; message: string }>(null);

  const politicalParties = useMemo(() => {
    const found = supportedRegions.find((r) => r.name === form.region);
    return found?.politicalParties ?? [];
  }, [form.region]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const mutation = useMutation({
    mutationFn: async () => {
      console.log(form);
      return await embedPdfAction({
        documentLink: form.documentLink,
        author: form.author,
        documentName: form.documentName,
        collectionName: form.collectionName,
        region: form.region,
        politicalAffiliation: form.politicalAffiliation
      });
    },
    onMutate: () => setStatus(null),
    onSuccess: (data) => {
      if (data.success) {
        setStatus({ type: "success", message: data.message || "Embeddings added successfully!" });
        setForm(initialForm);
      } else {
        setStatus({ type: "error", message: data.error || "Failed to add embeddings." });
      }
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
    <AdminAuth className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white shadow-md border border-slate-200">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Embed PDF</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              name="documentLink"
              type="url"
              placeholder="Document Link"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={form.documentLink}
              onChange={handleChange}
              required
            />
            <input
              name="author"
              type="text"
              placeholder="Author"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={form.author}
              onChange={handleChange}
              required
            />
            <input
              name="documentName"
              type="text"
              placeholder="Document Name"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={form.documentName}
              onChange={handleChange}
              required
            />
            <input
              name="collectionName"
              type="text"
              placeholder="Collection Name"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={form.collectionName}
              onChange={handleChange}
              required
            />

            <div className="flex space-x-2">
              <Select
                value={form.region}
              >
                <SelectTrigger className="w-auto md:w-[150px] bg-white border border-gray-300 text-gray-900 text-xs md:text-sm p-2 h-9 md:h-10 font-poppins">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border border-gray-300 z-[50] cursor-pointer">
                  {supportedRegions?.map(region => (
                    <SelectItem 
                      key={region.code} 
                      value={region.name} 
                      onSelect={() => 
                        setForm((prev) => ({ ...prev, region: region.name }))
                      }
                      className="hover:bg-gray-100 focus:bg-gray-100 font-poppins"
                    >
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={form.politicalAffiliation || "Democratic Party"}
                disabled={!form.region}
              >
                <SelectTrigger className="w-auto md:w-[150px] bg-white border border-gray-300 text-gray-900 text-xs md:text-sm p-2 h-9 md:h-10 font-poppins">
                  <SelectValue placeholder="Political Party" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border border-gray-300 z-[50] cursor-pointer">
                  {politicalParties.map(party => (
                    <SelectItem 
                      key={party} 
                      value={party}
                      onSelect={() => 
                        setForm((prev) => ({ ...prev, politicalAffiliation: form.politicalAffiliation }))
                      } 
                      className="hover:bg-gray-100 focus:bg-gray-100 font-poppins"
                    >
                      {party}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
    </AdminAuth>
  );
};

export default EmbedPdfForm;