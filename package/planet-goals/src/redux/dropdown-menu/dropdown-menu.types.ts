const DropdownMenuTypes = {
    HIDE_ALL: "HIDE_ALL",
    TOGGLE_HEADER_MENU_HIDDEN: "TOGGLE_HEADER_MENU_HIDDEN",
    TOGGLE_LANGUAGES_MENU_HIDDEN: "TOGGLE_LANGUAGES_MENU_HIDDEN",
};

export interface IDropdownMenu {
    hidden: boolean;
}

export interface IDropdownMenuStore {
    headerMenu?: IDropdownMenu;
    languagesMenu?: IDropdownMenu;
}

export default DropdownMenuTypes;
