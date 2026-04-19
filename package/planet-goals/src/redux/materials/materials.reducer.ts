import { PersistConfig, persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";
import { MaterialsActionsTypes, IMaterialsState } from "./materials.types";

const INITIAL_STATE: IMaterialsState = {
    fetchingError: null,
    isFetching: false,
    materials: null,
};

const materialsReducer = (state: IMaterialsState = INITIAL_STATE, action): IMaterialsState => {
    switch (action.type) {
        case MaterialsActionsTypes.FETCH_MATERIALS_START:
            return {
                ...state,
                fetchingError: null,
                isFetching: true,
            };
        case MaterialsActionsTypes.FETCH_MATERIALS_SUCCESS:
            return {
                ...INITIAL_STATE,
                materials: action.payload,
            };
        case MaterialsActionsTypes.FETCH_MATERIALS_FAILURE:
            return {
                ...INITIAL_STATE,
                fetchingError: action.payload
            };
        default:
            return state;
    }
}

const materialsPersistConfig: PersistConfig<object> = {
    key: "materials",
    storage: sessionStorage
};

const persistedMaterialsReducer = persistReducer(materialsPersistConfig, materialsReducer);

export default persistedMaterialsReducer;