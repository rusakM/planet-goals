import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useTranslate } from '@tolgee/react';

import PageContainer from '../../page-components/page-container/page-container';
import PrimaryContainer from '../../components/primary-container/primary-container';
import MaterialsCard, { IMaterialsCard } from '../../components/materials-card/materials-card';

import { useDeviceType } from '../../helpers/responsiveContainers';
import { IUser } from '../../types/user';
import { selectCurrentUser } from '../../redux/user/user.selectors';

import styles from "./materials.module.scss";
import commonStyles from "../../styles/common.module.scss";
import containersStyles from "../../styles/containers.module.scss";

import TeacherImg from "../../assets/teachers-materials/teacher_standing_against_blackboard.svg";
import Footer from '../../components/footer/footer';
import Flipbook from '../../page-components/flipbook/flipbook';
import { downloadFile } from '../../helpers/events.functions';

interface IMaterials {
    currentUser?: IUser
}

const Materials: React.FC<IMaterials> = () => {
    const { t } = useTranslate();
    const { isMobile } = useDeviceType();
    const [isFlipbookOpened, setIsFlipbookOpened] = useState<boolean>(false);
    const [flipbookNumber, setFlipbookNumber] = useState<number>(0);

    const documentsList: IMaterialsCard[] = [
        {
            description: t("manuals.manual01.info"),
            downloadAction: () => downloadMaterial(0),
            header: t("manuals.manual01.header"),
            resizeAction: () => openFlipbook(0),
        },
        {
            description: t("manuals.manual02.info"),
            downloadAction: () => downloadMaterial(1),
            header: t("manuals.manual02.header"),
            resizeAction: () => openFlipbook(1),
        },
    ];

    const documentsUrls: string[] = [
        '/cdn/materials/manual_01.pdf',
        '/cdn/materials/manual_02.pdf'
    ]

    const downloadMaterial = (num: number) => downloadFile(documentsUrls[num]);
    const openFlipbook = (num: number) => {
        setFlipbookNumber(num);
        setIsFlipbookOpened(true);
    }

    return (
        <PageContainer>
            <PrimaryContainer direction={isMobile ? "column" : "rowReverse"} additionalClassess={`${containersStyles.pagePadding}`}>
                <img alt="For teachers" src={TeacherImg} className={commonStyles.sectionImg} />
                <PrimaryContainer direction="column" additionalClassess={`${!isMobile ? `${containersStyles.halfScreenContainer} ${styles.descriptionContainer}` : containersStyles.buttonsContainer}`}>
                    <p className={`${commonStyles.basicHeader} ${commonStyles.orangeText}`}>
                        {t("manuals.header.info")}
                    </p>
                    <p className={`${commonStyles.darkText}`}>
                        {t("manuals.info")}
                    </p>
                </PrimaryContainer>
            </PrimaryContainer>
            <PrimaryContainer direction="column" additionalClassess={`${containersStyles.pagePadding}${isMobile ? '' : ` ${containersStyles.restrictedFlexibleContainer2} ${containersStyles.centerFlexibleContainer2} ${containersStyles.alignFlexStart}`}`}>
                <p className={`${commonStyles.basicHeader3}`}>{t("manuals.header")}</p>
                <PrimaryContainer direction="row" additionalClassess={`${containersStyles.justifyFlexStart} ${styles.cardsContainer}`}>
                    {
                        documentsList.map((document, index) => <MaterialsCard key={index} { ...document }  />)
                    }
                </PrimaryContainer>
            </PrimaryContainer>
            {
                isFlipbookOpened && <Flipbook onClose={() => setIsFlipbookOpened(false)} pdfUrl={documentsUrls[flipbookNumber]} />
            }
            <Footer />
        </PageContainer>
    );
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
});

export default connect(mapStateToProps, null)(Materials);