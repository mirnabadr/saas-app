import Vapi from "@vapi-ai/web";
const apiKey = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;

if (!apiKey || apiKey.trim() === '') {
  console.error('VAPI API key is not set. Please set NEXT_PUBLIC_VAPI_API_KEY in your environment variables.');
  console.error('Create a .env.local file in the root directory and add: NEXT_PUBLIC_VAPI_API_KEY=your_api_key_here');
}

// Initialize VAPI with the API key (or empty string if missing - will fail gracefully at runtime)
export const vapi = new Vapi(apiKey || '');

// Export a function to check if API key is valid
export const isVapiConfigured = (): boolean => {
  return !!(apiKey && apiKey.trim() !== '');
};