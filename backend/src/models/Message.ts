import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId;
  role: "user" | "assistant";
  content: string;
}

const messageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>("Message", messageSchema);
