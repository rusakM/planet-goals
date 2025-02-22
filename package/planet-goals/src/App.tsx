import { Route, Routes } from "react-router-dom";

import "./App.css";
import { constantsUrls } from "./helpers/constants";
import Confirm from "./pages/confirm/confirm";
import LandingPage from "./pages/landing-page/landing-page";
import SignIn from "./pages/sign-in/sign-in";
import SignUp from "./pages/sign-up/sign-up";
import RootContainer from "./components/root-container/root-container";

function App() {
    return (
        <>
            <RootContainer>
                <Routes>
                    <Route element={<LandingPage />} path={constantsUrls.LandingPage.main} />
                    <Route element={<SignIn />} path={constantsUrls.LandingPage.signIn} />
                    <Route element={<SignUp />} path={constantsUrls.LandingPage.signUp} />
                    <Route element={<Confirm />} path={constantsUrls.LandingPage.confirm} />
                </Routes>
            </RootContainer>
        </>
    );
}

export default App;
