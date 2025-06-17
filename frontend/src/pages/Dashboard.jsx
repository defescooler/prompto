import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Sparkles, Heart, BarChart3, Settings, User, LogOut, CheckCircle, Zap, Clock, TrendingUp, Star, BookOpen, Plus, Search, Filter } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const API_BASE_URL = 'http://localhost:8002'

export default function Dashboard() {
  const { user, token, logout, loading: authLoading } = useAuth()
  const [prompts, setPrompts] = useState([])
  const [analytics, setAnalytics] = useState({})
  const [loading, setLoading] = useState(true)
  const [newPrompt, setNewPrompt] = useState('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [enhancedPrompt, setEnhancedPrompt] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    // Only fetch data if auth is not loading and token is available
    if (!authLoading && token) {
      fetchData()
    } else if (!authLoading && !token) {
      // If auth is done loading but no token, set loading to false
      // This might be redundant with ProtectedRoute but good for clarity
      setLoading(false)
    }
  }, [token, authLoading])

  const fetchData = async () => {
    setLoading(true) // Ensure loading is true when fetching starts
    try {
      const [promptsRes, analyticsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/prompts`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(async res => {
          if (res.status === 401) {
            logout() // Log out if token is unauthorized
            setPrompts([]) // Clear data
            setAnalytics({}) // Clear data
            setLoading(false) // Stop loading spinner
            throw new Error('Unauthorized')
          }
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status} for prompts`)
          return res.json()
        }),
        fetch(`${API_BASE_URL}/api/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(async res => {
          if (res.status === 401) {
            logout() // Log out if token is unauthorized
            setPrompts([]) // Clear data
            setAnalytics({}) // Clear data
            setLoading(false) // Stop loading spinner
            throw new Error('Unauthorized')
          }
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status} for analytics`)
          return res.json()
        })
      ])

      setPrompts(promptsRes)
      setAnalytics(analyticsRes)
    } catch (error) {
      console.error('Error fetching data:', error)
      // Optionally display error to user
    } finally {
      setLoading(false)
    }
  }

  const handleEnhance = async () => {
    if (!newPrompt.trim()) return

    setIsEnhancing(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/prompts/enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: newPrompt })
      })

      if (response.status === 401) {
        logout()
        setEnhancedPrompt('') // Clear enhanced prompt
        setLoading(false) // Stop loading
        setIsEnhancing(false) // Stop enhancing state
        throw new Error('Unauthorized')
      }

      if (response.ok) {
        const data = await response.json()
        setEnhancedPrompt(data.enhanced_prompt)
        // Refresh prompts list
        fetchData()
      } else {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Enhancement failed:', error)
    } finally {
      setIsEnhancing(false)
    }
  }

  const toggleFavorite = async (promptId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/prompts/${promptId}/favorite`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status === 401) {
        logout()
        setLoading(false) // Stop loading
        throw new Error('Unauthorized')
      }

      if (response.ok) {
        fetchData()
      } else {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.original_prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.enhanced_prompt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'favorites' && prompt.is_favorite) ||
                      (activeTab === 'recent' && new Date(prompt.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    return matchesSearch && matchesTab
  })

  const StatCard = ({ label, value, icon: Icon, color = 'purple' }) => (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Show loading state for authentication first
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    )
  }

  // Show loading for dashboard data after authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="container mx-auto px-4 py-8">
        {/* Analytics Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            label="Total Prompts" 
            value={analytics.total_prompts || 0} 
            icon={BookOpen} 
            color="blue"
          />
          <StatCard 
            label="Enhanced Today" 
            value={analytics.today_enhancements || 0} 
            icon={Zap} 
            color="purple"
          />
          <StatCard 
            label="Avg. Score" 
            value={`${analytics.average_score || 0}%`} 
            icon={TrendingUp} 
            color="green"
          />
          <StatCard 
            label="Favorites" 
            value={analytics.favorites_count || 0} 
            icon={Heart} 
            color="red"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Enhancement */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Quick Enhancement
                </CardTitle>
                <CardDescription>
                  Enhance your prompts instantly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your prompt here..."
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={handleEnhance} 
                  disabled={isEnhancing || !newPrompt.trim()} 
                  className="w-full"
                >
                  {isEnhancing ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-pulse" /> Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" /> Enhance Prompt
                    </>
                  )}
                </Button>
                {enhancedPrompt && (
                  <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-md text-purple-800 text-sm whitespace-pre-wrap">
                    <h4 className="font-semibold mb-2">Enhanced Prompt:</h4>
                    {enhancedPrompt}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Prompts List */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Your Prompts
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search prompts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 pr-2 py-1 border rounded-md text-sm"
                      />
                    </div>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                      <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-gray-100 rounded-md">
                        <TabsTrigger value="all" className="px-3 py-1 text-xs">All</TabsTrigger>
                        <TabsTrigger value="favorites" className="px-3 py-1 text-xs">Favorites</TabsTrigger>
                        <TabsTrigger value="recent" className="px-3 py-1 text-xs">Recent</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardTitle>
                <CardDescription>All your saved and enhanced prompts</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredPrompts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No prompts found. Start by enhancing one above!
                  </p>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {filteredPrompts.map(prompt => (
                      <Card key={prompt.id} className="border-0 shadow-md transition-all hover:shadow-lg">
                        <CardContent className="p-4 flex items-start space-x-4">
                          <div className="flex-grow">
                            <p className="font-semibold text-gray-800 mb-1">
                              {prompt.title}
                            </p>
                            <p className="text-sm text-gray-600 mb-2 whitespace-pre-wrap">
                              Original: {prompt.original_prompt}
                            </p>
                            <p className="text-sm text-purple-700 mb-2 whitespace-pre-wrap">
                              Enhanced: {prompt.enhanced_prompt}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              {prompt.created_at && (
                                <span><Clock className="w-3 h-3 inline-block mr-1" /> {new Date(prompt.created_at).toLocaleDateString()}</span>
                              )}
                              <span><TrendingUp className="w-3 h-3 inline-block mr-1" /> Score: {prompt.effectiveness_score}%</span>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => toggleFavorite(prompt.id)}
                            className={`text-gray-400 ${prompt.is_favorite ? 'text-red-500 hover:text-red-600' : 'hover:text-red-400'}`}
                          >
                            <Heart className="w-5 h-5 fill-current" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
