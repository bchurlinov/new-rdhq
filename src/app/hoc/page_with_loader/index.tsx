import React, { ReactNode } from "react";
import { SkeletonText } from "@chakra-ui/react";
import "./index.scss";

const PageWithLoader = ({
    isLoading,
    rows,
    children,
}: {
    isLoading: boolean;
    children: ReactNode;
    rows: number;
}): JSX.Element => {
    if (isLoading) {
        return (
            <div className="page-with-loader__skeleton-wrap">
                {Array.from(
                    Array(rows),
                    (item: undefined, index: number): JSX.Element => (
                        <SkeletonText
                            key={index as number}
                            startColor="grey.250"
                            endColor="grey.100"
                            mt="4"
                            noOfLines={8}
                            spacing="6"
                            skeletonHeight="6"
                            fadeDuration={1000}
                        />
                    )
                )}
            </div>
        );
    }

    return <div>{children}</div>;
};

export default PageWithLoader;
