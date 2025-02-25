import React, { useState, FormEvent, MouseEvent, ChangeEvent } from "react";
import { createStructuredSelector } from "reselect";
import { getName, getCodes } from "country-list";
import { useNavigate } from "react-router-dom";
import { useTranslate } from "@tolgee/react";
import { connect } from "react-redux";

import PageContainer from "../../page-components/page-container/page-container";
import PrimaryContainer from "../../components/primary-container/primary-container";
import PrimaryButton from "../../components/primary-button.tsx/primary-button";
import SelectInput, { ISelectInputOption } from "../../components/select-input/select-input";
import TextInput from "../../components/text-input/text-input";

import { getFlagEmoji } from "../../helpers/locales.functions";
import { validateEditUser } from "../../helpers/validators.ts/user";
import { userEditStart } from "../../redux/user/user.actions";
import {
    selectCurrentUser,
    selectIsLoadingData,
    selectLoginEmail,
    selectUserError,
} from "../../redux/user/user.selectors";
import { IUser, IUserEdit, TUserRole, UserRoleEnum } from "../../types/user";
import { ROLES_TRANSLATIONS } from "../../helpers/constants/translations";
//import { ERRORS_ENUM } from "../../api/user.api";

import styles from "./fill-register-data.module.scss";
import commonStyles from "../../styles/common.module.scss";
import containerStyles from "../../styles/containers.module.scss";
import signInStyles from "../sign-in/sign-in.module.scss";

import SmilingEarthImg from "../../assets/login-page/smiling_earth.svg";
import { constantsUrls } from "../../helpers/constants";

interface IFillRegisterData {
    currentUser: IUser,
    saveUserData?: (userData: IUserEdit) => void;
    isLoadingData: boolean;
    signUpError: string;
}

const FillRegisterData: React.FC<IFillRegisterData> = ({
    saveUserData,
    isLoadingData,
    signUpError,
}) => {
    const { t } = useTranslate();
    const navigate = useNavigate();
    const countriesList: ISelectInputOption[] = getCodes().map(code => ({
        label: `${getFlagEmoji(code)} ${getName(code)}`,
        value: code
    })).sort((a, b) => getName(a.value).localeCompare(getName(b.value)))

    const [ registerForm, setRegisterForm ] = useState<IUserEdit>({
        cookiesAgreement: localStorage.getItem("cookiesAccepted") === "true",
        countryCode: "",
        firstName: "",
        lastName: "",
        rodoAgreement: true,
        role: UserRoleEnum.STUDENT,
        userInterfaceLanguage: localStorage.getItem("locale") || "en"
    })

    const [validateRegisterForm, setValidateRegisterForm] = useState({
        countryCode: false,
        firstName: false,
        lastName: false,
        role: false,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //const [signUpStarted, setSignUpStarted] = useState(false);

    const handleSubmit = async (event: FormEvent | MouseEvent) => {
        event.preventDefault();
        setValidateRegisterForm(validateEditUser(registerForm));
        for (const validation of Object.values(validateRegisterForm)) {
            if (validation) return;
        }
        //setSignUpStarted(true);
        await saveUserData(registerForm);
    };

    const handleInputText = (key: keyof typeof registerForm) => {
        return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            event.preventDefault();
            setRegisterForm({
                ...registerForm,
                [key]: event.target.value
            });
            setValidateRegisterForm({
                ...validateRegisterForm,
                [key]: false
            });
        }
    }

    const handleSelectRole = (role: TUserRole) => {
        return (event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            setRegisterForm({
                ...registerForm,
                role
            });
        }
    }

    return (
        <PageContainer>
            <PrimaryContainer direction="column">
                <img
                    src={SmilingEarthImg}
                    alt="Sign in"
                    className={signInStyles.img}
                />
                <p
                    className={`${commonStyles.basicHeader} ${commonStyles.darkText}`}
                >
                    {t("sign-up.header")}
                </p>
                <form onSubmit={handleSubmit} className={commonStyles.centeredText}>
                    <PrimaryContainer
                    direction="column"
                    additionalClassess={`${commonStyles.padding1em} ${containerStyles.buttonsContainer}`}
                    >
                        <PrimaryContainer direction="row" additionalClassess={''}>
                            <div className={`${containerStyles.halfScreenContainer} ${styles.paddingInputRight}`}>
                                <TextInput 
                                    name="firstName"
                                    onChange={handleInputText('firstName')}
                                    value={registerForm.firstName}
                                    placeholder={t("sign-up.register-form.first-name")}
                                    error={validateRegisterForm.firstName}
                                />
                            </div>
                            <div className={`${containerStyles.halfScreenContainer} ${styles.paddingInputLeft}`}>
                                <TextInput
                                    name="lastName"
                                    onChange={handleInputText('lastName')}
                                    placeholder={t("sign-up.register-form.last-name")}
                                    value={registerForm.lastName}
                                    error={validateRegisterForm.lastName}
                                />
                            </div>
                        </PrimaryContainer>
                        <SelectInput 
                            name="countryCode"
                            value={registerForm.countryCode}
                            onChange={handleInputText('countryCode')}
                            options={countriesList}
                            placeholder={t("sign-up.register-form.country")}
                            error={validateRegisterForm.countryCode}
                        />
                        <p
                            className={`${commonStyles.darkText} ${commonStyles.captionText} ${commonStyles.noPadding} ${commonStyles.centeredText}`}
                        >
                            {t("sign-up.register-form.choose-role")}
                        </p>
                        <div className={commonStyles.row}>
                            <PrimaryButton color="white" size="small" onClick={handleSelectRole(UserRoleEnum.STUDENT)} additionalClasses={`${containerStyles.halfScreenContainer}`} selected={registerForm.role === UserRoleEnum.STUDENT}>
                                {t(ROLES_TRANSLATIONS.STUDENT)}
                            </PrimaryButton>
                            <PrimaryButton color="white" size="small" onClick={handleSelectRole(UserRoleEnum.TEACHER)} additionalClasses={`${containerStyles.halfScreenContainer}`} selected={registerForm.role === UserRoleEnum.TEACHER}>
                                {t(ROLES_TRANSLATIONS.TEACHER)}
                            </PrimaryButton>
                        </div>
                        {isLoadingData && <p>...Loading</p>}
                        {signUpError && <p>{signUpError}</p>}
                    </PrimaryContainer>
                    <PrimaryContainer
                        direction="column"
                        additionalClassess={`${containerStyles.buttonsContainer} ${commonStyles.bottom} ${styles.bottomButtons}`}
                    >
                        <PrimaryButton color="orange" onClick={handleSubmit}>
                            {t("main.confirm")}
                        </PrimaryButton>
                        <PrimaryButton color="white" onClick={() => navigate(constantsUrls.LandingPage.main)}>
                            {t("main.back")}
                        </PrimaryButton>
                    </PrimaryContainer>
                </form>
            </PrimaryContainer>
        </PageContainer>
    );
};

const mapDispatchToProps = (dispatch) => ({
    saveUserData: (userData: IUserEdit) => dispatch(userEditStart(userData)),
});

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    loginEmail: selectLoginEmail,
    signUpError: selectUserError,
    isLoadingData: selectIsLoadingData,
});

export default connect(mapStateToProps, mapDispatchToProps)(FillRegisterData);
