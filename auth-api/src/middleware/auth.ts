import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;


  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.replace("Bearer ", "").trim()
  

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      email: string;
      role: string;
    };
   
    req.user = decoded;
    next();
  } catch (error) {
    
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function authorize(...roles:string[]){
    return(req:Request,res:Response,next:NextFunction) =>{
        if(!req.user){
            return res.status(401).json({message:'Not authenticated'})
        }

        if(!roles.includes(req.user.role)){
            return res.status(403).json({message:'Access denied'})
        }

        next()
    }
}