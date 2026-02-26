import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useGlobalChatStore = create((set, get) => ({
  globalMessages: [],
  isGlobalMessagesLoading: false,

  getGlobalMessages: async () => {
    set({ isGlobalMessagesLoading: true });
    try {
      const res = await axiosInstance.get("/global");
      set({ globalMessages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error");
    } finally {
      set({ isGlobalMessagesLoading: false });
    }
  },

  // ✅ IMPORTANT: on n'ajoute plus le message ici (socket va le faire)
  sendGlobalMessage: async (messageData) => {
    try {
      await axiosInstance.post("/global/send", messageData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error");
    }
  },

  subscribeToGlobalMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // éviter double subscription
    socket.off("newGlobalMessage");

    socket.on("newGlobalMessage", (newMessage) => {
      set((state) => {
        // ✅ dédoublonnage (évite double message)
        if (state.globalMessages.some((m) => m._id === newMessage._id)) {
          return state;
        }
        return { globalMessages: [...state.globalMessages, newMessage] };
      });
    });
  },

  unsubscribeFromGlobalMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newGlobalMessage");
  },
}));