// src/AddTaskModal.tsx
import React, { useState } from "react";
import { X, Calendar, Flag, ChevronDown } from "lucide-react";

export interface TaskFormData {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  reminderTime: string;
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => void;
  taskCount,
  setTaskCount
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  taskCount,
setTaskCount
  
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskFormData["priority"]>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setReminderTime("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const taskData: TaskFormData = {
      title,
      description,
      priority,
      dueDate,
      reminderTime,
    };

    try {
      // Direct JSON POST request to backend API
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          due_date: dueDate,
          reminder_time: reminderTime,
          tableName: "tasks",
        }),
      });

      
        const fetchTaskCount = async () => {
          try {
            const res = await fetch("http://localhost:5000/api/tasks/count");
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
    
            if (data?.success) {
              setTaskCount(data.count);
            }
          } catch (err) {
            console.error("Failed to fetch task count:", err);
          }
        };


      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      

      // Notify parent component, clear state, and close modal
      fetchTaskCount();
      onSubmit(taskData);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to add task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Add New Task</h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6"/>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-8 flex-1 overflow-y-auto space-y-6">
            {/* Task Title */}
            <div className="space-y-1.5">
              <label htmlFor="taskTitle" className="text-sm font-medium text-gray-700">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                id="taskTitle"
                name="title"
                type="text"
                required
                placeholder="Enter task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter task description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
              />
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label htmlFor="priority" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Flag className="w-4 h-4 text-gray-500"/> Priority
              </label>
              <div className="relative">
                <select
                  id="priority"
                  name="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskFormData["priority"])}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition appearance-none bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label htmlFor="dueDate" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500"/> Due Date
              </label>
              <div className="relative">
                <input
                  id="dueDate"
                  name="due_date"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
              </div>
            </div>

            {/* Reminder Time */}
            <div className="space-y-1.5">
              <label htmlFor="reminderTime" className="text-sm font-medium text-gray-700">
                Reminder Time
              </label>
              <div className="relative">
                <input
                  id="reminderTime"
                  name="reminder_time"
                  type="datetime-local"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
              </div>
            </div>
          </div>

          {/* Modal Footer / Actions */}
          <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-4 shrink-0 bg-gray-50/50">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {isSubmitting ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;