// DropdownMenu.tsx
import React from "react";
import styles from "./dropdown-menu.module.scss";

interface DropdownMenuProps {
    isOpen: boolean;
    items: [key: string, value: string][];
    onItemSelect?: (item: string) => void;
    reference?: React.MutableRefObject<HTMLElement>
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
    isOpen,
    items,
    onItemSelect,
    reference
}) => {
    const handleSelect = (item: string) => {
        if (onItemSelect) onItemSelect(item);
    };

    return (
        isOpen && (
            <aside className={styles.dropdownMenu} ref={reference || null}>
                <ul className={styles.dropdownList}>
                    {items.map(([key, value], index) => (
                        <li
                            key={index}
                            className={styles.dropdownItem}
                            onClick={() => handleSelect(key)}
                        >
                            {value}
                        </li>
                    ))}
                </ul>
            </aside>
        )
    );
};

export default DropdownMenu;
