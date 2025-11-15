"use client"

import React from 'react'

const page = () => {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Submitting')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="bg-red-500 text-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Request Admin Access</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <button
            type="submit"
            className="bg-white text-red-500 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Request
          </button>
        </form>
      </div>
    </div>
  )
}

export default page