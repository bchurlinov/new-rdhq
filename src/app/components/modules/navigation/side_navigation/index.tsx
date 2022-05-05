import React, { ReactElement, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { IUser } from "app/store/types/user.types";
import { Tooltip } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { sideNavData, SideNavDataType } from "app/lib/navigation";
import { SideNavChild, SideNavParent } from "app/lib/navigation/types";
import { timeout, _isEmpty } from "app/utils/helpers";
import logo from "assets/logo.svg";
import logoFull from "assets/logo_full.svg";
import "./index.scss";

function SideNavigation({
    user,
    isNavbarToggled,
    toggleNavbar,
}: {
    user: IUser;
    isNavbarToggled: boolean;
    toggleNavbar: () => void;
}): ReactElement {
    const location = useLocation();
    const isRouteActive = (link: string): boolean => location && location.pathname.includes(link);

    // Display nav children
    const renderGroupChildren = (children: SideNavChild[]): JSX.Element[] =>
        children &&
        children.map((child: SideNavChild) => (
            <Tooltip
                isDisabled={isNavbarToggled}
                label={child.label}
                placement="right"
                variant="primary"
                key={child.id}
            >
                <li
                    className={`${isRouteActive(child.type) ? "nav-active" : ""} ${
                        !child.current ? "notCurrent" : ""
                    }`}
                >
                    <Link className={`${isNavbarToggled ? "toggled" : ""} `} to={child.href}>
                        <img src={child.img} width="17" height="17" alt={child.imgAlt} />
                        <span className={`sidespan ${isNavbarToggled ? "toggled" : ""}`}>
                            {child.title}
                        </span>
                    </Link>
                </li>
            </Tooltip>
        ));

    // Display nav parents
    const renderGroupParents = (parents: SideNavDataType): (JSX.Element | null)[] =>
        parents.map((item: SideNavParent) => {
            if (!_isEmpty(user) && user.location.apps[item.type]) {
                return (
                    <Fragment key={item.id}>
                        {item.title && isNavbarToggled && <h5 className="toggled">{item.title}</h5>}
                        <ul>{!_isEmpty(item) && renderGroupChildren(item.children)}</ul>
                    </Fragment>
                );
            }
            return null;
        });

    // Display nav items
    const renderSideNavItems = (): (JSX.Element | null)[] => renderGroupParents(sideNavData);

    return (
        <div className={`side-navigation ${isNavbarToggled && "toggled"}`}>
            <div className="side-navigation__top-wrap">
                <Link to="/" className={`side-navigation__logo ${isNavbarToggled && "toggled"}`}>
                    {isNavbarToggled ? (
                        <img
                            className={`toggled ${isNavbarToggled ? "toggled-active" : ""}`}
                            src={logoFull}
                            alt="rdhq_logo"
                        />
                    ) : (
                        <img
                            src={logo}
                            className={`not-toggled ${
                                !isNavbarToggled ? "not-toggled-active" : ""
                            }`}
                            alt="rdhq_logo"
                        />
                    )}
                </Link>
                {isNavbarToggled && (
                    <span
                        onClick={toggleNavbar}
                        className="side-navigation__close-sidenav"
                        role="presentation"
                    >
                        <CloseIcon />
                    </span>
                )}
            </div>

            <header className={`side-navigation__links-wrap ${isNavbarToggled && "toggled"}`}>
                {renderSideNavItems()}
            </header>
        </div>
    );
}

export default SideNavigation;
