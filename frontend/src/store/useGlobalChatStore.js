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
      toast.error(error.response.data.message);
    } finally {
      set({ isGlobalMessagesLoading: false });
    }
  },

  sendGlobalMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post("/global/send", messageData);
      set({ globalMessages: [...get().globalMessages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToGlobalMessages: () => {
    var userId = sessionStorage.getItem('user_id');
    console.log("user_id = " + userId);

    const socket = useAuthStore.getState().socket;

    socket.on("newGlobalMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === userId;
      if (isMessageSentFromSelectedUser) return;
      console.log("message id = " + newMessage.senderId);

      set({
        globalMessages: [...get().globalMessages, newMessage],
      });
    });
    
  },

  unsubscribeFromGlobalMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newGlobalMessage");
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
