"use client"

import React, { useEffect } from 'react'

import { motion } from "motion/react"
import { Button } from '@/components/ui/button'
import { WorkflowDialog, WorkflowTask } from '@/components/workflow-dialogue'
import { Delete, DeleteIcon, PlusCircle, Trash } from 'lucide-react'
import axios from 'axios'
import app_api from '@/lib/api'
import { toast } from 'sonner'

export default function DashboardPageComponent() {



    const [workflows, setWorkflows] = React.useState([])

    const getAllWorkflows = async () => {


        const request = await app_api.get("/ai_agent/get-all-workflow", {
            params: {
                token: localStorage.getItem("token")
            }
        })

        setWorkflows(request.data.data)




    }

    const saveWorkflow = async (data: WorkflowTask) => {

        const response = await app_api.post("/ai_agent/add-workflow", { ...data, created_by_user_uuid: localStorage.getItem("user_uuid") })

        if (response.status === 200) {
            toast("Workflow Created", {

                position: "top-center"
            })
            getAllWorkflows()
        }

    }

    const deleteWorkflow = async (id: string) => {
        const response = await app_api.delete("/ai_agent/delete-workflow", {
            params: {
                workflow_id: id,
                token: localStorage.getItem("token")
            }
        })

        if (response.status === 200) {
            toast("Workflow Deleted", {

                position: "top-center"
            })
            getAllWorkflows()
        }
    }

    useEffect(() => {
        getAllWorkflows()
    }, [])

    return (
        <div>

            <motion.h2 initial={{ scale: 0.6 }} animate={{ scale: 1, transition: { duration: 0.5 } }} className='text-3xl font-bold w-fit m-auto'>Workflows</motion.h2>


            {workflows.length == 0 && <>
                <div className='font-bold h-[50vh] justify-center items-center w-full flex text-gray-500 text-center'>
                    <div>
                        <h2 className='text-4xl '>No Workflows now....</h2>
                      
                    </div>
                </div>

            </>}
            <div className='text-center m-3'>
                <WorkflowDialog onSave={saveWorkflow} triggerButton={
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create Workflow
                                </Button>
                            } />
            </div>

            <div className='p-6'>
                {workflows.length > 0 && <>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {workflows.map((workflow: any) => (
                            <motion.div key={workflow.id} className='border border-gray-200 p-4 rounded-lg cursor-pointer' whileHover={{
                                scale: 1.05
                            }} >
                                <div className='flex justify-between'>
                                    <h2 className='text-xl font-bold'>{workflow.workflow_name}</h2>
                                    <div className='flex'>
                                        <Trash onClick={() => deleteWorkflow(workflow.id)} className='hover:fill-red-600' color="red" width={16} />
                                    </div>
                                </div>
                                <p className='text-gray-500'>{workflow.workflow_description}</p>
                                
                                <p className='text-gray-500'>
                                    {workflow.workflow_trigger_time ? 
                                        new Date(workflow.workflow_trigger_time).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : 
                                        'No trigger time set'}
                                </p>
                            </motion.div>
                        ))}
                    </div></>
                }
            </div>


        </div>
    )
}
