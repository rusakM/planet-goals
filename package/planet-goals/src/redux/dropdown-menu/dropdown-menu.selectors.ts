import { createSelector } from "reselect";
import { IStore } from "../store.types";

const selectMenu = (state) => state.dropdownMenu;

export const selectHeaderMenuHidden = createSelector(
    [selectMenu],
    (menu: IStore["dropdownMenu"]) => menu.headerMenu.hidden
);

export const selectLanguagesMenuHidden = createSelector(
    [selectMenu],
    (menu: IStore["dropdownMenu"]) => menu.languagesMenu.hidden
);
