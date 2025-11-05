import { Queue } from "bullmq";

const notificationQueue = new Queue('notificationQueue',{
    connection:{port:6379,host:'localhost'}
})

const deadNotiQueue = new Queue('deadnotiQueue',{
    connection:{port:6379,host:'localhost'}
})

export const addNotificationQueue = async(notification:any)=>{
    const res = await notificationQueue.add('notificationProcessor',notification)
    console.log(`Added notification with id ${res.id} to the notification queue`)
    return res


}

export const deadLetterNotiQueue = async(notificationData:any)=>{
    const res = await deadNotiQueue.add('deadNotiProcessor',notificationData,{
        removeOnComplete:false,
        removeOnFail:false
    })

    console.log(`Added notification with id ${res.id} to the dead letter notification queue`)
}