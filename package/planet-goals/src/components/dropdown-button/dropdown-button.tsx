import React from "react";
import PrimaryButton, { TButtonColor } from "../primary-button.tsx/primary-button";
import styles from "./dropdown-button.module.scss";
import commonStyles from "../../styles/common.module.scss";

interface IDropdownbutton {
    color: TButtonColor,
    description: string,
    handleClick: () => void,
    handleOpen: () => void,
    header: React.ReactNode | string,
    isOpen: boolean,
}

const DropdownButton: React.FC<IDropdownbutton> = ({color, description, handleClick, handleOpen, header, isOpen }) => {
    return (
        <div className={`${styles.dropdownButtonContainer}`}>
            <div className={`${styles.row}`}>
                <PrimaryButton color={color} onClick={handleClick} additionalClasses={`${styles.lessonButton}`}>
                    {header}
                </PrimaryButton>
                <PrimaryButton color={color} onClick={handleOpen} additionalClasses={`${styles.chevronButton}`}>
                    &#8964;
                </PrimaryButton>
            </div>
            {
                isOpen && <div className={`${styles.descriptionContainer} ${commonStyles[`${color}Background`]}`}>
                    <p>{description}</p>
                </div>
            }
        </div>
    );    
}

export default DropdownButton;