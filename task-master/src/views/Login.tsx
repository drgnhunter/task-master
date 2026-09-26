import React, { useState } from "react";
import { CheckSquare, LogIn, AlertCircle } from "lucide-react";

export interface UserSession {
  id: number | string;
  username: string;
}

interface LoginProps {
  onLoginSuccess: (user: UserSession) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/tasks/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Login failed: ${response.statusText}`);
      }

      // Ensure 'id' is present in backend response
      if (!data.id && !data.user?.id) {
        throw new Error("User ID was not returned by the server.");
      }

      const userData: UserSession = {
        id: data.id || data.user.id,
        username: data.username || data.user?.username || username.trim(),
      };

      // Store authenticated session with id in localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      // Pass user info up to parent App state
      onLoginSuccess(userData);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50/50 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-sm">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            TaskMaster
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Sign in to manage your tasks
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              disabled={loading}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              disabled={loading}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}