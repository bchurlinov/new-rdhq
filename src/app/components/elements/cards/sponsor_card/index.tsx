import React, { ReactElement, useState } from "react";
import { Tooltip, Text, Button } from "@chakra-ui/react";
import { SponsorBenefit } from "app/types/sponsors/sponsor.types";
import { DateFormatFactory } from "app/utils/helpers/date_format";
import broken_link from "assets/icons/broken-link.svg";
import products from "assets/icons/products.svg";
import cash from "assets/icons/cash.svg";
import product_discounts from "assets/icons/product_discounts.svg";
import marketing from "assets/icons/marketing.svg";
import form from "assets/icons/form.svg";
import email from "assets/icons/email.svg";
import { asyncSponsorsTracking } from "app/views/protected/plan/sponsors/sponsor_utils";
import { SponsorCardProps } from "./index.types";
import "./index.scss";

const Icons = {
    products,
    cash,
    product_discounts,
    marketing,
    form,
    email,
};

const SponsorCard = ({
    pk,
    name,
    description,
    apply_mode,
    apply_url,
    benefits,
    category,
    image,
    logo,
    response_by,
    brokenLinks,
    reportLink,
}: SponsorCardProps): ReactElement => {
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);

    const brokenLinkClass = (): string => {
        if (brokenLinks.includes(pk)) return "isDisabled";
        return "";
    };

    const disabledBrokenLink = (): boolean => brokenLinks.includes(pk);

    const renderIcons = (): JSX.Element => {
        const icons = benefits.map((benefit: SponsorBenefit): JSX.Element => {
            const icon = benefit.name.split(" ").join("_").toLowerCase();

            return (
                <div className="sponsor-card__tooltip-wrap" key={benefit.pk}>
                    <Tooltip variant="primary" label={benefit.description} placement="right">
                        <img src={Icons[icon]} key={benefit.pk} alt={benefit.name} />
                    </Tooltip>
                </div>
            );
        });

        const applyModeIcon = (
            <div className="sponsor-card__tooltip-wrap">
                <Tooltip variant="primary" label={apply_mode.description} placement="right">
                    <img
                        src={Icons[apply_mode.name.toLocaleLowerCase()]}
                        key={apply_mode.pk}
                        alt={apply_mode.name}
                    />
                </Tooltip>
            </div>
        );

        return (
            <>
                {icons}
                {applyModeIcon}
            </>
        );
    };

    return (
        <div className="sponsor-card">
            <div className="sponsor-card__wrap">
                <div className="sponsor-card__wrap-item">
                    {image && (
                        <img
                            src={image}
                            alt={name}
                            onLoad={() => setImageLoaded(true)}
                            className={`sponsor-card__image ${imageLoaded ? "hasLoaded" : ""}`}
                        />
                    )}
                    {logo && (
                        <div className="sponsor-card__logo">
                            <img src={logo} alt={name} />
                        </div>
                    )}
                </div>
                <div className="sponsor-card__wrap-item">
                    <div className="sponsor-card__content-wrap">
                        <div className="sponsor-card__broken-link">
                            <Tooltip label="Report broken link" placement="right" variant="primary">
                                <button
                                    type="button"
                                    onClick={() => reportLink(pk)}
                                    className={`${brokenLinkClass()}`}
                                    disabled={disabledBrokenLink()}
                                >
                                    <img src={broken_link} alt="broken_link" />
                                </button>
                            </Tooltip>
                        </div>
                        <div className="sponsor-card__top">
                            <h3 className="sponsor-card__title">{name}</h3>
                            <div className="sponsor-card__icons-wrap">{renderIcons()}</div>
                        </div>
                    </div>
                    <div className="sponsor-card__description">
                        <Text>{description}</Text>
                    </div>
                    <div className="sponsor-card__actions">
                        <div className="sponsor-card__actions-wrap">
                            {response_by && (
                                <p>
                                    Receive a response by:{" "}
                                    <span>{DateFormatFactory.formatDateString(response_by)}</span>
                                </p>
                            )}
                        </div>
                        <div className="sponsor-card__actions-wrap">
                            <Button
                                type="button"
                                variant="solid"
                                onClick={() => {
                                    Object.assign(document.createElement("a"), {
                                        target: "_blank",
                                        href: `${process.env.REACT_APP_BASE_URL}${apply_url}`,
                                    }).click();
                                    asyncSponsorsTracking(pk);
                                }}
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SponsorCard;
