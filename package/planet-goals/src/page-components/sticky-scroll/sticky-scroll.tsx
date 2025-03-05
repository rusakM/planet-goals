import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import styles from "./sticky-scroll.module.scss";

interface IStickyScrollSection {
    items: React.ReactElement[];
}

const StickyScrollSection: React.FC<IStickyScrollSection> = ({ items }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const handleScroll = () => {
            const { top, height } = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Procentowy postęp przewijania sekcji (0 - początek, 1 - koniec)
            const scrollProgress = Math.min(Math.max((viewportHeight - top) / height, 0), 1);

            // Wybieramy indeks slajdu na podstawie scrolla
            const newIndex = Math.min(Math.floor(scrollProgress * items.length), items.length - 1);

            if (newIndex !== currentIndex) {
                gsap.to(containerRef.current, {
                    scale: 0.75,
                    duration: 0.25,
                    onComplete: () => {
                        setCurrentIndex(newIndex);
                        gsap.to(containerRef.current, { duration: 0.35, scale: 1 });
                    },
                });
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [items, currentIndex]);

    return (
        <div className={styles.sectionWrapper} ref={sectionRef}>
            <div className={styles.stickyContainer} ref={containerRef}>
                {items[currentIndex]}
            </div>
        </div>
    );
};

export default StickyScrollSection;