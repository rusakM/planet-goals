import { combineReducers } from "redux";
import { persistReducer, PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage";

import dropdownMenuReducer from "./dropdown-menu/dropdown-menu.reducer";

const persistConfig: PersistConfig<object> = {
    key: "root",
    storage,
    whitelist: ["user"],
};

const rootReducer = combineReducers({
    dropdownMenu: dropdownMenuReducer,
});

export default persistReducer(persistConfig, rootReducer);
