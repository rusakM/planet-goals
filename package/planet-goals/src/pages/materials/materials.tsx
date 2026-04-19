/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, lazy, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslate } from '@tolgee/react';

import PageContainer from '../../page-components/page-container/page-container';
import PrimaryContainer from '../../components/primary-container/primary-container';
import MaterialsCard, { IMaterialsCard } from '../../components/materials-card/materials-card';

import { useDeviceType } from '../../helpers/responsiveContainers';
import { selectIsFetchingMaterials, selectMaterials } from '../../redux/materials/materials.selectors';
import { fetchMaterialsStart } from '../../redux/materials/materials.actions';

import styles from "./materials.module.scss";
import commonStyles from "../../styles/common.module.scss";
import containersStyles from "../../styles/containers.module.scss";

import TeacherImg from "../../assets/teachers-materials/teacher_standing_against_blackboard.svg";
import Footer from '../../components/footer/footer';
import Spinner from '../../components/spinner/spinner.component';

import { downloadFile } from '../../helpers/events.functions';
import { getCurrentLocale } from '../../translations/utils';
import { constantsUrls } from '../../helpers/constants';

const Flipbook = lazy(() => import("../../page-components/flipbook/flipbook"))

const Materials: React.FC = () => {
	const { t } = useTranslate();
	const dispatch = useDispatch();
	const { isMobile } = useDeviceType();
 
	const [isFlipbookOpened, setIsFlipbookOpened] = useState<boolean>(false);
	const [flipbookUrl, setFlipbookUrl] = useState<string>('');
 
	const materials = useSelector(selectMaterials);
	const isFetching = useSelector(selectIsFetchingMaterials);
 
	useEffect(() => {
    if (!isFetching && !materials) {
        dispatch(fetchMaterialsStart());
    }
}, [dispatch]);
 
	const getMaterialUrl = (materialNumber: number): string => {
		const material = materials.find(m => m.materialNumber === materialNumber);
		if (!material) return '';
		return `${constantsUrls.Materials.cdnMaterials}/${material.names[getCurrentLocale()]}`;
	};
 
	const downloadMaterial = (materialNumber: number): void => {
		const url = getMaterialUrl(materialNumber);
		if (url) downloadFile(url);
	};
 
	const openFlipbook = (materialNumber: number): void => {
		const url = getMaterialUrl(materialNumber);
		if (url) {
			setFlipbookUrl(url);
			setIsFlipbookOpened(true);
		}
	};
 
	const documentsList: IMaterialsCard[] = materials?.map(material => ({
		description: t("manuals.manual01.info"),
		downloadAction: () => downloadMaterial(material.materialNumber),
		header: t(material.translation),
		resizeAction: () => openFlipbook(material.materialNumber),
	})) ?? [];
 
	return (
		<PageContainer>
			<PrimaryContainer
				direction={isMobile ? "column" : "rowReverse"}
				additionalClassess={`${containersStyles.pagePadding}`}
			>
				<img alt="For teachers" src={TeacherImg} className={commonStyles.sectionImg} />
				<PrimaryContainer
					direction="column"
					additionalClassess={`${!isMobile
						? `${containersStyles.halfScreenContainer} ${styles.descriptionContainer}`
						: containersStyles.buttonsContainer
					}`}
				>
					<p className={`${commonStyles.basicHeader} ${commonStyles.orangeText}`}>
						{t("manuals.header.info")}
					</p>
					<p className={`${commonStyles.darkText}`}>
						{t("manuals.info")}
					</p>
				</PrimaryContainer>
			</PrimaryContainer>
 
			<PrimaryContainer
				direction="column"
				additionalClassess={`${containersStyles.pagePadding}${isMobile
					? ''
					: ` ${containersStyles.restrictedFlexibleContainer2} ${containersStyles.centerFlexibleContainer2} ${containersStyles.alignFlexStart}`
				}`}
			>
				<p className={`${commonStyles.basicHeader3}`}>{t("manuals.header")}</p>
				<PrimaryContainer
					direction="row"
					additionalClassess={`${containersStyles.justifyFlexStart} ${styles.cardsContainer}`}
				>
					{isFetching
						? <Spinner />
						: documentsList.map((document, index) => (
							<MaterialsCard key={index} {...document} />
						))
					}
				</PrimaryContainer>
			</PrimaryContainer>
 
			{isFlipbookOpened && (
				<Flipbook
					onClose={() => setIsFlipbookOpened(false)}
					pdfUrl={flipbookUrl}
				/>
			)}
 
			<Footer />
		</PageContainer>
	);
};
 
export default Materials;
 