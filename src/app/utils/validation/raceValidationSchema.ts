import { object, mixed, string, number, boolean, array } from "yup";

const reqString = "This field is required";

export const raceValidationSchema = object().shape({
    pk: number().optional(),
    owner: object()
        .shape({
            pk: number().required(reqString),
            username: string().required(reqString),
            email: string().email().required(reqString),
        })
        .required(reqString),
    name: string().trim().required(reqString),
    type: object()
        .required(reqString)
        .shape({
            pk: number(),
            discipline: string(),
            name: string().required(reqString),
            display_name: string(),
        }),
    start_date: string().required(reqString),
    display_date: string(),
    weekday: string().optional(),
    start_time: string(),
    description: string().trim().required(reqString),
    events: array().of(
        object({
            pk: number().optional(),
            name: string().required(reqString),
            distance: string().required(reqString),
            distance_units: string().required(reqString),
            start_time: string().required(reqString),
            entry_fee: string().required(reqString),
            participants: string().required(reqString),
        })
    ), // RaceDetailsEventType[],
    venue: string().trim().optional().min(3, "Please provide a valid venue"),
    address: string().trim().required(reqString),
    city: string().trim().required(reqString),
    region: object()
        .shape({
            pk: number(),
            name: string(),
            code: string().required(reqString),
        })
        .required(reqString),
    city_state: string(),
    country: object().shape({
        pk: number().required(reqString),
        name: string(),
        language: string(),
        ccy: string(),
        ccy_symbol: string(),
    }),
    // locality: object()
    //     .shape({
    //         pk: number().required(reqString),
    //         name: string(),
    //         display_name: string(),
    //     })
    //     .optional(),
    postal_code: string().trim().required(reqString),
    full_address: string(),
    timezone: object()
        .shape({
            pk: number(),
            code: string().required(reqString),
            display_name: string(),
        })
        .required(reqString),
    website: string().trim().required(reqString).url("Invalid website URL"),
    logo: mixed().required(reqString),
    registration_page: string().trim().required(reqString),
    num_participants: number().optional(),
    listed: boolean(),
    display_group: string().oneOf(["past", "upcoming"]),
});
