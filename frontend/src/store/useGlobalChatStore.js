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
  const userId = sessionStorage.getItem("user_id");
  const socket = useAuthStore.getState().socket;

  socket.off("newGlobalMessage"); // ✅ évite double écoute

  socket.on("newGlobalMessage", (newMessage) => {
    const senderId =
      typeof newMessage.senderId === "object"
        ? newMessage.senderId._id
        : newMessage.senderId;

    // ✅ ne pas ignorer ton propre message ici (sinon tu perds le populate parfois)
    // On laisse le store ajouter tous les messages, mais on évite le doublon:
    const exists = get().globalMessages.some((m) => m._id === newMessage._id);
    if (exists) return;

    set({ globalMessages: [...get().globalMessages, newMessage] });
  });
},

  unsubscribeFromGlobalMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newGlobalMessage");
  },
}));