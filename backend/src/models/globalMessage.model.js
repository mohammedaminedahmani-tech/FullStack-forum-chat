import mongoose from "mongoose";

const globalMessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const GlobalMessage = mongoose.model("GlobalMessage", globalMessageSchema);

export default GlobalMessage;
