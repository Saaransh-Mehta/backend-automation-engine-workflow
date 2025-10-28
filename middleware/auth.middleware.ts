import { Injectable,NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request,Response } from "express";
import jwt from 'jsonwebtoken'


interface AuthenticatedRequest extends Request{
    user?: any 
}

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const token = req.cookies['auth_token']
        if(!token){
            throw new Error("Unauthorized: No token Provided")
        }

        try{
            const decoded = jwt.verify(token,process.env.JWT_KEY as string)
            req.user = decoded
            next()

        }catch(error){
            throw new Error("Invalid Token generated ")
        }
        
    }
}
