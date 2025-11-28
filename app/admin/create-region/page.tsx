"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { StatusMessage } from "@/components/status-message";
import ReusableSelect from "@/components/reusable-select";
import handleCreateRegion from "@/server-actions/create-region";
import supportedRegionDetails from "@/data/supported-regions";

const initialForm = {
  code: "",
  name: "",
  politicalParties: [],
  collectionName: "",
  type: "",
  parentRegionCode: "",
};

const CreateRegion = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<null | { type: "success" | "error"; message: string }>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (value: string, fieldName: string) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const [partyInput, setPartyInput] = useState("");

  const appendParty = (raw: string) => {
    const items = raw.split(",")
      .map(s => s.trim())
      .filter(Boolean);
    if (items.length === 0) return;
    setForm(prev => {
      const existing = prev.politicalParties || [];
      const toAdd = items.filter(i => !existing.includes(i));
      return {
        ...prev,
        politicalParties: [...existing, ...toAdd],
      };
    });
  };

  const handlePartyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (partyInput.trim()) {
        appendParty(partyInput.replace(/,$/, ""));
        setPartyInput("");
      }
    }
  };

  const handlePartyBlur = () => {
    if (partyInput.trim()) {
      appendParty(partyInput);
      setPartyInput("");
    }
  };

  const handlePartyRemove = (party: string) => {
    setForm(prev => ({
      ...prev,
      politicalParties: prev.politicalParties.filter(p => p !== party),
    }));
  }

  const mutation = useMutation({
    mutationFn: async () => {
      return await handleCreateRegion({
        code: form.code,
        name: form.name,
        politicalParties: form.politicalParties,
        collectionName: form.collectionName,
        type: form.type,
        parentRegionCode: form.parentRegionCode
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white shadow-md border border-slate-200">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Create Region</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              name="code"
              placeholder="Region Code (e.g., US, CA, US-CA)"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={form.code}
              onChange={handleChange}
              required
            />

            <input
              name="name"
              placeholder="Region Name (e.g., United States, Canada)"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={form.name}
              onChange={handleChange}
              required
            />

            <ReusableSelect
              value={form.type}
              onValueChange={(value) => handleSelectChange(value, "type")}
              placeholder="Region Type"
              items={["country", "sub-region"]}
            />

            {form.type === "sub-region" && (
              <ReusableSelect
                value={form.parentRegionCode}
                onValueChange={(value) => handleSelectChange(value, "parentRegionCode")}
                placeholder="Parent Region"
                items={supportedRegionDetails.filter(r => r.type === "country").map(r => r.code)}
              />
            )}

            <input
              name="collectionName"
              placeholder="Collection Name (e.g., collection-us)"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={form.collectionName}
              onChange={handleChange}
              required
            />

            <input
              name="politicalParties"
              placeholder="Political Parties (press Enter to add, comma to separate)"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={partyInput}
              onChange={(e) => setPartyInput(e.target.value)}
              onKeyDown={handlePartyKeyDown}
              onBlur={handlePartyBlur}
              required={form.politicalParties.length === 0 && partyInput.trim() === ""}
            />
            
            {form.politicalParties.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.politicalParties.map((p: string) => (
                  <span 
                    onClick={() => handlePartyRemove(p)} 
                    key={p} 
                    className="text-xs px-2 py-1 bg-slate-100 border border-slate-200 rounded-md cursor-pointer"
                  >
                    {p}
                  </span>
                ))}
              </div>
            )}

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg py-2"
            >
              {mutation.isPending ? <Spinner size="sm" className="text-white" /> : "Create Region"}
            </Button>
          </form>

          <StatusMessage status={status} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRegion;