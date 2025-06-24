"use client";

import { Navigate } from "react-router-dom";

export default function Auth() {
  return <Navigate to="/auth/sign-in" replace />;
}
