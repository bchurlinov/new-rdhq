class Storage {
    static set = (key: string, value: string): void => localStorage.setItem(key, value);

    static get = (key: string): string | null => localStorage.getItem(key);

    static remove = (key: string): void => localStorage.removeItem(key);

    static saveRedirect = (key: string, value: any): void => localStorage.setItem(key, value);
}

export default Storage;
