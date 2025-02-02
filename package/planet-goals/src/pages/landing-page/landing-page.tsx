import React from "react";
import { useTranslate } from "@tolgee/react";
// styles
import styles from "./landing-page.module.scss";
import partnersStyles from "./landing-page.partners.module.scss";
import commonStyles from "../../styles/common.module.scss";

// components
import PageContainer from "../../page-components/page-container/page-container";
import PrimaryContainer from "../../components/primary-container/primary-container";
import PrimaryButton from "../../components/primary-button.tsx/primary-button";
import Footer from "../../components/footer/footer";

//helpers
import { handleClick } from "../../helpers/onClick.functions";
import { constantsUrls } from "../../helpers/constants";
import { formatNewLines } from "../../translations/utils";

//svg
import EnterGameImg from "../../assets/landing-page/enter_game.svg";
import WelcomePlanetGoalsImg from "../../assets/landing-page/welcome_planet_goals.svg";
import ForTeachersImg from "../../assets/landing-page/for_teachers.svg";
import ForStudentsImg from "../../assets/landing-page/for_students.svg";
import LearnInGroupImg from "../../assets/landing-page/learn_in_group.svg";
import LearnAnyywhereMobileImg from "../../assets/landing-page/learn_anywhere_moible.svg";

const landingPage: React.FC = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { t } = useTranslate();
    const containersDirection = "column";
    const partnersImgNames = [
        "Fonix.png",
        "InnoHub.png",
        "InnovED.png",
        "MDU.svg",
        "NovaReckon.png",
        "Stowarzyszenie.svg",
    ];

    return (
        <PageContainer>
            {/* 1 */}
            <PrimaryContainer
                direction={containersDirection}
                additionalClassess={`${commonStyles.lightestGreyBackground}`}
            >
                <img
                    src={EnterGameImg}
                    alt="Enter game img"
                    className={styles.img}
                />
                <PrimaryContainer
                    direction="column"
                    additionalClassess={commonStyles.lightestGreyBackground}
                >
                    <p
                        className={`${commonStyles.orangeText} ${styles.header}`}
                    >
                        {formatNewLines(t("landing-page.headers.enter-game"))}
                    </p>
                    <PrimaryContainer
                        direction="column"
                        additionalClassess={`${styles.container} ${styles.buttonsContainer} ${commonStyles.lightestGreyBackground}`}
                    >
                        <PrimaryButton color="orange">
                            {t("main.signin")}
                        </PrimaryButton>
                        <PrimaryButton color="white">
                            {t("main.signup")}
                        </PrimaryButton>
                    </PrimaryContainer>
                </PrimaryContainer>
            </PrimaryContainer>
            {/* 2 */}
            <PrimaryContainer
                direction={containersDirection}
                additionalClassess={`${commonStyles.lightestGreyBackground} ${commonStyles.largeHorizontalPadding}`}
            >
                <img
                    src={WelcomePlanetGoalsImg}
                    alt="Welcome to the planet goals"
                    className={styles.img}
                />
                <PrimaryContainer
                    direction="column"
                    additionalClassess={commonStyles.lightestGreyBackground}
                >
                    <p
                        className={`${commonStyles.orangeText} ${styles.header}`}
                    >
                        {formatNewLines(t("landing-page.headers.welcome"))}
                    </p>
                    <p className={styles.primaryText}>
                        {t("landing-page.descriptions.welcome")}
                    </p>
                </PrimaryContainer>
            </PrimaryContainer>
            {/* 3 */}
            <PrimaryContainer
                direction={containersDirection}
                additionalClassess={`${commonStyles.lightestGreyBackground} ${commonStyles.largeHorizontalPadding}`}
            >
                <img
                    src={ForTeachersImg}
                    alt="For teachers"
                    className={styles.img}
                />
                <PrimaryContainer
                    direction="column"
                    additionalClassess={commonStyles.lightestGreyBackground}
                >
                    <p
                        className={`${commonStyles.orangeText} ${styles.header}`}
                    >
                        {t("landing-page.headers.for-teachers")}
                    </p>
                    <p className={styles.primaryText}>
                        {t("landing-page.descriptions.for-teachers")}
                    </p>
                </PrimaryContainer>
            </PrimaryContainer>
            {/* 4 */}
            <PrimaryContainer
                direction={containersDirection}
                additionalClassess={`${commonStyles.lightestGreyBackground} ${commonStyles.largeHorizontalPadding}`}
            >
                <img
                    src={ForStudentsImg}
                    alt="For students"
                    className={styles.img}
                />
                <PrimaryContainer
                    direction="column"
                    additionalClassess={commonStyles.lightestGreyBackground}
                >
                    <p
                        className={`${commonStyles.orangeText} ${styles.header}`}
                    >
                        {t("landing-page.headers.for-students")}
                    </p>
                    <p className={styles.primaryText}>
                        {t("landing-page.descriptions.for-students")}
                    </p>
                </PrimaryContainer>
            </PrimaryContainer>
            {/* 5 */}
            <PrimaryContainer
                direction={containersDirection}
                additionalClassess={`${commonStyles.lightGreyBackground} ${commonStyles.largeHorizontalPadding}`}
            >
                <img
                    src={LearnInGroupImg}
                    alt="Learn in group"
                    className={styles.img}
                />
                <PrimaryContainer
                    direction="column"
                    additionalClassess={commonStyles.lightGreyBackground}
                >
                    <p className={`${commonStyles.darkText} ${styles.header}`}>
                        {formatNewLines(
                            t("landing-page.headers.learn-in-group")
                        )}
                    </p>
                    <p className={styles.primaryText}>
                        {t("landing-page.descriptions.learn-in-group")}
                    </p>
                </PrimaryContainer>
            </PrimaryContainer>
            <PrimaryContainer direction="column">
                <div className={partnersStyles.partnersSpinner}>
                    <div className={partnersStyles.scrollingTrack}>
                        {[...partnersImgNames, ...partnersImgNames].map(
                            (logo, index) => (
                                <img
                                    key={index}
                                    src={`src/assets/landing-page/partners/${logo}`}
                                    alt={`Partner ${index + 1}`}
                                    className={partnersStyles.partnerLogo}
                                />
                            )
                        )}
                    </div>
                </div>
            </PrimaryContainer>
            <PrimaryContainer
                direction="column"
                additionalClassess={`${commonStyles.lightGreyBackground} ${commonStyles.largeHorizontalPadding}`}
            >
                <PrimaryContainer
                    direction="column"
                    additionalClassess={commonStyles.lightGreyBackground}
                >
                    <p
                        className={`${commonStyles.orangeText} ${styles.header}`}
                    >
                        {formatNewLines(t("landing-page.headers.visit-blog"))}
                    </p>
                    <PrimaryButton
                        color="orange"
                        onClick={handleClick(
                            constantsUrls.LandingPage.blog,
                            "_blank"
                        )}
                    >
                        {t("landing-page.buttons.visit-blog")}
                    </PrimaryButton>
                </PrimaryContainer>
                <img
                    src={LearnAnyywhereMobileImg}
                    alt="Learn anywhere"
                    className={`${styles.img} ${commonStyles.noPadding}`}
                />
            </PrimaryContainer>
            <Footer />
        </PageContainer>
    );
};

export default landingPage;
