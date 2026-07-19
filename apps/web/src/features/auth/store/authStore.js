import { create } from "zustand";
import { persist } from "zustand/middleware";

const API_URL = "http://localhost:5000/api/v1/auth";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      error: null,

      // Login
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.message || "Invalid email or password");
          }

          const userObj = data.data.user;
          // Generate initial avatar letters
          const initials = userObj.name
            ? userObj.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
            : "US";

          set({
            isAuthenticated: true,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
            user: {
              ...userObj,
              avatar: initials,
              // Fallback default mock data for UI pages if DB has them empty
              addresses: userObj.addresses || [],
              wishlist: userObj.wishlist || [],
              orders: userObj.orders || [],
            },
            loading: false,
          });

          return { success: true, message: "Logged in successfully!" };
        } catch (err) {
          console.error("[AuthStore Login Error]", err);
          set({ error: err.message, loading: false });
          return { success: false, message: err.message };
        }
      },

      // Logout
      logout: async () => {
        const { accessToken } = get();
        // Best effort API call to logout
        if (accessToken) {
          try {
            await fetch(`${API_URL}/logout`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
          } catch (err) {
            console.warn("[AuthStore Logout Warning] Server logout omitted/failed:", err.message);
          }
        }

        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          error: null,
        });
      },

      // Register / Signup
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fullName: userData.fullName,
              email: userData.email,
              phone: userData.phone,
              password: userData.password,
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.message || "Registration failed");
          }

          // Automatically log the user in after registration
          return await get().login(userData.email, userData.password);
        } catch (err) {
          console.error("[AuthStore Register Error]", err);
          set({ error: err.message, loading: false });
          return { success: false, message: err.message };
        }
      },

      // Update Profile Details
      updateProfile: async (updatedData) => {
        set({ loading: true, error: null });
        const { accessToken, user } = get();
        
        if (!accessToken) {
          set({ loading: false, error: "Access token missing" });
          return { success: false, message: "Authentication required" };
        }

        try {
          const res = await fetch(`${API_URL}/profile`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              fullName: updatedData.fullName,
              phone: updatedData.phone,
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.message || "Profile update failed");
          }

          const initials = data.data.name
            ? data.data.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
            : "US";

          set({
            user: {
              ...user,
              ...data.data,
              avatar: initials,
            },
            loading: false,
          });

          return { success: true, message: "Profile updated successfully!" };
        } catch (err) {
          console.error("[AuthStore Update Profile Error]", err);
          set({ error: err.message, loading: false });
          return { success: false, message: err.message };
        }
      },

      // Trigger dummy password reset link
      forgotPassword: async (email) => {
        set({ loading: true, error: null });
        await new Promise((resolve) => setTimeout(resolve, 800));
        set({ loading: false });
        return { success: true, message: `Password reset link sent to ${email}` };
      },

      // Trigger dummy password reset confirm
      resetPassword: async (newPassword) => {
        set({ loading: true, error: null });
        await new Promise((resolve) => setTimeout(resolve, 800));
        set({ loading: false });
        return { success: true, message: "Password reset successfully! You can now log in." };
      },
    }),
    {
      name: "sweetshop-auth", // unique local storage key
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
