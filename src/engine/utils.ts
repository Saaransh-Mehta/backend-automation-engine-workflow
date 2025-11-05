export const processJob = async(jobData:any) =>{
    setTimeout(()=>{
        jobData.status = "completed"
    },4000)
}