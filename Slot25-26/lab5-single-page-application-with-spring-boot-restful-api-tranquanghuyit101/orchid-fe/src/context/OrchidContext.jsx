import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { orchidReducer, initialState, ACTIONS } from '../reducers/orchidReducer';
import * as orchidApi from '../utils/orchidApi';

const OrchidContext = createContext(null);

export const OrchidProvider = ({ children }) => {
    const [state, dispatch] = useReducer(orchidReducer, initialState);

    const fetchOrchids = useCallback(async () => {
        dispatch({ type: ACTIONS.FETCH_START });
        try {
            const response = await orchidApi.getAllOrchids();
            dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: response.data });
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Lỗi tải danh sách hoa lan';
            dispatch({ type: ACTIONS.FETCH_ERROR, payload: errorMsg });
        }
    }, []);

    const addOrchid = useCallback(async (orchidData) => {
        try {
            const response = await orchidApi.createOrchid(orchidData);
            dispatch({ type: ACTIONS.ADD, payload: response.data });
            return response.data;
        } catch (error) {
            throw error;
        }
    }, []);

    const editOrchid = useCallback(async (id, orchidData) => {
        try {
            const response = await orchidApi.updateOrchid(id, orchidData);
            dispatch({ type: ACTIONS.UPDATE, payload: response.data });
            return response.data;
        } catch (error) {
            throw error;
        }
    }, []);

    const removeOrchid = useCallback(async (id) => {
        try {
            await orchidApi.deleteOrchid(id);
            dispatch({ type: ACTIONS.DELETE, payload: id });
        } catch (error) {
            throw error;
        }
    }, []);

    return (
        <OrchidContext.Provider value={{
            ...state,
            fetchOrchids,
            addOrchid,
            editOrchid,
            removeOrchid
        }}>
            {children}
        </OrchidContext.Provider>
    );
};

export const useOrchid = () => {
    const context = useContext(OrchidContext);
    if (!context) {
        throw new Error('useOrchid must be used within an OrchidProvider');
    }
    return context;
};
