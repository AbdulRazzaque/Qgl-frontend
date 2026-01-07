import { deleteGeneticRecord } from "./geneticApi";


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createGeneticRecord, getGeneticRecords, updateGeneticRecord } from "./geneticApi";
import { toast } from "react-toastify";



export const useCreateGeneticRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGeneticRecord,

    onSuccess: () => {
      toast.success("Data added successfully", { position: "top-center", theme: "light" });
      // Refetch receipt list automatically after success
      queryClient.invalidateQueries(["GeneticRecord"]);
    },

    onError: (error) => {
      const message = error?.response?.data || error?.message || "Something went wrong";
      toast.error(message, { position: "top-right", theme: "dark" });
    },
  });
};

export const useUpdateGeneticRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateGeneticRecord(id, payload),
    onSuccess: () => {
      toast.success("Record updated successfully", { position: "top-center", theme: "light" });
      queryClient.invalidateQueries(["GeneticRecord"]);
    },
    onError: (error) => {
      const message = error?.response?.data || error?.message || "Something went wrong";
      toast.error(message, { position: "top-right", theme: "dark" });
    },
  });
};



export const useGeneticRecord = () => {
  return useQuery({
    queryKey: ["GeneticRecord"],
    queryFn: getGeneticRecords,
  });
};


export const useDeleteGeneticRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteGeneticRecord(id),
    onSuccess: () => {
      toast.success("Record deleted successfully", { position: "top-center", theme: "light" });
      queryClient.invalidateQueries(["GeneticRecord"]);
    },
    onError: (error) => {
      const message = error?.response?.data || error?.message || "Something went wrong";
      toast.error(message, { position: "top-right", theme: "dark" });
    },
  });
};