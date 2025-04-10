import React, { ChangeEvent, KeyboardEvent, useState, useRef } from "react";
import { useTranslate } from "@tolgee/react";
import { useNavigate } from "react-router-dom";

import PageContainer from "../../../page-components/page-container/page-container";
import PrimaryButton from "../../../components/primary-button.tsx/primary-button";
import PrimaryContainer from "../../../components/primary-container/primary-container";
import CodeInput from "../../../components/code-input/code-input";
import { useDeviceType } from "../../../helpers/responsiveContainers";

import styles from "./join.module.scss";
import commonStyles from "../../../styles/common.module.scss";
import containerStyles from "../../../styles/containers.module.scss";
import signInStyles from "../../sign-in/sign-in.module.scss";

import { constantsUrls } from "../../../helpers/constants";


const Join: React.FC = () => {
    const { t } = useTranslate();
    const navigate = useNavigate();
    const { isMobile } = useDeviceType();
    const validator = new RegExp("[A-Z0-9]", "g");
    const inputs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    const [code, setCode] = useState<string[]>(["", "", "", "", ""]);
    //const [lastChar, setLastChar] = useState<string>("");
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const validationError = false;

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
                                error={validationError} name={`input-${index}`}
                                handleChange={handleChange}
                                handleClick={() => handleClick(index) }
                                handleKeyDown={(event: KeyboardEvent<HTMLInputElement>) => handleKeyDown(event, index)}
                                ref={inputs[index]}
                            />)
                    }
                </div>
            </PrimaryContainer>
            <PrimaryContainer additionalClassess={isMobile 
                    ? `${containerStyles.buttonsContainer} ${commonStyles.bottom} ${signInStyles.bottomButtons}`
                    : signInStyles.bottomButtons
                }>
                <PrimaryButton color="orange" disabled={code.join("").length !== 5} onClick={() => console.log(`btn clicked, code: ${code}`)} type="action">
                    {t("main.confirm")}
                </PrimaryButton>
                <PrimaryButton onClick={() => navigate(constantsUrls.Main.startLessons)} type="action">
                    {t("main.back")}
                </PrimaryButton>
            </PrimaryContainer>
        </PageContainer>
    )
}

export default Join;