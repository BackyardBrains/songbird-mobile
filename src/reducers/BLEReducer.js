
import initialParameterObject from '../components/DeviceData';

export const INITIAL_STATE = {
	BLEList: [],
	status: 'None',
	connectionStatus: 'Disconnected',
	connectedDevice: {},
	services: [],
	characteristics: [],
	counter: 0,
	parameters: initialParameterObject,
	newParameters: initialParameterObject
  };

const BLEreducer = (state = INITIAL_STATE, action = {}) => {
    switch(action.type){
		
		case 'updateCounter':
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
		case 'changeConnectionStatus':
			return {
				...state,
				connectionStatus: action.payload,
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
		case 'resetBleList':
			return {
				...state,
				BLEList: [],
			}
		case 'addConnectedBLE':

			console.log("running addConnectedBLE");
			return {
				...state,
				connectedDevice: action.payload,
			}
		case 'updateServicesArray':
			return {
				...state,
				services: action.payload,
			}
		case 'updateCharacteristicsArray':
			return {
				...state,
				characteristics: action.payload,
			}
		case  'initParameterObjectAction':
			return {
				...state, 
				parameters: action.payload,
			}
		case 'changeParameterObject':
			let newParameters = {...state.parameters};
			newParameters[action.par] = action.val;
			return {
				...state,
				parameters: newParameters,
			}
		case 'changeNewParameterObject':
			let newNewParameters = {...state.parameters};
			newNewParameters[action.par] = action.val;
			return {
				...state,
				newParameters: newNewParameters,
			}
		case 'disconnectedBLE':
			return {
				...state,
				status: 'Disconnected',
				connectedDevice: {},
			}
	 	default: return state;
	}
};

export default BLEreducer;