import React from "react";

import styles from "./popup.module.scss";

interface IPopup {
    children: React.ReactNode;
    visible: boolean;
}

const Popup: React.FC<IPopup> = ({ children, visible }) => (
    <aside className={`${styles.container}${!visible ? ` ${styles.hidden}` : ''}`}>
        <div className={styles.popup}>
            {children}
        </div>
    </aside>
);

export default Popup;