import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTolgee } from "@tolgee/react";

import "./App.css";
import { constantsUrls } from "./helpers/constants";
import { selectCurrentUser } from "./redux/user/user.selectors";
import { UserRoleEnum } from "./types/user";

import ChooseGameMode from "./pages/choose-game-mode/choose-game-mode";
import Confirm from "./pages/confirm/confirm";
import EditProfile from "./pages/edit-profile/edit-profile";
import FillRegisterData from "./pages/fill-register-data/fill-register-data";
import LandingPage from "./pages/landing-page/landing-page";
import Lobby from "./pages/lobby/lobby";
import Materials from "./pages/materials/materials";
import RedirectAfterLogin from "./components/redirect-after-login/redirect-after-login";
import RootContainer from "./components/root-container/root-container";
import SignIn from "./pages/sign-in/sign-in";
import SignUp from "./pages/sign-up/sign-up";

import { checkCurrentUser } from "./helpers/events.functions";

function App() {
    const currentUser = useSelector(selectCurrentUser);
    const tolgee = useTolgee(["language"]);
    return (
        <div lang={tolgee.getLanguage()}>
            <RootContainer>
                <Routes>
                    <Route element={<LandingPage />} path={constantsUrls.LandingPage.main} />
                    <Route element={<RedirectAfterLogin currentUser={currentUser} Component={SignIn}/>} path={constantsUrls.LandingPage.signIn} />
                    <Route element={<RedirectAfterLogin currentUser={currentUser} Component={SignUp} />} path={constantsUrls.LandingPage.signUp} />
                    <Route element={<RedirectAfterLogin currentUser={currentUser} Component={Confirm} />} path={constantsUrls.LandingPage.confirm} />
                    <Route element={checkCurrentUser(currentUser) 
                        ? <EditProfile /> 
                        : <Navigate to={constantsUrls.LandingPage.main} replace={true} />}
                        path={constantsUrls.Main.myProfile} 
                    />
                    <Route element={checkCurrentUser(currentUser) && currentUser?.role === UserRoleEnum.TEACHER
                        ? <Materials/>
                        : <Navigate to={constantsUrls.LandingPage.main} replace={true} />}
                        path={constantsUrls.Main.materials}
                    />
                    <Route element={((currentUser && currentUser?.firstName) || !currentUser)
                        ? <Navigate to={constantsUrls.LandingPage.main } replace={true} />
                        : <FillRegisterData /> } 
                        path={constantsUrls.LandingPage.fillRegisterData}
                    />
                    <Route element={checkCurrentUser(currentUser)
                        ? <ChooseGameMode />
                        : <Navigate to={constantsUrls.LandingPage.signIn} replace={true} />}
                        path={constantsUrls.Main.startLessons}
                    />
                    <Route element={checkCurrentUser(currentUser)
                        ? <Lobby />
                        : <Navigate to={constantsUrls.LandingPage.signIn} replace={true} />}
                        path={constantsUrls.Main.lobby}
                    />
                </Routes>
            </RootContainer>
        </div>
    );
}

export default App;
