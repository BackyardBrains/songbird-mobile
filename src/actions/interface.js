import base64 from 'react-native-base64'
import initialParameterObject from '../components/DeviceData';
import { changeConnectionStatus, disconnectedBLE, 
    addConnectedBLE, addBLE, changeParameterObject, 
    updateLastResponse, updateCounter, setParameterObject, toggleReadStatus } from '.';

const serviceUUID = "ab0828b1-198e-4351-b779-901fa0e0371e";
const requestUUID = "54fd8ba8-fd8f-4862-97c0-71948babd2d3";
const responseUUID = "ada3eca6-fd1b-4995-8928-3f8e4688769c"; //char0
const errorMessage = "TIMEOUT:ERR"

// sleep function -- use with async, await
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// get key by value function. May or may not be used
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

// map sampling rate code to kHz
export const mapSRCodeToVal = {
    "12000" : "12",
    "5" : "12",
    "24000" : "24",
    "4" : "24",
    "48000" : "48",
    "3" : "48",
    "96000" : "96",
    "2" : "96",
    "192000" : "192",
    "1" : "192",
    "384000" : "384",
    "0" : "384",
    "..." : "..."
}

// thunks

export const startScan = () => {
    return (dispatch, getState, { DeviceManager } ) => {
        dispatch(updateCounter(-1 * getState().BLEs.counter)); // resets counter to 0;
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
        if (getState().BLEs.connectionStatus !== "Disconnected") return;
        dispatch(changeConnectionStatus("Connecting"));
        let connectedDevice = await device.connect( { autoConnect: true, refreshGatt: true } );
        connectedDevice = await connectedDevice.discoverAllServicesAndCharacteristics();
        console.log("CP1");
        dispatch(changeConnectionStatus("Connected"));
        dispatch(addConnectedBLE(connectedDevice));
        dispatch(readAllPars());
    
    }
}

export const readAllPars = () => {
    return async (dispatch, getState, { DeviceManager } ) => {
        let deviceID = getState().BLEs.connectedDevice.id;
        await dispatch(subscribeToDevice(deviceID));
        await dispatch(readPar("BatteryLevel"));
        // await sleep(6);
        // await dispatch(readPar("StorageCapacity"));
        // await sleep(6);
        // await dispatch(readPar("IsRecording"));
        await sleep(6);
        await dispatch(readPar("DeviceClock"));
        await sleep(6);
        await dispatch(readPar("RecordingDuration"));
        await sleep(6);
        await dispatch(readPar("SamplingRate"));
        // await sleep(6);
        // await dispatch(readPar("GpsCoordinates"));
        await sleep(1000);
        dispatch(toggleReadStatus("finish")); // tells homescreen that pars are read
        await sleep(3);
        dispatch(toggleReadStatus("null"));
    }
}

export const readPar = ( parameterName ) => {
    return async (dispatch, getState, { DeviceManager } ) => {

        if (getState().BLEs.connectionStatus === "Talking") return;
        await dispatch(sendRequest("read", parameterName));
        await sleep(3000);
        dispatch(changeConnectionStatus("Connected"));
        let response = getState().BLEs.lastResponse; // example: 'GPS:x:y\r'
        if (response === 'ERR') console.log("error reading ",  parameterName);
        else { //  clean up response
            response = response.replace('\r',''); // -> 'GPS:x:y'
            response = response.slice(response.indexOf(':')+1); // -> 'x:y'
            dispatch(changeParameterObject(parameterName, response));
        }
    }
}

export const writePar = ( parameterName, parameterValue ) => {
    return async (dispatch, getState, { DeviceManager } ) => {
        if (getState().BLEs.connectionStatus === "Talking") return;
        dispatch(changeParameterObject(parameterName, "..."));
        await dispatch(sendRequest("write", parameterName, parameterValue));
        await sleep(3000);
        dispatch(changeConnectionStatus("Connected"));
        let response = getState().BLEs.lastResponse;
        if (response === errorMessage) console.log("error writing to device");
        else {
            dispatch(changeParameterObject(parameterName, parameterValue));
        }
    }
}

export const disconnectDevice = () => {
    return async (dispatch, getState, { DeviceManager } ) => {
        let deviceID = getState().BLEs.connectedDevice.id;
        if (deviceID == null) return;
        await DeviceManager.cancelDeviceConnection(deviceID);  
        dispatch(changeConnectionStatus("Disconnected"));
        dispatch(disconnectedBLE());
        dispatch(setParameterObject(initialParameterObject));  
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
                        message = "BAT?";
                        break;
                    case "StorageCapacity":
                        message = "CS?";
                        break;
                    case "IsRecording": 
                        message = "SR?"; // this is unknown currently
                        break;
                    case "DeviceClock": 
                        message = "RTC?";
                        break;
                    case "RecordingDuration": 
                        message = "RD?";
                        break;
                    case "SamplingRate": 
                        message = "RS?";
                        break;
                    case "GpsCoordinates":
                        message = "GPS?";
                        break;
                }
                break;
            case "write":
                switch(parameterName){
                    case "IsRecording": 
                        message = parameterValue;
                        break;
                    case "DeviceClock": 
                        message = "RTC:" + parameterValue;
                        break;
                    case "RecordingDuration": 
                        message = "WD:" + parameterValue;
                        break;
                    case "SamplingRate": 
                        message = "WS:" + parameterValue;
                        break;
                    case "GpsCoordinates":
                        message = "GPS:" + parameterValue;
                        break; 
                }
        }
        console.log('message', message);
        await DeviceManager.writeCharacteristicWithoutResponseForDevice(
                            deviceID, serviceUUID, requestUUID, base64.encode(message + '\r'));
    }
}

export const handleResponse = (response) => {
    return async (dispatch, getState, { DeviceManager } ) => {

        
        dispatch(changeConnectionStatus("Connected"));
    }
}


export const subscribeToDevice = (deviceID) => {
    return async (dispatch, getState, { DeviceManager } ) => {
        DeviceManager.monitorCharacteristicForDevice(
            deviceID,
            serviceUUID,
            responseUUID,
            (error, characteristic) => {
                console.log("in monitor");
                if (error) {
                    console.error("Recieving Error", error);
                } 
                else {
                    console.log("value", characteristic.value);
                    const response = base64.decode(characteristic.value);
                    console.log("response:", response);
                    dispatch(updateLastResponse(response));
                }
            }
        )
    }
}

