import { IDropdownMenuStore } from "./dropdown-menu/dropdown-menu.types";
import { IGameState } from "./game/game.types";
import { IMaterialsState } from "./materials/materials.types";
import { IUserState } from "./user/user.types";

export interface IStore {
    dropdownMenu: IDropdownMenuStore;
    game: IGameState;
    materials: IMaterialsState;
    user: IUserState;
}

export interface IAction<T> {
    type: string;
    payload: T;
}
