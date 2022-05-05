import React, { useEffect } from "react";
import { Button } from "@chakra-ui/react";
import { toggleMembersProgramModal, toggleNoListingCreditsModal } from "app/store/misc/misc.slice";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAppDispatch } from "app/store/hooks/use_store";

import URL from "app/constants/route_urls";
import API from "app/utils/api/axios";

const Home = () => {
    const navigate = useNavigate();
    // const location = useLocation();
    const dispatch = useAppDispatch();

    useEffect(() => {
        navigate(URL.RACES);
    }, [navigate]);

    return (
        <div style={{ height: "1000px" }}>
            <h1 style={{ fontSize: "50px" }}>Welcome to the home page</h1>
            <Button onClick={() => dispatch(toggleNoListingCreditsModal())}>
                Toggle no credits modal
            </Button>
            <br />
            <br />
            <Button onClick={() => navigate("/members/", { state: { to: URL.MEMBERS_JOIN } })}>
                NEW MEMBERSHIP
            </Button>
            <br />
            <br />
            <Button onClick={() => navigate("/members/", { state: { to: URL.LISTING_CREDITS } })}>
                LISTING CREDITS
            </Button>

            <br />
            <br />
            <Link to={URL.RACE}>GO to Race Details</Link>
            <br />
            <br />
            <Link to={`${URL.RACE}1594/`}>GO to Race PK</Link>
            <br />
            <br />
            <Link to={`${URL.RACE}bojan/`}>NOT NUMERIC</Link>
            <br />
            <br />
            <hr />
            <br />
            <Link to="/race/import?url=https://runsignup.com/Race/NY/Utica/RoadrunnersScavengerHunt">
                RACE IMPORT
            </Link>
            <br />
            <br />
            <Link to="/race/import?url=https://runsignup.com/Race/NY/Utica/Roa">
                RACE IMPORT ERROR URL
            </Link>
            <br />
            <br />
            <Link to="/race/import?url=">RACE IMPORT EMPTY URL</Link>
        </div>
    );
};

export default Home;
