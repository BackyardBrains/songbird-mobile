import { combineReducers } from 'redux';
import BLEReducer from './BLEReducer';


export default combineReducers({
    BLEs: BLEReducer, // this adds an extra sub-object to state called BLEs
  });                 // which then contains the initial state. this can be reconfigured trivially later on
