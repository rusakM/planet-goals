import React, { useState, useEffect, FormEvent, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslate } from "@tolgee/react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import PageContainer from "../../page-components/page-container/page-container";
import PrimaryContainer from "../../components/primary-container/primary-container";
import PrimaryButton, { TButtonType } from "../../components/primary-button.tsx/primary-button";
import TextInput from "../../components/text-input/text-input";

import { handleInputText } from "../../helpers/events.functions";
import { useDeviceType } from "../../helpers/responsiveContainers";
import { checkEmailStart } from "../../redux/user/user.actions";
import {
    selectIsLoadingData,
    selectLoginEmail,
    selectUserError,
} from "../../redux/user/user.selectors";

import { ERRORS_ENUM } from "../../api/user.api";

import commonStyles from "../../styles/common.module.scss";
import containerStyles from "../../styles/containers.module.scss";
import footerStyles from "../../components/footer/footer.module.scss";
import styles from "./sign-in.module.scss";
import Spinner from "../../components/spinner/spinner.component";

import SmilingEarthImg from "../../assets/login-page/smiling_earth.svg";
import { constantsUrls } from "../../helpers/constants";

interface ISignIn {
    checkEmail?: (email: string) => void;
    isLoadingData: boolean;
    loginEmail: string;
    loginError: string;
}

const SignIn: React.FC<ISignIn> = ({
    checkEmail,
    isLoadingData,
    loginEmail,
    loginError,
}) => {
    const navigate = useNavigate();
    const { t } = useTranslate();
    const { isMobile } = useDeviceType();
    const buttonstype: TButtonType = isMobile ? "default" : "action";
    const [email, setEmail] = useState("");
    const [loginStarted, setLoginStarted] = useState(false);

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

    const handleSubmit = async (event: FormEvent | MouseEvent) => {
        event.preventDefault();
        try {
            setLoginStarted(true);
            await checkEmail(email);
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
                    alt="Sign in"
                    className={styles.img}
                />
                <p
                    className={`${commonStyles.basicHeader2} ${commonStyles.darkText}`}
                >
                    {t("main.signin")}
                </p>
                <PrimaryContainer
                    direction="column"
                    additionalClassess={containerStyles.buttonsContainer}
                >
                    <TextInput
                        name="email"
                        onChange={handleInputText(setEmail)}
                        placeholder="E-mail"
                        type="email"
                        value={email}
                    />
                    <p
                        className={`${commonStyles.blueText} ${footerStyles.privacyRef} ${commonStyles.noPadding} ${commonStyles.noMargin} ${commonStyles.centeredText}`}
                        onClick={() => navigate(constantsUrls.LandingPage.signUp)}
                    >
                        {t("main.register-question")}
                    </p>
                    {isLoadingData && <Spinner />}
                    {loginError && <p>{loginError}</p>}
                </PrimaryContainer>
            </PrimaryContainer>
            <PrimaryContainer
                direction={isMobile ? "column" : "row"}
                additionalClassess={isMobile 
                    ? `${containerStyles.buttonsContainer} ${commonStyles.bottom} ${styles.bottomButtons}`
                    : styles.bottomButtons
                }
            >
                <PrimaryButton color="orange" onClick={handleSubmit} type={buttonstype}>
                    {t("main.signin")}
                </PrimaryButton>
                <PrimaryButton color="white" onClick={() => navigate(constantsUrls.LandingPage.main)} type={buttonstype}>
                    {t("main.back")}
                </PrimaryButton>
            </PrimaryContainer>
        </PageContainer>
    );
};

const mapDispatchToProps = (dispatch) => ({
    checkEmail: (email: string) => dispatch(checkEmailStart(email)),
});

const mapStateToProps = createStructuredSelector({
    loginEmail: selectLoginEmail,
    loginError: selectUserError,
    isLoadingData: selectIsLoadingData,
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
