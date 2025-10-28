import React from "react";
import styles from './spinner.module.scss';

export type TSpinnerColor = "none" | "orange";

interface ISpinner {
  color?: TSpinnerColor;
  description?: string;
}

const Spinner: React.FC<ISpinner> = ({ description, color = "none" }) => (
  <div className={`${styles.SpinnerOverlay}`}>
    {description && <p>{description}</p>}
    <div className={`${styles.SpinnerContainer}${color !== "none" ? ` ${styles[color]}` : ""}`} />
  </div>
);

export default Spinner;
