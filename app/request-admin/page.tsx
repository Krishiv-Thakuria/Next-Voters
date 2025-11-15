import React, { useState } from 'react'

const page = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Submitting', email)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="bg-red-500 text-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Request Admin Access</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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