import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_DEVELOPMENT,
  withCredentials: true,
  timeout: 600000, // ✅ 10 minutes
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const importFathersCamel = async (camels) => {
  console.log('Sending chunk to backend:', camels.length, 'camels');
  try {
    const { data } = await api.post("/api/camels/importFathersCamel", {
      camel: camels,
    });
    console.log('Received response:', data);
    return data;
  } catch (error) {
    if (error.response) {
      console.error('API error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response from backend:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};


export const getFathersCamels = async () => {
  const { data } = await api.get("/api/camels/getFathersCamels");
  return data;
};
