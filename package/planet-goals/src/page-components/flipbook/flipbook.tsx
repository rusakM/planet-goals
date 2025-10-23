/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import { useDeviceType } from "../../helpers/responsiveContainers";
import styles from "./flipbook.module.scss";
import PrimaryButton from "../../components/primary-button.tsx/primary-button";

interface IFlipbook {
	onClose: () => void;
	pdfUrl: string;
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url,
).toString();

const Page = React.forwardRef<HTMLDivElement, { children: React.ReactNode; number: number }>(
	(props, ref) => {
		return (
			<div className={styles.page} ref={ref}>
				<div className={styles.pageContent}>
					{props.children}
					<div className={styles.pageFooter}>{props.number + 1}</div>
				</div>
			</div>
		);
	}
);

Page.displayName = 'Page';

const Flipbook: React.FC<IFlipbook> = ({ pdfUrl, onClose }) => {
	const [numPages, setNumPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	const [pageImages, setPageImages] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);
    const { isMobile } = useDeviceType();
    const dimensions = {
        width: (window.innerWidth >> 1) - 50,
        height: window.innerHeight - 100
    };

    console.log('dimensions', dimensions);

	
	const flipBookRef = useRef<any>(null);

	// useEffect(() => {
	// 	const updateDimensions = () => {
	// 		setDimensions({
	// 			width: isMobile ? window.innerWidth * 0.9 : 550,
	// 			height: isMobile ? window.innerHeight - 100 : 733,
	// 		});
	// 	};

	// 	updateDimensions();
	// 	window.addEventListener('resize', updateDimensions);
	// 	return () => window.removeEventListener('resize', updateDimensions);
	// }, [isMobile]);

	useEffect(() => {
		const loadPdfPages = async () => {
			try {
				const loadingTask = pdfjs.getDocument(pdfUrl);
				const pdf = await loadingTask.promise;
				setNumPages(pdf.numPages);

				const images: string[] = [];
				for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
					const page = await pdf.getPage(pageNum);
					const viewport = page.getViewport({ scale: 1.5 });

					const canvas = document.createElement('canvas');
					const context = canvas.getContext('2d');
					if (!context) continue;
					
					canvas.height = viewport.height;
					canvas.width = viewport.width;

					const renderContext = {
						canvasContext: context,
						viewport: viewport
					};

					await page.render(renderContext).promise;
					images.push(canvas.toDataURL());
				}

				setPageImages(images);
				setIsLoading(false);
			} catch (error) {
				console.error("Error loading PDF:", error);
				setIsLoading(false);
			}
		};

		loadPdfPages();
	}, [pdfUrl]);

	const nextButtonClick = () => {
		flipBookRef.current?.pageFlip()?.flipNext();
	};

	const prevButtonClick = () => {
		flipBookRef.current?.pageFlip()?.flipPrev();
	};

	const onFlip = (e: any) => {
		setCurrentPage(e.data);
	};

	return (
		<div className={styles.flipbook}>
			<div className={styles.flipbookPages}>
				{isLoading ? (
					<div className={styles.loading}>Loading...</div>
				) : (
                    //@ts-ignore
					<HTMLFlipBook
                            width={550}
                            height={733}
                            minWidth={315}
                            maxWidth={1000}
                            minHeight={420}
                            maxHeight={1350}
                            size="stretch"
                            maxShadowOpacity={0.5}
                            showCover={false}
                            mobileScrollSupport={true}
                            onFlip={onFlip}
                            ref={flipBookRef}
                            startPage={0} 
                            className={styles.flipBook}
                            drawShadow={true} 
                            // flippingTime={0} 
                            usePortrait={isMobile} 
                            // startZIndex={0} 
                            autoSize={true} 
                            // clickEventForward={false} 
                            // useMouseEvents={false} 
                            // swipeDistance={0} 
                            // showPageCorners={false} 
                            // disableFlipByClick={false}	
                        >
						{pageImages.map((image, index) => (
							<Page key={index} number={index}>
								<img 
									src={image} 
									alt={`Page ${index + 1}`}
									className={styles.pageImage}
								/>
							</Page>
						))}
					</HTMLFlipBook>
				)}
			</div>

			<div className={styles.flipbookControls}>
				<PrimaryButton 
					onClick={prevButtonClick} 
					disabled={currentPage === 0 || isLoading} 
					color="orange" 
					size="small"
				>
					Prev
				</PrimaryButton>
				<span className={styles.pageCounter}>
					{currentPage + 1} / {numPages}
				</span>
				<PrimaryButton 
					onClick={nextButtonClick} 
					disabled={currentPage === numPages - 1 || isLoading} 
					color="orange" 
					size="small"
				>
					Next
				</PrimaryButton>
				<PrimaryButton onClick={onClose} size="small" color="orange">
					Close
				</PrimaryButton>
			</div>
		</div>
	);
};

export default Flipbook;