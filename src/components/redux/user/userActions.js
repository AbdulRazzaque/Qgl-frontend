export const setUser = (user)=>{
    return {
        type:"SET_USER",
        payload:user
    }
}
export const storeUserInfo = (info)=>{
    return {
        type:"STORE_USERINFO",
        payload:info
    }
}
export const deleteUser =()=>{
    return {
        type:"DELETE_USER"
    }
}