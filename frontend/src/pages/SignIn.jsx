"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GitHubIcon, GoogleIcon, Logo } from "@/components/icons";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex items-center space-x-1.5">
            <Logo className="h-7 w-7 text-foreground" />
            <p className="font-medium text-lg text-foreground">Prompto</p>
          </div>
          <h3 className="mt-6 text-lg font-semibold text-foreground">
            Sign in to your account
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a href="/auth/sign-up" className="font-medium text-primary hover:text-primary/90">
              Sign up
            </a>
          </p>
          <div className="mt-8 flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button
              variant="outline"
              className="flex-1 items-center justify-center space-x-2 py-2"
            >
              <GitHubIcon className="size-5" />
              <span className="text-sm font-medium">Login with GitHub</span>
            </Button>
            <Button
              variant="outline"
              className="mt-2 flex-1 items-center justify-center space-x-2 py-2 sm:mt-0"
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
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <form action="#" method="post" className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="email@example.com"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="********"
                className="mt-2"
              />
            </div>
            <Button type="submit" className="mt-4 w-full py-2 font-medium">
              Sign in
            </Button>
          </form>
          <p className="mt-6 text-sm text-muted-foreground">
            Forgot your password?{' '}
            <a href="#" className="font-medium text-primary hover:text-primary/90">
              Reset password
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 