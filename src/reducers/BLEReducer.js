
import { setStatusBarStyle } from "expo-status-bar";

export const INITIAL_STATE = {
	BLEList: [],
	status: 'Disconnected',
	connectedDevice: {},
	deviceBattery: 20,
	deviceStorage: 20,
  };

const BLEreducer = (state = INITIAL_STATE, action = {}) => {
    switch(action.type){
		case 'updateBattery': 
	 		return {
				...state,
				deviceBattery: action.payload, 
			}
		case 'updateStorage': 
			return {
			   ...state,
			   deviceStorage: action.payload, 
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
			if(state.BLEList.some(device => device.id === action.device.id) 
			|| !action.device.isConnectable || action.device.name === null){
				return state;
			} 
			else {
				return {
					...state,
					BLEList: [...state.BLEList, action.device],
				}
			}
	 	default: return state;
	}
};

export default BLEreducer;