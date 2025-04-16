export function secondsToMinutes(timeInSeconds: number) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds.toString().padStart(2, '0')}`;
}