import { Route, Routes } from "react-router-dom";

import "./App.css";
import RootContainer from "./components/root-container/root-container";
import LandingPage from "./pages/landing-page/landing-page";

function App() {
    return (
        <>
            <RootContainer>
                <Routes>
                    <Route element={<LandingPage />} path="/" />
                </Routes>
            </RootContainer>
        </>
    );
}

export default App;
