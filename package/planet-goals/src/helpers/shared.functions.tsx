import { addHours, isAfter } from 'date-fns';

export function secondsToMinutes(timeInSeconds: number) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function msToSeconds(timeInMs: number) {
    if (timeInMs <= 0) return 0;
    return Math.floor(timeInMs / 1000);
}

export function convertTimeUntilToRemainedSeconds(timeUntil: number): number {
    const remainedTime = timeUntil - Date.now();
    const seconds = msToSeconds(remainedTime);
    return seconds;
}

function getTokenExp(token: string): Date {
  if (!token) return null;
  try {
    const base64Url = (token.split('.'))?.[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    if (!base64) return null;
    const payload = JSON.parse(atob(base64));
    return payload?.exp ? new Date(payload.exp * 1000) : null;
  } catch (err) {
    console.error('Token incorrect:', err);
    return null;
  }
}

export function verifyTokenExpiration(token: string): boolean {
    const tokenExp = getTokenExp(token);
    if (!tokenExp) return false;
    const next1h = addHours(new Date(), 1);
    return isAfter(tokenExp, next1h);
}