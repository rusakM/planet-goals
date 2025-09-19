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