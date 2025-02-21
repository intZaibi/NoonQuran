/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',  // This will proxy all requests made to /api
        // destination: 'http://localhost:3000/api/:path*', // Target your backend server here
        headers: [
          {key: 'Access-Control-Allow-Origin', value: '*'}, // Allows all origins (can be more specific)
          {key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE'}, // Allowed methods
          {key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization'}, // Allowed headers

        ],
      },
    ]
  }
};

export default nextConfig;
