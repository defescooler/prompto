"use client";

import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Link } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Social icon (Google)
function GoogleIcon(props) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
    </svg>
  );
}

// ----- Validation Schemas -----
const signInSchema = z.object({
  email: z.string().email({ message: "Enter a valid e-mail" }),
  password: z.string().min(6, { message: "Password ≥ 6 chars" }),
});

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name too short" }),
  email: z.string().email({ message: "Enter a valid e-mail" }),
  password: z.string().min(6, { message: "Password ≥ 6 chars" }),
});

// ----- Stubs (replace with API calls) -----
function signIn(values) {
  toast.promise(
    new Promise((res) => setTimeout(res, 800)),
    {
      loading: "Signing in…",
      success: () => `Welcome back, ${values.email}!`,
      error: "Sign-in failed",
    },
  );
}

function register(values) {
  toast.promise(
    new Promise((res) => setTimeout(res, 800)),
    {
      loading: "Creating account…",
      success: () => `Account created for ${values.email}!`,
      error: "Registration failed",
    },
  );
}

function signInWithGoogle() {
  toast("Redirecting to Google OAuth…");
  // window.location.href = "/api/auth/google"; // real world flow
}

// ----- Forms -----
function SignInForm() {
  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signInSchema) });

  // ⌘/Ctrl + Enter shortcut
  const onSubmit = useCallback((data) => signIn(data), []);
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        handleSubmit(onSubmit)();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSubmit, onSubmit]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <Label htmlFor="signin_email">Email</Label>
        <Input
          id="signin_email"
          type="email"
          inputMode="email"
          enterKeyHint="next"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...rhfRegister("email")}
          placeholder="john@company.com"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="signin_password">Password</Label>
        <Input
          id="signin_password"
          type="password"
          autoComplete="current-password"
          enterKeyHint="go"
          aria-invalid={!!errors.password}
          {...rhfRegister("password")}
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  );
}

function SignUpForm() {
  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signUpSchema) });

  const onSubmit = useCallback((data) => register(data), []);
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        handleSubmit(onSubmit)();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSubmit, onSubmit]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <Label htmlFor="signup_name">Name</Label>
        <Input
          id="signup_name"
          autoComplete="name"
          enterKeyHint="next"
          aria-invalid={!!errors.name}
          {...rhfRegister("name")}
          placeholder="Jane Doe"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="signup_email">Email</Label>
        <Input
          id="signup_email"
          type="email"
          inputMode="email"
          enterKeyHint="next"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...rhfRegister("email")}
          placeholder="jane@company.com"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="signup_password">Password</Label>
        <Input
          id="signup_password"
          type="password"
          autoComplete="new-password"
          enterKeyHint="go"
          aria-invalid={!!errors.password}
          {...rhfRegister("password")}
          placeholder="At least 6 characters"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full">
        Create account
      </Button>
    </form>
  );
}

export default function AuthCard() {
  return (
    <div className="auth-card w-full max-w-md rounded-2xl bg-white/5 p-10 backdrop-blur-md shadow-xl">
      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <div className="space-y-3">
          <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
            <GoogleIcon className="size-5" aria-hidden />
            Continue with Google
          </Button>
        </div>

        <Separator className="my-6" />

        <TabsContent value="signin">
          <SignInForm />
        </TabsContent>
        <TabsContent value="signup">
          <SignUpForm />
        </TabsContent>

        <p className="mt-6 text-center text-xs text-slate-400">
          By continuing you agree to our{' '}
          <Link to="#" className="underline">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="#" className="underline">
            Privacy
          </Link>
        </p>
      </Tabs>
    </div>
  );
} 