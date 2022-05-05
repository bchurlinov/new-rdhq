import { useState } from "react";
import { useAppDispatch } from "app/store/hooks/use_store";
import { getAsyncUser } from "app/store/user/user.actions";
import { ListingCreditAddon } from "app/store/payments/payments.types";
import API_URL from "app/constants/api_urls";
import Storage from "app/utils/storage/local";
import axios from "axios";

export const useUserPayment = () => {
    const dispatch = useAppDispatch();
    const token: string | null = Storage.get("access_token");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<string>("");

    const paymentAction = async (
        payment_data: {
            [key: string]: string | Partial<ListingCreditAddon>;
        },
        type: "subscription" | "credits"
    ): Promise<{ success: boolean }> => {
        try {
            setIsLoading(true);
            setErrors("");

            if (type === "subscription") {
                await axios.post(
                    `${process.env.REACT_APP_BASE_URL}${API_URL.SUBSCRIBE}`,
                    payment_data,
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                );
            } else if (type === "credits") {
                await axios.post(
                    `${process.env.REACT_APP_BASE_URL}${API_URL.BUY_CREDITS}`,
                    payment_data,
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                );
            }

            await dispatch(getAsyncUser());

            return { success: true };
        } catch (error) {
            setIsLoading(false);
            setErrors(
                error.response?.data?.non_field_errors ||
                    "Your payment could not be completed at this time. Please try again or contact us."
            );
            return { success: false };
        }
    };

    const resetPaymentErrors = (): void => setErrors("");

    return {
        isLoading,
        errors,
        paymentAction,
        resetPaymentErrors,
    };
};
