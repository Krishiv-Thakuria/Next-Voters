"use client"

import { Analytics as AnalyticsType } from '@/types/analytics'
import React, { useEffect, useState } from 'react'

const Analytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleGetAnalytics = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/analytics");
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        alert(error)
      } finally {
        setIsLoading(false);
      }
    };

    handleGetAnalytics();
  }, []);

  if (isLoading) return <p className="text-gray-500">Loading...</p>;
  if (!analytics) return <p className="text-gray-500">No analytics data</p>;

  return (
    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-6">
      <div className="p-6 bg-white shadow rounded-2xl text-center">
        <h2 className="text-lg font-semibold text-gray-700">Requests</h2>
        <p className="text-3xl font-bold text-blue-600">{analytics.requestCount}</p>
      </div>
      <div className="p-6 bg-white shadow rounded-2xl text-center">
        <h2 className="text-lg font-semibold text-gray-700">Responses</h2>
        <p className="text-3xl font-bold text-green-600">{analytics.responseCount}</p>
      </div>
    </div>
  );
};

export default Analytics;
