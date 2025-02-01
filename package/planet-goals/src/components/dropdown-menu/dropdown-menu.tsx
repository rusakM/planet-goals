// DropdownMenu.tsx
import React from "react";
import styles from "./dropdown-menu.module.scss";

interface DropdownMenuProps {
    isOpen: boolean;
    items: [key: string, value: string][];
    onItemSelect?: (item: string) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
    isOpen,
    items,
    onItemSelect,
}) => {
    const handleSelect = (item: string) => {
        if (onItemSelect) onItemSelect(item);
    };

    return (
        isOpen && (
            <aside className={styles.dropdownMenu}>
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
