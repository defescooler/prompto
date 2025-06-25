"use client";

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GitHubIcon, GoogleIcon, Logo } from "@/components/icons";
import { AuthContext } from "../App";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login({ email, password });
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Placeholder for Google OAuth
    navigate("/dashboard");
  };

  const handleGitHubLogin = () => {
    // Placeholder for GitHub OAuth
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Logo className="h-8 w-8" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-white">
            Sign in to your account
          </h3>
          <p className="mt-2 text-sm text-slate-300">
            Don't have an account?{' '}
            <a href="/auth/sign-up" className="font-medium text-emerald-400 hover:text-emerald-300">
              Sign up
            </a>
          </p>
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button
              variant="outline"
              className="flex-1 items-center justify-center space-x-2 py-2"
              onClick={handleGitHubLogin}
              disabled={isLoading}
            >
              <GitHubIcon className="size-5" />
              <span className="text-sm font-medium">Login with GitHub</span>
            </Button>
            <Button
              variant="outline"
              className="mt-2 flex-1 items-center justify-center space-x-2 py-2 sm:mt-0"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <GoogleIcon className="size-4" />
              <span className="text-sm font-medium">Login with Google</span>
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950 px-2 text-slate-400">
                or
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-white">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="email@example.com"
                className="mt-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-white">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="********"
                className="mt-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="mt-4 w-full py-2 font-medium" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Logo className="h-4 w-4" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
          <p className="mt-6 text-sm text-slate-300">
            Forgot your password?{' '}
            <a href="#" className="font-medium text-emerald-400 hover:text-emerald-300">
              Reset password
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 