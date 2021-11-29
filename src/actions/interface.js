import base64 from 'react-native-base64'
import initialParameterObject from '../components/DeviceData';
import { changeConnectionStatus, disconnectedBLE, 
    addConnectedBLE, addBLE, changeParameterObject, 
    updateCounter, setParameterObject, updateCardFiles, 
    toggleInterruptStatus} from '.';

const serviceUUID = "ab0828b1-198e-4351-b779-901fa0e0371e";
const requestUUID = "54fd8ba8-fd8f-4862-97c0-71948babd2d3";
const responseUUID = "ada3eca6-fd1b-4995-8928-3f8e4688769c"; //char0
const errorMessage = "TIMEOUT:ERR\r"

// sleep function -- use with async, await
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// get key by value function. May or may not be used
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

function checkFormat(parameterName, text) {
    let numColons = 0;
    switch(parameterName){
		
		case 'GpsCoordinates':
            numColons = (text.match(/:/g) || []).length;
            if (numColons !== 4) return false;
            else return true;
        case 'ClockTime':
            numColons = (text.match(/:/g) || []).length;
            if (numColons !== 6) return false;
            else return true;
        default:
            return true;
    }
}

// map sampling rate code to kHz
export const mapSRCodeToVal = {
    "12000" : "12",
    "5" : "12",
    "12 kHz" : "5",
    "24000" : "24",
    "24 kHz" : "4",
    "4" : "24",
    "48000" : "48",
    "48 kHz" : "3",
    "3" : "48",
    "96000" : "96",
    "96 kHz" : "2",
    "2" : "96",
    "192000" : "192",
    "192 kHz" : "1",
    "1" : "192",
    "384000" : "384",
    "384 kHz" : "0",
    "0" : "384",
    "..." : "...",
    "... kHz" : "..."
}

export const TranslateStorageCapacity = (inParam) => {
    if (inParam === "NO CARDS") return 'No SD Cards'
    let temp1 = inParam.replace('kB','');
    temp1 = inParam.replace('NO','0');
    let temp2 = temp1.split(':');

    return ((parseInt(temp2[0],10) + parseInt(temp2[1],10)) / (1000 * 1000)).toPrecision(6) + " GB";
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
            if (counter % 5 === 0) {
                console.log("counter val: ", counter);
            }
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
        let connectedDevice = await device.connect( { autoConnect: true, refreshGatt: true, requestMTU: 50 } );
        connectedDevice = await connectedDevice.discoverAllServicesAndCharacteristics();
        dispatch(changeConnectionStatus("Connected"));
        dispatch(addConnectedBLE(connectedDevice));
        dispatch(readAllPars());
    
    }
}

export const readAllPars = () => {
    return async (dispatch, getState, { DeviceManager } ) => {
        dispatch(changeConnectionStatus("Reading"));
        await dispatch(readPar("BatteryLevel"));
        await sleep(20);
        await dispatch(readPar("StorageCapacity"));
        await sleep(20);
        await dispatch(readPar("IsRecording"));
        await sleep(20);
        await dispatch(readPar("DeviceClock"));
        await sleep(20);
        await dispatch(readPar("RecordingDuration"));
        await sleep(20);
        await dispatch(readPar("SamplingRate"));
        await sleep(20);
        await dispatch(readPar("GpsCoordinates"));
        dispatch(changeConnectionStatus("Free"));
    }
}

// TODO: use connection status keywords to differentiate between 
//  different types of readPar. If connection status == readingDynamic && par == "...", don't update
// channelStatus E { reading, refreshing, writing, free }
export const readDynamicPars = () => {
    return async (dispatch, getState, { DeviceManager } ) => {
        // return;

        // handle multi-threading ( read is sub-ordinate to write)
        if (getState().BLEs.connectionStatus !== "Free") {
            console.log("rDPs: channel is busy, abort rDP process...");
            return;
        }
        else {
            console.log("rDPs: channel is free, begin update...");
        }
        dispatch(changeConnectionStatus("Refreshing"));
        await sleep(50); 
        
        // begin reads //
        await dispatch(readPar("IsRecording"));
        await sleep(50);
        await dispatch(readPar("BatteryLevel"));
        await sleep(50);
        await dispatch(readPar("DeviceClock"));

        console.log("rDPs: completed successfully...\n");

        dispatch(changeConnectionStatus("Free"));
    }
}

const SLEEP_TIME_B = 50;
export const readPar = ( parameterName ) => {
    return async (dispatch, getState, { DeviceManager } ) => {

        await dispatch(sendRequest("read", parameterName));
        await sleep(SLEEP_TIME_B);
        const device_id = getState().BLEs.connectedDevice.id;
        let response = await getResponse(device_id, DeviceManager); 
        console.log("rP: response: ", response);

        // Handle refresh-write edge case
        if (getState().BLEs.connectionStatus === "Refreshing" 
        && getState().BLEs.parameters[parameterName] == "...") {
            console.log(
                "rP: attempting to refresh parameter ", 
                parameterName, " mid-write. Killing refresh"
            );
            return;
        }

        // ERROR HANDLER: if read error, wait 50ms and retry once
        if (response.includes(errorMessage) || !checkFormat(parameterName, response)) {
            console.log("rP: first read error detected, wait 50ms and retry");
            await sleep(SLEEP_TIME_B);
            await dispatch(sendRequest("read", parameterName));
            await sleep(SLEEP_TIME_B);
            let response = await getResponse(device_id, DeviceManager); 
            console.log("rP: response: ", response);
            if (response.includes(errorMessage) || !checkFormat(parameterName, response)) {
                console.log("rP: second read error detected, kill process");
                return;
            }
        }

        // parse response

        if (response.includes("START:OK")) {
            dispatch(changeParameterObject(parameterName, "1"));
            return;
        }
        else if (response.includes("STOP:OK")) {
            dispatch(changeParameterObject(parameterName, "0"));
            return;
        }

        response = response.replace('\r',''); // remove terminating character. new format:: 'GPS:x:y'
        response = response.slice(response.indexOf(':')+1); // get rid of header. new format:: 'x:y'
        dispatch(changeParameterObject(parameterName, response)); // update paramterer tree
    }
}

export const writePar = ( parameterName, parameterValue ) => {
    return async (dispatch, getState, { DeviceManager } ) => {
        
        // handle a quirk in the front end
        if (parameterName != 'SamplingRate') {
            dispatch(changeParameterObject(parameterName, "..."));
        }

        // handle multithreading 1/2
        await dispatch(interruptRefresh("wP"));
        if (getState().BLEs.interruptStatus === "fail") return;

        
        await dispatch(sendRequest("write", parameterName, parameterValue));
        await sleep(1000); // songbird device has high latency and needs one second to process write request
        const device_id = getState().BLEs.connectedDevice.id;
        let response = await getResponse(device_id, DeviceManager); 
        console.log("wP: response: ", response);
        

        // ERROR HANDLER: if write error, wait and retry once
        if (response.includes(errorMessage)) {
            console.log("wP: first read error detected, wait 50ms and retry");
            await sleep(SLEEP_TIME_B * 2);
            await dispatch(sendRequest("write", parameterName, parameterValue));
            let response = await getResponse(device_id, DeviceManager); 
            console.log("wP: response: ", response);
            if (response.includes(errorMessage)) {
                console.log("wP: second write error detected, kill process");
                return;
            }
        }

        // begin readPar
        // readPar will update the state tree
        console.log("wP: dispatching rP to validate write...");
        await dispatch(readPar(parameterName));


        // handle multithreading 2/2
        await dispatch(continueRefresh("wP"));
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

// TODO:
// add new commands to sendRequest
// add handler for data instream
//      

function pad_num(num, padlen, padchar) {
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
}

import RNFetchBlob from 'rn-fetch-blob';


export const readDirectory = () => {
    return async (dispatch, getState, { DeviceManager } ) => {

        //      CONSTS
        const deviceID = getState().BLEs.connectedDevice.id;
   
        // handle multithreading 1/2
        await dispatch(interruptRefresh("rD"));
        if (getState().BLEs.interruptStatus === "fail") return;

        //      request data for card 1
        await dispatch(sendRequest("read", "ReadDirectory", "1"));
        await sleep(SLEEP_TIME_B);

        //      get response for card 1
        let response1 = await getResponse(deviceID, DeviceManager); 

        //      request data for card 2
        await dispatch(sendRequest("read", "ReadDirectory", "2"));
        await sleep(SLEEP_TIME_B);

        //      get response for card 2
        let response2 = await getResponse(deviceID, DeviceManager); 

        dispatch(updateCardFiles(1, response1));
        dispatch(updateCardFiles(2, response2));

        console.log("r1:\n", response1,"\n");
        console.log("r2:\n", response2,"\n");

        // handle multithreading 2/2
        await dispatch(continueRefresh("rD"));

    }
}



export const requestFile = (NEW_FILE_PATH, fileNumberDevice, SdCard) => {
    return async (dispatch, getState, { DeviceManager } ) => {

        //      CONSTS
        const deviceID = getState().BLEs.connectedDevice.id;
  
        // handle multithreading 1/2
        await dispatch(interruptRefresh("rF"));
        if (getState().BLEs.interruptStatus === "fail") return;

        //      init directory file and stream
        await RNFetchBlob.fs.createFile(NEW_FILE_PATH, "", 'base64');
        console.log("success making file");
        let stream = await RNFetchBlob.fs.writeStream(NEW_FILE_PATH, 'base64', true);
        console.log("STREAM!\n\n", stream, "\n\n");

        //      request data
        let padded = pad_num(fileNumberDevice,6,'0');
        await dispatch(sendRequest("read", "RequestFile", padded, SdCard));


        //      load file
        let prev_input = ""; let new_input = ""; let num_duplicates = 0; let i = 0;
        while (num_duplicates < 100 && ++i < 500) {

            let char = await DeviceManager.readCharacteristicForDevice(
            deviceID, serviceUUID, responseUUID );
            new_input = char.value;

            //console.log(i, "\n");

            if (new_input != prev_input) {
                console.log(new_input);
                stream = await stream.write(new_input);
                num_duplicates = 0;
            }
            else {
                ++num_duplicates;
            }
            prev_input = new_input;
        }
        await stream.close();
        console.log("rF DONE");

        // handle multithreading 2/2
        await dispatch(continueRefresh("rF"));


        
    }
}



export const sendRequest = (readWrite, parameterName, parameterValue, misc ) => {
    return async (dispatch, getState, { DeviceManager } ) => {
        const deviceID = getState().BLEs.connectedDevice.id;
        let message;
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
                        message = "SR?";
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

                    // wireless data transfer commands
                    case "RequestFile":
                        message = "RW:" + misc + ":" + parameterValue;
                        // RW:<SD card #>:<File #>
                        break;
                    case "ReadDirectory":
                        message = "DIR:" + parameterValue;
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
        console.log('sR: message: ', message);
        await DeviceManager.writeCharacteristicWithResponseForDevice(
                            deviceID, serviceUUID, requestUUID, 
                            base64.encode(message + '\r'));
    }
}

async function getResponse(deviceID, DeviceManager) {
    let characteristic = await DeviceManager.readCharacteristicForDevice(
                                            deviceID, serviceUUID, responseUUID  );
    return base64.decode(characteristic.value);

}

export const continueRefresh = (functionName) => {
    return async (dispatch, getState, { DeviceManager } ) => {
        console.log(functionName + ": write/read finished successfully...\n");
        dispatch(changeConnectionStatus("Free"));
    }
}

export const interruptRefresh = (functionName) => {
    return async (dispatch, getState, { DeviceManager } ) => {

        console.log(functionName + ": attempting write/read...");
        for (let i = 0; i < 30; ++i) {
            if (getState().BLEs.connectionStatus !== "Free") {
                console.log(functionName + ": channel is busy for ", i, " seconds, " + functionName + ": waiting...");
                await sleep(1000);
            }
            else break;
        }
        if (getState().BLEs.connectionStatus !== "Free") {
            console.log(functionName + ": channel is busy for 30 seconds, kill " + functionName + " process...");
            dispatch(toggleInterruptStatus("fail"));
            return;
        }
        dispatch(changeConnectionStatus("Writing"));
        console.log(functionName + ": channel is free, begin write/read...");
        dispatch(toggleInterruptStatus("success"));
        return;
    }
}