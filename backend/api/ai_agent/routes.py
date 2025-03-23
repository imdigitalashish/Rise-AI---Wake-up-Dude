from fastapi import APIRouter


from api.config import configureDjangoSettings

from apscheduler.triggers.date import DateTrigger
from apscheduler.triggers.interval import IntervalTrigger
import uuid
from api.task import scheduler
# import run_in_threadpool
from starlette.concurrency import run_in_threadpool
from api.ai_agent.models import WorkFlowRequest
import datetime

configureDjangoSettings()

from aiworkflow.models import WorkflowTasks

router = APIRouter(
    tags=["ai_agent"],
    prefix="/ai_agent"
)


## write a function to get current time in YYYY-MM-DD HH:MM:SS format
def get_current_time():
    # Return datetime in a format APScheduler can parse with 10 seconds added
    return (datetime.datetime.now() + datetime.timedelta(seconds=10)).strftime("%Y-%m-%d %H:%M:%S")

@router.post("/add-workflow")
async def add_workflow(workflowRequest: WorkFlowRequest):
    # Create a dictionary from the request
    data = workflowRequest.dict()
    data["workflow_trigger_time"] = get_current_time()
    
    obj = await run_in_threadpool(lambda: WorkflowTasks.objects.create(**data))
    
    # Use the actual datetime object for the trigger, not a string
    trigger_time = datetime.datetime.strptime(data["workflow_trigger_time"], "%Y-%m-%d %H:%M:%S")
    trigger = DateTrigger(run_date=trigger_time)
    
    scheduler.add_job(
        func=lambda: print("Workflow triggered"),
        trigger=trigger,
        id=str(uuid.uuid4()), replace_existing=True
    )
    
    return {"message": "Workflow added successfully", "data": obj}
