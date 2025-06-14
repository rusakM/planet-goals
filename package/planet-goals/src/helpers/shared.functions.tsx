export function secondsToMinutes(timeInSeconds: number) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    console.log('time', timeInSeconds, minutes, seconds);
    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds.toString().padStart(2, '0')}`;
}