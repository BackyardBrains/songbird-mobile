//these action functions will return an action const object when called. call it with parameters
// to return an action oject with the appropriate payload
// example: store.dispatch( updateBattery(45) );

import { Device } from "react-native-ble-plx";

export const changeStatus = (newStatus) => ({
    type: "changeStatus",
    payload: newStatus,
});

export const addBLE = (device) => ({
    type: "addBLE",
    payload: device,
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
                    dispatch(getCharacteristic(servicesArray[2])); // @2 is specific to Kane's ESP
                }
                console.log("servicesArray: ", servicesArray);
                return services;
            })    
    }
}

// function customized specifically for Kane's ESP
export const getCharacteristic = ( serviceID ) => {
    return (dispatch, getState, { DeviceManager } ) => {
        
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

// export const fillCharacteristics = ( servicesArray ) => {
//     return (dispatch, getState, { DeviceManager } ) => {

//         const deviceID = getState().BLEs.connectedDevice.id;
//         for (let i = 0; i < servicesArray.length; ++i){
//             const serviceID = servicesArray[i].UUID;
//             DeviceManager.characteristicsForDevice(deviceID, serviceID)
//             .then( ( characteristics ) =>{
//                 for (let j = 0; j < characteristics.length; ++j){
//                     servicesArray[i].characteristics[j] = {};
//                     servicesArray[i].characteristics[j].UUID = characteristics[j].uuid;
//                 }
                
//                 dispatch(fillValues(servicesArray, i));
//                 return characteristics;
//             })
//         } 
//     }
// }

// export const fillValues = ( servicesArray, index ) => {
//     return (dispatch, getState, { DeviceManager } ) => {
//         console.log("reached fillValues");
//         const deviceID = getState().BLEs.connectedDevice.id;
//         const serviceID = servicesArray[index].UUID;
//         const  characteristics = servicesArray[index].characteristics;
//         for (let j = 0; j < characteristics.length; ++j){
//             const characteristicID = characteristics[j].UUID;
//             console.log("reached readCharacteristic");
//             DeviceManager.readCharacteristicForDevice(deviceID, serviceID, characteristicID)
//             .then( ( characteristic ) => {
//                 servicesArray[index].characteristics[j].value = characteristic.value;
//                 console.log("value: ", characteristic.value);
//                 console.log("characteristic: ", servicesArray[i].characteristics[j]);
//                 return characteristic;
//             })
//         }   
//     }
// }

export const disconnectDevice = () => {
    return (dispatch, getState, { DeviceManager } ) => {
        let deviceID = getState().BLEs.connectedDevice.id;
        DeviceManager.cancelDeviceConnection(deviceID)
            .then((device) => {
                dispatch(disconnectedBLE());
                dispatch(updateServicesArray([]));
                dispatch(addCharacteristic({}));
                return device;
            })
    }
}