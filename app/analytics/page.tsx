"use client"

import { Analytics as AnalyticsType } from '@/types/analytics'
import React from 'react'
import { useQuery } from '@tanstack/react-query';

const Analytics = () => {
  const { data, isLoading, error } = useQuery<AnalyticsType>({
        queryKey: ['analytics-data-fetch'],
        queryFn: async () => {
          const response = await fetch('/api/analytics');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = response.json()
          return data;
        },
  });

  if (isLoading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">Error in fetching analytics</p>

  return (
    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-6">
      <div className="p-6 bg-white shadow rounded-2xl text-center">
        <h2 className="text-lg font-semibold text-gray-700">Requests</h2>
        <p className="text-3xl font-bold text-blue-600">{data?.requestCount}</p>
      </div>
      <div className="p-6 bg-white shadow rounded-2xl text-center">
        <h2 className="text-lg font-semibold text-gray-700">Responses</h2>
        <p className="text-3xl font-bold text-green-600">{data?.responseCount}</p>
      </div>
    </div>
  );
};

export default Analytics;
