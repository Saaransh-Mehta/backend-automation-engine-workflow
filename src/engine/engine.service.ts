import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { addJobsTOQueue } from './jobQueue';

const prisma = new PrismaClient()

@Injectable()
export class EngineService {
    async startEngine(){
        const jobs = await prisma.job.findMany({
            where:{
                status:"pending"
        }
    })        
    // Calling the function to add jobs in queue
    addJobsTOQueue(jobs)
    return {message:"Engine started and jobs are being processed"}
    }
}
