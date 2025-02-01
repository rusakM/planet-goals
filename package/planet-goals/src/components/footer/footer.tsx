import React from "react";
import styles from "./footer.module.scss";
import commonStyles from "../../styles/common.module.scss";

import PrimaryContainer from "../primary-container/primary-container";
import Separator from "../separator/separator";

import { handleClick } from "../../helpers/onClick.functions";
import { constantsUrls } from "../../helpers/constants";

import LinkedInImg from "../../assets/footer/in.svg";
import InstagramImg from "../../assets/footer/instagram.svg";
import YoutubeImg from "../../assets/footer/youtube.svg";
import CoFundedByEUImg from "../../assets/icons/co_funded_by_the_european_union_bw.svg";
import CcIcon from "../../assets/icons/cc.svg";

const Footer: React.FC = () => {
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
                <p className={commonStyles.darkText}>
                    Sfinansowane ze środków UE. Wyrażone poglądy i opinie są
                    jedynie opiniami autora lub autorów i niekoniecznie
                    odzwierciedlają poglądy i opinie Unii Europejskiej lub
                    Europejskiej Agencji Wykonawczej ds. Edukacji i Kultury
                    (EACEA). Unia Europejska ani EACEA nie ponoszą za nie
                    odpowiedzialności.
                </p>
                <br />
                <p className={`${commonStyles.darkText} ${styles.captionText}`}>
                    Ze wszystkich rezultatów projektu PlanetGoals można
                    korzystać bezpłatnie i na zasadzie licencji otwartej.
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
                        Polityka prywatności
                    </span>
                    <span
                        className={`${commonStyles.blueText} ${styles.privacyRef}`}
                    >
                        Warunki użytkowania
                    </span>
                </PrimaryContainer>
                <br />
                <p className={`${commonStyles.darkText} ${styles.captionText}`}>
                    © 2025 | Wszelkie prawa zastrzeżone | Wdrożone przez Planet
                    Goals Project
                </p>
            </PrimaryContainer>
        </footer>
    );
};

export default Footer;
