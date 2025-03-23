import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useTranslate } from '@tolgee/react';

import PageContainer from '../../page-components/page-container/page-container';
import PrimaryContainer from '../../components/primary-container/primary-container';
import MaterialsCard, { IMaterialsCard } from '../../components/materials-card/materials-card';

import { useDeviceType } from '../../helpers/responsiveContainers';
import { IUser } from '../../types/user';
import { selectCurrentUser } from '../../redux/user/user.selectors';

// import styles from "./materials.module.scss";
import commonStyles from "../../styles/common.module.scss";
import containersStyles from "../../styles/containers.module.scss";

import TeacherImg from "../../assets/teachers-materials/teacher_standing_against_blackboard.svg";
import Footer from '../../components/footer/footer';

interface IMaterials {
    currentUser?: IUser
}

const Materials: React.FC<IMaterials> = () => {
    const { t } = useTranslate();
    const { isMobile } = useDeviceType();

    const documentsList: IMaterialsCard[] = [
        {
            description: t("manuals.manual01.info"),
            downloadAction: () => downloadMaterial("Material 1 download"),
            header: t("manuals.manual01.header"),
            resizeAction: () => downloadMaterial("Material 1 resize"),
        },
        {
            description: t("manuals.manual02.info"),
            downloadAction: () => downloadMaterial("Material 2 download"),
            header: t("manuals.manual02.header"),
            resizeAction: () => downloadMaterial("Material 2 resize"),
        },
    ];

    const downloadMaterial = (material: string) => console.log(material);

    return (
        <PageContainer>
            <PrimaryContainer direction={isMobile ? "column" : "rowReverse"} additionalClassess={`${containersStyles.pagePadding}`}>
                <img alt="For teachers" src={TeacherImg} className={commonStyles.sectionImg} />
                <PrimaryContainer direction="column" additionalClassess={`${!isMobile ? containersStyles.halfScreenContainer : containersStyles.buttonsContainer}`}>
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
                <PrimaryContainer direction="row" additionalClassess={`${containersStyles.justifyFlexStart}`}>
                    {
                        documentsList.map(document => <MaterialsCard { ...document }  />)
                    }
                </PrimaryContainer>
            </PrimaryContainer>
            <Footer />
        </PageContainer>
    );
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
});

export default connect(mapStateToProps, null)(Materials);