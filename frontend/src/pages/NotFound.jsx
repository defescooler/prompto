import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card variant="glass" className="relative z-10 p-12 max-w-2xl mx-auto text-center space-y-8">
        {/* 404 Text */}
        <div className="space-y-4">
          <div className="text-8xl md:text-9xl font-black bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent tracking-tight">
            404
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl font-semibold text-white">
              Page Not Found
            </h1>
            <p className="text-base text-slate-300 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved to another dimension.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            className="group"
          >
            <Home className="w-6 h-6 mr-2" />
            Go Home
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Go Back
          </Button>
        </div>
      </Card>
    </div>
  )
} 