export interface IDialog {
    message: string;
    key?: number | string;
    type: "error" | "success" | "warning";
}
