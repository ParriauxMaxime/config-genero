/**
 * Created by maxime on 12/04/17.
 */

export const changeHeader = (id, value) => {
    return {
        type: 'CHANGE_HEADER',
        id,
        value
    };
};
