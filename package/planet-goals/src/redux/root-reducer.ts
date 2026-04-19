import { combineReducers } from "redux";
import { persistReducer, PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage";

import dropdownMenuReducer from "./dropdown-menu/dropdown-menu.reducer";
import gameReducer from "./game/game.reducer";
import materialsReducer from "./materials/materials.reducer";
import userReducer from "./user/user.reducer";
import socketReducer from "./sockets/socket.reducer";

const persistConfig: PersistConfig<object> = {
    key: "root",
    storage,
    whitelist: ["user"],
};

const rootReducer = combineReducers({
    dropdownMenu: dropdownMenuReducer,
    game: gameReducer,
    materials: materialsReducer,
    socket: socketReducer,
    user: userReducer,
});

export default persistReducer(persistConfig, rootReducer);
