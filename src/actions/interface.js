
const serviceUUID = "d858069e-e72c-4314-b38c-b05f7515a3f6";
const requestUUID = "54fd8ba8-fd8f-4862-97c0-71948babd2d3";
const responseUUID = "ada3eca6-fd1b-4995-8928-3f8e4688769c";



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

import base64 from 'react-native-base64'

export const connectDevice = ( item ) => {
    return (dispatch, getState, { DeviceManager } ) => {
        
        const device = item.item;
        if (getState().BLEs.connectedDevice.id === device.id) return;
        dispatch(changeConnectionStatus("Connecting"));

        device.connect( { autoConnect: true, refreshGatt: true } )
        .then(( device ) => {
            dispatch(changeConnectionStatus("Connected"));
            dispatch(addConnectedBLE( device ));
            dispatch(readAllPars());
        })
    }
}

export const readAllPars = ( item ) => {
    return (dispatch, getState, { DeviceManager } ) => {
        


    }
}

export const readPar = ( parameterName ) => {
    return (dispatch, getState, { DeviceManager } ) => {
        
        switch(parameterName){
            case "BatteryLevel":
                // code 
            case "StorageCapacity" :
                
            case "IsRecording" : 

            case "DeviceClock" : 

            case "RecordingDuration" : 

            case "SamplingRate" : 
            
            case "GpsCoordinates" :
        }

    }
}
import initialParameterObject from '../components/DeviceData';

export const disconnectDevice = () => {
    return (dispatch, getState, { DeviceManager } ) => {
        let deviceID = getState().BLEs.connectedDevice.id;

        if (deviceID == null) return;

        DeviceManager.cancelDeviceConnection(deviceID)
            .then((device) => {
                dispatch(changeConnectionStatus("Disconnected"));
                dispatch(disconnectedBLE());
                dispatch(initParameterObjectAction(initialParameterObject));
                return device;
            })
    }
}