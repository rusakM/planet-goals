import React, { ChangeEvent, ReactElement } from 'react';

import styles from './checkbox.module.scss';
import errorStyles from '../../styles/errors.module.scss';

interface ICheckbox {
    checked: boolean,
    disabled?: boolean,
    error?: boolean,
    label: ReactElement | string,
    onChange?: (event: ChangeEvent) => void,
}

const Checkbox: React.FC<ICheckbox> = ({ checked, disabled = false, error, label, onChange }) => (
    <label className={styles.checkbox}>
        <input type="checkbox" checked={checked} disabled={disabled} onChange={onChange} />
        <span className={`${error ? `${errorStyles.errorInput} ` : ''}${styles.customCheckbox}`}>{checked && "✔"}</span>
        <span className={`${error ? `${errorStyles.errorText} ` : ''}${styles.label}`}>{label}</span>
    </label>
)

export default Checkbox;