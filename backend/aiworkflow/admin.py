from django.contrib import admin

# Register your models here.

from .models import WorkflowTasks

admin.site.register(WorkflowTasks)
