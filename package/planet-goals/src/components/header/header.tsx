import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useTranslate } from "@tolgee/react";
import { createStructuredSelector } from "reselect";

import { userTypes } from "../../types";
import { constantsTranslations } from "../../helpers/constants";
import tolgeeConfig from "../../translations";
import { useDeviceType } from "../../helpers/responsiveContainers";
import styles from "./header.module.scss";

//components
import DropdownMenu from "../dropdown-menu/dropdown-menu";
import PrimaryButton, { TButtonColor } from "../primary-button.tsx/primary-button";

//icons
import Logo from "../../assets/logo/logo-20.svg";
import TranslationIcon from "../../assets/icons/translate_icon.svg";
import HamburgerMenuIcon from "../../assets/icons/hamburger_menu_button.svg";
import HamburgerMenuIconClicked from "../../assets/icons/hamburger_menu_button_click.svg";

//redux
import {
    selectHeaderMenuHidden,
    selectLanguagesMenuHidden,
} from "../../redux/dropdown-menu/dropdown-menu.selectors";
import { selectCurrentUser } from "../../redux/user/user.selectors";
import {
    hideAll,
    toggleHeaderMenuHidden,
    toggleLanguagesMenuHidden,
} from "../../redux/dropdown-menu/dropdown-menu.actions";
import { signOut } from "../../redux/user/user.actions";

//helpers


type MainPropsT = {
    currentUser?: userTypes.IUser;
    hideAllMenus?: () => void;
    isHeaderMenuHidden?: boolean;
    isLanguagesMenuHidden?: boolean;
    signOutStart?: () => void;
    toggleHeaderMenu?: () => void;
    toggleLanguagesMenu?: () => void;
};

enum MENU_ACTIONS {
    LOGOUT = "LOGOUT",
    MATERIALS = "MATERIALS",
    ME = "ME",
    MY_PROGRESS = "MY_PROGRESS",
    START_LESSONS = "START_LESSONS",
}

const Header: React.FC<MainPropsT> = ({
    currentUser,
    hideAllMenus,
    isHeaderMenuHidden,
    isLanguagesMenuHidden,
    signOutStart,
    toggleHeaderMenu,
    toggleLanguagesMenu,
}) => {
    const { isMobile, isDesktop } = useDeviceType();
    const { t } = useTranslate();
    const languagesMenuRef = useRef<HTMLElement>();
    const headerMenuRef = useRef<HTMLElement>();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleClickOutsideMenu = (event: MouseEvent) => {
        if (!headerMenuRef?.current?.contains(event.target as Node) && !languagesMenuRef?.current?.contains(event.target as Node)) {
            if (!isHeaderMenuHidden || !isLanguagesMenuHidden) hideAllMenus();
        }
        document.removeEventListener('mousedown', handleClickOutsideMenu);
    }

    useEffect(() => {
        if (!isHeaderMenuHidden || !isLanguagesMenuHidden) document.addEventListener('mousedown', handleClickOutsideMenu)
        else document.removeEventListener('mousedown', handleClickOutsideMenu);
    }, [handleClickOutsideMenu, isHeaderMenuHidden, isLanguagesMenuHidden])

    const languages: [key: constantsTranslations.TLocale, value: string][] = [
        ["el", t("header.languages.greek")],
        ["en", t("header.languages.english")],
        ["es", t("header.languages.spanish")],
        ["it", t("header.languages.italian")],
        ["nb", t("header.languages.norwegian")],
        ["pl", t("header.languages.polish")],
        ["sl", t("header.languages.slovenian")],
        ["sv", t("header.languages.swedish")],
    ];

    const menuItems: [key: MENU_ACTIONS, value: string, color: TButtonColor][] = [
        [MENU_ACTIONS.START_LESSONS, t("header.menu.start-lessons"), 'orange'],
        [MENU_ACTIONS.MATERIALS, t("header.menu.materials"), 'white'],
        [MENU_ACTIONS.MY_PROGRESS, t("header.menu.my-progress"), 'white'],
        [MENU_ACTIONS.ME, t("header.menu.me"), 'white'],
        [MENU_ACTIONS.LOGOUT, t("header.menu.logout"), 'white']
    ];

    const onClickHeaderMenu = () => {
        if (!isLanguagesMenuHidden) toggleLanguagesMenu();
        toggleHeaderMenu();
    };

    const onClickLanguagesMenu = () => {
        if (!isHeaderMenuHidden) toggleHeaderMenu();
        toggleLanguagesMenu();
    };

    const selectLanguage = (language: constantsTranslations.TLocale) => {
        tolgeeConfig.changeLanguage(language);
        localStorage.setItem("locale", language);
        toggleLanguagesMenu();
    };

    const selectMenuAction = (action: MENU_ACTIONS) => {
        switch(action) {
            case MENU_ACTIONS.LOGOUT:
                signOutStart();
                localStorage.removeItem("token");
                break;
            default:
                console.log(action);
                break;
        }
    };

    return (
        <div className={styles.headerContainer}>
            <div className={styles.header}>
                <img
                    src={Logo}
                    alt="Plant Goals Logo"
                    className={styles.logo}
                />
                <div className={styles.content}>
                    <div className={styles.controls}>
                        {
                            currentUser && !isMobile && menuItems.map(([key, value, color]) => (
                                <div className={styles.control}>
                                    <PrimaryButton key={key} color={color} size={isDesktop ? "desktopSmall" : "small"} onClick={
                                        () => selectMenuAction(key)
                                    }>
                                        {value}
                                    </PrimaryButton>
                                </div>
                            ))
                        }
                        {currentUser?.role && <div className={styles.control}>
                            <PrimaryButton color="blue" size={isDesktop ? "desktopSmall" : "small" }>
                                {t(constantsTranslations.ROLES_TRANSLATIONS[currentUser.role])}
                            </PrimaryButton>
                        </div>}
                        <div
                            className={`${styles.control} ${
                                !isLanguagesMenuHidden
                                    ? styles.controlActive
                                    : ""
                            }`}
                            onClick={onClickLanguagesMenu}
                        >
                            <img src={TranslationIcon} alt="Select language" />
                        </div>
                        {
                            currentUser && isMobile &&
                            <div className={`${styles.control} ${
                                !isHeaderMenuHidden ? styles.controlActive : ""
                                }`}
                                onClick={onClickHeaderMenu}
                                >
                                <img src={isHeaderMenuHidden ? HamburgerMenuIconClicked : HamburgerMenuIcon} alt="Menu" />
                            </div>
                        }
                    </div>
                </div>
            </div>
            <DropdownMenu
                isOpen={!isLanguagesMenuHidden}
                items={languages}
                onItemSelect={selectLanguage}
                reference={languagesMenuRef}
            />
            {
                currentUser &&
                <DropdownMenu
                    isOpen={!isHeaderMenuHidden}
                    items={menuItems.map(([key, value]) => [key, value])}
                    onItemSelect={selectMenuAction}
                    reference={headerMenuRef}
                />
            }
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    isHeaderMenuHidden: selectHeaderMenuHidden,
    isLanguagesMenuHidden: selectLanguagesMenuHidden,
});

const mapDispatchToProps = (dispatch) => ({
    hideAllMenus: () => dispatch(hideAll()),
    signOutStart: () => dispatch(signOut()),
    toggleHeaderMenu: () => dispatch(toggleHeaderMenuHidden()),
    toggleLanguagesMenu: () => dispatch(toggleLanguagesMenuHidden()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
