import GlobalMessage from "../models/globalMessage.model.js";

import { io } from "../lib/socket.js";


// Récupérer tous les messages globaux
export const getGlobalMessages = async (req, res) => {
  try {
    const messages = await GlobalMessage.find()
      .sort({ createdAt: 1 })
      .populate("senderId", "username profilePic"); // 👈 récupération des infos du sender

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error fetching global messages:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des messages globaux" });
  }
};


// Envoyer un message global
export const sendGlobalMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    
    // Correction : utilisation de req.user._id au lieu de req.userId
    const newMessage = new GlobalMessage({
      senderId: req.user._id,  // Utilisation de req.user._id pour l'ID de l'utilisateur
      text,
      image
    });
    
    await newMessage.save();
    io.emit("newGlobalMessage",newMessage);
    console.log("global msg emit");

    

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error sending global message:", error);
    res.status(500).json({ message: "Erreur lors de l'envoi du message global" });
  }
};