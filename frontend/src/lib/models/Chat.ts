import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
}

const chatSchema = new Schema<IChat>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'New Chat' },
  },
  { timestamps: true }
);

const Chat = mongoose.models.Chat ?? mongoose.model<IChat>('Chat', chatSchema);
export default Chat;
