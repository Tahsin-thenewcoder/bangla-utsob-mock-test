import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'bu_student_session';
export const SESSION_SECONDS = 8 * 60 * 60;
export type StudentSession = { studentId: string; name: string; school: string; className: string; year: number; expiresAt: number };

function secret() {
  const value = process.env.STUDENT_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error('STUDENT_SESSION_SECRET must be at least 32 characters');
  return value;
}
function signature(payload: string) { return createHmac('sha256', secret()).update(payload).digest('base64url'); }
export function signSession(session: StudentSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  return `${payload}.${signature(payload)}`;
}
export function verifySession(cookie: string | undefined): StudentSession | null {
  if (!cookie) return null;
  try {
    const parts = cookie.split('.');
    if (parts.length !== 2) return null;
    const [payload, provided] = parts;
    const a = Buffer.from(signature(payload), 'base64url');
    const b = Buffer.from(provided, 'base64url');
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const session: StudentSession = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!session.studentId || !/^BU\d{2}-[A-F0-9]{8}$/.test(session.studentId) || !Number.isFinite(session.expiresAt) || Date.now() >= session.expiresAt || session.expiresAt > Date.now() + SESSION_SECONDS * 1000) return null;
    if (!Number.isInteger(session.year) || !['Class_6','Class_7','Class_8','Class_9_10'].includes(session.className)) return null;
    return session;
  } catch { return null; }
}
