const API_ENDPOINT = "https://mnemosync.onrender.com";
const LOCAL_API_ENDPOINT = "http://localhost:8000";

console.log("Frontend mode:", process.env.NODE_ENV);

export default process.env.NODE_ENV === 'production' ? API_ENDPOINT : LOCAL_API_ENDPOINT;