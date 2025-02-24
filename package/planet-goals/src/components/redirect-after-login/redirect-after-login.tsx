import React from "react";
import { Navigate } from "react-router-dom";

import { IUser } from "../../types/user";
import { constantsUrls } from "../../helpers/constants";

interface IRedirectAfterLogin {
    currentUser: IUser,
    Component: React.FC,
}

const RedirectAfterLogin: React.FC<IRedirectAfterLogin> = ({ Component, currentUser }) => {
    if (currentUser) {
        if (currentUser.role) return <Navigate to={constantsUrls.LandingPage.main} replace={true} />
        return <Navigate to={constantsUrls.LandingPage.fillRegisterData} replace={true} />
    } else {
        return <Component />;
    }
}

export default RedirectAfterLogin;