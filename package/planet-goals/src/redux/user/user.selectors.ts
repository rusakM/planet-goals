import { createSelector } from "reselect";
import { IUserState } from "./user.types";

const selectUser = (state): IUserState => state.user;

export const selectCurrentUser = createSelector(
    [selectUser],
    (user) => user.currentUser
);

export const selectIsLoadingData = createSelector(
    [selectUser],
    (user) => user.isFetching
);

export const selectUserError = createSelector(
    [selectUser],
    (user) => user.userError
);

export const selectLoginEmail = createSelector(
    [selectUser],
    (user) => user.signInEmail
);
