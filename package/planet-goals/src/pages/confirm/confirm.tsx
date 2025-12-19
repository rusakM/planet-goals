import React, { useState, useEffect, FormEvent, MouseEvent, ChangeEvent } from "react";
import { useTranslate } from "@tolgee/react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import PageContainer from "../../page-components/page-container/page-container";
import PrimaryContainer from "../../components/primary-container/primary-container";
import PrimaryButton, { TButtonType } from "../../components/primary-button.tsx/primary-button";
import Spinner from "../../components/spinner/spinner.component";
import TextInput from "../../components/text-input/text-input";

import { useDeviceType } from "../../helpers/responsiveContainers";
import { checkEmailStart, verifyCodeStart, userEerrorClear } from "../../redux/user/user.actions";
import {
    selectIsLoadingData,
    selectLoginEmail,
    selectUserError,
} from "../../redux/user/user.selectors";

import { ERRORS_ENUM, ERRORS_TRANSLATIONS_MAP } from "../../api/user.api";
import { IUserLogin } from "../../types/user";

import commonStyles from "../../styles/common.module.scss";
import containerStyles from "../../styles/containers.module.scss";
import footerStyles from "../../components/footer/footer.module.scss";
import styles from "../sign-in/sign-in.module.scss";

import SmilingEarthImg from "../../assets/login-page/smiling_earth.svg";
import { createStructuredSelector } from "reselect";
import { constantsUrls } from "../../helpers/constants";
import { secondsToMinutes } from "../../helpers/shared.functions";

interface IConfirm {
    clearError?: () => void;
    isLoadingData: boolean;
    loginEmail: string;
    loginError: string;
    resendEmail?: (payload: string) => void;
    verifyCode?: (payload: IUserLogin) => void;
}

const Confirm: React.FC<IConfirm> = ({
    clearError,
    isLoadingData,
    loginEmail,
    loginError,
    resendEmail,
    verifyCode,
}) => {
    const { t } = useTranslate();
    const navigate = useNavigate();
    const { isMobile } = useDeviceType();
    const buttonstype: TButtonType = isMobile ? "default" : "action";
    const [verificationCode, setVerificationCode] = useState("");
    const [loginStarted, setLoginStarted] = useState(false);
    const [nextResendCodeInSeconds, setNextResendCodeInSeconds] = useState(0);

    useEffect(() => {
        if (
            loginError === ERRORS_ENUM.USER_WITH_EMAIL_NOT_FOUND &&
            loginStarted
        ) {
            navigate(constantsUrls.LandingPage.signUp);
        } else if (!loginError && loginStarted && loginEmail) {
            navigate(constantsUrls.LandingPage.confirm);
        }
    }, [navigate, loginError, loginStarted, loginEmail]);

    useEffect(() => {
        if (nextResendCodeInSeconds > 0) {
            setTimeout(() => setNextResendCodeInSeconds(nextResendCodeInSeconds - 1), 1000);
        }
    }, [nextResendCodeInSeconds, setNextResendCodeInSeconds]);

    const handleSubmit = async (event: FormEvent | MouseEvent) => {
        event.preventDefault();
        try {
            setLoginStarted(true);
            verifyCode({email: loginEmail, verificationCode});
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputCode = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const value = event.target.value;
        if (value.length < 7) {
            setVerificationCode(value);
            if (loginError) clearError();
        }
    }

    const sendCodeAgain = () => {
        if (nextResendCodeInSeconds === 0) {
            resendEmail(loginEmail);
            setNextResendCodeInSeconds(120);
        }
    }

    return (
        <PageContainer>
            <PrimaryContainer direction="column">
                <img
                    src={SmilingEarthImg}
                    alt="Login confirm"
                    className={styles.img}
                />
                <p
                    className={`${commonStyles.basicHeader2} ${commonStyles.darkText}`}
                >
                    {t("signin.confirm.header.enter-code")}
                </p>
                <PrimaryContainer
                    direction="column"
                    additionalClassess={containerStyles.buttonsContainer}
                >
                    <TextInput
                        name="verificationCode"
                        onChange={handleInputCode}
                        placeholder={t("signin.confirm.input-placeholder")}
                        type="text"
                        value={verificationCode}
                        error={loginError === ERRORS_ENUM.INCORRECT_VERIFICATION_CODE}
                    />
                    <p
                        className={`${commonStyles.blueText} ${footerStyles.privacyRef} ${commonStyles.noPadding} ${commonStyles.noMargin} ${commonStyles.centeredText}${nextResendCodeInSeconds > 0 ? ` ${commonStyles.nonClickableCursor}` : ''}`}
                        onClick={sendCodeAgain}
                    >
                        {t("signin.confirm.send-code-again")}
                        {nextResendCodeInSeconds > 0 && ` - ${secondsToMinutes(nextResendCodeInSeconds)}`}
                    </p>
                    {isLoadingData && <Spinner />}
                </PrimaryContainer>
                <div className={styles.errorDescriptionContainer}>
                    <p className={commonStyles.redText}>
                        {loginError && <p>{t(ERRORS_TRANSLATIONS_MAP[loginError])}</p>}
                    </p>

                </div>
            </PrimaryContainer>
            <PrimaryContainer
                direction={isMobile ? "column" : "row"}
                additionalClassess={isMobile 
                    ? `${containerStyles.buttonsContainer} ${commonStyles.bottom} ${styles.bottomButtons}`
                    : styles.bottomButtons
                }
            >
                <PrimaryButton color="orange" onClick={handleSubmit} type={buttonstype}>
                    {t("main.confirm")}
                </PrimaryButton>
                <PrimaryButton color="white" onClick={() => navigate(constantsUrls.LandingPage.main)} type={buttonstype}>
                    {t("main.back")}
                </PrimaryButton>
            </PrimaryContainer>
        </PageContainer>
    );
};

const mapDispatchToProps = (dispatch) => ({
    clearError: () => dispatch(userEerrorClear()),
    resendEmail: (payload: string) => dispatch(checkEmailStart(payload)),
    verifyCode: (payload: IUserLogin) => dispatch(verifyCodeStart(payload)),
});

const mapStateToProps = createStructuredSelector({
    loginEmail: selectLoginEmail,
    loginError: selectUserError,
    isLoadingData: selectIsLoadingData,
});

export default connect(mapStateToProps, mapDispatchToProps)(Confirm);
