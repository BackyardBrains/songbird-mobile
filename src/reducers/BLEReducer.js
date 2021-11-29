
import initialParameterObject from '../components/DeviceData';

export const INITIAL_STATE = {
	BLEList: [],
	connectionStatus: 'Disconnected',
	connectedDevice: {},
	counter: 0,
	parameters: initialParameterObject,
	location: {},
	lastResponse: '',
	interruptStatus: 'null',
	cardFiles: [],
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
		case 'changeConnectionStatus':
			console.log("channel status: ", action.payload);
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
		case  'setParameterObject':
			return {
				...state, 
				parameters: action.payload,
			}
		case 'changeParameterObject':
			let newParameters = {...state.parameters};
			newParameters[action.par] = action.val;
			if (action.par === "DeviceClock") {
				console.log("!!!CLOCKVAL: ", action.val);
			}
			return {
				...state,
				parameters: newParameters,
			}
		case 'changeNewParameterObject':
			let newNewParameters = {...state.newParameters};
			newNewParameters[action.par] = action.val;
			return {
				...state,
				newParameters: newNewParameters,
			}
		case 'updateLastResponse':
			return {
				...state,
				lastResponse: action.payload
			}
		case 'disconnectedBLE':
			return {
				...state,
				status: 'Disconnected',
				connectedDevice: {},
			}
		case 'toggleInterruptStatus':
			return {
				...state,
				interruptStatus: action.payload,
			}
		case 'initLocation':
			console.log("reducer:\n", action.payload);
			return {
				...state,
				location: action.payload,
			}
		case 'updateCardFiles':
			let newCardFiles = {...state.cardFiles};
			newCardFiles[action.cardNum - 1] = action.fileData;
			return {
				...state,
				cardFiles: newCardFiles
			}
	 	default: return state;
	}
};

export default BLEreducer;