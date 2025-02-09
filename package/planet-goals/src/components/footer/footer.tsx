import React from "react";
import { useTranslate } from "@tolgee/react";
import styles from "./footer.module.scss";
import commonStyles from "../../styles/common.module.scss";

import PrimaryContainer from "../primary-container/primary-container";
import Separator from "../separator/separator";

import { handleClick } from "../../helpers/events.functions";
import { constantsUrls } from "../../helpers/constants";

import LinkedInImg from "../../assets/footer/in.svg";
import InstagramImg from "../../assets/footer/instagram.svg";
import YoutubeImg from "../../assets/footer/youtube.svg";
import CoFundedByEUImg from "../../assets/icons/co_funded_by_the_european_union_bw.svg";
import CcIcon from "../../assets/icons/cc.svg";

const Footer: React.FC = () => {
    const { t } = useTranslate();
    return (
        <footer className={styles.footer}>
            <PrimaryContainer direction="column">
                <Separator color="orange" />
                <div
                    className={`${commonStyles.row} ${commonStyles.centerFlex}`}
                >
                    <img
                        src={LinkedInImg}
                        alt="LinkedIn"
                        className={styles.logo}
                        onClick={handleClick(
                            constantsUrls.Footer.linkedIn,
                            "_blank"
                        )}
                    />
                    <img
                        src={InstagramImg}
                        alt="Instagram"
                        className={styles.logo}
                        onClick={handleClick(
                            constantsUrls.Footer.instagram,
                            "_blank"
                        )}
                    />
                    <img
                        src={YoutubeImg}
                        alt="YouTube"
                        className={styles.logo}
                        onClick={handleClick(
                            constantsUrls.Footer.youtube,
                            "_blank"
                        )}
                    />
                </div>
                <img
                    src={CoFundedByEUImg}
                    alt="Co-funded by the European Union"
                    className={styles.coFundedImg}
                />
                <p className={commonStyles.darkText}>{t("footer.text-1")}</p>
                <br />
                <p className={`${commonStyles.darkText} ${styles.captionText}`}>
                    {t("footer.text-2")}
                    <span className={styles.ccIcon}>
                        <img src={CcIcon} alt="CC Icon" />
                    </span>
                </p>
                <br />
                <PrimaryContainer
                    direction="row"
                    additionalClassess={`${commonStyles.centerFlex}`}
                >
                    <span
                        className={`${commonStyles.blueText} ${styles.privacyRef}`}
                    >
                        {t("footer.privacy-policy")}
                    </span>
                    <span
                        className={`${commonStyles.blueText} ${styles.privacyRef}`}
                    >
                        {t("footer.conditions-terms")}
                    </span>
                </PrimaryContainer>
                <br />
                <p className={`${commonStyles.darkText} ${styles.captionText}`}>
                    {t("footer.copyright")}
                </p>
            </PrimaryContainer>
        </footer>
    );
};

export default Footer;
