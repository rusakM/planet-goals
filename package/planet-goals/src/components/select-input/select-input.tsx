import React, { ChangeEvent, useState } from "react";
import { useTranslate } from "@tolgee/react";
import styles from "./select-input.module.scss";
import errorStyles from "../../styles/errors.module.scss";
import containerStyles from "../../styles/containers.module.scss";

import PrimaryButton from "../primary-button.tsx/primary-button";
import PrimaryContainer from "../primary-container/primary-container";

export interface ISelectInputOption {
    label: string,
    value: string,
}

interface ISelectInputProps {
    disabled?: boolean;
    error?: boolean;
    name?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    options: ISelectInputOption[];
    value?: string;
}

const SelectInput: React.FC<ISelectInputProps> = ({
    disabled, error, name, onChange, placeholder, options, value
}) => {
    const { t } = useTranslate();
    const [ isOpened, setIsOpened ] = useState<boolean>(false);
    const [ filteredList, setFilteredList ] = useState<ISelectInputOption[]>(options);
    const [ filteredPhrase, setFilteredPhrase ] = useState<string>("");
    const [ selectedValue, setSelectedValue ] = useState<string>(value || "");

    const clearState = () => {
        setIsOpened(false);
        setFilteredPhrase("");
        setFilteredList(options);
        setSelectedValue(value || "");
    }

    const handleChange = () => {
        setIsOpened(false);
        onChange(selectedValue);
        clearState();
    }

    const handleSelect = ({ value }: ISelectInputOption) => {
        setSelectedValue(value);
    };

    const handleFilter = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setFilteredPhrase(event.target.value);
        setFilteredList(event.target.value === "" 
            ? options 
            : options.filter(({ label }) =>
                label.toLowerCase().includes(event.target.value.toLowerCase())
            ));
    }

    return (
        <>
            <input className={`${styles.selectInput} ${error ? errorStyles.errorInput : ""}`} 
                placeholder={placeholder}
                value={value ? options.find((item) => item.value === value)?.label : ""}
                name={name}
                disabled={disabled}
                onClick={() => setIsOpened(!disabled && true)}
                onChange={handleChange}
            />
            {
                isOpened && 
                    <aside className={`${styles.selectContainer}`}>
                        <div className={styles.searchBarContainer}>
                            <input value={filteredPhrase} onChange={handleFilter} className={styles.selectInput}/>
                        </div>
                        <ul className={styles.list} >
                            {
                                filteredList.map(item => (
                                    <li onClick={() => handleSelect(item)} className={`${styles.listItem}${item.value === selectedValue ? ` ${styles.listItemActive}` : ''}`}>
                                        {item.label}
                                    </li>
                                ))
                            }
                        </ul>
                        <PrimaryContainer direction="row" additionalClassess={`${styles.buttonsContainer} ${containerStyles.buttonsContainer}`}>
                            <PrimaryButton size="small" color="orange" onClick={handleChange}>{t("main.confirm")}</PrimaryButton>
                            <PrimaryButton size="small" color="white" onClick={() => clearState()}>
                                {t("main.back")}
                            </PrimaryButton>
                        </PrimaryContainer>
                    </aside>
            }
        </>
    )
}

export default SelectInput;