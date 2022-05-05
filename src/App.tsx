import React, { useEffect, ReactElement } from "react";
import { useAppDispatch } from "app/store/hooks/use_store";
import { reAuthenticate } from "app/store/user/user.slice";
import { Routes, Route, Navigate } from "react-router-dom";
import URL from "app/constants/route_urls";
import Layout from "app/hoc/layout";
import Storage from "app/utils/storage/local";

// Public views
import Login from "app/views/public/auth/login";
import Register from "app/views/public/auth/register";
import PasswordReset from "app/views/public/auth/password_reset";
import ResetPasswordConfirm from "app/views/public/auth/reset_password_confirm";
import VerifyEmail from "app/views/public/auth/verify_email";

// Protected views
import Dashboard from "app/views/protected/dashboard";
import Account from "app/views/protected/user/account";
import Profile from "app/views/protected/user/profile";
import Races from "app/views/protected/races/my_races";
import RaceImport from "app/views/protected/races/race_import";
import RaceDetails from "app/views/protected/races/race_details";
import CalendarMarketer from "app/views/protected/promote/calendar_marketer";
import VendorOffers from "app/views/protected/plan/offers";
import Documents from "app/views/protected/plan/documents";
import Sponsors from "app/views/protected/plan/sponsors";
import Logout from "app/views/misc/logout";
import Members from "app/views/protected/payments";
import MembersJoin from "app/views/protected/payments/members_join";
import ListingCredits from "app/views/protected/payments/listing_credits";

// Misc. views
import ErrorPage from "app/views/misc/error_page";

// Guards
import ProtectedRoute from "app/hoc/protected_route";

function App(): ReactElement {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const token: string | unknown = Storage.get("access_token");
        if (token) dispatch(reAuthenticate());
    }, [dispatch]);

    return (
        <Routes>
            {/* Public routes */}
            <Route path={URL.LOGIN} element={<Login />} />
            <Route path={URL.REGISTER} element={<Register />} />
            <Route path={URL.PASSWORD_RESET} element={<PasswordReset />} />
            <Route path={URL.VERIFY_PASSWORD_RESET} element={<ResetPasswordConfirm />} />
            <Route path={URL.VERIFY_EMAIL} element={<VerifyEmail />} />

            {/* <Route path={URL.DASHBOARD} element={<Navigate replace to={URL.RACES} />} /> */}
            <Route path="/" element={<Navigate replace to={URL.DASHBOARD} />} />

            {/* Protected routes */}
            <Route path="/" element={<Layout />}>
                {/* Dashboard/Home */}
                <Route element={<ProtectedRoute />}>
                    <Route path={URL.DASHBOARD} element={<Dashboard />} />
                </Route>
                {/* Account */}
                <Route element={<ProtectedRoute />}>
                    <Route path={URL.ACCOUNT} element={<Account />} />
                </Route>
                {/* Profile */}
                <Route element={<ProtectedRoute />}>
                    <Route path={URL.PROFILE} element={<Profile />} />
                </Route>
                {/* Races */}
                <Route element={<ProtectedRoute />}>
                    <Route path={URL.RACES} element={<Races />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route path={URL.RACE} element={<RaceDetails />}>
                        <Route path=":id/" element={<RaceDetails />} />
                    </Route>
                    <Route path={URL.RACE_IMPORT} element={<RaceImport />} />
                </Route>
                {/* Calendar Marketer / Reports */}
                <Route element={<ProtectedRoute />}>
                    <Route path={URL.REPORTS} element={<CalendarMarketer />} />
                </Route>
                {/* Offers */}
                <Route element={<ProtectedRoute />}>
                    <Route path={URL.OFFERS} element={<VendorOffers />} />
                </Route>
                {/* Sponsor Finder */}
                <Route element={<ProtectedRoute />}>
                    <Route path={URL.SPONSORS} element={<Sponsors />} />
                </Route>
                {/* Documents & Templates */}
                <Route element={<ProtectedRoute />}>
                    <Route path={URL.DOCUMENTS} element={<Documents />} />
                </Route>
                {/* Logout */}
                <Route element={<ProtectedRoute />}>
                    <Route path={URL.LOGOUT} element={<Logout />} />
                </Route>
            </Route>
            {/* Subscription & Memberships */}
            <Route path="/members">
                <Route element={<ProtectedRoute />}>
                    <Route path={URL.MEMBERS} element={<Members />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route path={URL.MEMBERS_JOIN} element={<MembersJoin />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route path={URL.LISTING_CREDITS} element={<ListingCredits />} />
                </Route>
            </Route>
            {/* Catch All */}
            <Route path="*" element={<ErrorPage errorCode="404" />} />
        </Routes>
    );
}

export default App;
