import { createSelector } from "reselect";
import { IStore } from "../store.types";

const selectMaterialsState = (state: IStore): IStore["materials"] => state.materials;

export const selectMaterials = createSelector(
    [selectMaterialsState],
    (materials) => materials.materials
);

export const selectIsFetchingMaterials = createSelector(
    [selectMaterialsState],
    (materials) => materials.isFetching
);

export const selectMaterialsFetchingError = createSelector(
    [selectMaterialsState],
    (materials) => materials.fetchingError
);