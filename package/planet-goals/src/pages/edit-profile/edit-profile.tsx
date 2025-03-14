import React, { ChangeEvent, useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { useTranslate } from '@tolgee/react';
import { getName, getCodes } from "country-list";
import { connect } from 'react-redux';

import { useDeviceType } from '../../helpers/responsiveContainers';
import { IUser, IUserEdit } from '../../types/user';

import PageContainer from '../../page-components/page-container/page-container';
import PrimaryContainer from '../../components/primary-container/primary-container';
import PrimaryButton, { TButtonSize } from '../../components/primary-button.tsx/primary-button';
import TextInput from '../../components/text-input/text-input';
import Footer from '../../components/footer/footer';
import SelectInput, {ISelectInputOption} from '../../components/select-input/select-input';
import ToggleSwitch from '../../components/toggle-switch/toggle-switch';
import Popup from '../../components/popup/popup';

import { userEditStart } from '../../redux/user/user.actions';

import { selectCurrentUser } from '../../redux/user/user.selectors';
import TeacherImg from "../../assets/user-profile/teacher_writing_on_blackboard.svg";
import SadEarthImg from "../../assets/login-page/sad_earth.svg";

import styles from "./edit-profile.module.scss";
import commonStyles from "../../styles/common.module.scss";
import containersStyles from "../../styles/containers.module.scss";


interface IEditProfile {
    currentUser: IUser;
    isLoading?: boolean;
    saveChanges: (payload: IUserEdit) => void;
}

const EditProfile: React.FC<IEditProfile> = ({ currentUser, saveChanges }) => {
    const { t } = useTranslate();
    const { isMobile } = useDeviceType();
    const buttonsSize: TButtonSize = isMobile ? "small" : "desktopSmall";
    const [isProfileEditing, setIsProfileEditing] = useState(false);
    const [editProfileState, setEditProfileState] = useState<IUserEdit>({
        countryCode: currentUser?.countryCode || "",
        firstName: currentUser?.firstName || "",
        lastName: currentUser?.lastName || "",
    });
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const countriesList: ISelectInputOption[] = getCodes().map(code => ({
            label: `${getName(code)}`,
            value: code
        })).sort((a, b) => getName(a.value).localeCompare(getName(b.value)))

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        event.preventDefault();
        if (!isProfileEditing) return;
        const { value, name } = event.target;
        setEditProfileState({
            ...editProfileState,
            [name]: value
        });
    }

    const save = () => {
        saveChanges(editProfileState);
        setIsProfileEditing(false);
    }

    return (
        <PageContainer>
            <PrimaryContainer direction={isMobile ? "column" : "rowReverse"} additionalClassess={`${containersStyles.pagePadding}`}>
                <img
                    src={TeacherImg}
                    alt="Edit profile"
                    className={commonStyles.sectionImg}
                />
                <PrimaryContainer 
                    direction="column" 
                    additionalClassess={`${containersStyles.buttonsContainer} ${containersStyles.alignFlexStart}${!isMobile ? ` ${containersStyles.halfScreenContainer}` : ''}`}
                >
                    <p className={`${commonStyles.basicHeader3} ${styles.header}`}>
                        {t(!isProfileEditing ? "profil.tab.header" : "profil.tab.EditProfile")}
                    </p>
                    <p className={`${commonStyles.basicHeader4} ${styles.label} ${styles.labelFirst}`}>
                        {t("profil.tab.data.name")}
                    </p>
                    <TextInput disabled={!isProfileEditing} 
                        name="firstName"
                        onChange={handleChange}
                        value={editProfileState.firstName}
                        placeholder={t("profil.tab.data.name")}
                    />
                    <p className={`${commonStyles.basicHeader4} ${styles.label}`}>
                        {t("profil.tab.data.surname")}
                    </p>
                    <TextInput disabled={!isProfileEditing}
                        name="lastName"
                        onChange={handleChange}
                        value={editProfileState.lastName}
                        placeholder={t("profil.tab.data.surname")}
                    />
                    <p className={`${commonStyles.basicHeader4} ${styles.label}`}>
                        {t("profil.tab.data.email")}
                    </p>
                    <TextInput disabled={true}
                        name="email"
                        value={currentUser?.email || ""}
                        placeholder={t("profil.tab.data.email")}
                        type="email"
                    />
                    <p className={`${commonStyles.basicHeader4} ${styles.label}`}>
                        {t("profil.tab.data.country")}
                    </p>
                    <SelectInput 
                        name="countryCode"
                        value={editProfileState.countryCode}
                        onChange={handleChange}
                        options={countriesList}
                        placeholder={t("profil.tab.data.country")}
                    />
                    <PrimaryContainer direction="row" additionalClassess={`${containersStyles.justifySpaceBetween}`}>
                        <ToggleSwitch value={isProfileEditing} onToggle={() => setIsProfileEditing(!isProfileEditing)} label={t("profil.tab.EditProfile")} />
                        { 
                            isProfileEditing && 
                            <PrimaryButton size={buttonsSize} color="orange" onClick={save}>
                                {t("profile.tab.edit.save.button")}
                                </PrimaryButton> 
                        }
                    </PrimaryContainer>
                </PrimaryContainer>
            </PrimaryContainer>
            <PrimaryContainer direction="column" additionalClassess={`${!isMobile ? `${containersStyles.halfScreenContainer} ${styles.deleteSection}` : ''}`}>
                <p className={`${commonStyles.basicHeader3} ${commonStyles.redText} ${styles.header}`}>
                    {t("profile.tab.RemoveAccount")}
                </p>
                <p className={`${commonStyles.centeredText} ${commonStyles.padding1em}`}>
                    {t("profile.tab.RemoveAccountInfo")}
                </p>
                <PrimaryButton size={buttonsSize} color="red" onClick={() => setIsPopupVisible(true)}>
                    {t("profile.tab.RemoveAccount.button")}
                </PrimaryButton>
            </PrimaryContainer>
            <Footer />
            <Popup visible={isPopupVisible}>
                <PrimaryContainer direction="column" additionalClassess={`${commonStyles.inheritBackground}`}>
                    <img alt='Delete account' src={SadEarthImg} className={styles.popupImg} />
                    <p className={`${commonStyles.basicHeader3}`}>{t("profile.tab.widget.info")}</p>
                    <PrimaryContainer direction="row" additionalClassess={`${commonStyles.inheritBackground} ${commonStyles.basicGap} ${commonStyles.padding1em}`}>
                        <PrimaryButton color="red" size={buttonsSize}>
                            {t("profile.tab.widget.confirm.button")}
                        </PrimaryButton>
                        <PrimaryButton color="white" size={buttonsSize} onClick={() => setIsPopupVisible(false)}>
                            {t("profile.tab.widget.cancel.button")}
                        </PrimaryButton>
                    </PrimaryContainer>
                </PrimaryContainer>
            </Popup>
        </PageContainer>
    );
}

const mapDispatchToProps = (dispatch) => ({
    saveChanges: (payload: IUserEdit) => dispatch(userEditStart(payload))
})

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);