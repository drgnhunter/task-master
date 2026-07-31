import React from "react";
import { Target, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

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
  );
}