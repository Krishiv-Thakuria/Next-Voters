"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const requestToken = async (email: string) => {
  const response = await fetch("/api/admin/request-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to send token.");
  return data;
};

const AdminTokenPage = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (email: string) => requestToken(email),
    onSuccess: () => {
      setEmail("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(email);
    router.push("/admin/embed-pdf");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md bg-white shadow-md border border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-6 space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Mail className="w-6 h-6 text-slate-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Request Token</h2>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your admin email"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg py-2"
              >
                {mutation.isPending ? <Spinner size="sm" className="text-white" /> : "Send Token"}
              </Button>
            </form>

            {mutation.isSuccess && (
              <div className="mt-4 flex items-center space-x-2 text-sm px-3 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>{mutation.data.message || "Token sent to your email."}</span>
              </div>
            )}

            {mutation.isError && (
              <div className="mt-4 flex items-center space-x-2 text-sm px-3 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200">
                <AlertCircle className="w-4 h-4" />
                <span>{(mutation.error as Error).message}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTokenPage;
