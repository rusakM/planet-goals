import React, { ChangeEvent, KeyboardEvent, useState, useRef, useEffect } from "react";
import { useTranslate } from "@tolgee/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import PageContainer from "../../../page-components/page-container/page-container";
import PrimaryButton, { TButtonSize, TButtonType } from "../../../components/primary-button.tsx/primary-button";
import PrimaryContainer from "../../../components/primary-container/primary-container";
import CodeInput from "../../../components/code-input/code-input";
import { useDeviceType } from "../../../helpers/responsiveContainers";

import { joinGameStart, setGameStage } from "../../../redux/game/game.actions";
import { selectCurrentGame, selectGameError } from "../../../redux/game/game.selectors";
//import { selectCurrentUser } from "../../../redux/user/user.selectors";

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
    //const currentUser = useSelector(selectCurrentUser);
    const currentGame = useSelector(selectCurrentGame);
    const validator = new RegExp("[A-Z0-9]", "g");
    const inputs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    const [code, setCode] = useState<string[]>(["", "", "", "", ""]);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const validationError = useSelector(selectGameError);

    useEffect(() => {
        if (currentGame && currentGame?.invitationCode === code.join("")) {
            dispatch(setGameStage("lobby"));
        }
    }, [currentGame, code, dispatch]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const val = event.target.value.toUpperCase();
        const codeCopy = [...code];
        let newIndex = activeIndex + 1;
        console.log(val);
        if (!validator.test(val) && val !== "") return;

        if (val !== "") {
            if (activeIndex > 4) return;
            codeCopy[activeIndex] = val[val.length - 1];
            newIndex = activeIndex < 4 ? activeIndex + 1 : activeIndex;
        } else {
            codeCopy[activeIndex] = "";
            newIndex = (activeIndex > 0) ? activeIndex - 1 : activeIndex;
        }
        
        setCode(codeCopy);
        //setLastChar(val);
        setActiveIndex(newIndex);
        inputs[newIndex].current.focus();
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (index === 0) return;
        const newIndex = index - 1;
        if (event.key === "Backspace" && inputs[index].current.value === "") {
            inputs[newIndex].current.focus();
        }
    }

    const handleClick = (index: number) => {
        setActiveIndex(index);
    }

    const joinGame = () => {
        dispatch(joinGameStart({
            invitationCode: code.join('')
        }));
    }

    return (
        <PageContainer>
            <PrimaryContainer direction="column">
                <p className={`${styles.header} ${commonStyles.basicHeader6} ${commonStyles.darkText}`}>
                    {t("lesson.code.header")}
                </p>
                <div className={styles.inputsContainer}>
                    {
                        [0, 1, 2, 3, 4].map(index => 
                            <CodeInput 
                                value={code?.[index] || ""} 
                                isActive={index === activeIndex} 
                                error={validationError?.length > 0} name={`input-${index}`}
                                handleChange={handleChange}
                                handleClick={() => handleClick(index) }
                                handleKeyDown={(event: KeyboardEvent<HTMLInputElement>) => handleKeyDown(event, index)}
                                ref={inputs[index]}
                                key={index}
                            />)
                    }
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
                <PrimaryButton color="orange" disabled={code.join("").length !== 5} onClick={joinGame} type={buttonsType} size={buttonsSize}>
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