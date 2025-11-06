import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { connect } from 'http2';


const prisma = new PrismaClient()

@Injectable()
export class JobsService {
    async createJob(
  title: string,
  description: string,
  userId: number,
  dependOn?: number
) {
  if (!title || !description || !userId) {
    throw new Error("Missing Required Necessary Fields");
  }

  if (dependOn) {
    const parentJob = await prisma.job.findUnique({
      where: { id: dependOn },
    });
    if (!parentJob) throw new Error("Dependent job not found");
  }

  const newJob = await prisma.job.create({
    data: {
      title,
      description,
      user: {
        connect: { id: userId },
      },
      dependsOn: dependOn
        ? {
            connect: { id: dependOn },
          }
        : undefined,
    },
  });

  return newJob;
}


    async updateJob(paramId:number,title?:string,description?:string){
        const exisitingJob = await prisma.job.findUnique({
            where:{id:paramId}

        })
        if(!exisitingJob){
            throw new Error("Job not found")
        }
        const updatedJob = await prisma.job.update({
            where:{id:paramId},
            data:{
                title: title || exisitingJob.title,
                description: description || exisitingJob.description
            }
        })
        
        return updatedJob


    }

    async getJobById(jobId:number){
        const job = await prisma.job.findUnique({
            where:{id:jobId}
        })
        if(!job){
            throw new Error("Job not found")
        }
        return job
    }


    async deleteJob(jobId:number){
        const exisitnJob = await prisma.job.findUnique({
            where:{id:jobId}
        })

        if(!exisitnJob){
            throw new Error("This job does not exist")
        }

        const deletedJob = await prisma.job.delete({
            where:{id:jobId}
        })

        return deletedJob

    }

}
