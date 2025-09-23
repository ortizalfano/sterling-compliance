// Debug file to check environment variables
export const debugEnv = () => {
  console.log('Environment Variables Debug:');
  console.log('VITE_AIRTABLE_API_KEY:', import.meta.env.VITE_AIRTABLE_API_KEY ? 'Present' : 'Missing');
  console.log('VITE_AIRTABLE_BASE_ID:', import.meta.env.VITE_AIRTABLE_BASE_ID ? 'Present' : 'Missing');
  console.log('VITE_GEMINI_API_KEY:', import.meta.env.VITE_GEMINI_API_KEY ? 'Present' : 'Missing');
  console.log('VITE_EMAILJS_SERVICE_ID:', import.meta.env.VITE_EMAILJS_SERVICE_ID ? 'Present' : 'Missing');
  console.log('VITE_APP_ENV:', import.meta.env.VITE_APP_ENV);
  console.log('All env vars:', import.meta.env);
};
