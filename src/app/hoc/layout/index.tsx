import React, { ReactElement, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "app/store/hooks/use_store";
import { userState } from "app/store/user/user.slice";
import { getAsyncUser } from "app/store/user/user.actions";
import { _isEmpty } from "app/utils/helpers";
import { IUser } from "app/store/types/user.types";
import TopNavigation from "app/components/modules/navigation/top_navigation";
import SideNavigation from "app/components/modules/navigation/side_navigation";
import LoadingScreen from "app/components/elements/loading_screen";
import GlobalModals from "app/components/modules/global_modals";
import Storage from "app/utils/storage/local";
import STORAGE_CONSTANTS from "app/constants/storage";
import useToastMessage from "app/hooks/useToastMessage";
import "./index.scss";

const Layout = (): ReactElement | null => {
    const dispatch = useAppDispatch();
    const { authLoading, isAuthenticated, user } = useAppSelector(userState);

    // Local storage
    const payment_message = Storage.get(STORAGE_CONSTANTS.paymentSuccessMessage);
    const user_login_message = Storage.get(STORAGE_CONSTANTS.loginSuccessMessage);

    // Local state
    const [isNavbarToggled, setIsNavbarToggled] = useState<boolean>(false);

    // If there is a token re-authenticate the user
    useEffect(() => {
        if (isAuthenticated && _isEmpty(user)) dispatch(getAsyncUser());
    }, [user, authLoading, isAuthenticated, dispatch]);

    // Display success message after payment
    useToastMessage({
        message: payment_message,
        type: "success",
        storage: STORAGE_CONSTANTS.paymentSuccessMessage,
        isVisible: !_isEmpty(payment_message),
    });

    // Display message after user login
    useToastMessage({
        message: user_login_message,
        type: "success",
        storage: STORAGE_CONSTANTS.loginSuccessMessage,
        isVisible: !_isEmpty(user_login_message),
    });

    if (!isAuthenticated) return <Outlet />;

    return authLoading && _isEmpty(user) ? (
        <LoadingScreen />
    ) : (
        <main className="layout">
            <GlobalModals />
            <TopNavigation
                user={user as IUser}
                toggleNavbar={() => setIsNavbarToggled(!isNavbarToggled)}
            />
            <SideNavigation
                user={user as IUser}
                isNavbarToggled={isNavbarToggled}
                toggleNavbar={() => setIsNavbarToggled(!isNavbarToggled)}
            />
            <div className={`main-content ${isNavbarToggled ? "isToggled" : ""}`}>
                <Outlet />
            </div>
        </main>
    );
};

export default Layout;
