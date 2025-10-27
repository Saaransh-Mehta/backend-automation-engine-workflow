import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}
    @Post('register')
    async registerUser(@Body() body:any, @Res({passthrough:true}) res:Response){
        const {username,email,password} = body
        const newUser = await this.authService.registerUser(username,email,password)

        res.status(200).json({message:"User register successfully ",user:newUser})
    }

    @Post('login')
    async loginUser(@Body() body:any,@Res({passthrough:true}) res:Response){
        const {email,password} = body
        const tokenData = await this.authService.loginUser(email,password)
        res.cookie('auth_token',tokenData.token,{
            httpOnly:true,
            maxAge:3600000
        })
        res.status(200).json(tokenData)

    }
    @Get('user/:id')
    async getUserById(id:number,@Res({passthrough:true}) res:Response,@Param('id') paramId:number){
        
        const user = await this.authService.getUser(Number(paramId))
        return user


    }

    @Post('logout')
    async logoutUser(@Res({passthrough:true}) res:Response){
        res.clearCookie('auth_token')
        res.status(200).json({message:"Logout successful"})
    }
}
