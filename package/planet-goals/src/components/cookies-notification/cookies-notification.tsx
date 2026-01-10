import React, { useState } from "react";
import { useTranslate } from "@tolgee/react";
import { useDeviceType } from "../../helpers/responsiveContainers";

import styles from "./cookies-notification.module.scss";
import footerStyles from "../footer/footer.module.scss";
import commonStyles from "../../styles/common.module.scss";
import containerStyles from "../../styles/containers.module.scss";

import PrimaryButton from "../primary-button.tsx/primary-button";
import PrimaryContainer from "../primary-container/primary-container";
import { downloadFile } from "../../helpers/events.functions";
import { constantsUrls } from "../../helpers/constants";

const CookiesNotification: React.FC = () => {
    const { t } = useTranslate();
    const { isMobile } = useDeviceType();
    const [cookiesAccepted, setCookiesAccepted] = useState(
        localStorage.getItem("cookiesAccepted") === "true"
    );
    const [cookiesNotificationVisible, setCookiesNotificationVisible] =
        useState(
            sessionStorage.getItem("CookiesNotificationVisible") !== "false" &&
                !cookiesAccepted
        );

    const acceptCookies =
        (state: boolean) => (event: React.MouseEvent<HTMLElement>) => {
            event.preventDefault();
            setCookiesAccepted(state);
            setCookiesNotificationVisible(false);
            localStorage.setItem("cookiesAccepted", `${state}`);
            sessionStorage.setItem("cookiesNotificationVisible", "false");
        };

    return (
        cookiesNotificationVisible && (
            <aside className={styles.cookiesNotification}>
                <PrimaryContainer
                    direction={isMobile ? "column" : "row"}
                    additionalClassess={commonStyles.headerGreyBackground}
                >
                    <PrimaryContainer direction="column" additionalClassess={!isMobile ? containerStyles.halfScreenContainer : ""}>
                        <p className={`${styles.paragraph} ${commonStyles.justifiedText} ${commonStyles.darkText} ${footerStyles.captionText}`}>
                            {t("cookies.notification.text") + " "} 
                            <span 
                                className={`${commonStyles.blueText} ${commonStyles.pointerCursor}`} 
                                title={t("main.regulations")} 
                                onClick={() => downloadFile(constantsUrls.Footer.conditionTerms)}
                            >
                                {t("main.regulations")}
                            </span> {t("main.and")} <span 
                                className={`${commonStyles.blueText} ${commonStyles.pointerCursor}`} 
                                title={t("main.privacy-policy")} 
                                onClick={() => downloadFile(constantsUrls.Footer.privacyPolicy)}
                            >
                                {t("main.privacy-policy")}
                            </span>.
                        </p>
                    </PrimaryContainer>
                    <PrimaryContainer
                        direction="column"
                        additionalClassess={`${containerStyles.buttonsContainer} ${commonStyles.headerGreyBackground}`}
                    >
                        <PrimaryButton
                            color="white"
                            onClick={acceptCookies(true)}
                        >
                            {t("cookies.notification.buttons.accept")}
                        </PrimaryButton>
                        <PrimaryButton
                            color="white"
                            onClick={acceptCookies(false)}
                        >
                            {t("cookies.notification.buttons.discard")}
                        </PrimaryButton>
                    </PrimaryContainer>
                </PrimaryContainer>
            </aside>
        )
    );
};

export default CookiesNotification;
