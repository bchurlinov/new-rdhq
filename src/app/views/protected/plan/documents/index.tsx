import React, { ReactElement, useEffect } from "react";
import { Heading, Text } from "@chakra-ui/react";
import { DocumentType } from "app/types/documents/document.types";
import { getAsyncDocuments } from "app/store/documents/document.actions";
import { useAppSelector, useAppDispatch } from "app/store/hooks/use_store";
import { _isEmpty } from "app/utils/helpers";
import PageWithLoader from "app/hoc/page_with_loader";
import DocumentCard from "app/components/elements/cards/document_card";
import "./index.scss";

/**
 * TODO Add CSS cases for bigger screens
 * @returns JSX
 */

const Documents = (): ReactElement => {
    const dispatch = useAppDispatch();
    const { documents, documentsError, isFetchingDocuments } = useAppSelector(
        (state) => state.documents
    );

    useEffect(() => {
        if (documents.length === 0) dispatch(getAsyncDocuments());
    }, [documents.length, dispatch]);

    const renderDocument = (): JSX.Element[] | JSX.Element => {
        if (!isFetchingDocuments && !_isEmpty(documents)) {
            const groupedDocuments = documents.reduce(
                (acc: { [key: string]: DocumentType[] }, item: DocumentType) => {
                    acc[item.category.name] = acc[item.category.name] || [];
                    acc[item.category.name].push(item);
                    return acc;
                },
                {}
            );

            return Object.keys(groupedDocuments).map((groupTitle: string) => (
                <div className="documents-templates__group" key={groupTitle}>
                    <Heading as="h2">{groupTitle}</Heading>
                    <div className="documents-templates__group-wrap">
                        {groupedDocuments[groupTitle].map((document: DocumentType) => (
                            <DocumentCard
                                key={document.pk}
                                pk={document.pk}
                                title={document.title}
                                description={document.description}
                                download_link={document.download_link}
                                format={document.format}
                                post={document.post}
                                format_display={document.format_display}
                            />
                        ))}
                    </div>
                </div>
            ));
        }

        return (
            <Text className="documents-templates__message">
                There are no offers in your region at this time.
            </Text>
        );
    };

    return (
        <div className="documents-templates">
            <Heading as="h1">Documents & Templates</Heading>
            <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Text>
            <PageWithLoader isLoading={isFetchingDocuments} rows={5}>
                <div className="documents-templates__container">
                    {!documentsError ? (
                        renderDocument()
                    ) : (
                        <Text className="documents-templates__message">
                            Something went wrong. Please refresh the page and try again.
                        </Text>
                    )}
                </div>
            </PageWithLoader>
        </div>
    );
};
export default Documents;
