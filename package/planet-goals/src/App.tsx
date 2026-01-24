import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, lazy } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTolgee } from "@tolgee/react";

import "./App.css";
import { constantsUrls } from "./helpers/constants";
import { selectCurrentUser } from "./redux/user/user.selectors";
import { UserRoleEnum } from "./types/user";
import socketService from "./socket";

import { checkCurrentUser } from "./helpers/events.functions";
import { socketConnect } from "./redux/sockets/socket.actions";
import { verifyTokenExpiration } from "./helpers/shared.functions";
import { refreshTokenStart, signOut } from "./redux/user/user.actions";

import RedirectAfterLogin from "./components/redirect-after-login/redirect-after-login";
import RootContainer from "./components/root-container/root-container";
import SignIn from "./pages/sign-in/sign-in";

const LandingPage = lazy(() => import("./pages/landing-page/landing-page"));
const ChooseGameMode = lazy(() => import("./pages/choose-game-mode/choose-game-mode"));
const Confirm = lazy(() => import("./pages/confirm/confirm"));
const EditProfile = lazy(() => import("./pages/edit-profile/edit-profile"));
const FillRegisterData = lazy(() => import("./pages/fill-register-data/fill-register-data"));
const Game = lazy(() => import("./pages/game/game"));
const Lobby = lazy(() => import("./pages/lobby/lobby"));
const Materials = lazy(() => import("./pages/materials/materials"));
const UserProgress = lazy(() => import("./pages/user-progress/user-progress"));
const SignUp = lazy(() => import("./pages/sign-up/sign-up"));


function App() {
    const currentUser = useSelector(selectCurrentUser);
    const tolgee = useTolgee(["language"]);
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || !currentUser) return;
        dispatch(socketConnect(constantsUrls.Socket.url, constantsUrls.Socket.namespace));
    }, [currentUser, dispatch]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && currentUser && !verifyTokenExpiration(token)) {
            dispatch(refreshTokenStart());
        } else if (!token && currentUser) {
            dispatch(signOut());
        }
    }, [currentUser, dispatch])

    setTimeout(() => {
        if (!currentUser || socketService.isConnected()) return;
        dispatch(socketConnect(constantsUrls.Socket.url, constantsUrls.Socket.namespace));
    }, 10e3);

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
                    <Route element={checkCurrentUser(currentUser)
                        ? <Game />
                        : <Navigate to={constantsUrls.LandingPage.signIn} replace={true} />}
                        path={constantsUrls.Main.game}
                    />
                    <Route element={checkCurrentUser(currentUser)
                        ? <UserProgress />
                        : <Navigate to={constantsUrls.LandingPage.signIn} replace={true} />}
                        path={constantsUrls.Main.myProgress}
                    />
                </Routes>
            </RootContainer>
        </div>
    );
}

export default App;
