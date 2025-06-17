"use client";
import React from "react";
import { Home, LogOut, User } from "lucide-react";
import { useAuth } from "./hooks/useAuth";

export default function SidebarLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Simple Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Prompt Copilot</h1>
        </div>
        
        <nav className="p-4">
          <div className="space-y-2">
            <a 
              href="/dashboard" 
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </a>
            
            <button 
              onClick={logout}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700 w-full text-left"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
            <User className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-700">{user?.username || "Guest"}</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
