import type { LoginResponse, RegisterResponse } from "../types";
import api from "./axios";


export async function login(email:string,password:string):Promise<LoginResponse>{
    const {data} = await api.post<LoginResponse>('/auth/login',{email,password})
    return data
}

export async function register(name:string,email:string,password:string):Promise<RegisterResponse>{
        const {data} = await api.post<RegisterResponse>('/auth/register',{name,email,password})
        return data
}