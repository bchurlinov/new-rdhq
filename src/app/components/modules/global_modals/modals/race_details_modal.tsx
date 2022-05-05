import React, { ReactElement } from "react";
import { Text } from "@chakra-ui/react";
import { RaceReportType } from "app/store/races/races.types";
import { _isEmpty } from "app/utils/helpers";
import Modal from "app/components/elements/layout/modal";

const eventParticipants: { [key: string]: string } = {
    100: "0-100",
    500: "100-500",
    1000: "500-1000",
    5000: "1000-5000",
    99999: "10000+",
};

const RaceDetailsModal = ({
    isVisible,
    title,
    raceDetails,
    closeModal,
}: {
    isVisible: boolean;
    title: string;
    raceDetails: RaceReportType["race_details"];
    closeModal: () => void;
}): ReactElement => {
    const renderEvents = (): JSX.Element[] | boolean =>
        !_isEmpty(raceDetails.events) &&
        raceDetails.events.map((event, index) => (
            <div className="race-details-modal__events-wrap" key={index as number}>
                <ul className="race-details-modal__events-list" key={index as number}>
                    <li className="race-details-modal__events-list-item">
                        <span>Name:</span> {event.name}
                    </li>
                    <li className="race-details-modal__events-list-item">
                        <span>Distance:</span> {event.distance}
                    </li>
                    <li className="race-details-modal__events-list-item">
                        <span>Start time:</span> {event.start_time}
                    </li>
                    <li className="race-details-modal__events-list-item">
                        <span>Entry fee:</span> {event.entry_fee}
                    </li>
                    <li className="race-details-modal__events-list-item">
                        <span>Participants:</span> {eventParticipants[event.participants] || ""}
                    </li>
                </ul>
            </div>
        ));

    return (
        <Modal visible={isVisible} closeModal={closeModal} title={title}>
            <div className="race-details-modal">
                <div className="race-details-modal__top">
                    <Text>
                        Below you can see the details that were used to search for your race on race
                        calendars and will be used to list your race on race calendars:
                    </Text>
                </div>
                <div className="race-details-modal__details">
                    <ul className="race-details-modal__details-list">
                        <li className="race-details-modal__details-list-item">
                            <span>Date:</span> {raceDetails.date || ""}
                        </li>
                        <li className="race-details-modal__details-list-item">
                            <span>Type:</span> {raceDetails.type || ""}
                        </li>
                        <li className="race-details-modal__details-list-item">
                            <span>Venue:</span>: {raceDetails.venue || ""}
                        </li>
                        <li className="race-details-modal__details-list-item">
                            <span>Address:</span> {raceDetails.address || ""}
                        </li>
                        <li className="race-details-modal__details-list-item">
                            <span>City:</span> {raceDetails.city || ""}
                        </li>
                        <li className="race-details-modal__details-list-item">
                            <span>Region:</span> {raceDetails.region || ""}
                        </li>
                        <li className="race-details-modal__details-list-item">
                            <span>Timezone:</span> {raceDetails.timezone || ""}
                        </li>
                        <li className="race-details-modal__details-list-item">
                            <span>Website:</span>
                            <br />
                            <a href={raceDetails.website} rel="noopener noreferrer" target="_blank">
                                {raceDetails.website || ""}
                            </a>
                        </li>
                        <li className="race-details-modal__details-list-item">
                            <span>Registration page:</span>
                            <br />
                            <a
                                href={raceDetails.registration_page}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                {raceDetails.registration_page || ""}
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="race-details-modal__events">
                    <Text>Events:</Text>
                    {renderEvents()}
                </div>
            </div>
        </Modal>
    );
};

export default RaceDetailsModal;
