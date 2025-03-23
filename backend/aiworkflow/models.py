from django.db import models

# Create your models here.
class WorkflowTasks(models.Model):
    created_by_user_uuid = models.CharField(max_length=100)
    workflow_name = models.CharField(max_length=100)
    workflow_description = models.TextField(null=True, blank=True)
    workflow_status = models.CharField(max_length=100, default="pending") # pending | completed
    workflow_trigger_time = models.DateTimeField(null=True, blank=True)
    workflow_trigger_frequency = models.CharField(max_length=100, null=True, blank=True) # daily | weekly | monthly
    workflow_trigger_frequency_value = models.CharField(max_length=100, null=True, blank=True) # 1 | 2 | 3
    workflow_trigger_frequency_unit = models.CharField(max_length=100, null=True, blank=True) # day | week | month
    
    def __str__(self):
        return f"Workflow named {self.workflow_name} created by {self.created_by_user_uuid}"
