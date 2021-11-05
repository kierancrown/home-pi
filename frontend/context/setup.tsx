/* eslint-disable no-unused-vars */
import React, { createContext, useReducer, Context } from 'react';

export enum ACTIONS {
    OPEN_SETUP_MODAL,
}

const initialData: SetupContextTypes = {
    setupModalOpen: false,
};

export const SetupContext: Context<SetupContextTypes> = createContext(initialData);

SetupContext.displayName = 'Setup Context';

interface SetupContextTypes {
    dispatch?: React.Dispatch<DispatchAction>;
    setupModalOpen: boolean;
}

interface ContextProps {
    children?: JSX.Element | JSX.Element[];
}

export interface DispatchAction {
    type: ACTIONS;
    value: unknown;
}

const SetupContextProvider = ({ children }: ContextProps): JSX.Element => {
    const [state, dispatch] = useReducer((state: SetupContextTypes, action: DispatchAction): SetupContextTypes => {
        switch (action.type) {
            case ACTIONS.OPEN_SETUP_MODAL:
                return { ...state, setupModalOpen: action.value as boolean };
            default:
                return state;
        }
    }, initialData);

    return <SetupContext.Provider value={{ ...state, dispatch }}>{children}</SetupContext.Provider>;
};

export default SetupContextProvider;
