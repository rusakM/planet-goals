import React from "react";
import styles from "./separator.module.scss";

interface SeparatorProps {
    color?: "orange" | "white" | "blue";
    width?: number;
    noPadding?: boolean;
    noMargin?: boolean;
}

const Separator: React.FC<SeparatorProps> = ({ color = "orange", width, noMargin, noPadding }) => {
    const inlineStyles = width ? { width: `${width}px` } : {};
    return <div className={`${styles.separator} ${styles[color]}${noMargin ? ` ${styles.noMargin}` : ""}${noPadding ? ` ${styles.noPadding}` : ""}`} style={inlineStyles}></div>;
};

export default Separator;
