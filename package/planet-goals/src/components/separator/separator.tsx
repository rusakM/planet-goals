import React from "react";
import styles from "./separator.module.scss";

interface SeparatorProps {
    color?: "orange" | "white" | "blue";
}

const Separator: React.FC<SeparatorProps> = ({ color = "orange" }) => {
    return <div className={`${styles.separator} ${styles[color]}`}></div>;
};

export default Separator;
