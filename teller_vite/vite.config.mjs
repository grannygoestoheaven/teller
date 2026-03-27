export default {
    server: {
      proxy: {
        '/api': 'http://localhost:8000' // Forward `/api` requests to FastAPI
      }
    }
  };