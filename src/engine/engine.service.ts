import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { addJobsTOQueue } from './jobQueue';

const prisma = new PrismaClient()

@Injectable()
export class EngineService {
    async startEngine(userId:number){
       const jobs = await prisma.job.findMany({
        where:{userId,status:"pending"},
        take:10
       })  
    
    addJobsTOQueue(jobs)
    
    return {message:"Engine started and jobs are being processed"}
    }

}
