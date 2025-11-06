import cron from 'node-cron'
import { PrismaClient } from '@prisma/client'
import { addJobsTOQueue } from '../jobQueue'
import { processJob } from '../utils'

const prisma = new PrismaClient()
export const scheduleJob = async()=>{
    cron.schedule('*/5 * * * *',async ()=>{
        console.log(`Scheduling jobs for  at ${new Date().toISOString()}`)
    

    try{
        const remainingJobs = await prisma.job.findMany({
        where:{status:"pending"},
        take:10
       })
       if(remainingJobs.length === 0){
        console.log("No pending Jobs [CRON] shutting")
        return
       }

       addJobsTOQueue(remainingJobs)
       console.log(`Scheduled ${remainingJobs.length} jobs for user `)
        

    }catch(error){
        throw new Error("Failed to schedule Jobs" + error.message)
    }
    })
}