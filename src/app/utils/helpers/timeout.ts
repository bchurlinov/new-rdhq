export function timeout(callback: () => void, time: number): any {
    return setTimeout(() => callback(), time);
}
