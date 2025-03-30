import React from "react";
import styles from './spinner.module.scss';

interface ISpinner {
  description?: string;
}

const Spinner: React.FC<ISpinner> = ({ description }) => (
  <div className={styles.SpinnerOverlay}>
    {description && <p>{description}</p>}
    <div className={styles.SpinnerContainer} />
  </div>
);

export default Spinner;
