from pydantic import BaseModel


class WorkFlowRequest(BaseModel):
    workflow_name: str
    workflow_description: str
    workflow_status: str | None = None
    workflow_trigger_time: str
    workflow_trigger_frequency: str | None = None
    workflow_trigger_frequency_value: str | None = None
    workflow_trigger_frequency_unit: str | None = None
    created_by_user_uuid: str | None = None