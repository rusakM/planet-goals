import React from "react";
import { useTranslate } from "@tolgee/react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
// styles
import styles from "./landing-page.module.scss";
import partnersStyles from "./landing-page.partners.module.scss";
import commonStyles from "../../styles/common.module.scss";
import containersStyles from "../../styles/containers.module.scss";
import footerStyles from "../../components/footer/footer.module.scss";

// components
import PageContainer from "../../page-components/page-container/page-container";
import PrimaryContainer from "../../components/primary-container/primary-container";
import PrimaryButton, { TButtonType } from "../../components/primary-button.tsx/primary-button";
import Footer from "../../components/footer/footer";
import CookiesNotification from "../../components/cookies-notification/cookies-notification";

//helpers
import { constantsUrls } from "../../helpers/constants";
import { formatNewLines } from "../../translations/utils";
import { redirect } from "../../helpers/events.functions";
import { IUser, UserRoleEnum } from "../../types/user";
import { useDeviceType } from "../../helpers/responsiveContainers";

//redux
import { selectCurrentUser } from "../../redux/user/user.selectors";

//svg
import EnterGameImg from "../../assets/landing-page/enter_game.svg";
import WelcomePlanetGoalsImg from "../../assets/landing-page/welcome_planet_goals.svg";
import ForTeachersImg from "../../assets/landing-page/for_teachers.svg";
import ForStudentsImg from "../../assets/landing-page/for_students.svg";
import LearnInGroupImg from "../../assets/landing-page/learn_in_group.svg";
import LearnAnywhereMobileImg from "../../assets/landing-page/learn_anywhere_moible.svg";
import LearnAnywhereDesktopImg from "../../assets/landing-page/learn_anywhere_desktop.svg";

//partners
import FonixImg from "../../assets/landing-page/partners/Fonix.png";
import InnoHubImg from "../../assets/landing-page/partners/InnoHub.png";
import InnovEdImg from "../../assets/landing-page/partners/InnovED.png";
import MduImg from "../../assets/landing-page/partners/MDU.svg";
import NovaReckonImg from "../../assets/landing-page/partners/NovaReckon.png";
import StowarzyszenieImg from "../../assets/landing-page/partners/Stowarzyszenie.svg";

interface ILandingPage {
    currentUser?: IUser
}

const LandingPage: React.FC<ILandingPage> = ({ currentUser }) => {
    const navigate = useNavigate();
    const { isMobile } = useDeviceType();
    const buttonsType: TButtonType = isMobile ? "default" : "action";
    const { t } = useTranslate();
    const containersDirection = isMobile ? "column" : "row";
    const partnersImgs = [
        FonixImg,
        InnoHubImg,
        InnovEdImg,
        MduImg,
        NovaReckonImg,
        StowarzyszenieImg
    ];

    return (
        <PageContainer>
            {/* 1 */}
            <PrimaryContainer
                direction={containersDirection}
                additionalClassess={`${commonStyles.lightestGreyBackground}`}
                height={isMobile ? "auto" : "allScreenHeight" }
            >
                <img
                    src={EnterGameImg}
                    alt="Enter game img"
                    className={commonStyles.sectionImg}
                />
                <PrimaryContainer
                    direction="column"
                    additionalClassess={`${commonStyles.lightestGreyBackground}${!isMobile ? ` ${containersStyles.halfScreenContainer}` : ''}`}
                >
                    <p
                        className={`${commonStyles.orangeText} ${commonStyles.basicHeader}`}
                    >
                        {formatNewLines(t("landing-page.headers.enter-game"))}
                    </p>
                    <PrimaryContainer
                        direction="column"
                        additionalClassess={`${styles.container} ${containersStyles.buttonsContainer} ${commonStyles.lightestGreyBackground}`}
                    >
                        <PrimaryButton
                            color="orange"
                            onClick={() => navigate(currentUser 
                                ? constantsUrls.Main.startLessons 
                                : constantsUrls.LandingPage.signIn
                            )}
                            type={buttonsType}
                        >
                            {t(currentUser 
                                ? "landing-page.buttons.start-lessons" 
                                : "main.signin"
                            )}
                        </PrimaryButton>
                        <PrimaryButton
                            color="white"
                            onClick={() => navigate(currentUser 
                                ? currentUser?.role === UserRoleEnum.TEACHER 
                                    ? constantsUrls.Main.myProgress
                                    : constantsUrls.Main.materials
                                : constantsUrls.LandingPage.signUp
                            )}
                            type={buttonsType}
                        >
                            {t(currentUser
                                ? currentUser?.role === UserRoleEnum.TEACHER
                                    ? "landing-page.buttons.educational-materials"
                                    : "landing-page.buttons.my-progress"
                                : "main.signup"
                            )}
                        </PrimaryButton>
                    </PrimaryContainer>
                </PrimaryContainer>
            </PrimaryContainer>
            {/* 2 */}
            <PrimaryContainer
                direction="column"
                additionalClassess={`${commonStyles.lightestGreyBackground} ${commonStyles.largeHorizontalPadding}`}
            >
                <img
                    src={WelcomePlanetGoalsImg}
                    alt="Welcome to the planet goals"
                    className={commonStyles.sectionImg}
                />
                <PrimaryContainer
                    direction="column"
                    additionalClassess={`${commonStyles.lightestGreyBackground}${!isMobile ? ` ${containersStyles.restrictedFlexibleContainer}` : ''}`}
                >
                    <p
                        className={`${commonStyles.orangeText} ${commonStyles.basicHeader}`}
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
                height={isMobile ? "auto" : "allScreenHeight" }
            >
                <img
                    src={ForTeachersImg}
                    alt="For teachers"
                    className={commonStyles.sectionImg}
                />
                <PrimaryContainer
                    direction="column"
                    additionalClassess={`${styles.sectionDescription} ${commonStyles.lightestGreyBackground}${!isMobile ? ` ${containersStyles.halfScreenContainer}` : ''}`}
                >
                    <p
                        className={`${commonStyles.orangeText} ${commonStyles.basicHeader} ${isMobile ? commonStyles.centeredText : commonStyles.leftSideText}`}
                    >
                        {t("landing-page.headers.for-teachers")}
                    </p>
                    <p className={styles.primaryText}>
                        {t("landing-page.descriptions.for-teachers")}
                    </p>
                    {
                        currentUser?.role === UserRoleEnum.TEACHER && 
                        <p className={`${commonStyles.blueText} ${footerStyles.privacyRef}`} onClick={() => navigate(constantsUrls.Main.materials)}>
                            {t("landing-page.buttons.check-materials")}
                        </p>
                    }
                </PrimaryContainer>
            </PrimaryContainer>
            {/* 4 */}
            <PrimaryContainer
                direction={isMobile ? containersDirection : "rowReverse"}
                additionalClassess={`${commonStyles.lightestGreyBackground} ${commonStyles.largeHorizontalPadding}`}
                height={isMobile ? "auto" : "allScreenHeight"}
            >
                <img
                    src={ForStudentsImg}
                    alt="For students"
                    className={commonStyles.sectionImg}
                />
                <PrimaryContainer
                    direction="column"
                    additionalClassess={`${styles.sectionDescription} ${commonStyles.lightestGreyBackground}${!isMobile ? ` ${containersStyles.halfScreenContainer}` : ''}`}
                >
                    <p
                        className={`${commonStyles.orangeText} ${commonStyles.basicHeader}`}
                    >
                        {t("landing-page.headers.for-students")}
                    </p>
                    <p className={styles.primaryText}>
                        {t("landing-page.descriptions.for-students")}
                    </p>
                    {
                        currentUser?.role === UserRoleEnum.STUDENT &&
                        <p className={`${commonStyles.blueText} ${footerStyles.privacyRef}`} onClick={() => navigate(constantsUrls.Main.startLessons)}>
                            {t("landing-page.buttons.start-lessons")}
                        </p>
                    }
                </PrimaryContainer>
            </PrimaryContainer>
            {/* 5 */}
            <PrimaryContainer
                direction={containersDirection}
                additionalClassess={`${commonStyles.lightGreyBackground} ${commonStyles.largeHorizontalPadding}`}
                height={isMobile ? "auto" : "allScreenHeight"}
           >
                <img
                    src={LearnInGroupImg}
                    alt="Learn in group"
                    className={commonStyles.sectionImg}
                />
                <PrimaryContainer
                    direction={containersDirection}
                    additionalClassess={`${styles.sectionDescription} ${commonStyles.lightGreyBackground}${!isMobile ? ` ${containersStyles.halfScreenContainer}` : ''}`}
                >
                    <p
                        className={`${commonStyles.darkText} ${commonStyles.basicHeader}`}
                    >
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
                        {[...partnersImgs, ...partnersImgs].map(
                            (logo, index) => (
                                <img
                                    key={index}
                                    src={logo}
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
                        className={`${commonStyles.orangeText} ${commonStyles.basicHeader}`}
                    >
                        {formatNewLines(t("landing-page.headers.visit-blog"))}
                    </p>
                    <PrimaryButton
                        color="orange"
                        onClick={redirect(
                            constantsUrls.LandingPage.blog,
                            "_blank"
                        )}
                    >
                        {t("landing-page.buttons.visit-blog")}
                    </PrimaryButton>
                </PrimaryContainer>
                <img
                    src={isMobile ? LearnAnywhereMobileImg : LearnAnywhereDesktopImg}
                    alt="Learn anywhere"
                    className={`${commonStyles.sectionImg} ${commonStyles.noPadding}`}
                />
            </PrimaryContainer>
            <Footer />
            <CookiesNotification />
        </PageContainer>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
})

export default connect(mapStateToProps, null)(LandingPage);
