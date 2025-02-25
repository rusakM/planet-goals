import DropdownMenuTypes, { IDropdownMenuStore } from "./dropdown-menu.types";

const INITIAL_STATE: IDropdownMenuStore = {
    headerMenu: {
        hidden: true,
    },
    languagesMenu: {
        hidden: true,
    },
};

const menuReducer = (
    state: IDropdownMenuStore = INITIAL_STATE,
    action
): IDropdownMenuStore => {
    switch (action.type) {
        case DropdownMenuTypes.TOGGLE_HEADER_MENU_HIDDEN:
            return {
                ...state,
                headerMenu: {
                    ...state.headerMenu,
                    hidden: !state.headerMenu.hidden,
                },
            };
        case DropdownMenuTypes.TOGGLE_LANGUAGES_MENU_HIDDEN:
            return {
                ...state,
                languagesMenu: {
                    ...state.languagesMenu,
                    hidden: !state.languagesMenu.hidden,
                },
            };
        case DropdownMenuTypes.HIDE_ALL:
            return INITIAL_STATE;
        default:
            return state;
    }
};

export default menuReducer;
