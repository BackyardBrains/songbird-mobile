import initialParameterObject from '../components/DeviceData';

export const INITIAL_STATE = {
	BLEList: [],
	status: 'Disconnected',
	connectedDevice: {},
	services: [],
	characteristic: {},
	counter: 0,
	parameters: initialParameterObject,
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
		case 'updateParameter/light':
			return{
				...state,
				parameters: {...parameters, LightIntensity: action.payload},
			}
		case 'updateParameter/sound':
			return{
				...state,
				parameters: {...parameters, SoundLevel: action.payload},
			}
		case 'updateParameter/sensitivity':
			return{
				...state,
				parameters: {...parameters, Sensitivity: action.payload},
			}
		case 'updateParameter/clock':
			return{
				...state,
				parameters: {...parameters, DeviceClock: action.payload},
			}
		case 'updateParameter/duration':
			return{
				...state,
				parameters: {...parameters, RecordingDuration: action.payload},
			}
		case 'updateParameter/sample_rate':
			return{
				...state,
				parameters: {...parameters, SamplingRate: action.payload},
			}
		case 'updateParameter/schedule':
			return{
				...state,
				parameters: {...parameters, ScheduleStart: action.payload[0], ScheduleEnd: action.payload[1]},
			}
		case 'updateParameter/gps':
			return{
				...state,
				parameters: {...parameters, GpsCoordinates: action.payload},
			}
	 	default: return state;
	}
};

export default BLEreducer;