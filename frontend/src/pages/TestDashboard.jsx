import React from 'react'

export default function TestDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🎉 Dashboard Works!</h1>
        <p className="text-slate-400 mb-8">If you can see this, the routing is working correctly.</p>
        <div className="space-y-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Home
          </button>
          <br />
          <button 
            onClick={() => window.location.href = '/dashboard-protected'}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Try Protected Dashboard
          </button>
        </div>
      </div>
    </div>
  )
} 