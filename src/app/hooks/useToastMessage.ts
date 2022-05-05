import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { StorageConstantsType } from "app/constants/storage";
import Storage from "app/utils/storage/local";

type ToastType = "info" | "warning" | "success" | "error";

const useToastMessage = ({
    message,
    type,
    storage,
    isVisible,
}: {
    message: string | null;
    type: ToastType;
    storage?: StorageConstantsType;
    isVisible?: boolean;
}) => {
    const toast = useToast();

    useEffect(() => {
        if (isVisible) {
            toast({
                description: message,
                status: type,
                duration: 4_500,
                isClosable: true,
                position: "top",
            });

            if (storage) Storage.remove(storage);
        }
    }, [message, type, toast, storage, isVisible]);
};

export default useToastMessage;
