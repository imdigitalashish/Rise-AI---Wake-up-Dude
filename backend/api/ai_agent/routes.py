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
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Play
configureDjangoSettings()

from aiworkflow.models import WorkflowTasks
from elevenlabs.client import ElevenLabs
from elevenlabs import save
from pydantic import BaseModel

from pydantic_ai import Agent
import uuid

router = APIRouter(
    tags=["ai_agent"],
    prefix="/ai_agent"
)
import os

os.environ["GEMINI_API_KEY"] = "AIzaSyD_dB7aFnCg6pJzIrqAaFToCxTubLixdBU"
class Response(BaseModel):
    response:str


sustem_prompt = """
You're a savage bot, whatever is requesting you have to write that comment into a savage comment for it

eg:
Eg: Wake me up by putting in a guilt

Response: Wake up you lazy bum, you have to work and make your dreams come true.

And write in their language if it's hindi write in hindi


"""
agent = Agent("google-gla:gemini-2.0-flash", result_type=Response, system_prompt=sustem_prompt)

client = ElevenLabs(api_key=os.environ.get("ELEVEN_LABS_KEY"))

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


def call_person(audio_file_path: str):
    account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
    auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
    twilio_phone_number = '+19159006128'

    # Recipient's phone number
    recipient_phone_number = '+917827648166'

    # Path to your saved audio file
    audio_file_path = "https://ed61-14-139-53-130.ngrok-free.app/audio_files/"+audio_file_path

    # Initialize Twilio Client
    client = Client(account_sid, auth_token)

    # Create TwiML to play the audio
    voice_response = VoiceResponse()
    voice_response.play(audio_file_path)

    # Make the call
    call = client.calls.create(
        to=recipient_phone_number,
        from_=twilio_phone_number,
        twiml=str(voice_response)
    )

def Pipeline(workflow: WorkFlowRequest):
    a = agent.run_sync(workflow.workflow_description)
    audio = client.text_to_speech.convert(
    text=a.data.response,
    voice_id="JBFqnCBsd6RMkjVDRZzb",
    model_id="eleven_multilingual_v2",
    output_format="mp3_44100_128",
    )
    save(audio, f"audio_files/{str(uuid.uuid4())+".mp3"}")
    print(workflow.workflow_name)
    
    


@router.post("/add-workflow")
async def add_workflow(workflowRequest: WorkFlowRequest):
    data = workflowRequest.dict()
    data["workflow_trigger_time"] = get_current_time()
    
    obj = await run_in_threadpool(lambda: WorkflowTasks.objects.create(**data))
    
    trigger_time = datetime.datetime.strptime(data["workflow_trigger_time"], "%Y-%m-%d %H:%M:%S")
    trigger = DateTrigger(run_date=trigger_time)
    
    scheduler.add_job(
        func=lambda: Pipeline(workflowRequest),
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