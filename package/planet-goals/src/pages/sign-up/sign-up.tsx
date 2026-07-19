import React, { useState, useEffect, FormEvent, MouseEvent, ChangeEvent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslate } from "@tolgee/react";
import { useDispatch, useSelector } from "react-redux";

import Checkbox from "../../components/checkbox/checkbox";
import PageContainer from "../../page-components/page-container/page-container";
import PrimaryContainer from "../../components/primary-container/primary-container";
import PrimaryButton, { TButtonType } from "../../components/primary-button.tsx/primary-button";
import TextInput from "../../components/text-input/text-input";
// import SmallSpinner from "../../components/small-spinner/small-spinner";
import Spinner from "../../components/spinner/spinner.component";

import { downloadFile, handleInputText } from "../../helpers/events.functions";
import { useDeviceType } from "../../helpers/responsiveContainers";

import { checkEmailStart, clearUserState, signUpStart } from "../../redux/user/user.actions";
import {
    selectIsLoadingData,
    selectLoginEmail,
    selectUserError,
} from "../../redux/user/user.selectors";

import { ERRORS_ENUM } from "../../api/user.api";

import commonStyles from "../../styles/common.module.scss";
import containerStyles from "../../styles/containers.module.scss";
import footerStyles from "../../components/footer/footer.module.scss";
import styles from "../sign-in/sign-in.module.scss";
import internalStyles from "./sign-up.module.scss";

import SmilingEarthImg from "../../assets/login-page/smiling_earth.svg";
import { constantsUrls } from "../../helpers/constants";
import { UserValidators } from "../../helpers/validators.ts/user";
import { getCurrentLocale } from "../../translations/utils";

const SignUp: React.FC = () => {
    const { t } = useTranslate();
    const { isMobile } = useDeviceType();
    const dispatch = useDispatch();
    const loginEmail = useSelector(selectLoginEmail);
    const loginError = useSelector(selectUserError);
    const isLoadingData = useSelector(selectIsLoadingData);
    const buttonsType: TButtonType = isMobile ? "default" : "action";
    const navigate = useNavigate();
    const [email, setEmail] = useState(loginEmail || "");
    const [inputWasChanged, setInputWasChanged] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [formError, setFormError] = useState({
        confirm: false,
        email: false,
    });
    const [loginStarted, setLoginStarted] = useState(false);

    useEffect(() => {
        if (
            loginError === ERRORS_ENUM.USER_EMAIL_EXIST &&
            loginStarted
        ) {
            dispatch(checkEmailStart(email))
        } else if (!loginError && loginStarted && loginEmail) {
            console.log('navigate to confirm', loginEmail);
            navigate(constantsUrls.LandingPage.confirm);
        }
    }, [navigate, loginError, loginStarted, loginEmail]);

    useEffect(() => {
        if (!inputWasChanged && loginEmail && !email) {
            setEmail(loginEmail);
        }
    }, [inputWasChanged, loginEmail]);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            handleSubmit(event);
        }
    };

    const handleSubmit = async (event: FormEvent | MouseEvent) => {
        event.preventDefault();
        try {
            const validateError = !!(UserValidators.email.validate(email)?.error) || null;
            if (!email || !confirm || validateError) {
                setFormError({
                    confirm: !confirm,
                    email: validateError ? true : !email
                });
                return;
            }
            setLoginStarted(true);
            dispatch(signUpStart({ email, userInterfaceLanguage: getCurrentLocale() }));
        } catch { /* empty */ }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setConfirm(event.target.checked);
        setFormError({
            ...formError,
            confirm: false
        });
    }

    const goBack = useCallback(() => {
        dispatch(clearUserState())
        navigate(constantsUrls.LandingPage.main);
    }, [dispatch, navigate]);

    return (
        <PageContainer>
            <PrimaryContainer direction="column">
                <img
                    src={SmilingEarthImg}
                    alt="Sign up"
                    className={styles.img}
                />
                <p
                    className={`${commonStyles.basicHeader2} ${commonStyles.darkText}`}
                >
                    {t("main.signup")}
                </p>
                <PrimaryContainer
                    direction="column"
                    additionalClassess={containerStyles.buttonsContainer}
                >
                    <TextInput
                        name="email"
                        onChange={handleInputText(setEmail, () => {
                            setFormError({ ...formError, email: false })
                            setInputWasChanged(true);
                        })}
                        onKeyDown={handleKeyDown}
                        placeholder="E-mail"
                        type="email"
                        value={email}
                        error={formError.email}
                    />
                    <p
                        className={`${commonStyles.blueText} ${footerStyles.privacyRef} ${commonStyles.noPadding} ${commonStyles.noMargin} ${commonStyles.centeredText}`}
                        onClick={() => navigate(constantsUrls.LandingPage.signIn)}
                    >
                        {t("main.login-question")}
                    </p>
                    <Checkbox 
                        checked={confirm}
                        error={formError.confirm}
                        label={<>
                            {t("signup.confirm-regulations")} <span 
                                className={commonStyles.blueText} 
                                title={t("main.regulations")} 
                                onClick={() => downloadFile(constantsUrls.Footer.conditionTerms)}
                            >
                                {t("main.regulations")}
                            </span> {t("main.and")} <span 
                                className={commonStyles.blueText} 
                                title={t("main.privacy-policy")} 
                                onClick={() => downloadFile(constantsUrls.Footer.privacyPolicy)}
                            >
                                {t("main.privacy-policy")}
                            </span>.</>}
                        onChange={handleChange}
                        additionalClasses={`${internalStyles.checkbox} ${commonStyles.centerFlex}`}
                    />
                </PrimaryContainer>
                { isLoadingData && <Spinner /> }
            </PrimaryContainer>
            <PrimaryContainer
                direction={isMobile ? "column" : "row"}
                additionalClassess={isMobile 
                    ? `${containerStyles.buttonsContainer} ${commonStyles.bottom} ${styles.bottomButtons}`
                    : styles.bottomButtons
                }
            >
                <PrimaryButton color="orange" onClick={handleSubmit} type={buttonsType}>
                    {t("main.signup")}
                </PrimaryButton>
                <PrimaryButton color="white" onClick={goBack} type={buttonsType}>
                    {t("main.back")}
                </PrimaryButton>
            </PrimaryContainer>
        </PageContainer>
    );
};

export default SignUp;
