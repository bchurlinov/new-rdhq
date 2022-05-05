import { useState } from "react";
import API from "app/utils/api/axios";
import API_URL from "app/constants/api_urls";

const useClaimOffer = (
    pk: number
): { isLoading: boolean; success: string; error: string; handler: any; clearClaimOffer: any } => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>("");
    const [error, setError] = useState<string>("");

    const claimOffer = async (claimOfferObj: {
        content: string;
        author_phone: string;
        race: { [key: string]: number };
    }): Promise<boolean> => {
        try {
            setIsLoading(true);
            setSuccess("");
            setError("");

            const { data } = await API.post(
                `${API_URL.CLAIM_VENDOR_OFFER}${pk}/claim/`,
                claimOfferObj
            );

            setIsLoading(false);
            setSuccess("Your message has been sent successfully");
            return true;
        } catch (error) {
            setIsLoading(false);
            setError("Something went wrong. Please try again.");
            return false;
        }
    };

    return {
        isLoading,
        success,
        error,
        handler: (props: {
            content: string;
            author_phone: string;
            race: { [key: string]: number };
        }) => claimOffer(props),
        clearClaimOffer: () => {
            setError("");
            setSuccess("");
            setIsLoading(false);
        },
    };
};

export default useClaimOffer;
