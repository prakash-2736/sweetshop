"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const register = useAuthStore((state) => state.register);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const resetPassword = useAuthStore((state) => state.resetPassword);

  return {
    isAuthenticated: mounted ? isAuthenticated : false,
    user: mounted ? user : null,
    loading: mounted ? loading : false,
    error: mounted ? error : null,
    isMounted: mounted,

    // Actions
    login,
    logout,
    register,
    updateProfile,
    forgotPassword,
    resetPassword,
  };
}

export default useAuth;
