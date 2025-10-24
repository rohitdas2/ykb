import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [
    {
      id: 1,
      type: 'mention',
      user: 'Sports Analyst',
      action: 'mentioned you in a take',
      message: '"@user thoughts on MVP race?"',
      time: '2 minutes ago',
      read: false,
      avatar: '👨‍💼'
    },
    {
      id: 2,
      type: 'follow',
      user: 'Basketball Eyes',
      action: 'started following you',
      message: '',
      time: '15 minutes ago',
      read: false,
      avatar: '👨‍🦨'
    },
    {
      id: 3,
      type: 'like',
      user: 'Hoops Lover',
      action: 'liked your take',
      message: '"The Celtics are the most complete team..."',
      time: '1 hour ago',
      read: true,
      avatar: '👩‍🦱'
    },
    {
      id: 4,
      type: 'trending',
      user: 'System',
      action: 'your take is trending',
      message: 'Your take reached 1000 engagements',
      time: '3 hours ago',
      read: true,
      avatar: '🔥'
    }
  ],

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          id: Date.now(),
          read: false,
          ...notification
        },
        ...state.notifications
      ]
    })),

  markNotificationAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    })),

  dismissNotification: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.filter((notif) => notif.id !== notificationId)
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notif) => ({ ...notif, read: true }))
    })),

  getUnreadCount: () => {
    // This is accessed via the hook directly
  },

  clearAll: () =>
    set({ notifications: [] })
}));
