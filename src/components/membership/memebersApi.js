import axios from "axios";

export const api = axios.create({
    baseURL:process.env.REACT_APP_DEVELOPMENT,
    withCredentials:true,
    headers:{
    "Content-Type": "application/json",
    Accept: "application/json",
    },
});


export const autocompleteMembers = async(query)=>{
    
    if(!query) return [];

    const response = await api.get(`/api/autocompleteMembers`,{
        params:{q:query},
    })

    return response.data
}