import React, { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListingCreditAddon } from "app/store/payments/payments.types";
import { Button, Heading, Text } from "@chakra-ui/react";
import { ElementsConsumer, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { _isEmpty, timeout } from "app/utils/helpers";
import { getAsyncUserPlanDetails } from "app/store/user/user.actions";
import { StripeCardElementChangeEvent } from "@stripe/stripe-js";
import { useAppDispatch } from "app/store/hooks/use_store";
import { AsyncDispatch } from "app/store/types/action.types";
import Select from "app/components/elements/form/select";
import Dialog from "app/components/elements/dialog";
import StripeCardElement from "app/components/modules/payments/stripe_card_element";
import Storage from "app/utils/storage/local";
import STORAGE_CONSTANTS from "app/constants/storage";
import URL from "app/constants/route_urls";
import { useUserPayment } from "app/components/modules/payments/checkout_form/payment_hooks";
import { PaymentFormContent } from "./content";
import { CheckoutFormProps } from "./index.types";
import "./index.scss";

// @TODO - Once Panos is done with updating the subscribe route, remove the call to fetch a new user
// @TODO - Integrate Google TAG on Successful Payment
const CheckoutForm = ({
    type,
    stripe_id,
    addons,
    display_price,
    terms_conditions_url,
}: CheckoutFormProps): ReactElement => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Local state
    const [stripeError, setStripeError] = useState<string>("");
    const [paymentIsLoading, setPaymentIsLoading] = useState<boolean>(false);
    const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
    const [selectValue, setSelectValue] = useState<Partial<ListingCreditAddon>>({});
    const [cardComplete, setCardComplete] = useState<boolean>(false);

    // Custom subscription hook
    const { errors, paymentAction, resetPaymentErrors } = useUserPayment();

    // Stripe hooks
    const stripe = useStripe();
    const elements = useElements();

    // Dialog error message
    const renderErrorDialog = (): JSX.Element | boolean =>
        !_isEmpty(errors) && <Dialog message={errors} type="error" />;

    // Render Select Input's options
    const renderSelectCreditsOptions = () =>
        addons?.listing_credits
            .slice()
            .sort(
                (a: ListingCreditAddon, b: ListingCreditAddon) => a.stripe_amount - b.stripe_amount
            )
            .map((item: ListingCreditAddon) => ({
                value: JSON.stringify(item),
                name: item.description,
            }));

    // Display the Select Input for credits
    const renderSelectCredits = () => (
        <div className="plan-info-wrap__select">
            <Text variant="labelDefault">Pick a listing credit bundle</Text>
            <Select
                name="user_locations"
                options={renderSelectCreditsOptions()}
                onChange={(value: string) => setSelectValue(JSON.parse(value))}
            />
        </div>
    );

    // Action when payment is successful
    const onPaymentSuccess = (message: string, navigateTo: string): void => {
        setPaymentSuccess(true);
        Storage.set(STORAGE_CONSTANTS.paymentSuccessMessage, message);
        timeout(() => navigate(navigateTo), 500);
    };

    // Submit handler
    const handleSubmit = async (): Promise<void> => {
        const redirectTo = Storage.get(STORAGE_CONSTANTS.paymentRedirect);

        setPaymentIsLoading(true);
        if (!stripe || !elements) return;

        resetPaymentErrors();
        setStripeError("");

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod }: any = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement as any,
        });

        if (error || !_isEmpty(errors)) {
            setStripeError(error.message);
            setPaymentIsLoading(false);
            return;
        }

        setStripeError("");

        const response: AsyncDispatch<null, { id: string; customer_portal_url: string }> =
            await dispatch(getAsyncUserPlanDetails());

        if (response && response.meta.requestStatus === "fulfilled") {
            if (type === "subscription") {
                const dataToSend: { [key: string]: string } = {
                    plan: stripe_id,
                    customer: response.payload.id,
                    payment_method: paymentMethod.id,
                };

                const { success } = await paymentAction(dataToSend, "subscription");
                setPaymentIsLoading(false);

                if (success)
                    onPaymentSuccess(
                        "Your membership has been upgraded successfully",
                        redirectTo as string
                    );
                else setPaymentIsLoading(false);
            }

            if (type === "credits") {
                const dataToSend: { [key: string]: string | Partial<ListingCreditAddon> } = {
                    customer: response.payload.id,
                    payment_method: paymentMethod.id,
                    plan_details: selectValue,
                };

                const { success } = await paymentAction(dataToSend, "credits");
                setPaymentIsLoading(false);

                if (success)
                    onPaymentSuccess(
                        `${selectValue.description} were successfully added to your account`,
                        redirectTo as string
                    );
                else setPaymentIsLoading(false);
            }
        }
    };

    // Emmiter from Stripe Card component
    const stripeCardEmitter = (event: StripeCardElementChangeEvent): void => {
        if (event?.complete) setCardComplete(event.complete);
        if (event?.error) setStripeError(event.error.message);
        if (event?.error === undefined) setStripeError("");
    };

    // Render display text on the button depending on the `type`
    const buttonText = (): string => {
        if (type === "subscription") return `Pay - ${display_price}`;
        if (type === "credits") {
            if (!_isEmpty(selectValue)) return `Pay - ${selectValue.display_price}`;
            return "Pay";
        }
        return "";
    };

    const creditsButtonDisabledStatus = (): boolean => {
        if (type === "credits") {
            if (_isEmpty(selectValue)) return true;
        }

        return false;
    };

    return (
        <div className="plan-info">
            <div className="plan-info-wrap">
                <div className="plan-info__header">
                    <div
                        className="plan-info__logo"
                        onClick={() => navigate(URL.DASHBOARD)}
                        role="presentation"
                    >
                        <img src="/assets/logo.svg" alt="rdhq_logo" />
                    </div>
                    <Heading as="h3">{PaymentFormContent[type].heading}</Heading>
                    <Text>{PaymentFormContent[type].subHeading}</Text>
                </div>
                <div className="plan-info__content">
                    <div className="plan-info__content-messages">{renderErrorDialog()}</div>
                    {type === "credits" && renderSelectCredits()}
                    <div className="plan-info__card-section">
                        <Text variant="labelDefault">Card details</Text>
                        <StripeCardElement changeHandler={stripeCardEmitter} />
                        {!_isEmpty(stripeError) && <Text variant="labelError">{stripeError}</Text>}
                    </div>
                </div>
                <div className="plan-info__cta-wrap">
                    {!paymentSuccess && (
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            isLoading={paymentIsLoading}
                            disabled={
                                paymentIsLoading ||
                                !cardComplete ||
                                !_isEmpty(stripeError) ||
                                creditsButtonDisabledStatus()
                            }
                        >
                            {buttonText()}
                        </Button>
                    )}
                </div>
            </div>
            <div className="plan-info__terms">
                <Text>
                    <a
                        href={`${process.env.REACT_APP_BASE_URL}${terms_conditions_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Terms and conditions
                    </a>
                </Text>
            </div>
        </div>
    );
};

const InjectedCheckoutForm = (props: CheckoutFormProps) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <ElementsConsumer>{() => <CheckoutForm {...props} />}</ElementsConsumer>
);

export default InjectedCheckoutForm;
