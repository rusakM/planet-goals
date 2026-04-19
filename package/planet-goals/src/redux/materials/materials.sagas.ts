import { takeLatest, put, all, call } from "redux-saga/effects";
import { createAction } from "@reduxjs/toolkit";

import { constantsUrls } from "../../helpers/constants";
import * as Api from "../../api/index";
import { MaterialsActionsTypes } from "./materials.types";
import {
    fetchMaterialsFailure,
    fetchMaterialsSuccess,

} from "./materials.actions";
import { IMaterial } from "../../types/material";

const fetchMaterialsStart = createAction(MaterialsActionsTypes.FETCH_MATERIALS_START);

function* fetchMaterials() {
    try {
        const materials: IMaterial[] = yield call(Api.getData, constantsUrls.Materials.getMaterials);
        yield put(fetchMaterialsSuccess(materials));
    } catch (error) {
        yield put(fetchMaterialsFailure(error.name));
    }
};

function* onFetchMaterialsStart(): Generator {
    yield takeLatest(fetchMaterialsStart, fetchMaterials);
}

export function* materialsSagas() {
    yield all([
        call(onFetchMaterialsStart)
    ]);
}