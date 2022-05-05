/* eslint-disable react/no-danger */
import React, { ReactElement, useState } from "react";
import { Button } from "@chakra-ui/react";
import { VendorOfferType } from "app/types/vendors/vendors.types";
import "./index.scss";

type OfferCardType = Omit<VendorOfferType, "claim_mode" | "claim_instructions"> & {
    planUpgreadable: boolean;
    mode: "quote" | "instructions";
    toggleModal: (pk: number, mode: "quote" | "instructions" | "payments") => void;
};

const VendorOffersCard = ({
    pk,
    title,
    content,
    image,
    listing_url,
    premium,
    sponsor,
    planUpgreadable,
    mode,
    toggleModal,
}: OfferCardType): ReactElement => {
    const [loading, setLoading] = useState<boolean>(false);

    const renderCheckListingUrl = (): JSX.Element =>
        listing_url ? (
            <a href={process.env.REACT_APP_BASE_URL + listing_url}>{sponsor}</a>
        ) : (
            <span>{sponsor}</span>
        );

    const renderClaimOfferButton = (): JSX.Element => {
        if (planUpgreadable && premium)
            return (
                <Button variant="text" onClick={() => toggleModal(pk, "payments")}>
                    Claim offer
                </Button>
            );
        return (
            <Button variant="text" onClick={() => toggleModal(pk, mode)}>
                Claim offer
            </Button>
        );
    };

    return (
        <div className="offer-card">
            <div className="offer-card__logo">
                {image && (
                    <img
                        src={image}
                        alt={title}
                        loading="lazy"
                        onLoad={() => setLoading(true)}
                        className={`load-image ${loading ? "image-loaded" : ""}`}
                    />
                )}
            </div>
            <div className="offer-card__info">
                <div className="offer-card__header">
                    <div className="offer-card__title-wrap">
                        <h5 className="offer-card__title">{title}</h5>
                    </div>
                    <h6 className="offer-card__subtitle">Offer by: {renderCheckListingUrl()}</h6>
                    <p
                        className="offer-card__description"
                        dangerouslySetInnerHTML={{
                            __html: content,
                        }}
                    />
                </div>

                <div className="offer-card__actions">
                    <div className="offer-card__actions-wrap">{renderClaimOfferButton()}</div>
                </div>
            </div>
        </div>
    );
};

export default VendorOffersCard;
