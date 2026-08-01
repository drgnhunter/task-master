import React, { useState } from "react";
import {
  Bell,
  Search,
  ArrowUpDown,
  Check,
  Calendar,
  Clock,
  Trash2,
  CheckCircle2,
} from "lucide-react";

interface CompletedTask {
  id: number;
  title: string;
  description: string;
  completedAt: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
}

export default function CompletedTasks() {
  const [activeTab, setActiveTab] = useState("Tasks");
  const [searchQuery, setSearchQuery] = useState("");

  const completedTasks: CompletedTask[] = [
    {
      id: 1,
      title: "Assignment",
      description: "Mathematics Assignment of calculus",
      completedAt: "Sep 2, 2025, 08:30 AM",
      dueDate: "Sep 3, 2025, 09:00 AM",
      priority: "High",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-gray-800 font-sans">
      {/* Header */}
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

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Completed Tasks</h1>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {completedTasks.length} task completed
          </p>
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
              placeholder="Search completed tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200/90 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
            />
          </div>

          <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200/90 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
            <ArrowUpDown size={15} className="text-gray-500" />
            <span>Latest</span>
          </button>
        </div>

        {/* List */}
        <div className="space-y-3">
          {completedTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md transition-shadow opacity-90"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                      <Check size={14} strokeWidth={2.5} />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 text-base leading-tight line-through">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-through mt-1 font-normal">
                      {task.description}
                    </p>

                    <div className="flex items-center space-x-5 text-xs text-gray-400 mt-3 font-normal">
                      <div className="flex items-center space-x-1.5">
                        <Calendar size={13} />
                        <span>Due: {task.dueDate}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-emerald-600 font-medium">
                        <CheckCircle2 size={13} />
                        <span>Finished: {task.completedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between self-stretch">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                    Done
                  </span>

                  <button className="hover:text-red-500 text-gray-300 transition-colors p-1">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}