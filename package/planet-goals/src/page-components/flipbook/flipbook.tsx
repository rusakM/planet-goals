import React, { useState, useEffect } from "react";
import { pdfjs } from "react-pdf";
import { FlippingPages } from "flipping-pages";
import styles from "./flipbook.module.scss";
import PrimaryButton from "../../components/primary-button.tsx/primary-button";

interface IFlipbook {
    onClose: () => void,
    pdfUrl: string,
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

const Flipbook: React.FC<IFlipbook> = ({ pdfUrl, onClose }) => {
	const [numPages, setNumPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	const [pageImages, setPageImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

	return (
		<div className={styles.flipbook}>
			<div className={styles.flipbookPages}>
				{
					isLoading ? 'Loading...' :
					<FlippingPages
					direction="right-to-left"
					selected={currentPage}
					onSwipeEnd={setCurrentPage}
				>
					{pageImages.map((image, index) => (
                        <img 
                            key={index} 
                            src={image} 
                            alt={`Strona ${index + 1}`} 
                            className={styles.flipbookPage}
                        />
                    ))}
				</FlippingPages>
				}
				
			</div>

			<div className={styles.flipbookControls}>
				<PrimaryButton onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))} disabled={currentPage === 0} color="orange" size="small">
				Prev
				</PrimaryButton>
				<PrimaryButton onClick={() => setCurrentPage((p) => Math.min(p + 1, numPages - 1))} disabled={currentPage === numPages - 1} color="orange" size="small">
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