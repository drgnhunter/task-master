import React, { useState } from "react";
import {CheckSquare,Menu,X,
  Home,
  AlertCircle,
  Settings,Plus,TrendingUp, Calendar ,Target, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

const tasks = [
    {
      id: 1,
      title: "Assignment",
      dueDate: "Sep 3, 2025, 09:00 AM",
      priority: "high",
    },
  ];
const navItems = [
    { label: "Dashboard", icon: Home, active: true },
    { label: "All Tasks", icon: CheckSquare, active: false },
    { label: "Pending", icon: Clock, active: false },
    { label: "Completed", icon: CheckCircle2, active: false },
    { label: "Overdue", icon: AlertCircle, active: false },
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
   <div className="flex h-screen w-full bg-slate-50/50 overflow-hidden relative">
      {/* Overlay Backdrop for Mobile Menu */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* 1. Sidebar (Desktop Static / Mobile Drawer) */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 p-6 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out shrink-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-8">
          {/* Logo & Mobile Close Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <CheckSquare className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-800 tracking-tight">
                TaskMaster
              </span>
            </div>
            {/* Close button for mobile menu */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-150 ${
                    item.active
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings */}
        <div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header Bar with Hamburger Menu */}
        <header className="md:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-800">
              TaskMaster
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none"
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {item.title}
                    </p>
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

          {/* Progress Overview & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Progress Overview
                  </h2>
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>

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

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Quick Stats
                </h2>
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium">
                    Today's Tasks
                  </span>
                  <span className="font-semibold text-gray-800">0</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium">This Week</span>
                  <span className="font-semibold text-gray-800">1</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium">
                    High Priority
                  </span>
                  <span className="font-semibold text-red-600">1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Upcoming Tasks
              </h2>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>

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
        </main>
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-6 right-6 z-40 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95"
        aria-label="Add Task"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}