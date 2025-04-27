export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">API Endpoint Not Found</h2>
      <p className="mb-6 text-gray-600 max-w-md">
        The API endpoint you are looking for does not exist. Please use one of the available endpoints.
      </p>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <a
          href="/api"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          API Documentation
        </a>
        <a
          href="/api/conservative"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Conservative API
        </a>
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