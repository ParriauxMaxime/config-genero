/**
 * Created by maxime on 11/04/17.
 */

import { Overview as OverviewReducer } from './Overview';
import { Header as HeaderReducer } from './Header';
import { combineReducers } from 'redux';

const configurator = combineReducers({
    OverviewReducer,
    HeaderReducer
});

export default configurator;