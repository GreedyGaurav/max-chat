import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
}

export function getAuthUserId(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return decoded.userId;
  } catch {
    return null;
  }
}
