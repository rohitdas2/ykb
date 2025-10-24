import { create } from 'zustand';

export const useAuthStore = create((set) => ({
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
}));
