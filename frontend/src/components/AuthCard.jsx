"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";


// Social icon (Google)
function GoogleIcon(props) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
    </svg>
  );
}

// ---------------- Validation Schemas ----------------
const signInSchema = z.object({
  email: z.string().email({ message: "Enter a valid e-mail" }),
  password: z.string().min(6, { message: "Password ≥ 6 chars" }),
});

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name too short" }),
  email: z.string().email({ message: "Enter a valid e-mail" }),
  password: z.string().min(6, { message: "Password ≥ 6 chars" }),
});

// ---------------- API Configuration ----------------
const API_BASE_URL = 'http://localhost:8002'

// ---------------- API Functions ----------------
async function signIn(values) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed')
    }
    
    // Store token and user data
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function register(values) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed')
    }
    
    // Store token and user data
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function signInWithGoogle() {
  try {
    toast("Redirecting to Google OAuth…");
    // Simulate potential error in OAuth flow
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 10% chance of user cancellation
        if (Math.random() < 0.1) {
          reject(new Error("User cancelled Google sign-in"));
        } else {
          resolve();
        }
      }, 1000);
    });
    // window.location.href = "/api/auth/google";
  } catch (error) {
    toast.error(error.message || "Google sign-in failed");
    throw error;
  }
}

// ---------------- Helper components ----------------
function PasswordField({ id, register, error, autoComplete, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        aria-invalid={!!error}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="pr-10 focus:ring-2 focus:ring-emerald-500/60"
        {...register}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute w-8 h-8 right-2 md:right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 rounded"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

function LoadingSpinner(props) {
  return (
    <div
      className="size-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"
      aria-hidden
      {...props}
    />
  );
}

// ---------------- Forms ----------------
function SignInForm() {
  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, touchedFields },
    setError,
  } = useForm({ 
    resolver: zodResolver(signInSchema), 
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true
  });

  const navigate = useNavigate();
  const [search] = useSearchParams();
  const cardRef = useRef(null);

  const onSubmit = useCallback(async (data, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    try {
      const result = await signIn(data);
      
      if (!result.success) {
        if (result.error.includes('email') || result.error.includes('Email')) {
          setError('email', { type: 'server', message: result.error });
        } else if (result.error.includes('password') || result.error.includes('Password')) {
          setError('password', { type: 'server', message: result.error });
        } else {
          toast.error(result.error, { position: "top-center" });
        }
        return;
      }

      toast.success(`Welcome back, ${result.data.user.name}!`);
      const redirectTo = search.get("next") ?? "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Sign in failed. Please try again.', { position: "top-center" });
    }
  }, [navigate, search, setError]);

  // ⌘/Ctrl + Enter shortcut
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
    <form ref={cardRef} onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit)(e); }} className="space-y-4" noValidate>
      <div>
        <Label htmlFor="signin_email">Email</Label>
        <Input
          id="signin_email"
          type="email"
          inputMode="email"
          enterKeyHint="next"
          autoComplete="email"
          aria-invalid={!!errors.email}
          className="focus:ring-2 focus:ring-emerald-500/60"
          {...rhfRegister("email")}
          placeholder="john@company.com"
        />
        {errors.email && (touchedFields.email || errors.email.type === 'server') && (
          <p className="mt-1 text-xs text-red-400" aria-live="polite">
            {errors.email.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="signin_password">Password</Label>
        <PasswordField
          id="signin_password"
          autoComplete="current-password"
          register={rhfRegister("password")}
          error={errors.password}
          placeholder="••••••••"
        />
        {errors.password && (touchedFields.password || errors.password.type === 'server') && (
          <p className="mt-1 text-xs text-red-400" aria-live="polite">
            {errors.password.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full"
        variant="secondary"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? <LoadingSpinner /> : null}
        {isSubmitting ? <span className="sr-only">Signing in…</span> : "Sign in →"}
      </Button>
    </form>
  );
}

function SignUpForm() {
  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, touchedFields },
    setError,
  } = useForm({ 
    resolver: zodResolver(signUpSchema), 
    mode: "onChange",
    reValidateMode: "onChange", 
    shouldFocusError: true
  });

  const navigate = useNavigate();
  const [search2] = useSearchParams();
  const cardRef2 = useRef(null);

  const onSubmit = useCallback(async (data, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    try {
      const result = await register(data);
      
      if (!result.success) {
        if (result.error.includes('name') || result.error.includes('Name')) {
          setError('name', { type: 'server', message: result.error });
        } else if (result.error.includes('email') || result.error.includes('Email')) {
          setError('email', { type: 'server', message: result.error });
        } else if (result.error.includes('password') || result.error.includes('Password')) {
          setError('password', { type: 'server', message: result.error });
        } else {
          toast.error(result.error, { position: "top-center" });
        }
        return;
      }

      toast.success(`Welcome to Prompto, ${result.data.user.name}!`);
      const redirectTo = search2.get("next") ?? "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Sign up failed. Please try again.', { position: "top-center" });
    }
  }, [navigate, search2, setError]);

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
    <form ref={cardRef2} onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit)(e); }} className="space-y-4" noValidate>
      <div>
        <Label htmlFor="signup_name">Name</Label>
        <Input
          id="signup_name"
          autoComplete="name"
          enterKeyHint="next"
          aria-invalid={!!errors.name}
          className="focus:ring-2 focus:ring-emerald-500/60"
          {...rhfRegister("name")}
          placeholder="Jane Doe"
        />
        {errors.name && (touchedFields.name || errors.name.type === 'server') && (
          <p className="mt-1 text-xs text-red-400" aria-live="polite">
            {errors.name.message}
          </p>
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
          className="focus:ring-2 focus:ring-emerald-500/60"
          {...rhfRegister("email")}
          placeholder="jane@company.com"
        />
        {errors.email && (touchedFields.email || errors.email.type === 'server') && (
          <p className="mt-1 text-xs text-red-400" aria-live="polite">
            {errors.email.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="signup_password">Password</Label>
        <PasswordField
          id="signup_password"
          autoComplete="new-password"
          register={rhfRegister("password")}
          error={errors.password}
          placeholder="At least 6 characters"
        />
        {errors.password && (touchedFields.password || errors.password.type === 'server') && (
          <p className="mt-1 text-xs text-red-400" aria-live="polite">
            {errors.password.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full"
        variant="secondary"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? <LoadingSpinner /> : null}
        {isSubmitting ? <span className="sr-only">Creating…</span> : "Create account →"}
      </Button>
    </form>
  );
}

// ---------------- Main Card Component ----------------
export default function AuthCard({ mode = "sign-in" }) {
  const shouldReduceMotion = useReducedMotion();
  const isSignIn = mode === "sign-in";
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      // Error already handled in signInWithGoogle
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 18, mass: 0.5 }}
      className="w-full sm:max-w-[420px] sm:rounded-lg bg-[#0D0D0D]/85 backdrop-blur-md border border-[#2B2B2B] p-4 sm:p-8 shadow-xl text-slate-100 ring-0 ring-emerald-500/30"
    >
      <div className="space-y-3">
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGoogleSignIn}
          aria-label="Sign in with Google"
          disabled={googleLoading}
        >
          {googleLoading ? <LoadingSpinner /> : <GoogleIcon className="size-5" />}
          {googleLoading ? <span className="sr-only">Redirecting…</span> : "Sign in with Google"}
        </Button>
      </div>

      <Separator className="my-6" />

      {isSignIn ? <SignInForm /> : <SignUpForm />}

      <p className="mt-6 text-center text-sm text-slate-400">
        By continuing you're agreeing to the{' '}
        <Link to="#" className="underline mr-1">
          Terms
        </Link>
        and{' '}
        <Link to="#" className="underline">
          Privacy
        </Link>
      </p>
    </motion.div>
  );
} 