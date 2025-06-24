"use client";

export default function AuthLayout({ children }) {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-950 text-slate-100">
      {children}
    </section>
  );
} 