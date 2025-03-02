import React, { ReactNode } from "react";
import styles from "./primary-container.module.scss";

interface PrimaryContainerProps {
    children: ReactNode;
    height?: "allScreenHeight" | "auto";
    contentAlignment?: "center" | "left" | "right";
    direction?: "row" | "rowReverse" | "column" | "columnReverse";
    additionalClassess?: string;
}

const PrimaryContainer: React.FC<PrimaryContainerProps> = ({
    children,
    contentAlignment = "center",
    height = "auto",
    direction = "row",
    additionalClassess,
}) => {
    return (
        <div
            className={`${styles.container} ${
                (height === "allScreenHeight" && styles.allScreenHeight) || ""
            } ${styles[direction]} ${styles[contentAlignment]} ${additionalClassess || ""}`}
        >
            {children}
        </div>
    );
};

export default PrimaryContainer;
