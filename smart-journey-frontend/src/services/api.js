import axios from "axios";

const backendBaseUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export async function planJourney(payload) {
  const res = await axios.post(`${backendBaseUrl}/api/route`, payload);
  return res.data;
}
