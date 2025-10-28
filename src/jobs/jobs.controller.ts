import { Body, Controller, Get, Param, Patch, Post, Put, Req, Res } from '@nestjs/common';
import type { Response,Request } from 'express';
import { JobsService } from './jobs.service';


interface RequestWithUser extends Request{
    user?: any
}
@Controller('jobs')
export class JobsController {
    constructor(private readonly jobService:JobsService){}
    // Controller methods will be implemented here

    @Post('create')
    async createJob(@Res({passthrough:true}) res:Response , @Body() body:any, @Req() req:RequestWithUser){
        const userId = req.user.id
        if(!userId){
            return res.status(401).json({message:"Unable to authenticate user"})
        }
       const {title, description} = body
        try{
            const newJob = await this.jobService.createJob(title,description,userId)
            res.status(201).json({message:"Job created successfully", job:newJob})
        }catch(error){
            return res.status(500).json({message:"Failed to create job", error:error.message})
        }


    }

    @Patch('update/:id')
    async updateJob(@Res({passthrough:true}) res:Response,@Body() body:any, @Req() req:RequestWithUser,@Param('id') id:string){
        const userId = req.user.id
        const {title,description} = body
        if(!userId){
            return res.status(401).json({message:"Unable to authenticate user"})
        }
        const paramId = parseInt(id)
        if(isNaN(paramId)){
            return res.status(400).json({message:"Invalid Job ID"})
        }
        const updatedJob = await this.jobService.updateJob(paramId,title,description)
        res.status(200).json({message:"Job updated successfully",job:updatedJob})
    }
    @Get(':id')
    async getJobById(@Param('id') id:string , @Res({passthrough:true}) res:Response){
        const jobId = parseInt(id)
        if(isNaN(jobId)){
            return res.status(400).json({message:"Invalid Job ID"})
        }
        const job = await this.jobService.getJobById(jobId)
        res.status(200).json({job})
    }
}
