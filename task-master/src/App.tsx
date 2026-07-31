import React from "react";
import {Plus,TrendingUp, Calendar ,Target, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

const tasks = [
    {
      id: 1,
      title: "Assignment",
      dueDate: "Sep 3, 2025, 09:00 AM",
      priority: "high",
    },
  ];

const statsData = [
  {
    id: "total-tasks",
    title: "Total Tasks",
    count: 1,
    icon: Target,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: "completed",
    title: "Completed",
    count: 1,
    icon: CheckCircle2,
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    id: "pending",
    title: "Pending",
    count: 0,
    icon: Clock,
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    id: "overdue",
    title: "Overdue",
    count: 0,
    icon: AlertTriangle,
    bgColor: "bg-rose-100",
    iconColor: "text-rose-600",
  },
];

export default function DashboardHeader() {
  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full p-4">
      {statsData.map((item) => {
        const IconComponent = item.icon;

        return (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div>
              <p className="text-sm font-medium text-gray-500">{item.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {item.count}
              </h3>
            </div>

            <div className={`p-3 rounded-lg ${item.bgColor}`}>
              <IconComponent className={`w-6 h-6 ${item.iconColor}`} />
            </div>
          </div>
        );
      })}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full p-4 bg-gray-50/50">
      {/* Left Card: Progress Overview */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Progress Overview
            </h2>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>

          {/* Progress Bar Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2 font-medium">
              <span>Completion Rate</span>
              <span className="font-semibold text-gray-800">0%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: "0%" }}
              />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 text-center gap-4 border-t border-gray-50 pt-4">
          <div>
            <div className="text-2xl font-bold text-emerald-600">0</div>
            <div className="text-xs text-gray-500 font-medium mt-1">
              Completed
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-500">1</div>
            <div className="text-xs text-gray-500 font-medium mt-1">
              Pending
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">0</div>
            <div className="text-xs text-gray-500 font-medium mt-1">
              Overdue
            </div>
          </div>
        </div>
      </div>

      {/* Right Card: Quick Stats */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Quick Stats</h2>
          <Calendar className="w-5 h-5 text-blue-500" />
        </div>

        {/* List Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">Today's Tasks</span>
            <span className="font-semibold text-gray-800">0</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">This Week</span>
            <span className="font-semibold text-gray-800">1</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">High Priority</span>
            <span className="font-semibold text-red-600">1</span>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Upcoming Tasks</h2>
        <Calendar className="w-5 h-5 text-blue-500" />
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between bg-slate-50/70 p-4 rounded-xl border border-gray-100"
          >
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                {task.title}
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                Due: {task.dueDate}
              </p>
            </div>

            <span className="px-3 py-1 text-xs font-semibold text-red-500 bg-red-100/60 rounded-full">
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
    <button
      className="fixed bottom-6 right-6 z-50 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95"
      aria-label="Add Task"
    >
      <Plus className="w-6 h-6" />
    </button>
    </>
  );
}