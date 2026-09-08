import React, { useEffect, useState } from "react";
import {
  Bell,
  Search,
  ArrowUpDown,
  Check,
  Calendar,
  Clock,
  Pencil,
  Trash2,
  AlertCircle,
  Circle,
  CheckCircle2
} from "lucide-react";

export default function AllTasks({formatDueDate}) {
  const [activeTab, setActiveTab] = useState("Tasks");
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks,setTasks] = useState();
  const fetchTaskCount = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tasks/details");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();

        if (data?.success) {
          setTasks(data.tasks);
        }
      } catch (err) {
        console.error("Failed to fetch task count:", err);
      }
    };
  useEffect(() => {
    fetchTaskCount();
  }, []);
  const task = {
    id: 1,
    title: "Assignment",
    description: "Mathematics Assignment of calculus",
    due_date: "Sep 3, 2025, 09:00 AM",
    reminder: "Sep 2, 2025, 04:00 AM",
    priority: "High",
    completed: true,
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-gray-800 font-sans">
      {/* Navigation Header */}
      <header className="border-b border-gray-200/80 bg-white px-8 py-3.5 flex items-center justify-between">
        <nav className="flex items-center space-x-8 text-sm font-medium">
          <button
            onClick={() => setActiveTab("Dashboard")}
            className={`transition-colors ${
              activeTab === "Dashboard"
                ? "text-blue-600 font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("Tasks")}
            className={`transition-colors ${
              activeTab === "Tasks"
                ? "text-blue-600 font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Tasks
          </button>
        </nav>

        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
            <Bell size={18} />
          </button>
          <span>Tuesday, September 2, 2025</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
          <p className="text-xs text-gray-500 mt-1">1 task</p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200/90 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>

          <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200/90 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
            <ArrowUpDown size={15} className="text-gray-500" />
            <span>Latest</span>
          </button>
        </div>

        {/* Single Task Card */}
    {(tasks||[]).map((task) => {
  // Derive status
  const isCompleted = task.completed || task.status?.toLowerCase() === "completed";
  const isOverdue = !isCompleted && new Date(task.due_date).getTime() < Date.now();

  // Calculate late days if overdue
  const daysLate = isOverdue
    ? Math.max(1, Math.floor((Date.now() - new Date(task.due_date).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Outer card border & opacity styling
  const cardBorder = isCompleted
    ? "border-gray-200/80 opacity-90"
    : isOverdue
    ? "border-rose-200/80"
    : "border-gray-200/80";

  return (
    <div
      key={task.id}
      className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow ${cardBorder}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3.5">
          {/* Status Icon */}
          <div className="mt-0.5 flex-shrink-0">
            {isCompleted && (
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                <Check size={14} strokeWidth={2.5} />
              </div>
            )}
            {isOverdue && (
              <div className="text-rose-500">
                <AlertCircle size={22} />
              </div>
            )}
            {!isCompleted && !isOverdue && (
              <button
                aria-label="Mark as complete"
                className="text-gray-300 hover:text-emerald-500 transition-colors"
              >
                <Circle size={22} strokeWidth={1.5} />
              </button>
            )}
          </div>

          {/* Task Details */}
          <div>
            <h3
              className={`font-semibold text-base leading-tight ${
                isCompleted ? "text-gray-700 line-through" : "text-gray-900"
              }`}
            >
              {task.title}
            </h3>

            <p
              className={`text-sm mt-1 font-normal ${
                isCompleted ? "text-gray-400 line-through" : "text-gray-500"
              }`}
            >
              {task.description}
            </p>

            {/* Metadata Badges */}
            <div
              className={`flex items-center space-x-5 text-xs mt-3 ${
                isOverdue ? "text-rose-500 font-medium" : "text-gray-400 font-normal"
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <Calendar size={13} />
                <span>
                  {isOverdue ? "Was Due: " : "Due: "}
                  {formatDueDate(task.due_date)}
                </span>
              </div>

              {isCompleted && task.completedAt && (
                <div className="flex items-center space-x-1.5 text-emerald-600 font-medium">
                  <CheckCircle2 size={13} />
                  <span>Finished: {task.completedAt}</span>
                </div>
              )}

              {isOverdue && (
                <div className="flex items-center space-x-1.5">
                  <Clock size={13} />
                  <span>{task.daysLate || daysLate} days late</span>
                </div>
              )}

              {!isCompleted && !isOverdue && task.reminder && (
                <div className="flex items-center space-x-1.5">
                  <Clock size={13} />
                  <span>Reminder: {task.reminder}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status / Priority Badge & Action Buttons */}
        <div className="flex flex-col items-end justify-between self-stretch">
          {isCompleted && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
              Done
            </span>
          )}
          {isOverdue && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
              Overdue
            </span>
          )}
          {!isCompleted && !isOverdue && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100 capitalize">
              {task.priority}
            </span>
          )}

          <div className="flex items-center space-x-2.5 text-gray-300">
            {/* Edit button: shown for pending and overdue tasks */}
            {!isCompleted && (
              <button
                aria-label="Edit task"
                className="hover:text-gray-600 transition-colors p-1"
              >
                <Pencil size={15} />
              </button>
            )}

            <button
              aria-label="Delete task"
              className="hover:text-red-500 transition-colors p-1"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
})}
      </main>
    </div>
  );
}