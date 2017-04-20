/**
 * Created by maxime on 11/04/17.
**/

export const changeOverview = (id, value) => {
    return {
        type: 'CHANGE_OVERVIEW',
        id,
        value
    };
};
