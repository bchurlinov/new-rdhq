import React, { ReactElement } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "app/store/hooks/use_store";
import { userState } from "app/store/user/user.slice";
import Storage from "app/utils/storage/local";
import URL from "app/constants/route_urls";

function ProtectedRoute(): ReactElement {
    const { isAuthenticated } = useAppSelector(userState);
    const token = Storage.get("access_token");
    const location = useLocation();

    return isAuthenticated || token ? (
        <Outlet />
    ) : (
        <Navigate to={URL.LOGIN} state={{ from: location }} replace />
    );
}

export default ProtectedRoute;
