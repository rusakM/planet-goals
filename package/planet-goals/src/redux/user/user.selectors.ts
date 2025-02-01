import { createSelector } from "reselect";

const selectUser = (state) => state.user;

export const selectCurrentUser = createSelector(
    [selectUser],
    (user) => user.currentUser
);

export const selectIsLoadingData = createSelector(
    [selectUser],
    (user) => user.isFetching
);

export const selectLoginError = createSelector(
    [selectUser],
    (user) => user.error
);
