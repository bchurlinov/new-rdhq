import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RaceType } from "app/types/races/race.types";
import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    ButtonGroup,
} from "@chakra-ui/react";
import { deleteAsyncRace } from "app/store/races/races.actions";
import { deleteRace } from "app/store/races/races.slice";
import { useAppDispatch } from "app/store/hooks/use_store";
import { AsyncDispatch } from "app/store/types/action.types";
import { timeout } from "app/utils/helpers";
import Storage from "app/utils/storage/local";
import STORAGE_CONSTANTS from "app/constants/storage";
import useToastMessage from "app/hooks/useToastMessage";
import URL from "app/constants/route_urls";
import { listingReportActionNavigate } from "./listing_report";
import "./index.scss";

/**
 * TODO Implement functionality to access race calendar from the Race Card
 * TODO Implement functionality to List the race on Race Calendars
 * ? If a race is being submitted, update the Race Card
 */

const RaceCard = ({
    pk,
    name,
    display_date,
    city_state,
    listed,
    logo,
    type,
}: RaceType): ReactElement => {
    const dispatch = useAppDispatch();
    const imageRef = useRef<HTMLImageElement>(null);
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
    const [deleteError, setDeleteError] = useState<boolean>(false);
    const [itemIsRemoved, setItemIsRemoved] = useState<boolean>(false);
    const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);

    // Display toast in case of error
    useToastMessage({
        message: "Something went wrong. Please try again.",
        type: "error",
        isVisible: deleteError,
    });

    // Display toast in case of error
    useToastMessage({
        message: `${name} has been successfully deleted`,
        type: "success",
        isVisible: deleteSuccess,
    });

    // To avoid memory leak close all side-effects on component unmount
    useEffect(
        () => () => {
            setPopoverOpen(false);
            setIsDeleteLoading(false);
            setDeleteError(false);
        },
        []
    );

    const raceDeleteConfirm = async (pk: number, raceType: "upcoming" | "past"): Promise<void> => {
        setIsDeleteLoading(true);

        const response: AsyncDispatch<{ pk: number; raceType: string }> = await dispatch(
            deleteAsyncRace({ pk, raceType })
        );

        setItemIsRemoved(true);
        setDeleteSuccess(true);
        setIsDeleteLoading(false);
        timeout(() => setDeleteSuccess(false), 500);

        if (response) {
            if (response.meta.requestStatus === "fulfilled") {
                timeout(() => {
                    setPopoverOpen(false);
                    dispatch(deleteRace({ pk, raceType }));
                    Storage.remove(STORAGE_CONSTANTS.currentRace);
                }, 1500);
            }

            if (response.meta.requestStatus === "rejected") {
                setDeleteError(true);
                setPopoverOpen(false);
                timeout(() => setDeleteError(false), 2000);
            }
        }
    };

    const listRaceAndFindSponsors = (): JSX.Element | null => (
        <>
            {type === "upcoming" && listed && (
                <li>
                    <img src="/assets/icons/race-calendar-menu-icon.svg" alt="calendar" />
                    <span
                        onClick={() =>
                            listingReportActionNavigate(pk, name, type, navigate, dispatch)
                        }
                        role="presentation"
                    >
                        <u>View listing report</u>
                    </span>
                </li>
            )}
            {type === "upcoming" && !listed && (
                <li>
                    <img src="/assets/icons/race-calendar-menu-icon.svg" alt="calendar" />
                    <span
                        onClick={() =>
                            listingReportActionNavigate(pk, name, type, navigate, dispatch)
                        }
                        role="presentation"
                    >
                        <u>List this race</u>
                    </span>{" "}
                    on race calendars
                </li>
            )}
            {type === "upcoming" && (
                <li>
                    <img src="/assets/icons/sponsor-finder-menu-icon.svg" alt="loupe" />
                    <span
                        onClick={() =>
                            listingReportActionNavigate(pk, name, type, navigate, dispatch)
                        }
                        role="presentation"
                    >
                        <u>Find sponsors</u>
                    </span>{" "}
                    for this race
                </li>
            )}
            {type === "past" && listed && (
                <li>
                    <img src="/assets/icons/race-calendar-menu-icon.svg" alt="calendar" />
                    <span
                        onClick={() =>
                            listingReportActionNavigate(pk, name, type, navigate, dispatch)
                        }
                        role="presentation"
                    >
                        <u>View listing report</u>
                    </span>
                </li>
            )}
        </>
    );

    return (
        <div className={`race-card ${itemIsRemoved ? "isRemoved" : ""}`}>
            <div className="race-card__logo">
                {logo && (
                    <Link to={URL.DASHBOARD}>
                        <img
                            src={logo}
                            alt={logo}
                            loading="lazy"
                            onLoad={() => setLoading(true)}
                            ref={imageRef}
                            className={`load-image ${loading ? "image-loaded" : ""}`}
                        />
                    </Link>
                )}
            </div>
            <div className="race-card__info">
                <div className="race-card__header">
                    <div className="race-card__title-wrap">
                        <h3 className="race-card__title">{name}</h3>
                    </div>
                    <h4 className="race-card__date">
                        {display_date} - {city_state}
                    </h4>
                </div>
                <div className="race-card__listed">
                    <ul>{listRaceAndFindSponsors()}</ul>
                </div>
                {type === "upcoming" && (
                    <div className="race-card__actions">
                        <div className="race-card__actions-wrap">
                            <Link className="race-card__action" to={`${URL.RACE}${pk}/`}>
                                Edit
                            </Link>
                            <Popover
                                placement="top"
                                isOpen={popoverOpen}
                                onClose={() => setPopoverOpen(false)}
                            >
                                <PopoverTrigger>
                                    <Button
                                        type="button"
                                        className="race-card__action delete-race"
                                        variant="ghost"
                                        onClick={() => setPopoverOpen(true)}
                                    >
                                        Delete
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverHeader>Delete race</PopoverHeader>
                                    <PopoverBody>
                                        Are you sure you want to delete this race ?
                                    </PopoverBody>
                                    <PopoverFooter d="flex" justifyContent="flex-end">
                                        <ButtonGroup size="sm">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setPopoverOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="solid"
                                                isLoading={isDeleteLoading}
                                                onClick={() => raceDeleteConfirm(pk, type)}
                                            >
                                                Confirm
                                            </Button>
                                        </ButtonGroup>
                                    </PopoverFooter>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RaceCard;
