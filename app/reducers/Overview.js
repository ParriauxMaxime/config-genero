import {Overview as model} from "../models/Overview";

export const Overview = (state = model, action) => {
    switch (action.type) {
        case 'CHANGE_OVERVIEW':
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    value: action.value
                }
            };
        default:
            return state;
    }
};
