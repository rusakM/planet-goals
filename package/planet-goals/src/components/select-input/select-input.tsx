import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import styles from "./select-input.module.scss";
import errorStyles from "../../styles/errors.module.scss";

export interface ISelectInputOption {
	label: string;
	value: string;
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
	disabled,
	error,
	name,
	onChange,
	placeholder,
	options,
	value
}) => {
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const [filteredList, setFilteredList] = useState<ISelectInputOption[]>(options);
	const [filteredPhrase, setFilteredPhrase] = useState<string>("");
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Obsługa kliknięcia poza komponentem
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpened(false);
				setFilteredPhrase("");
				setFilteredList(options);
			}
		};

		if (isOpened) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpened, options]);

	// Aktualizacja listy filtrowanej gdy zmienią się opcje
	useEffect(() => {
		setFilteredList(options);
	}, [options]);

	const handleInputClick = () => {
		if (!disabled) {
			setIsOpened(true);
			inputRef.current?.focus();
		}
	};

	const handleSelect = (option: ISelectInputOption) => {
		if (onChange) {
			onChange(option.value);
		}
		setIsOpened(false);
		setFilteredPhrase("");
		setFilteredList(options);
	};

	const handleFilter = (event: ChangeEvent<HTMLInputElement>) => {
		const phrase = event.target.value;
		setFilteredPhrase(phrase);
		setFilteredList(
			phrase === ""
				? options
				: options.filter(({ label }) =>
					label.toLowerCase().includes(phrase.toLowerCase())
				)
		);
	};

	const displayValue = isOpened
		? filteredPhrase
		: options.find((item) => item.value === value)?.label || "";

	return (
		<div ref={containerRef} className={styles.selectContainer}>
			<input
				ref={inputRef}
				className={`${styles.selectInput} ${error ? errorStyles.errorInput : ""}`}
				placeholder={placeholder}
				value={displayValue}
				name={name}
				disabled={disabled}
				onClick={handleInputClick}
				onFocus={handleInputClick}
				onChange={handleFilter}
				autoComplete="off"
			/>
			{isOpened && (
				<ul className={styles.selectDropdown}>
					{filteredList.length > 0 ? (
						filteredList.map((option) => (
							<li
								key={option.value}
								className={`${styles.selectOption} ${
									option.value === value ? styles.selectedOption : ""
								}`}
								onClick={() => handleSelect(option)}
							>
								{option.label}
							</li>
						))
					) : (
						<li className={styles.selectOptionEmpty}>Brak wyników</li>
					)}
				</ul>
			)}
		</div>
	);
};

export default SelectInput;