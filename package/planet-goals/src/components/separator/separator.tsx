import React from "react";
import styles from "./separator.module.scss";

interface SeparatorProps {
    color?: "orange" | "white" | "blue";
    width?: number;
    noPadding?: boolean;
}

const Separator: React.FC<SeparatorProps> = ({ color = "orange", width, noPadding }) => {
    const inlineStyles = width ? { width: `${width}px` } : {};
    return <div className={`${styles.separator} ${styles[color]}${noPadding ? ` ${styles.noPadding}` : ""}`} style={inlineStyles}></div>;
};

export default Separator;
