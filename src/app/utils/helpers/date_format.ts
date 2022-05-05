export const DateFormatFactory = (() => ({
    formatDateString(dateStr: string): string {
        const newDate: Date = new Date(dateStr);
        const year: string = newDate.getFullYear().toString();
        const month: string = newDate.toLocaleString("default", { month: "long" }).slice(0, 3);
        const day: string = String(newDate.getDate()).padStart(2, "0");

        return `${month} ${day}, ${year}`;
    },
}))();
