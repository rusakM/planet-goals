import React, { useEffect } from 'react';
import { useTranslate } from '@tolgee/react';
import { useDispatch, useSelector } from 'react-redux';

import PageContainer from '../../page-components/page-container/page-container';
import PrimaryContainer from '../../components/primary-container/primary-container';
import ProgressCard, { TCardColor, TCircleColor } from '../../components/progress-card/progress-card';

import { useDeviceType } from '../../helpers/responsiveContainers';
import { getPlayerStatsStart } from '../../redux/user/user.actions';
import { selectUserStats, selectIsLoadingData } from '../../redux/user/user.selectors';

import styles from "./user-progress.module.scss";
import commonStyles from "../../styles/common.module.scss";
import containersStyles from "../../styles/containers.module.scss";

import ProgressImg from "../../assets/user-profile/progress1.svg";
import { constantsGame, constantsUrls } from '../../helpers/constants';
import Spinner from '../../components/spinner/spinner.component';
import Footer from '../../components/footer/footer';
import { createGameStart, setGameMode, setGameStage, setIsGameCreatedByCurrentUser, setPlayerRole, setSelectedLesson } from '../../redux/game/game.actions';
import { useNavigate } from 'react-router-dom';

const cardColorsList : TCardColor[] = ["orange", "blue", "red"];

const UserProgress: React.FC = () => {
    const { t } = useTranslate();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isMobile } = useDeviceType();
    const { playerStats, lessonsStats } = useSelector(selectUserStats);
    const isLoading = useSelector(selectIsLoadingData);

    useEffect(() => {
        if (isLoading || playerStats) return;
        dispatch(getPlayerStatsStart());
    })

    const startLesson = (id: string, index: number) => {
        dispatch(setPlayerRole("player"));
        dispatch(setGameMode("single"));
        dispatch(setGameStage("wait"));
        dispatch(setIsGameCreatedByCurrentUser(true));
        dispatch(setSelectedLesson(index));
        dispatch(createGameStart({
            hostRole: "player",
            lesson: id,
            singlePlayerMode: true,
        }));
        setTimeout(() => navigate(constantsUrls.Main.lobby), 250);
    }

    return (<PageContainer>
        <PrimaryContainer direction={isMobile ? "column" : "row"} additionalClassess={`${containersStyles.pagePadding}`}>
            <img src={ProgressImg} className={`${commonStyles.sectionImg} ${styles.img}`} alt="User stats" />
            <PrimaryContainer direction="column" additionalClassess={`${!isMobile ? `${containersStyles.halfScreenContainer} ${styles.headerContainer}` : containersStyles.buttonsContainer}`}>
                <p className={`${commonStyles.basicHeader} ${commonStyles.orangeText} ${styles.headerText}`}>{t("player.stats.header")}</p>
                <p className={`${commonStyles.darkText} ${styles.headerText} ${styles.headerDescription} ${commonStyles.noMargin}`}>{t("player.stats.description")}</p>
            </PrimaryContainer>
        </PrimaryContainer>
        <PrimaryContainer direction="column" additionalClassess={`${commonStyles.transparentBackground} ${containersStyles.pagePadding}${isMobile ? '' : ` ${styles.listContainer} ${containersStyles.restrictedFlexibleContainer2} ${containersStyles.centerFlexibleContainer2} ${containersStyles.alignFlexStart}`}`}>
            <p className={`${commonStyles.basicHeader3} ${commonStyles.darkText} ${styles.cardListHeader}`}>{t("player.stats.lessons.list.header")}</p>
            {
                isLoading || !playerStats ? <Spinner /> :
                <PrimaryContainer additionalClassess={`${styles.cardListContainer}`}>
                    {
                        constantsGame.LESSONS_IDS.map((id, index) => {
                            const gameStat = playerStats?.find(({ _id }) => _id === id);
                            const lessonStat = lessonsStats?.find(({ _id }) => _id === id);
                            const color = cardColorsList[index % 3];
                            const colorCircle: TCircleColor = color === "blue" ? "darkBlue" : color;
                            return (<ProgressCard 
                                color={color}
                                colorCircle={colorCircle}
                                id={id}
                                lessonNumber={index + 1}
                                maxPoints={lessonStat?.maxPoints || 50}
                                points={gameStat?.lastGame?.score}
                                title={t(`lesson.choice.0${index + 1}.header`)}
                                open={startLesson}
                                key={index}
                            />);
                        })
                    }
                </PrimaryContainer>
            }
        </PrimaryContainer>
        <Footer />
    </PageContainer>);
}

export default UserProgress;