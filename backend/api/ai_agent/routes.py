from fastapi import APIRouter


from api.config import configureDjangoSettings

from apscheduler.triggers.date import DateTrigger
from apscheduler.triggers.interval import IntervalTrigger
import uuid
from api.task import scheduler
from starlette.concurrency import run_in_threadpool
from api.ai_agent.models import WorkFlowRequest
import datetime

from platformusers.models import PlatformUsers

configureDjangoSettings()

from aiworkflow.models import WorkflowTasks
from elevenlabs.client import ElevenLabs

router = APIRouter(
    tags=["ai_agent"],
    prefix="/ai_agent"
)

client = ElevenLabs()

from pydantic_ai import Agent

from pydantic import BaseModel


class Response(BaseModel):
    response:str

agent = Agent("google-gla:gemini-2.0-flash", result_type=Response)


def get_current_time():
    return (datetime.datetime.now() + datetime.timedelta(seconds=10)).strftime("%Y-%m-%d %H:%M:%S")



def convert_text_to_mp3(text: str):
    audio = client.text_to_speech(
        text=text,
        voice="Bella",
    )
    return audio




@router.post("/add-workflow")
async def add_workflow(workflowRequest: WorkFlowRequest):
    data = workflowRequest.dict()
    data["workflow_trigger_time"] = get_current_time()
    
    obj = await run_in_threadpool(lambda: WorkflowTasks.objects.create(**data))
    
    trigger_time = datetime.datetime.strptime(data["workflow_trigger_time"], "%Y-%m-%d %H:%M:%S")
    trigger = DateTrigger(run_date=trigger_time)
    
    scheduler.add_job(
        func=lambda: print(workflowRequest.workflow_name),
        trigger=trigger,
        id=str(uuid.uuid4()), replace_existing=True
    )
    
    return {"message": "Workflow added successfully", "data": obj}


@router.get("/get-all-workflow")
async def get_all_workflow_of_user(token: str):
    user = await run_in_threadpool(lambda: PlatformUsers.objects.filter(token=token).first())
    if not user:
        return {"message": "User not found"}
    
    
    all_data = await run_in_threadpool(lambda: list(WorkflowTasks.objects.filter(created_by_user_uuid=user.uuid)))
    return {"message": "Workflow added successfully", "data": all_data}

@router.delete("/delete-workflow")
async def delete_workflow(workflow_id: int, token: str):
    
    user = await run_in_threadpool(lambda: PlatformUsers.objects.filter(token=token).first())
    if not user:
        return {"message": "User not found"}
    
    await run_in_threadpool(lambda: WorkflowTasks.objects.filter(id=workflow_id, created_by_user_uuid=user.uuid).delete())
    
    return {"message": "Workflow deleted successfully"}