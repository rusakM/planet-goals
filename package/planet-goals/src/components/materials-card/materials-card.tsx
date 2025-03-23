import React from 'react';
import { useTranslate } from '@tolgee/react';
import PrimaryButton from '../primary-button.tsx/primary-button';

import styles from "./materials-card.module.scss";
import commonStyles from "../../styles/common.module.scss";
import DocumentIconImg from "../../assets/teachers-materials/document_icon.svg";
import ResizeIconImg from "../../assets/teachers-materials/resize_icon.svg";

export interface IMaterialsCard {
    description?: string;
    downloadAction?: () => void;
    header?: string;
    picture?: string;
    resizeAction?: () => void;
}

const MaterialsCard: React.FC<IMaterialsCard> = ({ description, downloadAction, header, picture, resizeAction }) => {
    const { t } = useTranslate();
    return (
        <div className={`${styles.cardContainer}`}>
            <div className={`${styles.card}`}>
                <div className={`${styles.cardImageContainer}${!picture ? ` ${styles.noImage}` : ''}`}>
                    <img src={picture || DocumentIconImg} alt="document" className={`${!picture ? styles.defaultCardImage : ''}`} />
                </div>
                <div className={`${styles.contentContainer}`}>
                    <p className={`${commonStyles.basicHeader4}`}>
                        {header || ""}
                    </p>
                    <p className={`${commonStyles.darkText}`}>
                        {description || ""}
                    </p>
                </div>
                <div className={`${styles.cardButtonsContainer}`}>
                    <PrimaryButton color="orange" size="small" onClick={downloadAction}>
                        {t("manuals.download.button")}
                    </PrimaryButton>
                    <PrimaryButton color="white" size="small" onClick={resizeAction}>
                        <img src={ResizeIconImg} />
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

export default MaterialsCard;