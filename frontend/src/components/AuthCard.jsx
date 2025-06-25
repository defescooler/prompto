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
import { Logo } from "@/components/icons";

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

// ---------------- API stubs ----------------
function signIn(values) {
  return toast.promise(new Promise((res) => setTimeout(res, 800)), {
    loading: "Signing in…",
    success: () => `Welcome back, ${values.email}!`,
    error: "Sign-in failed",
  });
}

function register(values) {
  return toast.promise(new Promise((res) => setTimeout(res, 800)), {
    loading: "Creating account…",
    success: () => `Account created for ${values.email}!`,
    error: "Registration failed",
  });
}

function signInWithGoogle() {
  toast("Redirecting to Google OAuth…");
  // window.location.href = "/api/auth/google";
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
        className="pr-10"
        {...register}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute w-8 h-8 right-2 md:right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus-visible:outline-none"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

function LoadingLogo(props) {
  return (
    <Logo
      className="size-5 text-emerald-400"
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
    formState: { errors, isSubmitting, isValid },
    setError,
  } = useForm({ resolver: zodResolver(signInSchema), mode: "onChange" });

  const navigate = useNavigate();
  const [search] = useSearchParams();
  const cardRef = useRef(null);
  const [remember] = useState(false);

  const onSubmit = useCallback(async (data) => {
    const payload = {
      ...data,
      remember,
      device: navigator.userAgent,
      tzOffset: -new Date().getTimezoneOffset(),
      redirectTo: search.get("next") ?? "/dashboard",
    };

    const result = await signIn(payload);
    if (result?.error) {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        cardRef.current?.querySelector(`#signin_${firstErrorField}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        setError(firstErrorField, { type: "server", message: result.error });
      } else {
        toast.error(result.error, { position: "top-center" });
      }
      return;
    }

    navigate(payload.redirectTo, { replace: true });
  }, [navigate, remember, search]);

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
    <form ref={cardRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
        {errors.password && (
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
        {isSubmitting ? <LoadingLogo /> : null}
        {isSubmitting ? <span className="sr-only">Signing in…</span> : "Sign in →"}
      </Button>
    </form>
  );
}

function SignUpForm() {
  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
  } = useForm({ resolver: zodResolver(signUpSchema), mode: "onChange" });

  const navigate = useNavigate();
  const [search2] = useSearchParams();
  const cardRef2 = useRef(null);

  const onSubmit = useCallback(async (data) => {
    const payload = {
      ...data,
      remember: false,
      device: navigator.userAgent,
      tzOffset: -new Date().getTimezoneOffset(),
      redirectTo: search2.get("next") ?? "/dashboard",
    };

    const result = await register(payload);
    if (result?.error) {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        cardRef2.current?.querySelector(`#signup_${firstErrorField}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        setError(firstErrorField, { type: "server", message: result.error });
      } else {
        toast.error(result.error, { position: "top-center" });
      }
      return;
    }
    navigate(payload.redirectTo, { replace: true });
  }, [navigate, search2]);

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
    <form ref={cardRef2} onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
          {...rhfRegister("email")}
          placeholder="jane@company.com"
        />
        {errors.email && (
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
        {errors.password && (
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
        {isSubmitting ? <LoadingLogo /> : null}
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

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 18, mass: 0.5 }}
      className="w-full sm:max-w-[420px] sm:rounded-lg bg-black p-4 sm:p-8 shadow-xl text-slate-100"
    >
      <div className="space-y-3">
        <Button
          variant="secondary"
          className="w-full"
          onClick={async () => {
            setGoogleLoading(true);
            toast("Redirecting…", { position: "bottom-center" });
            await signInWithGoogle();
          }}
          aria-label="Sign in with Google"
          disabled={googleLoading}
        >
          {googleLoading ? <LoadingLogo /> : <GoogleIcon className="size-5" />}
          {googleLoading ? <span className="sr-only">Redirecting…</span> : "Sign in with Google"}
        </Button>
      </div>

      <Separator className="my-6" />

      {isSignIn ? <SignInForm /> : <SignUpForm />}

      <p className="mt-6 text-center text-xs text-slate-400">
        By continuing you're agreeing to the
        <Link to="#" className="underline">
          Terms
        </Link>{" "}
        and {" "}
        <Link to="#" className="underline">
          Privacy
        </Link>
      </p>
    </motion.div>
  );
} 