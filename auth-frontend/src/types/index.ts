export type LoginResponse = {
    message:string
    token:string
}

export type RegisterResponse = {
    id:number
    name:string
    email:string
    role:string
}

export type Role = 'admin' | 'user'

export type User = {
    id:number
    email:string
    role:Role
}


