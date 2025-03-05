import React, { ReactNode } from 'react';
import styles from './primary-container.module.scss';

export type TContainersDirection = 'row' | 'rowReverse' | 'column' | 'columnReverse';

interface PrimaryContainerProps {
    children: ReactNode;
    height?: 'allScreenHeight' | 'auto';
    contentAlignment?: 'center' | 'left' | 'right';
    direction?: TContainersDirection;
    additionalClassess?: string;
}

const PrimaryContainer: React.FC<PrimaryContainerProps> = ({ children, contentAlignment = 'center', height = 'auto', direction = 'row', additionalClassess }) => {
    return <div className={`${styles.container} ${(height === 'allScreenHeight' && styles.allScreenHeight) || ''} ${styles[direction]} ${styles[contentAlignment]} ${additionalClassess || ''}`}>{children}</div>;
};

export default PrimaryContainer;
