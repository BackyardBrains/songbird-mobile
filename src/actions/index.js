//these action functions will return an action const object when called. call it with parameters
// to return an action oject with the appropriate payload
// example: store.dispatch( updateBattery(45) );

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

// thunks

export const startScan = () => {
    return (dispatch, getState, { DeviceManager } ) => {
        const appState = getState();

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