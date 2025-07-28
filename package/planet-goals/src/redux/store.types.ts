import { IDropdownMenuStore } from "./dropdown-menu/dropdown-menu.types";
import { IGameState } from "./game/game.types";
import { IUserState } from "./user/user.types";

export interface IStore {
    dropdownMenu: IDropdownMenuStore;
    game: IGameState;
    user: IUserState;
}

export interface IAction<T> {
    type: string;
    payload: T;
}
