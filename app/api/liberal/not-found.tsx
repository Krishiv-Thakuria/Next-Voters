export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Liberal API Endpoint Not Found</h2>
      <p className="mb-6 text-gray-600 max-w-md">
        The specific Liberal API endpoint you are looking for does not exist. Please use the correct endpoint.
      </p>
      <div className="flex space-x-4">
        <a
          href="/api/liberal"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Liberal API
        </a>
        <a
          href="/"
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Return Home
        </a>
      </div>
    </div>
  );
} 