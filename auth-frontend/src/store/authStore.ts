import { create } from "zustand"
import type { User } from "../types"
import { jwtDecode } from "jwt-decode"

type AuthStore = {
    token:string | null
    user:User | null
    setAuth:(token:string)=>void
    logout:()=>void
}


export const useAuthStore = create<AuthStore>((set)=>({
    token: null,
    user:null,
    setAuth:(token) => {
        try {
            const decodedUser = jwtDecode<User>(token);
            localStorage.setItem('token',token)
            set({token,user:decodedUser})
        } catch (error) {
            console.log('invalid token');
        }
    },
    logout:()=> {
        localStorage.removeItem('token')
        set({token:null,user:null})
    },
}))