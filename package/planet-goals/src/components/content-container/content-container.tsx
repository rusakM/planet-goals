import React from "react";
import styles from "./content-container.module.scss";

interface ContentContainerProps {
    children: React.ReactNode;
}

const ContentContainer: React.FC<ContentContainerProps> = ({ children }) => {
    return <div className={styles.contentContainer}>{children}</div>;
};

export default ContentContainer;
