import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../App.jsx'

export default function DebugDashboard() {
  const [debugInfo, setDebugInfo] = useState('Component Mounted')
  const { user } = useContext(AuthContext) || { user: null }
  
  useEffect(() => {
    console.log('Dashboard Debug: Component mounted')
    setDebugInfo('useEffect ran')
    
    setTimeout(() => {
      setDebugInfo('Timeout completed')
    }, 2000)
  }, [])
  
  return (
    <div className="min-h-screen bg-red-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🔍 Dashboard Debug</h1>
        
        <div className="space-y-4 bg-black/50 p-6 rounded">
          <p><strong>Debug Info:</strong> {debugInfo}</p>
          <p><strong>User:</strong> {user ? JSON.stringify(user) : 'No user'}</p>
          <p><strong>AuthContext:</strong> {useContext(AuthContext) ? 'Available' : 'Missing'}</p>
          <p><strong>Window Location:</strong> {window.location.href}</p>
          <p><strong>Current Time:</strong> {new Date().toLocaleTimeString()}</p>
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl mb-4">React Test</h2>
          <button 
            onClick={() => setDebugInfo('Button clicked at ' + new Date().toLocaleTimeString())}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            Test Button
          </button>
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl mb-4">Navigation Test</h2>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded mr-4"
          >
            Go Home
          </button>
          <button 
            onClick={() => window.location.href = '/dashboard-test'}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
          >
            Test Dashboard
          </button>
        </div>
      </div>
    </div>
  )
} 