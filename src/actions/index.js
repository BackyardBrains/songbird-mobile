//these action functions will return an action const object when called. call it with parameters
// to return an action oject with the appropriate payload
// example: store.dispatch( updateBattery(45) );

import { BleManager } from "react-native-ble-plx";

export const changeStatus = (newStatus) => ({
    type: "changeStatus",
    payload: newStatus,
});

export const addBLE = (device) => ({
    type: "addBLE",
    device,
});

// thunks

export const startScan = () => {
    return (dispatch, getState, { DeviceManager } ) => {
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
           
            if (error) {
                console.log(error);
            }
            if(device !== null){
                dispatch(addBLE(device));
                console.log("found device");
            }
        });
    }
}