import GlobalMessage from "../models/globalMessage.model.js";
import { io } from "../lib/socket.js";

// Récupérer tous les messages globaux
export const getGlobalMessages = async (req, res) => {
  try {
    const messages = await GlobalMessage.find()
      .sort({ createdAt: 1 })
      .populate("senderId", "username profilePic");

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error fetching global messages:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des messages globaux" });
  }
};

// Envoyer un message global
export const sendGlobalMessage = async (req, res) => {
  try {
    const { text, image } = req.body;

    // 1) Créer + sauvegarder
    const newMessage = await GlobalMessage.create({
      senderId: req.user._id,
      text,
      image,
    });

    // 2) ✅ Populate pour avoir username + profilePic immédiatement (sans refresh)
    const populatedMessage = await GlobalMessage.findById(newMessage._id).populate(
      "senderId",
      "username profilePic"
    );

    // 3) Emit au global chat
    io.emit("newGlobalMessage", populatedMessage);

    // 4) Réponse API
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.log("Error sending global message:", error);
    res.status(500).json({ message: "Erreur lors de l'envoi du message global" });
  }
};