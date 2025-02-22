import React from "react";
import { connect } from "react-redux";
import { useTranslate } from "@tolgee/react";

import { userTypes } from "../../types";
import { constantsTranslations } from "../../helpers/constants";
import { selectLanguage } from "../../translations";
//import { useDeviceType } from "../../helpers/responsiveContainers";
import styles from "./header.module.scss";

//components
import DropdownMenu from "../dropdown-menu/dropdown-menu";

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
import {
    toggleHeaderMenuHidden,
    toggleLanguagesMenuHidden,
} from "../../redux/dropdown-menu/dropdown-menu.actions";
import { createStructuredSelector } from "reselect";

type MainPropsT = {
    currentUser?: userTypes.IUser;
    isHeaderMenuHidden?: boolean;
    isLanguagesMenuHidden?: boolean;
    toggleHeaderMenu?: () => void;
    toggleLanguagesMenu?: () => void;
};

const Header: React.FC<MainPropsT> = ({
    currentUser,
    isHeaderMenuHidden,
    isLanguagesMenuHidden,
    toggleHeaderMenu,
    toggleLanguagesMenu,
}) => {
    //const { isMobile } = useDeviceType();
    const { t } = useTranslate();
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

    const menuItems: [key: string, value: string][] = [
        ["start_lessons", t("header.menu.start-lessons")],
        ["materials", t("header.menu.materials")],
        ["my_progress", t("header.menu.my-progress")],
        ["me", t("header.menu.me")],
    ];

    const onClickHeaderMenu = () => {
        if (!isLanguagesMenuHidden) toggleLanguagesMenu();
        toggleHeaderMenu();
    };

    const onClickLanguagesMenu = () => {
        if (!isHeaderMenuHidden) toggleHeaderMenu();
        toggleLanguagesMenu();
    };

    const selectMenuAction = (action) => {
        console.log(action);
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
                    {currentUser && <p>{currentUser.role}</p>}
                    <div className={styles.controls}>
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
                        <div
                            className={`${styles.control} ${
                                !isHeaderMenuHidden ? styles.controlActive : ""
                            }`}
                            onClick={onClickHeaderMenu}
                        >
                            <img
                                src={
                                    isHeaderMenuHidden
                                        ? HamburgerMenuIconClicked
                                        : HamburgerMenuIcon
                                }
                                alt="Menu"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <DropdownMenu
                isOpen={!isLanguagesMenuHidden}
                items={languages}
                onItemSelect={selectLanguage}
            />
            <DropdownMenu
                isOpen={!isHeaderMenuHidden}
                items={menuItems}
                onItemSelect={selectMenuAction}
            />
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    isHeaderMenuHidden: selectHeaderMenuHidden,
    isLanguagesMenuHidden: selectLanguagesMenuHidden,
});

const mapDispatchToProps = (dispatch) => ({
    toggleHeaderMenu: () => dispatch(toggleHeaderMenuHidden()),
    toggleLanguagesMenu: () => dispatch(toggleLanguagesMenuHidden()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
