import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const prisma = new PrismaClient()

@Injectable()
export class AuthService {
    async registerUser(username:string,email:string,password:string) {
        //Registration logic here 
        const exisitngUser = await prisma.user.findUnique({
            where:{email}
        })
        if(exisitngUser){
            throw new Error('User already exists')
        }

        const hashedPassword = await bcryptjs.hash(password,10)

        const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailregex.test(email) ){
            throw new Error('Invalid email format')
        }

        const newUser = await prisma.user.create({
            data:{
                username,
                email,
                password:hashedPassword
            }
        })
        return newUser
    }

    async loginUser(email:string,password:string){
        const user = await prisma.user.findUnique({
            where:{email}
        })
        if(!user){
            throw new Error("No user found with this email")
        }
        const isPasswordValid = await bcryptjs.compare(password,user.password)
        if(!isPasswordValid){
            throw new Error("Invalid Password")
        }

        const token = jwt.sign({email:user.email,id:user.id},process.env.JWT_KEY as string,{expiresIn:'1h'})

        return {message:"Login successfull",token,user}
    }

    async getUser(id:number){
        
        const user = await prisma.user.findUnique({
            where:{id}
        })
        if(!user){
            throw new Error("User not found")
        }
        return user
    }
}
