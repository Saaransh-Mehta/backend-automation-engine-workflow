export const processJob = async(jobData:any) =>{
    new Promise((resolve)=>{
        setTimeout(()=>{
        jobData.status = "completed"
    },4000)
    })
    
}