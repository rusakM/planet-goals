import React, { useState, useEffect, FormEvent, MouseEvent } from "react";
import { useTranslate } from "@tolgee/react";
import { connect } from "react-redux";

import PageContainer from "../../page-components/page-container/page-container";
import PrimaryContainer from "../../components/primary-container/primary-container";
import PrimaryButton from "../../components/primary-button.tsx/primary-button";
import TextInput from "../../components/text-input/text-input";

import { handleClick, handleInputText } from "../../helpers/events.functions";

import { verifyCodeStart } from "../../redux/user/user.actions";
import {
    selectIsLoadingData,
    selectLoginEmail,
    selectUserError,
} from "../../redux/user/user.selectors";

import { ERRORS_ENUM } from "../../api/user.api";
import { IUserLogin } from "../../types/user";

import commonStyles from "../../styles/common.module.scss";
import containerStyles from "../../styles/containers.module.scss";
import footerStyles from "../../components/footer/footer.module.scss";
import styles from "../sign-in/sign-in.module.scss";

import SmilingEarthImg from "../../assets/login-page/smiling_earth.svg";
import { createStructuredSelector } from "reselect";
import { constantsUrls } from "../../helpers/constants";

interface IConfirm {
    isLoadingData: boolean;
    loginEmail: string;
    loginError: string;
    verifyCode?: (payload: IUserLogin) => void;
}

const Confirm: React.FC<IConfirm> = ({
    isLoadingData,
    loginEmail,
    loginError,
    verifyCode,
}) => {
    const { t } = useTranslate();
    const [verificationCode, setVerificationCode] = useState("");
    const [loginStarted, setLoginStarted] = useState(false);

    useEffect(() => {
        if (
            loginError === ERRORS_ENUM.USER_WITH_EMAIL_NOT_FOUND &&
            loginStarted
        ) {
            window.open(constantsUrls.LandingPage.signUp, "_self");
        } else if (!loginError && loginStarted && loginEmail) {
            window.open(constantsUrls.LandingPage.confirm, "_self");
        }
    }, [loginError, loginStarted, loginEmail]);

    const handleSubmit = async (event: FormEvent | MouseEvent) => {
        event.preventDefault();
        try {
            setLoginStarted(true);
            await verifyCode({email: loginEmail, verificationCode});
            console.log("here1", loginError);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            console.log("here err");
            //console.error(error);
        }
    };

    return (
        <PageContainer>
            <PrimaryContainer direction="column">
                <img
                    src={SmilingEarthImg}
                    alt="Login confirm"
                    className={styles.img}
                />
                <p
                    className={`${commonStyles.basicHeader} ${commonStyles.darkText}`}
                >
                    {t("signin.confirm.header.enter-code")}
                </p>
                <PrimaryContainer
                    direction="column"
                    additionalClassess={containerStyles.buttonsContainer}
                >
                    <TextInput
                        name="verificationCode"
                        onChange={handleInputText(setVerificationCode)}
                        placeholder={t("signin.confirm.input-placeholder")}
                        type="text"
                        value={verificationCode}
                    />
                    <p
                        className={`${commonStyles.blueText} ${footerStyles.privacyRef} ${commonStyles.noPadding} ${commonStyles.noMargin} ${commonStyles.centeredText}`}
                        onClick={handleClick("/signup")}
                    >
                        {t("signin.confirm.send-code-again")}
                    </p>
                    {isLoadingData && <p>...Loading</p>}
                    {loginError && <p>{loginError}</p>}
                </PrimaryContainer>
            </PrimaryContainer>
            <PrimaryContainer
                direction="column"
                additionalClassess={`${containerStyles.buttonsContainer} ${commonStyles.bottom} ${styles.bottomButtons}`}
            >
                <PrimaryButton color="orange" onClick={handleSubmit}>
                    {t("main.confirm")}
                </PrimaryButton>
                <PrimaryButton color="white" onClick={handleClick("/")}>
                    {t("main.back")}
                </PrimaryButton>
            </PrimaryContainer>
        </PageContainer>
    );
};

const mapDispatchToProps = (dispatch) => ({
    verifyCode: (payload: IUserLogin) => dispatch(verifyCodeStart(payload)),
});

const mapStateToProps = createStructuredSelector({
    loginEmail: selectLoginEmail,
    loginError: selectUserError,
    isLoadingData: selectIsLoadingData,
});

export default connect(mapStateToProps, mapDispatchToProps)(Confirm);
