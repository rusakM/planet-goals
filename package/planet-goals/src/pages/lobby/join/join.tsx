import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import { useTranslate } from "@tolgee/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import PageContainer from "../../../page-components/page-container/page-container";
import PrimaryButton, { TButtonSize, TButtonType } from "../../../components/primary-button.tsx/primary-button";
import PrimaryContainer from "../../../components/primary-container/primary-container";
import CodeInput from "../../../components/code-input/code-input";
import { useDeviceType } from "../../../helpers/responsiveContainers";

import { joinGameStart, setGameStage } from "../../../redux/game/game.actions";
import { selectCurrentGame, selectGameError, selectPlayerRole } from "../../../redux/game/game.selectors";
import { selectCurrentUser } from "../../../redux/user/user.selectors";

import styles from "./join.module.scss";
import commonStyles from "../../../styles/common.module.scss";
import containerStyles from "../../../styles/containers.module.scss";
import signInStyles from "../../sign-in/sign-in.module.scss";
import lobbyStyles from "../lobby/lobby.module.scss";
import { constantsUrls } from "../../../helpers/constants";

const Join: React.FC = () => {
    const { t } = useTranslate();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isMobile } = useDeviceType();
    const buttonsSize: TButtonSize = isMobile ? "desktopSmall" : "regular";
    const buttonsType: TButtonType = isMobile ? "default" : "action";
    const currentUser = useSelector(selectCurrentUser);
    const currentGame = useSelector(selectCurrentGame);
    const playerRole = useSelector(selectPlayerRole);
    const validator = new RegExp("[A-Z0-9]", "g");
    const inputRef = useRef<HTMLInputElement>(null);
    
    const [code, setCode] = useState<string>("");
    const validationError = useSelector(selectGameError);

    useEffect(() => {
        if (currentGame && currentGame?.invitationCode === code) {
            dispatch(setGameStage("lobby"));
        }
    }, [currentGame, code, dispatch]);

    useEffect(() => {
        if (!currentUser) navigate(constantsUrls.LandingPage.signIn);
    }, [currentUser, navigate]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const val = event.target.value.toUpperCase();
        if (val.length > 5 || (!validator.test(val) && val !== "")) return;
        setCode(val);
    }

    const joinGame = () => {
        dispatch(joinGameStart({
            invitationCode: code,
            playerRole
        }));
    }

    return (
        <PageContainer>
            <PrimaryContainer direction="column">
                <p className={`${styles.header} ${commonStyles.basicHeader6} ${commonStyles.darkText}`}>
                    {t("lesson.code.header")}
                </p>
                <div className={styles.inputsContainer}>
                    <CodeInput 
                        value={code || ""} 
                        error={validationError?.length > 0} 
                        name={'input-code'}
                        handleChange={handleChange}
                        ref={inputRef}
                    />
                </div>
                {
                    validationError?.length > 0 && 
                    <p className={`${commonStyles.redText} ${commonStyles.basicText} ${commonStyles.smallHorizontalPadding}`}>{t("lesson.code.invalid")}</p>
                }
            </PrimaryContainer>
            <PrimaryContainer additionalClassess={isMobile 
                    ? `${containerStyles.buttonsContainer} ${commonStyles.bottom} ${signInStyles.bottomButtons} ${lobbyStyles.navButtons}`
                    : signInStyles.bottomButtons
                }>
                <PrimaryButton color="orange" disabled={code.length !== 5} onClick={joinGame} type={buttonsType} size={buttonsSize}>
                    {t("main.confirm")}
                </PrimaryButton>
                <PrimaryButton onClick={() => navigate(constantsUrls.Main.startLessons)} type={buttonsType} size={buttonsSize}>
                    {t("main.back")}
                </PrimaryButton>
            </PrimaryContainer>
        </PageContainer>
    )
}

export default Join;