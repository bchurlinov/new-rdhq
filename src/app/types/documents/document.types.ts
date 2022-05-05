export type DocumentType = {
    pk: number;
    title: string;
    format_display: string;
    format: "docx" | "gdocs" | "gforms" | "pdf" | "xlsx" | "gsheets";
    category: { name: string };
    description: string;
    download_link: string;
    post: { title: string; url: string };
};
