"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export interface WorkflowTask {
    created_by_user_uuid: string
    workflow_name: string
    workflow_description: string | null
    workflow_status: "pending" | "completed"
    workflow_trigger_time: Date | null
    workflow_trigger_frequency: "daily" | "weekly" | "monthly" | null
    workflow_trigger_frequency_value: string | null
    workflow_trigger_frequency_unit: "day" | "week" | "month" | null
}

interface WorkflowDialogProps {
    initialData?: WorkflowTask
    onSave: (data: WorkflowTask) => void
    triggerButton?: React.ReactNode
}

export function WorkflowDialog({ initialData, onSave, triggerButton }: WorkflowDialogProps) {
    const [open, setOpen] = useState(false)
    const [userUuid, setUserUuid] = useState<string | null>(null)
    const [data, setData] = useState<WorkflowTask>(
        initialData || {
            created_by_user_uuid: userUuid || "",
            workflow_name: "",
            workflow_description: "",
            workflow_status: "pending",
            workflow_trigger_time: null,
            workflow_trigger_frequency: null,
            workflow_trigger_frequency_value: null,
            workflow_trigger_frequency_unit: null,
        },
    )

    const handleChange = (field: keyof WorkflowTask, value: any) => {
        setData((prev) => ({ ...prev, [field]: value }))
    }

    useEffect(() => {
        const userUuid = localStorage.getItem("user_uuid")
        setUserUuid(userUuid)
    }, [])

    const handleSubmit = () => {
        onSave(data)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{triggerButton || <Button variant="outline">Create Workflow</Button>}</DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Workflow" : "Create Workflow"}</DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Make changes to your workflow task here."
                            : "Fill in the details to create a new workflow task."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">


                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="workflow_name" className="text-right col-span-1">
                            Workflow Name
                        </Label>
                        <Textarea

                            id="workflow_name"
                            value={data.workflow_name}
                            onChange={(e) => handleChange("workflow_name", e.target.value)}
                            className="col-span-3 w-full"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="workflow_description" className="text-right pt-2">
                            Description
                        </Label>
                        <Textarea
                            id="workflow_description"
                            value={data.workflow_description || ""}
                            onChange={(e) => handleChange("workflow_description", e.target.value)}
                            className="col-span-3"
                            rows={3}
                        />
                    </div>

                    {/* <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="workflow_status" className="text-right">
                            Status
                        </Label>
                        <Select disabled value={data.workflow_status} onValueChange={(value) => handleChange("workflow_status", value)}>
                            <SelectTrigger id="workflow_status" className="col-span-3">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div> */}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="trigger_time" className="text-right">
                            Trigger Time
                        </Label>
                        <div className="col-span-3">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="trigger_time"
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !data.workflow_trigger_time && "text-muted-foreground",
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {data.workflow_trigger_time ? (
                                            format(data.workflow_trigger_time, "PPP HH:mm")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={data.workflow_trigger_time || undefined}
                                        onSelect={(date) => handleChange("workflow_trigger_time", date)}
                                        initialFocus
                                    />
                                    <div className="p-3 border-t border-border">
                                        <Input
                                            type="time"
                                            onChange={(e) => {
                                                const [hours, minutes] = e.target.value.split(":").map(Number)
                                                const date = data.workflow_trigger_time || new Date()
                                                date.setHours(hours)
                                                date.setMinutes(minutes)
                                                handleChange("workflow_trigger_time", new Date(date))
                                            }}
                                            value={
                                                data.workflow_trigger_time
                                                    ? `${data.workflow_trigger_time.getHours().toString().padStart(2, "0")}:${data.workflow_trigger_time.getMinutes().toString().padStart(2, "0")}`
                                                    : ""
                                            }
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="trigger_frequency" className="text-right">
                            Frequency
                        </Label>
                        <Select
                            value={data.workflow_trigger_frequency || ""}
                            onValueChange={(value) => handleChange("workflow_trigger_frequency", value || null)}
                        >
                            <SelectTrigger id="trigger_frequency" className="col-span-3">
                                <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {data.workflow_trigger_frequency != "none" && data.workflow_trigger_frequency && (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="frequency_value" className="text-right">
                                    Frequency Value
                                </Label>
                                <Input
                                    id="frequency_value"
                                    type="number"
                                    min="1"
                                    value={data.workflow_trigger_frequency_value || ""}
                                    onChange={(e) => handleChange("workflow_trigger_frequency_value", e.target.value)}
                                    className="col-span-3"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="frequency_unit" className="text-right">
                                    Frequency Unit
                                </Label>
                                <Select
                                    value={data.workflow_trigger_frequency_unit || ""}
                                    onValueChange={(value) => handleChange("workflow_trigger_frequency_unit", value || null)}
                                >
                                    <SelectTrigger id="frequency_unit" className="col-span-3">
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="day">Day</SelectItem>
                                        <SelectItem value="week">Week</SelectItem>
                                        <SelectItem value="month">Month</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleSubmit}>
                        {initialData ? "Save changes" : "Create workflow"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

