import { MaterialsActionsTypes } from "./materials.types";
import { IMaterial } from "../../types/material";

export const fetchMaterialsStart = () => ({
    type: MaterialsActionsTypes.FETCH_MATERIALS_START,
});

export const fetchMaterialsSuccess = (payload: IMaterial[]) => ({
    type: MaterialsActionsTypes.FETCH_MATERIALS_SUCCESS,
    payload
});

export const fetchMaterialsFailure = (error) => ({
    type: MaterialsActionsTypes.FETCH_MATERIALS_FAILURE,
    payload: error
});