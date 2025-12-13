import { useQuery } from "@tanstack/react-query"
import { autocompleteMembers } from "./memebersApi"

export const useAutocompleteMembers =(query) =>{
    return useQuery({
        queryKey:['autocompleteMembers',query],
        queryFn:()=> autocompleteMembers(query),
        enabled:!!query,
    });
};