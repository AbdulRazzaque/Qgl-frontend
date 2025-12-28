import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFathersCamels, importFathersCamel } from "./camelApi";
import { toast } from "react-toastify";

export const useImportFatherCamel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importFathersCamel,

    onSuccess: () => {
      toast.success("Data added successfully", { position: "top-center" });
      queryClient.invalidateQueries(["fatherCamel"]);
    },

    onError: (error) => {
      const message = error?.response?.data?.message || error?.message || "Something went wrong";
      toast.error(message, { position: "top-right" });
    },
  });
};


export const useGetFatherCamels = () => {
  return useQuery({
    queryKey: ["fatherCamel"],
    queryFn: getFathersCamels,
  });
};