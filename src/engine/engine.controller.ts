import { Controller, Get, Req } from '@nestjs/common';
import { EngineService } from './engine.service';

@Controller('engine')
export class EngineController {
    constructor(private readonly engineService:EngineService){}
    @Get('')
    async startEngine(@Req() req:any){
        const user = req.user.id
        if(!user){
            return {message:"Unable to authenticate user"}
        }
        
        return this.engineService.startEngine(user)
        
    }
}
