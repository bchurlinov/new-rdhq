import { DeleteIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import {
    FormikInput,
    FormikNumber,
    FormikSelect,
    FormikTimePicker,
} from "app/components/elements/Formik";
import { RaceFormDataTypes } from "app/store/races/races.types";
import { RaceDetailsEventType } from "app/types/races/race.types";
import { Field } from "formik";
import React, { ReactElement } from "react";
import "./index.scss";

const RaceEvent = ({
    index,
    item,
    distance_units,
    participants,
    setFieldValue,
    deleteEvent,
}: {
    index: number;
    item: RaceDetailsEventType;
    participants: RaceFormDataTypes["participants"];
    distance_units: RaceFormDataTypes["distance_units"];
    setFieldValue: (fieldName: string, value: string | null) => void;
    deleteEvent: () => void;
}): ReactElement => (
    <div className="events__card" key={item.pk || item.id}>
        <Button className="events__delete-event" onClick={() => deleteEvent()}>
            <DeleteIcon />
        </Button>
        <div className="events__inputs-wrap">
            <Field
                label="Event name"
                name={`events.${index}.name`}
                required
                className="eventinputs-event-name"
                component={FormikInput}
            />
            <Field
                label="Distance"
                name={`events.${index}.distance`}
                required
                className="eventinputs-distance"
                component={FormikNumber}
                setFieldValue={setFieldValue}
            />
            <Field
                label="Units"
                name={`events.${index}.distance_units`}
                required
                options={distance_units}
                className="eventinputs-unit"
                component={FormikSelect}
            />

            <Field
                label="Start time"
                className="eventinputs-start-time"
                name={`events.${index}.start_time`}
                required
                setFieldValue={setFieldValue}
                component={FormikTimePicker}
            />
            <Field
                label="Entry fee"
                name={`events.${index}.entry_fee`}
                required
                className="eventinputs-entry-fee"
                component={FormikNumber}
                setFieldValue={setFieldValue}
            />
            <Field
                label="Participants"
                required
                name={`events.${index}.participants`}
                options={participants}
                className="eventinputs-participants"
                component={FormikSelect}
            />
        </div>
    </div>
);
export default RaceEvent;
