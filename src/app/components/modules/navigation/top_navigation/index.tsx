import React, { ReactElement, useRef, useState } from "react";
import { useClickOutside } from "app/hooks";
import { toggleMembersProgramModal } from "app/store/misc/misc.slice";
import { Link } from "react-router-dom";
import { IUser } from "app/store/types/user.types";
import { useAppDispatch } from "app/store/hooks/use_store";
import { _isEmpty } from "app/utils/helpers";
import RaceSelect from "app/components/modules/race_select";
import URL from "app/constants/route_urls";
import "./index.scss";

// Icons
import userIcon from "assets/icons/user.svg";
import cogIcon from "assets/icons/cog.svg";
import logOutIcon from "assets/icons/logout.svg";

function TopNavigation({
    user,
    toggleNavbar,
}: {
    user: IUser;
    toggleNavbar: () => void;
}): ReactElement {
    const dispatch = useAppDispatch();
    const [expanded, setExpanded] = useState<boolean>(false);
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useClickOutside(dropdownRef, () => {
        if (expanded) setExpanded(false);
    });

    const userDropdown = (): JSX.Element => (
        <div
            className={`top-navbar__user-settings-dropdown ${expanded ? "isToggled" : ""}`}
            ref={dropdownRef}
            style={{ height: expanded ? `${dropdownRef?.current?.scrollHeight}px` : 0 }}
        >
            <ul className={`top-navbar__user-settings-list ${expanded ? "isToggled" : ""}`}>
                <li className="top-navbar__user-settings-list-item">
                    <Link to={URL.PROFILE}>
                        <img src={userIcon} alt="user_icon" />
                        Profile
                    </Link>
                </li>
                <li className="top-navbar__user-settings-list-item">
                    <Link to={URL.ACCOUNT}>
                        <img src={cogIcon} alt="cog_icon" />
                        Account
                    </Link>
                </li>
                <li className="top-navbar__user-settings-list-item">
                    <Link to={URL.LOGOUT}>
                        <img src={logOutIcon} alt="log_out_icon" />
                        Logout
                    </Link>
                </li>
            </ul>
        </div>
    );

    return (
        user && (
            <header className="top-navbar">
                <div className="top-navbar__header">
                    <div className="top-navbar__item-wrap">
                        <div
                            className="top-navbar__hamburger"
                            onClick={toggleNavbar}
                            role="presentation"
                        >
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                    <div className="top-navbar__race-select">
                        <RaceSelect />
                    </div>
                    {!_isEmpty(user) && (
                        <div className="top-navbar__item-wrap top-navbar__item-wrap--user-settings">
                            <div className="top-navbar__plan-status">
                                <p>
                                    Your current plan:{" "}
                                    <b className="top-navbar__plan-status-bold">
                                        {user.plan && user.plan.name}
                                    </b>
                                    {user.plan && user.plan_upgradeable && (
                                        <>
                                            <b>|</b>
                                            <span
                                                onClick={() =>
                                                    dispatch(toggleMembersProgramModal())
                                                }
                                                role="presentation"
                                            >
                                                Get more with our members program
                                            </span>
                                        </>
                                    )}
                                </p>
                            </div>
                            <div
                                className="top-navbar__user-settings"
                                onClick={() => {
                                    setExpanded(!expanded);
                                }}
                                role="presentation"
                            >
                                <span onClick={(e) => e.preventDefault()} role="presentation">
                                    {user.image && (
                                        <img
                                            className={`top-navbar__user-image ${
                                                imageLoaded ? "hasLoaded" : ""
                                            }`}
                                            src={user.image}
                                            onLoad={() => setImageLoaded(true)}
                                            alt="user_image"
                                        />
                                    )}
                                </span>
                                {userDropdown()}
                            </div>
                        </div>
                    )}
                </div>
            </header>
        )
    );
}

export default TopNavigation;
