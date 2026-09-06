import React, { useState } from "react";
import {
  CheckSquare,
  Menu,
  X,
  Home,
  AlertCircle,
  Settings,
  Plus,
  CheckCircle2,
  Clock,
} from "lucide-react";

import Dashboard from "./views/Dashboard";
import AllTasks from "./views/AllTasks";
import PendingTasks from "./views/PendingTasks";
import CompletedTasks from "./views/CompletedTasks";
import OverdueTasks from "./views/OverdueTasks";
import AddTaskModal, { type TaskFormData } from "./views/AddTaskModal";

type ViewType = "Dashboard" | "All Tasks" | "Pending" | "Completed" | "Overdue";

// 2. Define the NavItem interface
interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: "Dashboard", label: "Dashboard", icon: Home },
  { id: "All Tasks", label: "All Tasks", icon: CheckSquare },
  { id: "Pending", label: "Pending", icon: Clock },
  { id: "Completed", label: "Completed", icon: CheckCircle2 },
  { id: "Overdue", label: "Overdue", icon: AlertCircle },
];

// 1. Define a type or union for your views

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("Dashboard");
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [taskCount, setTaskCount] = useState<number>(0);
  
  // Helper to dynamically render the view component
  const renderView = () => {
    switch (currentView) {
      case "Dashboard":
        return <Dashboard taskCount={taskCount} setTaskCount={setTaskCount} />;
      case "All Tasks":
        return <AllTasks />;
      case "Pending":
        return <PendingTasks />;
      case "Completed":
        return <CompletedTasks />;
      case "Overdue":
        return <OverdueTasks />;
      default:
        return <Dashboard taskCount={taskCount} setTaskCount={setTaskCount} />;
    }
  };

  const handleNavClick = (viewId: ViewType) => {
    setCurrentView(viewId);
    setIsSidebarOpen(false); // Close mobile drawer when a link is clicked
  };
  const handleAddTaskSubmit = async (taskData: TaskFormData) => {
    try {
        const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...taskData, tableName: "tasks" }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Server Response:", result);
      alert("Task saved successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

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
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-150 ${
                    isActive
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
            <span className="font-bold text-lg text-slate-800">TaskMaster</span>
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
        <main className="flex-1 overflow-y-auto">{renderView()}</main>
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-6 right-6 z-40 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95"
        aria-label="Add Task"
        onClick={() => {
          setIsAddTaskModalOpen(true);
        }}
      >
        <Plus className="w-6 h-6" />
      </button>

      <AddTaskModal
        taskCount={taskCount}
        setTaskCount={setTaskCount}
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSubmit={() => handleAddTaskSubmit}
      />
    </div>
  );
}
