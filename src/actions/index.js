
// helper functions

const ParameterObjectToString = ( parameterObject ) => {
    let parString = "";

    parString += parameterObject.BatteryLevel + " ";
    parString += parameterObject.StorageCapacity + " ";
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

    return parString
}

const ParameterStringToObject = ( parameterString ) => {
    let parArray = parameterString.split(" ");
    let parameterObject = {};

    parameterObject.BatteryLevel = parArray[0];
    parameterObject.StorageCapacity = parArray[1];
    parameterObject.RecordingDuration = parArray[2];
    parameterObject.SamplingRate = parArray[3]; 
    parameterObject.Sensitivity = parArray[4]; 
    parameterObject.IsTriggerSchedule = parArray[5]; 
    parameterObject.ScheduleStart = parArray[6]; 
    parameterObject.ScheduleEnd = parArray[7]; 
    parameterObject.LightIntensity = parArray[8]; 
    parameterObject.SoundLevel = parArray[9];
    parameterObject.GpsLatitude = parArray[10];
    parameterObject.GpsLongitude = parArray[11];

    return parameterObject;
}

// actions

export const changeStatus = (newStatus) => ({
    type: "changeStatus",
    payload: newStatus,
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

export const addCharacteristic = (characteristic) => ({
    type: "addCharacteristic",
    payload: characteristic,
})

export const changeParameterObject = (parameter, value) => ({
    type: "changeParameterObject",
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
        
        if (appState.BLEs.status === "Discovering" 
        || appState.BLEs.status === "Discovered") {
            return;
        }
        console.log("status: ", appState.BLEs.status);

        const counter = appState.BLEs.counter;
        dispatch(updateCounter(-1 * counter)); // resets counter to 0;

        DeviceManager.state().then( (State) => console.log("manager state:", State));

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
        
        DeviceManager.startDeviceScan(null, null, (error, device) => {
            // dispatch(changeStatus("Scanning"));

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
            console.log("counter val at stopDeviceScan check: ", counter);
            if (counter >= 60) { // stops scan after 60 iterations
                DeviceManager.stopDeviceScan();
            }

        });

    }
}

export const connectDevice = ( item ) => {
    return (dispatch, getState, { DeviceManager } ) => {
        dispatch(changeStatus("Discovering"));
        const device = item.item;
        const deviceID = device.id;
        console.log("device ID: ", deviceID);
        device.connect( { autoConnect: true, refreshGatt: true } )
            .then(( device ) => {
                return device.discoverAllServicesAndCharacteristics();
            })
            .then(( device ) => {
                dispatch(changeStatus("Discovered"));
                dispatch(addConnectedBLE(device));
                return device.services();
            })
            .then(( services ) => {
                let servicesArray = [];
                for (let i = 0; i < services.length; ++i){
                    servicesArray[i] = services[i].uuid;
                    console.log("Service UUID @ ", i, ": ", servicesArray[i]);
                    dispatch(updateServicesArray(servicesArray));
                }
                dispatch(getCharacteristic(servicesArray[2])); // @2 is specific to Kane's ESP
                console.log("servicesArray: ", servicesArray);
                return services;
            })    
    }
}

// function customized specifically for Kane's ESP
export const getCharacteristic = ( serviceID ) => {
    return (dispatch, getState, { DeviceManager } ) => {
        
        if (serviceID === null) return;

        let counter = getState().BLEs.counter
        console.log("counter, ", counter);
        if (counter === 10) {
            return;
        }
        
        dispatch(updateCounter(1));

        const deviceID = getState().BLEs.connectedDevice.id;
        DeviceManager.characteristicsForDevice(deviceID, serviceID)
        .then( ( characteristics ) =>{
            const characteristicID = characteristics[0].uuid;
            return DeviceManager.readCharacteristicForDevice(deviceID, serviceID, characteristicID)
        })
        .then( ( characteristic ) => {
           
            console.log("value: ", characteristic.value);
            dispatch(addCharacteristic(characteristic));
            return characteristic;
        })
    }
}

import base64 from 'react-native-base64'

export const changeParameter = ( parameter, newValue ) => {
    return (dispatch, getState, { DeviceManager } ) => {

        dispatch(changeParameterObject( parameter, newValue ));
        let parameterObject = getState().BLEs.parameters;
        let parameterString = ParameterObjectToString(parameterObject);

        let base64ParString = base64.encode(parameterString);

        // also implement the write to chracteristic here


    }
}

export const disconnectDevice = () => {
    return (dispatch, getState, { DeviceManager } ) => {
        let deviceID = getState().BLEs.connectedDevice.id;

        if (deviceID == null) return;

        DeviceManager.cancelDeviceConnection(deviceID)
            .then((device) => {
                dispatch(disconnectedBLE());
                dispatch(updateServicesArray([]));
                dispatch(addCharacteristic({}));
                return device;
            })
    }
}