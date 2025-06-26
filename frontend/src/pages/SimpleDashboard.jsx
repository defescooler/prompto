import React from 'react'

export default function SimpleDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          🚀 Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h3 className="text-emerald-400 text-sm font-medium mb-2">Total Prompts</h3>
            <p className="text-2xl font-bold">15</p>
            <p className="text-slate-400 text-xs">enhanced</p>
          </div>
          
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h3 className="text-blue-400 text-sm font-medium mb-2">Avg Score</h3>
            <p className="text-2xl font-bold">8.7/10</p>
            <p className="text-slate-400 text-xs">effectiveness</p>
          </div>
          
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h3 className="text-purple-400 text-sm font-medium mb-2">Tokens Saved</h3>
            <p className="text-2xl font-bold">2.8K</p>
            <p className="text-slate-400 text-xs">optimization</p>
          </div>
          
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h3 className="text-orange-400 text-sm font-medium mb-2">Level</h3>
            <p className="text-2xl font-bold">2</p>
            <p className="text-slate-400 text-xs">prompt master</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Prompt Terminal</h2>
            <textarea 
              className="w-full h-32 bg-slate-900 border border-slate-600 rounded p-3 text-white resize-none"
              placeholder="Enter your prompt here..."
            />
            <button className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded transition-colors">
              Enhance Prompt
            </button>
          </div>
          
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Recent Prompts</h2>
            <div className="space-y-3">
              <div className="bg-slate-900/50 p-3 rounded border border-slate-600">
                <h3 className="font-medium mb-1">Creative Writing Prompt</h3>
                <p className="text-slate-400 text-sm">Write a short story about...</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-emerald-400 text-xs">Score: 8.5</span>
                  <button className="text-slate-400 hover:text-white text-xs">Copy</button>
                </div>
              </div>
              
              <div className="bg-slate-900/50 p-3 rounded border border-slate-600">
                <h3 className="font-medium mb-1">Data Analysis Request</h3>
                <p className="text-slate-400 text-sm">Analyze the following dataset...</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-emerald-400 text-xs">Score: 9.2</span>
                  <button className="text-slate-400 hover:text-white text-xs">Copy</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
} 