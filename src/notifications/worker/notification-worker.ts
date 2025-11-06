import { Worker } from "bullmq";
import { PrismaClient } from "@prisma/client";
import { deadLetterNotiQueue } from "../queue/notification-queue";
import { sendMail } from "../utils/sendMessage";

const prisma = new PrismaClient()

const notificationWorker = new Worker('notificationQueue',async(notification)=>{
    console.log(`Processing notification with id ${notification.id} for user ${notification.data.userId}`)
    try{
        //Simulate Notification processing
        const user = await prisma.user.findUnique({
            where:{id:notification.data.userId}
        })

        if(!user){
            throw new Error('User not found')
        }

        await sendMail(user.email,"Success job proccessing",notification.data.message)
        console.log(`Notification with id ${notification.id} processed successfully`)
    }catch(err){
        await deadLetterNotiQueue(notification.data)
        console.log(`Notification with id ${notification.id} failed and moved to dead letter notification queue`)
        throw new Error('Notification processing failed, moved to dead letter queue')
    }
},{
    connection:{port:6379,host:'localhost'},
    concurrency:1
})

notificationWorker.on('completed',(notification)=>{
    console.log(`Notification with id ${notification.id} has been completed`)
})

notificationWorker.on('failed',(notification,err)=>{
    if (!notification) {
        console.log(`Notification failed with error ${err?.message}`)
        return
    }
    console.log(`Notification with id ${notification.id} has failed with error ${err?.message}`)
})

export default notificationWorker;
