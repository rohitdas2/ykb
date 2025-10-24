import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isGuest: false,
      phoneNumber: null,
      verificationStep: null, // 'phone', 'otp', 'profile'

      setPhoneNumber: (phone) => set({ phoneNumber: phone, verificationStep: 'phone' }),

      setVerificationStep: (step) => set({ verificationStep: step }),

      setUser: (userData) => set({
        user: userData,
        isAuthenticated: true,
        isGuest: false,
        verificationStep: null
      }),

      setGuestMode: () => set({
        user: {
          displayName: 'Guest User',
          username: 'guest',
          phoneNumber: null,
          createdAt: new Date('2025-09-05').toISOString(),
        },
        isAuthenticated: false,
        isGuest: true,
        verificationStep: null
      }),

      logout: () => set({
        user: null,
        isAuthenticated: false,
        isGuest: false,
        phoneNumber: null,
        verificationStep: null
      }),
    }),
    {
      name: 'auth-store', // localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isGuest: state.isGuest,
      }),
    }
  )
);
