/* eslint-disable no-unused-vars */
import React, { createContext, useReducer, Context } from 'react';

export interface Home {
    _id?: string;
    name: string;
    rooms: Room[];
}

interface Room {
    _id?: string;
    name: string;
    devices: Device[];
    type: 'Hue bulb' | 'Hue bridge' | 'WebOS TV' | 'IP Cam' | 'Ring doorbell';
}

interface User {
    _id?: string;
    username: string;
    password: string;
    last_login: number;
}

interface UserHash {
    _id?: string;
    user_id: string;
    hash: string;
}

interface History {
    _id?: string;
    action: string;
    timestamp: number;
    message?: string;
}

interface Device {
    _id?: string;
    name: string;
    type: 'hue_bridge' | 'hue_bulb' | 'webos_tv' | 'win_pc' | 'mac_pc' | 'ip_cam' | 'ring_doorbell';
    ip_address: string;
    mac_address: string;
}

export enum ACTIONS {
    SET_ACTIVE_HOME,
}

const readLocalStorage = (): Home | null => {
    try {
        const tmp = localStorage.getItem('activeHome');
        if (tmp) {
            return JSON.parse(tmp) as Home;
        }
    } catch {
        return null;
    }
    return null;
};

const initialData: HomeContextTypes = {
    activeHome: readLocalStorage(),
};

export const HomeContext: Context<HomeContextTypes> = createContext(initialData);

HomeContext.displayName = 'Home Context';

interface HomeContextTypes {
    dispatch?: React.Dispatch<DispatchAction>;
    activeHome: null | Home;
}

interface ContextProps {
    children?: JSX.Element | JSX.Element[];
}

export interface DispatchAction {
    type: ACTIONS;
    value: unknown;
}

const HomeContextProvider = ({ children }: ContextProps): JSX.Element => {
    const [state, dispatch] = useReducer((state: HomeContextTypes, action: DispatchAction): HomeContextTypes => {
        switch (action.type) {
            case ACTIONS.SET_ACTIVE_HOME:
                localStorage.setItem('activeHome', JSON.stringify(action.value));
                return { ...state, activeHome: action.value as Home };
            default:
                return state;
        }
    }, initialData);

    return <HomeContext.Provider value={{ ...state, dispatch }}>{children}</HomeContext.Provider>;
};

export default HomeContextProvider;
