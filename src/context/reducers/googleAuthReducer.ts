import { CombinedActions } from '../AppContext';
import { ActionMap, Types } from '../AppTypes';

export interface IGoogleAuth {
    authClient: any;
    isSignedIn: boolean;
}

type GoogleAuthPayload = {
    [Types.SET_GOOGLE_AUTH]: {
        authClient: any;
        isSignedIn: boolean;
    };
    [Types.UPDATE_GOOGLE_IS_SIGNED_IN]: {
        isSignedIn: boolean;
    };
    [Types.GOOGLE_SIGN_IN]: undefined;
    [Types.GOOGLE_SIGN_OUT]: undefined;
};

export type GoogleAuthActions = ActionMap<GoogleAuthPayload>[keyof ActionMap<GoogleAuthPayload>];

export const googleAuthReducer = (state: IGoogleAuth, action: CombinedActions) => {
    switch (action.type) {
        case Types.SET_GOOGLE_AUTH:
            return {
                authClient: action.payload.authClient,
                isSignedIn: action.payload.isSignedIn,
            };
        case Types.UPDATE_GOOGLE_IS_SIGNED_IN:
            return {
                ...state,
                isSignedIn: action.payload.isSignedIn,
            };
        case Types.GOOGLE_SIGN_IN:
            return {
                ...state,
                isSignedIn: true,
            };
        case Types.GOOGLE_SIGN_OUT:
            return {
                ...state,
                isSignedIn: false,
            };
        default:
            return state;
    }
};
