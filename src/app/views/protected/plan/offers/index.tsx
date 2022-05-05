import React, { ReactElement, useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "app/store/hooks/use_store";
import { Heading, Text } from "@chakra-ui/react";
import { getAsyncVendorOffers } from "app/store/vendors/vendors.actions";
import { toggleMembersProgramModal } from "app/store/misc/misc.slice";
import { _isEmpty } from "app/utils/helpers";
import { VendorOfferType } from "app/types/vendors/vendors.types";
import VendorOffersCard from "app/components/elements/cards/vendor_offers_card";
import PageWithLoader from "app/hoc/page_with_loader";
import VendorOffersModal from "app/views/protected/plan/offers/offer_modal";
import "./index.scss";

const VendorOffers = (): ReactElement => {
    const dispatch = useAppDispatch();
    const { offers } = useAppSelector((state) => state.vendors);
    const { user } = useAppSelector((state) => state.user);
    const { currentRace } = useAppSelector((state) => state.races);
    const [offerPk, setOfferPk] = useState<number | null>(null);
    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    // Fetch async vendor offers
    useEffect(() => {
        if (_isEmpty(offers.data)) dispatch(getAsyncVendorOffers());
    }, [offers, dispatch]);

    // Toggle appropriate modal depending of the user membership
    const toggleOffersModal = (pk: number, mode: "instructions" | "quote" | "payments"): void => {
        if (mode === "payments") dispatch(toggleMembersProgramModal());
        else {
            setOfferPk(pk);
            setModalVisible(true);
        }
    };

    // Memoized offer details
    const memoizedOffer = useMemo(() => {
        const offerDetails: Partial<{
            pk: number;
            title: string;
            content: string;
            sponsor: string;
            mode: "quote" | "instructions";
            claimInstructions: string;
        }> = {};
        const foundOffer = (
            type: "title" | "content" | "sponsor" | "claim_mode" | "claim_instructions" | "pk"
        ) => offers?.data?.find((offer: VendorOfferType) => offer.pk === offerPk)![type];

        if (offerPk) {
            Reflect.set(offerDetails, "pk", foundOffer("pk"));
            Reflect.set(offerDetails, "title", foundOffer("title"));
            Reflect.set(offerDetails, "content", foundOffer("content"));
            Reflect.set(offerDetails, "sponsor", foundOffer("sponsor"));
            Reflect.set(offerDetails, "mode", foundOffer("claim_mode"));
            Reflect.set(offerDetails, "claimInstructions", foundOffer("claim_instructions"));
            return offerDetails;
        }

        return null;
    }, [offerPk, offers.data]);

    // Display Vendor Offer Cards
    const renderVendorOffers = (): JSX.Element[] | boolean =>
        !offers.isLoading &&
        !_isEmpty(offers.data) &&
        offers.data.map((offer: VendorOfferType) => (
            <VendorOffersCard
                pk={offer.pk}
                key={offer.pk}
                title={offer.title}
                content={offer.content}
                image={offer.image}
                listing_url={offer.listing_url}
                premium={offer.premium}
                sponsor={offer.sponsor}
                mode={offer.claim_mode}
                planUpgreadable={user.plan_upgradeable as boolean}
                toggleModal={toggleOffersModal}
            />
        ));

    const modalFooterVisible = (): boolean => {
        if (user?.plan_upgradeable) return true;
        if (!user?.plan_upgradeable && memoizedOffer?.mode === "instructions") return false;
        return true;
    };

    return (
        <div className="vendor-offers">
            <Heading as="h1">Vendor Offers</Heading>
            <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Text>
            <PageWithLoader isLoading={offers.isLoading} rows={7}>
                <div className="vendor-offers__container">{renderVendorOffers()}</div>
                <VendorOffersModal
                    pk={memoizedOffer?.pk as number}
                    currentRace={currentRace as { pk: number; name: string }}
                    title={memoizedOffer?.title as string}
                    content={memoizedOffer?.content as string}
                    sponsor={memoizedOffer?.sponsor as string}
                    claimMode={memoizedOffer?.mode as "quote" | "instructions"}
                    claimInstructions={memoizedOffer?.claimInstructions as string}
                    isVisible={isModalVisible}
                    footerVisible={modalFooterVisible()}
                    closeModal={() => setModalVisible(false)}
                />
            </PageWithLoader>
        </div>
    );
};

export default VendorOffers;
