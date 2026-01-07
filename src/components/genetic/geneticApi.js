
import axios from "axios";


export const api = axios.create({
  baseURL: process.env.REACT_APP_DEVELOPMENT,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const handleApiError = (error) => {
  if (error.response) {
    console.error("API error:", error.response.status, error.response.data);
  } else if (error.request) {
    console.error("No response from backend:", error.request);
  } else {
    console.error("Request setup error:", error.message);
  }
  throw error;
};

export const createGeneticRecord = async (payload) => {
  try {
    const { data } = await api.post(
      "/api/genetic/createGeneticRecord",
      payload
    );
    return data;
  } catch (error) {
    handleApiError(error);
  }
};


export const updateGeneticRecord = async (id, payload) => {
  try {
    const { data } = await api.put(`/api/genetic/updateGeneticRecord/${id}`, payload);
    return data;
  } catch (error) {
    handleApiError(error);
  }
};
export const getGeneticRecords = async () => {
  try {
    const { data } = await api.get("/api/genetic/getGeneticRecords");
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteGeneticRecord = async (id) => {
  try {
    const { data } = await api.delete(`/api/genetic/deleteGeneticRecord/${id}`);
    return data;
  } catch (error) {
    handleApiError(error);
  }
};