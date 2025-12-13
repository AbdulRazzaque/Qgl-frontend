import axios from "axios";

export const api = axios.create({
    baseURL:process.env.REACT_APP_DEVELOPMENT,
    withCredentials:true,
    headers:{
    "Content-Type": "application/json",
    Accept: "application/json",
    },
});


export const getReceipts = async () => {
  const { data } = await api.get("/api/getReceipts");

  const receipts = Array.isArray(data) ? data : [];

  // Map for grid
  const arr = receipts.map((item, index) => ({
    ...item,
    id: index + 1,
  }));

  // Compute next document number
  const maxDoc = receipts.reduce((max, r) => {
    const n = parseInt(r?.doc, 10);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);

  return { receipts: arr, nextDocNo: maxDoc + 1 };
};



export const createReceipt = async (payload) => {
  const { data } = await api.post("/api/qgl", payload);
  return data;
};

export const updateReceipt = async ({ id, payload }) => {
  const { data } = await api.put(`/api/updatereceipt/${id}`, payload);
  return data;
};

// ✅ receiptApi.js
// export const deleteReceipt = async (id) => {
//   const response = await api.delete(`/deletereceipt/${id}`);
//   return response.data;
// };

// multiple row Delete 

export const deleteReceipts = async (ids) => {
  const response = await api.delete(`api/deletereceipts/${ids}`);
  return response.data;
};
