export const INITIAL_STATE = {
	BLEList: [],
	status: 'Disconnected',
	connectedDevice: {},
	services: [],
	characteristic: {},
	counter: 0,
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
		case 'addCharacteristic':
			return {
				...state,
				characteristic: action.payload,
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