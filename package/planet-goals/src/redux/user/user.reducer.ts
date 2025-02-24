import { IUserState, UserActionTypes } from "./user.types";

const INITIAL_STATE: IUserState = {
    currentUser: null,
    isFetching: false,
    signInEmail: "",
    userError: "",
};

const userReducer = (state: IUserState = INITIAL_STATE, action): IUserState => {
    switch (action.type) {
        case UserActionTypes.CHECK_EMAIL_START:
        case UserActionTypes.SIGN_UP_START:
        case UserActionTypes.USER_EDIT_START:
        case UserActionTypes.VERIFY_CODE_START:
            return {
                ...state,
                isFetching: true,
            };
        case UserActionTypes.CHECK_EMAIL_SUCCESS:
        case UserActionTypes.SIGN_UP_SUCCESS:
            return {
                ...state,
                isFetching: false,
                signInEmail: action.payload,
                userError: "",
            };
        case UserActionTypes.USER_EDIT_SUCCESS:
        case UserActionTypes.VERIFY_CODE_SUCCESS:
            return {
                ...state,
                currentUser: action.payload,
                isFetching: false,
                signInEmail: "",
                userError: "",
            }
        case UserActionTypes.CHECK_EMAIL_FAILURE:
        case UserActionTypes.SIGN_UP_FAILURE:
        case UserActionTypes.USER_EDIT_FAILURE:
        case UserActionTypes.VERIFY_CODE_FAILURE:
            return {
                ...state,
                isFetching: false,
                userError: action.payload,
            };
        case UserActionTypes.USER_ERROR_CLEAR:
            return {
                ...state,
                userError: "",
                isFetching: false
            };
        default:
            return state;
    }
};

export default userReducer;
