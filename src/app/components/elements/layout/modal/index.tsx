import React, { useRef, useLayoutEffect, useEffect } from "react";
import { useClickOutside, useEventListener } from "app/hooks";
import { Heading, Button } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { IModalType } from "./index.types";
import "./index.scss";

const Modal = ({
    children,
    visible,
    title,
    actions,
    footerVisible = true,
    closeModal,
}: IModalType): JSX.Element => {
    const modalRef = useRef<HTMLDivElement>(null);
    const body = document.querySelector("body") as HTMLBodyElement;
    const closeModalRef = useRef<void | any>();

    useClickOutside(modalRef, () => {
        if (visible) closeModal();
    });

    useEffect(() => {
        closeModalRef.current = closeModal;
    }, [closeModal]);

    useEventListener(
        "keydown",
        (event: Event) => {
            if ((event as KeyboardEvent).key === "Escape" && visible) closeModal();
        },
        document
    );

    useLayoutEffect(() => {
        if (visible) body.style.overflow = "hidden";
        else body.style.overflow = "auto";
    }, [visible, body]);

    return (
        <div
            className={`rdhq-modal ${visible ? "isVisible" : ""}`}
            aria-hidden={visible}
            role="presentation"
        >
            <div className={`rdhq-modal__wrap ${visible ? "isVisible" : ""}`} ref={modalRef}>
                <div className="rdhq-modal__header">
                    <Heading as="h2">{title}</Heading>
                    <button type="button" className="rdhq-modal__close" onClick={closeModal}>
                        <CloseIcon />
                    </button>
                </div>
                <div className="rdhq-modal__content">{children}</div>

                {actions && footerVisible && (
                    <div className="rdhq-modal__footer">
                        <div className="rdhq-modal__footer-cta">
                            {actions.secondary && (
                                <Button
                                    className="ghost"
                                    type="button"
                                    variant="ghost"
                                    onClick={actions?.secondary?.action}
                                    isLoading={actions.secondary?.isLoading ?? false}
                                    disabled={actions.secondary?.isDisabled}
                                >
                                    {actions?.secondary?.title}
                                </Button>
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={actions?.primary?.action}
                                isLoading={actions.primary?.isLoading ?? false}
                                disabled={actions.primary?.isDisabled}
                            >
                                {actions?.primary?.title}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
