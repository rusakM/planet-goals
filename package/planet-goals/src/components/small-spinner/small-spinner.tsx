import React from 'react';
import styles from './small-spinner.module.scss';

const SmallSpinner: React.FC = () => (
    <div className={styles.SpinnerOverlay}>
        <div className={styles.SpinnerContainer}></div>
    </div>
);

export default SmallSpinner;