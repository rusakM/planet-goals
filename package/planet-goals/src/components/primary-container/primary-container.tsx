import React, { ReactNode } from "react";
import styles from "./primary-container.module.scss";

interface PrimaryContainerProps {
    children: ReactNode;
    height?: "allScreenHeight" | "auto";
    direction?: "row" | "column";
    additionalClassess?: string;
}

const PrimaryContainer: React.FC<PrimaryContainerProps> = ({
    children,
    height = "auto",
    direction = "row",
    additionalClassess,
}) => {
    return (
        <div
            className={`${styles.container} ${
                (height === "allScreenHeight" && styles.allScreenHeight) || ""
            } ${styles[direction]} ${additionalClassess || ""}`}
        >
            {children}
        </div>
    );
};

export default PrimaryContainer;
