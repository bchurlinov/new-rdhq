import React, { useEffect, useState, ReactElement } from "react";
import { useAppDispatch, useAppSelector } from "app/store/hooks/use_store";
import { getAsyncRaces } from "app/store/races/races.actions";
import { renderRacesContent } from "app/components/templates/races/";
import Pagination from "rc-pagination";
import PageWithLoader from "app/hoc/page_with_loader";
import "app/components/templates/races/index.scss";

const PastRaces = (): ReactElement => {
    const dispatch = useAppDispatch();
    const { races } = useAppSelector((state) => state.races);

    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        if (races.past.page !== currentPage)
            dispatch(getAsyncRaces({ filter: "past", page: currentPage }));
    }, [dispatch, races.past, currentPage]);

    const paginationHandler = (page: number): void => {
        window.scrollTo(0, 0);
        setCurrentPage(page);
    };

    return (
        <PageWithLoader isLoading={races.past.isLoading || races.past.page === 0} rows={7}>
            <div className="races__wrap">
                <div className={`races__inner-wrap ${races.past.isLoading ? "isLoading" : ""}`}>
                    {renderRacesContent(races.past.isLoading, races.past.results)}
                </div>
                {races.past.count > 10 && (
                    <div className="races__pagination">
                        <Pagination
                            onChange={(page: number) => paginationHandler(page)}
                            current={currentPage}
                            total={races.past.count}
                            showTitle
                        />
                    </div>
                )}
            </div>
        </PageWithLoader>
    );
};

export default PastRaces;
