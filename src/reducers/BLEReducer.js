
export const INITIAL_STATE = {
	status: 'disconnected',
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
	 	default: return state;
	}
};

export default BLEreducer;