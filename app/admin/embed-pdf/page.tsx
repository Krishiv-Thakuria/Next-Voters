"use client";

import React, { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import AdminAuth from "@/wrappers/AdminAuth";
import supportedRegions from "@/data/supported-regions";
import { embedPdfAction } from "@/server-actions/embed";
import { StatusMessage } from "@/components/status-message";
import ReusableSelect from "@/components/reusable-select";

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

  const handleSelectChange = (value: string, valueType: string) => {
    setForm((prev) => ({
      ...prev,
      [valueType]: value,
    }));
  }

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
            {["documentLink", "author", "documentName", "collectionName", "region", "politicalAffiliation"].map((fieldName) => (
              fieldName !== "region" && (
                <input
                  key={fieldName}
                  name={fieldName}
                  type={fieldName === "documentLink" ? "url" : "text"}
                  placeholder={fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  value={form[fieldName]}
                  onChange={handleChange}
                  required
                />
              )
            ))}

            <div className="flex space-x-2">
              <ReusableSelect
                value={form.region}
                onValueChange={(value) => handleSelectChange(value, "region")}
                placeholder="Region"
                items={supportedRegions?.map(region => region.name)}
              />

              <ReusableSelect
                value={form.politicalAffiliation}
                disabled={!form.region}
                onValueChange={(value) => handleSelectChange(value, "politicalAffiliation")}
                placeholder="Political Party"
                items={politicalParties}
              />  
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg py-2"
            >
              {mutation.isPending ? <Spinner size="sm" className="text-white" /> : "Add Embeddings"}
            </Button>
          </form>

          <StatusMessage status={status} />
        </CardContent>
      </Card>
    </AdminAuth>
  );
};

export default EmbedPdfForm;