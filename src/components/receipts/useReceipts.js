import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createReceipt, deleteReceipts, getReceipts, updateReceipt } from "./receiptApi";
import { toast } from "react-toastify";

export const useReceipts = () => {
  return useQuery({
    queryKey: ["receipts"],
    queryFn: getReceipts,
  });
};

export const useCreateReceipt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReceipt,

    onSuccess: () => {
      toast.success("Data added successfully", { position: "top-center", theme: "light" });
      // Refetch receipt list automatically after success
      queryClient.invalidateQueries(["receipts"]);
    },

    onError: (error) => {
      const message = error?.response?.data || error?.message || "Something went wrong";
      toast.error(message, { position: "top-right", theme: "dark" });
    },
  });
};




export const useUpdateReceipt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReceipt,

    onSuccess: () => {
      toast.success("Data updated successfully", { position: "top-center", theme: "light" });
      // Refresh receipts automatically
      queryClient.invalidateQueries(["receipts"]);
    },

    onError: (error) => {
      const message = error?.response?.data || error?.message || "Something went wrong";
      toast.error(message, { position: "top-right", theme: "dark" });
    },
  });
};



export const useDeleteReceipt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReceipts,

    onSuccess: () => {
      toast.success("Data deleted successfully", { position: "top-center", theme: "light" });
      queryClient.invalidateQueries(["receipts"]); // Refresh list
    },

    onError: (error) => {
      const message = error?.response?.data || error?.message || "Something went wrong";
      toast.error(message, { position: "top-right", theme: "dark" });
    },
  });
};

