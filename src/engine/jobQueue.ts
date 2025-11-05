import {Queue} from 'bullmq'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


const jobQueue = new Queue('jobQueue',{
    connection:{port:6379,host:'localhost'}

})
const deadQueue = new Queue('deadLetterQueue',{
    connection:{port:6379,host:'localhost'}
})
export const addJobsTOQueue = async(jobs:any[])=>{

    for(const job of jobs){
        const res = await jobQueue.add('jobProcessor',job)
        console.log(`Added job with id ${res.id} to the queue`)
    }


    
}


export const deadLetterQueue = async(jobData:any)=>{
    const res = await deadQueue.add('deadJobProcessor',jobData,{
        removeOnComplete:false,
        removeOnFail:false
    })

    console.log(`Added job with id ${res.id} to the dead letter queue`)
}