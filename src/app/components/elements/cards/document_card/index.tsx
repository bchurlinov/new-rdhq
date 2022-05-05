import React, { ReactElement, useState } from "react";
import { DocumentType } from "app/types/documents/document.types";
import { Heading } from "@chakra-ui/react";
import API from "app/utils/api/axios";
import "./index.scss";

const DocumentCard = ({
    pk,
    description,
    download_link,
    format,
    post,
    title,
    format_display,
}: Omit<DocumentType, "category">): ReactElement => {
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);

    const asyncSponsorsTracking = async () => {
        await API.get(`/api/documents/${pk}/open/`);
    };

    return (
        <div className="documents-templates-card">
            <div className="documents-templates-card__image">
                {format && (
                    <figure>
                        <img
                            className={`load-image ${imageLoaded && "image-loaded"}`}
                            src={format && `/assets/documents/${format}.png`}
                            onLoad={() => setImageLoaded(true)}
                            alt="document"
                        />
                    </figure>
                )}
            </div>
            <div className="documents-templates-card__information">
                <div className="documents-templates-card__information-header">
                    <Heading as="h5">{title}</Heading>
                    <Heading as="h6">Format: {format_display}</Heading>
                    <p>{description}</p>
                </div>
            </div>
            <div className="documents-templates-card__information-cta">
                <a
                    onClick={asyncSponsorsTracking}
                    href={`${process.env.REACT_APP_BASE_URL}${download_link}`}
                    target="_parent"
                    rel="noopener noreferrer"
                    download
                >
                    Download
                </a>
                {post && (
                    <a
                        href={`${process.env.REACT_APP_BASE_URL}${post.url}`}
                        target="_blank"
                        data-type="help"
                        rel="noreferrer"
                    >
                        Help
                    </a>
                )}
            </div>
        </div>
    );
};

export default DocumentCard;
