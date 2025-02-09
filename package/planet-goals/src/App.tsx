import { Route, Routes } from "react-router-dom";

import "./App.css";
import RootContainer from "./components/root-container/root-container";
import LandingPage from "./pages/landing-page/landing-page";
import SignIn from "./pages/sign-in/sign-in";

function App() {
    return (
        <>
            <RootContainer>
                <Routes>
                    <Route element={<LandingPage />} path="/" />
                    <Route element={<SignIn />} path="/signin" />
                </Routes>
            </RootContainer>
        </>
    );
}

export default App;
