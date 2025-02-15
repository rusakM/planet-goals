import { Route, Routes } from "react-router-dom";

import "./App.css";
import { constantsUrls } from "./helpers/constants";
import RootContainer from "./components/root-container/root-container";
import LandingPage from "./pages/landing-page/landing-page";
import SignIn from "./pages/sign-in/sign-in";
import SignUp from "./pages/sign-up/sign-up";

function App() {
    return (
        <>
            <RootContainer>
                <Routes>
                    <Route element={<LandingPage />} path={constantsUrls.LandingPage.main} />
                    <Route element={<SignIn />} path={constantsUrls.LandingPage.signIn} />
                    <Route element={<SignUp />} path={constantsUrls.LandingPage.signUp} />
                </Routes>
            </RootContainer>
        </>
    );
}

export default App;
