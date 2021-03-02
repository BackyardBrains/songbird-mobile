
import { setStatusBarStyle } from "expo-status-bar";

export const INITIAL_STATE = {
	BLEList: [],
	status: 'Disconnected',
	connectedDevice: {},
	deviceBattery: 20,
	deviceStorage: 20,
	counter: 0,
  };

const BLEreducer = (state = INITIAL_STATE, action = {}) => {
    switch(action.type){
		
		case 'updateCounter':
			console.log("running updateCounter, counter: ", state.counter);
			return {
				...state,
				counter: state.counter + action.payload,
			}
		case 'changeDevice':
			 return {
				 ...state,
				 connectedDevice: {deviceID: action.payload},
			 }
		case 'changeStatus':
			return {
				...state,
				status: action.payload,
			}
		case 'addBLE':

			console.log("running addBLE");
			// checks if same name, might change name to id later
			if (state.BLEList.some(device => device.name === action.payload.name)) { 
				return state;
			}

			return {
				...state,
				BLEList: [...state.BLEList, action.payload],
			}
	
	 	default: return state;
	}
};

export default BLEreducer;