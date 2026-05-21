import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthUserId } from '@/lib/auth';
import Chat from '@/lib/models/Chat';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const userId = getAuthUserId(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { chatId } = await params;
  await connectDB();
  await Chat.findByIdAndDelete(chatId);
  return NextResponse.json({ success: true });
}
