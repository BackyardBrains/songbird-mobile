import { changeConnectionStatus, disconnectedBLE, 
    addConnectedBLE, addBLE, changeParameterObject, 
    updateLastResponse, updateCounter, resetBleList } from '.';

const serviceUUID = "d858069e-e72c-4314-b38c-b05f7515a3f6";
const requestUUID = "54fd8ba8-fd8f-4862-97c0-71948babd2d3";
const responseUUID = "ada3eca6-fd1b-4995-8928-3f8e4688769c";

// sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // use async await
  

// thunks

export const startScan = () => {
    return (dispatch, getState, { DeviceManager } ) => {
        const counter = getState().BLEs.counter;
        dispatch(updateCounter(-1 * counter)); // resets counter to 0;
        console.log("running startScan()");
        
        const subscription = DeviceManager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                dispatch(scan());
                subscription.remove();
            }
        }, true);
    };
}

export const scan = () => {
    return (dispatch, getState, { DeviceManager } ) => {
        console.log("running scan()");

        DeviceManager.startDeviceScan(null, null, (error, device) => {
            dispatch(updateCounter(1)); // increments counter
            if (error) {
                console.log(error);
            }
            if(device !== null && device.name !== null){
                dispatch(addBLE(device));
                console.log("found named device"); 
            }
            const counter = getState().BLEs.counter;
            console.log("counter val: ", counter);
            if (counter >= 20    // stops scan after 20 iterations
                || getState().BLEs.connectionStatus !== "Disconnected") {
                DeviceManager.stopDeviceScan();
            }
        });
    }
}

export const connectDevice = ( item ) => {
    return async (dispatch, getState, { DeviceManager } ) => {
        
        const device = item.item;
        if (getState().BLEs.connectedDevice.id === device.id) return;
        dispatch(changeConnectionStatus("Connecting"));

        let connectedDevice = await device.connect( { autoConnect: true, refreshGatt: true } );
        connectedDevice = await connectedDevice.discoverAllServicesAndCharacteristics();
        dispatch(changeConnectionStatus("Connected"));
        dispatch(addConnectedBLE(connectedDevice));
        dispatch(readAllPars());
    
    }
}

export const readAllPars = () => {
    return async (dispatch, getState, { DeviceManager } ) => {
        await dispatch(readPar("BatteryLevel"));
        await dispatch(readPar("StorageCapacity"));
        await dispatch(readPar("IsRecording"));
        await dispatch(readPar("DeviceClock"));
        await dispatch(readPar("RecordingDuration"));
        await dispatch(readPar("SamplingRate"));
        await dispatch(readPar("GpsCoordinates"));
    }
}

export const readPar = ( parameterName ) => {
    return async (dispatch, getState, { DeviceManager } ) => {
        if (getState().BLEs.connectionStatus === "Talking") return;
        await dispatch(sendRequest("read", parameterName));
        // may need to add time buffer here
        await dispatch(getResponse());
        let response = getState.BLEs.lastResponse; // example: 'GPS:x:y\r'
        if (response === 'ERR') return;
        //  clean up response
        response = response.replace('\r',''); // -> 'GPS:x:y'
        response = response.slice(response.indexOf(':')+1); // -> 'x:y'
        //  update parameter with response
        dispatch(changeParameterObject(parameterName, response));
    }
}

export const writePar = ( parameterName, parameterValue ) => {
    return async (dispatch, getState, { DeviceManager } ) => {
        if (getState.BLEs.connectionStatus === "Talking") return;
        await dispatch(sendRequest("write", parameterName, parameterValue));
        // may need to add time buffer here
        await dispatch(getResponse());
        let response = getState.BLEs.lastResponse;
        if (response === 'ERR') console.log("error writing to device");
        if (response === 'OK') {
            dispatch(changeParameterObject(parameterName, parameterValue));
        };
    }
}

import initialParameterObject from '../components/DeviceData';
export const disconnectDevice = () => {
    return async (dispatch, getState, { DeviceManager } ) => {
        let deviceID = getState().BLEs.connectedDevice.id;
        if (deviceID == null) return;

        await DeviceManager.cancelDeviceConnection(deviceID);  
        dispatch(changeConnectionStatus("Disconnected"));
        dispatch(disconnectedBLE());
        dispatch(initParameterObjectAction(initialParameterObject));  
    }
}

export const sendRequest = (readWrite, parameterName, parameterValue ) => {
    return async (dispatch, getState, { DeviceManager } ) => {
        const deviceID = getState().BLEs.connectedDevice.id;
        let message;
        dispatch(changeConnectionStatus("Talking"));
        // choose message
        switch(readWrite){
            case "read":
                switch(parameterName){
                    case "BatteryLevel":
                        message = "BAT?\r"
                    case "StorageCapacity":
                        message = "CS?\r"
                    case "IsRecording": 
                        message = "SR?\r" // this is unknown currently
                    case "DeviceClock": 
                        message = "RTC?\r"
                    case "RecordingDuration": 
                        message = "RD?\r"
                    case "SamplingRate": 
                        message = "RS?\r"
                    case "GpsCoordinates":
                        message = "GPS?\r"
                    default: 
                        message = "\r"
                }
            case "write":
                switch(parameterName){
                    case "IsRecording": 
                        message = "SR:" + parameterValue + "\r" // this is unknown currently
                    case "DeviceClock": 
                        message = "RTC:" + parameterValue + "\r"
                    case "RecordingDuration": 
                        message = "WD:" + parameterValue + "\r"
                    case "SamplingRate": 
                        message = "WS:" + parameterValue + "\r"
                    case "GpsCoordinates":
                        message = "GPS:" + parameterValue + "\r"
                    default: 
                        message = "\r"
                }
            default: 
                message = "\r"
        }
        
        await DeviceManager.writeCharacteristicWithResponseForDevice(
                            deviceID, serviceUUID, requestUUID, message  );
    }
}

export const getResponse = () => {
    return async (dispatch, getState, { DeviceManager } ) => {
        const deviceID = getState().BLEs.connectedDevice.id;
        let characteristic = await DeviceManager.readCharacteristicForDevice(
                                                deviceID, serviceUUID, responseUUID  );
        dispatch(updateLastResponse(characteristic.value));
        dispatch(changeConnectionStatus("Connected"));
    }
}

