from fastapi import FastAPI
from logging.config import dictConfig
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from api.logger import LogConfig
from api.api import router
import logging 
from contextlib import asynccontextmanager
import os
from django.core.wsgi import get_wsgi_application
from fastapi.middleware.wsgi import WSGIMiddleware
from fastapi.staticfiles import StaticFiles
from api.config import LOGGER_NAME
from asgiref.sync import sync_to_async
from api.task import scheduler
from apscheduler.triggers.date import DateTrigger

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main_backend.settings')
os.environ.setdefault("DJANGO_CONFIGURATIN", "Localdev")
django_app = get_wsgi_application()

from aiworkflow.models import WorkflowTasks

from api.config import configureDjangoSettings


configureDjangoSettings()


# if audio_files is not there make it

if not os.path.exists("audio_files"):
    os.makedirs("audio_files")



dictConfig(LogConfig())

logger = logging.getLogger(LOGGER_NAME)
# [TODO] NOT RECOMMENDED FOR PRODUCTION
origins = ["*"]

def configure_cors(app: FastAPI) -> None:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
logger.info("STARTING SERVER")




@sync_to_async
def get_pending_workflow():
    return list(WorkflowTasks.objects.filter(workflow_status="pending"))

async def lifespan(app: FastAPI):
    
    pending_list = await get_pending_workflow()
    
    for pending_item in pending_list:
        print(pending_item) 
        trigger = DateTrigger(run_date=pending_item.workflow_trigger_time)
        await run_in_threadpool(lambda: scheduler.add_job(
            func=lambda: print("Workflow triggered"),
            trigger=trigger,
            id=str(pending_item.id), replace_existing=True
        ))

    
    yield
    logger.info("STOPPING SERVER")

app = FastAPI(title=LOGGER_NAME, lifespan=lifespan)
configure_cors(app=app)


app.mount("/audio_files", StaticFiles(directory="audio_files"), name="audio_files")

app.include_router(router=router)

# app.include_router(router=router)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.mount("/", WSGIMiddleware(django_app))






