export interface IUserProfile {
    image: {
        base64: string;
    };
    username: string;
    first_name: string;
    last_name: string;
    location?: any;
}
