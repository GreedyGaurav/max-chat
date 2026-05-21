import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthUserId } from '@/lib/auth';
import Chat from '@/lib/models/Chat';

export async function GET(req: NextRequest) {
  const userId = getAuthUserId(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
  return NextResponse.json({ chats });
}

export async function POST(req: NextRequest) {
  const userId = getAuthUserId(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const { title } = await req.json();
  const chat = await Chat.create({ userId, title: title || 'New Chat' });
  return NextResponse.json(chat, { status: 201 });
}
