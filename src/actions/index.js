const serviceUUID = "d858069e-e72c-4314-b38c-b05f7515a3f6";
const writeCharUUID = "4423d64a-5bfb-4838-aaa3-784909691293"

// helper functions

const ParameterObjectToString1 = ( parameterObject ) => {
    let parString = "";

    parString += parameterObject.RecordingDuration + " ";
    parString += parameterObject.SamplingRate + " ";
    parString += parameterObject.Sensitivity + " ";
    parString += parameterObject.IsTriggerSchedule + " ";
    parString += parameterObject.ScheduleStart + " ";
    parString += parameterObject.ScheduleEnd + " ";
    parString += parameterObject.LightIntensity + " ";
    parString += parameterObject.SoundLevel + " ";
    parString += parameterObject.GpsLatitude + " ";
    parString += parameterObject.GpsLongitude + " ";
    parString += parameterObject.IsSettingClock + " ";
    parString += parameterObject.newClockVal + " ";

    return parString
}

const ParameterStringsToObject = ( parameterString0, parameterString1 ) => {
    let par0Array = parameterString0.split(" ");
    let par1Array = parameterString1.split(" ");
    let parameterObject = {};

    parameterObject.BatteryLevel = par0Array[0];
    parameterObject.StorageCapacity = par0Array[1];
    parameterObject.DeviceClock = par0Array[2];

    parameterObject.RecordingDuration = par1Array[0];
    parameterObject.SamplingRate = par1Array[1]; 
    parameterObject.Sensitivity = par1Array[2]; 
    parameterObject.IsTriggerSchedule = par1Array[3]; 
    parameterObject.ScheduleStart = par1Array[4]; 
    parameterObject.ScheduleEnd = par1Array[5]; 
    parameterObject.LightIntensity = par1Array[6]; 
    parameterObject.SoundLevel = par1Array[7];
    parameterObject.GpsLatitude = par1Array[8];
    parameterObject.GpsLongitude = par1Array[9];
    parameterObject.IsSettingClock = par1Array[10];
    parameterObject.newClockVal = par1Array[11];

    return parameterObject;
}



// actions

export const changeStatus = (newStatus) => ({
    type: "changeStatus",
    payload: newStatus,
});

export const changeConnectionStatus = (newConnectionStatus) => ({
    type: "changeConnectionStatus",
    payload: newConnectionStatus,
});

export const addBLE = (device) => ({
    type: "addBLE",
    payload: device,
});

export const resetBleList = () => ({
    type: "resetBleList",
});

export const updateCounter = (increment) => ({
    type: "updateCounter",
    payload: increment,
})

export const addConnectedBLE = (device) => ({
    type: "addConnectedBLE",
    payload: device,
})

export const updateServicesArray = (servicesArray) => ({
    type: "updateServicesArray",
    payload: servicesArray,
})

export const updateCharacteristicsArray = ( characteristicsArray ) => ({
    type: "updateCharacteristicsArray",
    payload: characteristicsArray,
})

export const initParameterObjectAction = (parameterObject) => ({
    type: "initParameterObjectAction",
    payload: parameterObject,
})

export const changeParameterObject = (parameter, value) => ({
    type: "changeParameterObject",
    par: parameter,
    val: value,
})

export const changeNewParameterObject = (parameter, value) => ({
    type: "changeNewParameterObject",
    par: parameter,
    val: value,
})

export const disconnectedBLE = () => ({
    type: "disconnectedBLE",
})

// thunks

export const startScan = () => {
    return (dispatch, getState, { DeviceManager } ) => {
        const appState = getState();
        const counter = appState.BLEs.counter;

        
        console.log("running startScan");
        if (appState.BLEs.status === "Discovering" 
        || appState.BLEs.status === "Discovered") {
        //|| appState.BLEs.status === "Scanning") {
            console.log("returning");
            return;
        }
        console.log("status: ", appState.BLEs.status);

        dispatch(updateCounter(-1 * counter)); // resets counter to 0;

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
        console.log("scan() running");
        DeviceManager.startDeviceScan(null, null, (error, device) => {

            dispatch(updateCounter(1)); // increments counter

            if (error) {
                console.log(error);
            }
            if(device !== null && device.name !== null){
                dispatch(addBLE(device));
                console.log("found named device"); 
            }

            const appState = getState();
            const counter = appState.BLEs.counter;
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
        if (getState().BLEs.connectionStatus !== "Disconnected") return;
        dispatch(changeConnectionStatus("Connecting"));
        const device = item.item;
        
        device.connect( { autoConnect: true, refreshGatt: true } )
        .then(( device ) => {
            return device.discoverAllServicesAndCharacteristics();
        })
        .then(( device ) => {
            dispatch(changeStatus("Discovered"));
            dispatch(addConnectedBLE( device ));
            dispatch(refreshDevice());
        })
            
    }
}

export const refreshDevice = () => {
    return (dispatch, getState, { DeviceManager } ) => {

        let charsArray = [];
        let deviceID = getState().BLEs.connectedDevice.id;

        DeviceManager.characteristicsForDevice(
            deviceID,   
            serviceUUID 
        )
        .then(( characteristics ) => {
            dispatch(updateCharacteristicsArray( characteristics ));
            return characteristics[0].read();
        })
        .then(( characteristics0 ) => {
            charsArray[0] = characteristics0;
            let characteristics = getState().BLEs.characteristics;
            return characteristics[1].read();
        })
        .then(( characteristics1 ) => {
            charsArray[1] = characteristics1;
            dispatch(updateCharacteristicsArray( charsArray ));
            dispatch(initParameterObject());
        })
    }
}

export const initParameterObject = () => {
return (dispatch, getState, { DeviceManager } ) => {
    let char0Encoded = getState().BLEs.characteristics[0].value;
    let char1Encoded = getState().BLEs.characteristics[1].value;
    
    let char0Decoded = base64.decode(char0Encoded);
    let char1Decoded = base64.decode(char1Encoded);
    
    console.log("char0: ", char0Decoded);
    console.log("char1: ", char1Decoded);

    let parameterObject = {};
    
    if (char0Decoded.length > char1Decoded.length) {
        parameterObject = ParameterStringsToObject(char1Decoded, char0Decoded);
    }
    else {
        parameterObject = ParameterStringsToObject(char0Decoded, char1Decoded);
    }
    
    dispatch(initParameterObjectAction(parameterObject));
}
}


export const changeParameter = ( parameter, newValue ) => {
    return (dispatch, getState, { DeviceManager } ) => {

        if (parameter === "NewClockVal") {
            dispatch(changeNewParameterObject( "IsSettingClock", "true" ));
        }
        dispatch(changeParameterObject(parameter, "..."));
        dispatch(changeNewParameterObject( parameter, newValue ));
        let newParameterObject = getState().BLEs.newParameters;
        
        
        let parameterString1 = ParameterObjectToString1(newParameterObject);

        let base64ParString = base64.encode(parameterString1);

        let deviceID = getState().BLEs.connectedDevice.id;
        DeviceManager.writeCharacteristicWithResponseForDevice(
            deviceID,           // deviceID
            serviceUUID,        // service UUID           
            writeCharUUID,      // characteristic UUID
            base64ParString     // par value string
        )
        .then(() => {
            setTimeout( () => {
                dispatch(refreshDevice());},
                200
            );
        })
    }
}

import initialParameterObject from '../components/DeviceData';

export const disconnectDevice = () => {
    return (dispatch, getState, { DeviceManager } ) => {
        let deviceID = getState().BLEs.connectedDevice.id;

        if (deviceID == null) return;

        DeviceManager.cancelDeviceConnection(deviceID)
            .then((device) => {
                dispatch(changeStatus("Disconnected"));
                dispatch(changeConnectionStatus("Disconnected"));
                dispatch(disconnectedBLE());
                dispatch(updateServicesArray([]));
                dispatch(updateCharacteristicsArray([]));
                dispatch(initParameterObjectAction(initialParameterObject));
                return device;
            })
    }
}