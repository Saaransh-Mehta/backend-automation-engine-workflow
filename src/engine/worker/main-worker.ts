import { Worker } from "bullmq";
import { deadLetterQueue } from "../jobQueue";
import { PrismaClient } from "@prisma/client";
import { processJob } from "../utils";
import { addNotificationQueue } from "../../notifications/queue/notification-queue";

const prisma = new PrismaClient()

export const jobWorker = new Worker('jobQueue', async(job)=>{
    try{
        console.log(`Processing Job with id ${job.id}`)
        //Simulate job processing
       await processJob(job.data)
        //After processing update the job status in DB
       const updatedJob =  await prisma.job.update({
            where:{id:job.data.id},
            data:{status:"completed"}
        })
        console.log(`Job with id ${job.id} completed successfully`)
        return updatedJob

    }catch(err){
        const addToDeadQueue = await deadLetterQueue(job.data)
        console.log(`Job with id ${job.id} failed and moved to dead letter queue`)
        await prisma.job.update({
            where:{id:job.data.id}
            ,data:{status:"failed"}
        })

        throw new Error('Job failed, moved to dead letter queue')
    }
},{
    connection:{port:6379,host:'localhost'},
    concurrency:1
})

jobWorker.on('completed',async (job)=>{
    console.log(`Job with id ${job.id} has been completed`)
    const message = `Job with id ${job.data.id} completed successfullt kindly check your dashboard for more details.`
     await prisma.notifications.create({
        data:{
            userId:job.data.userId,
            message:message,
            isRead:false
        }
    })

    await addNotificationQueue({
        userId:job.data.userId,
        message:message,
        isRead:false
    })
    
})

jobWorker.on('failed',async (job,err)=>{
    if (!job) {
        console.log(`Job failed with error ${err?.message}`)
        return
    }
    console.log(`Job with id ${job.id} has failed with error ${err?.message}`)
})