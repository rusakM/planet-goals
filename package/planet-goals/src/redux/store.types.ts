import { IDropdownMenuStore } from "./dropdown-menu/dropdown-menu.types";
import { IUserState } from "./user/user.types";

export interface IStore {
    dropdownMenu: IDropdownMenuStore;
    user: IUserState;
}
