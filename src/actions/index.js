
export const updateBattery = (batteryLevel) => ({
    type: 'updateBattery',
    payload: batteryLevel,
})

export const updateStorage = (storageLevel) => ({
    type: 'updateStorage',
    payload: storageLevel,
})

export const changeDevice = (newDeviceID) => ({
    type: 'changeDevice',
    payload: newDeviceID,
})

//these actions will return a const object when called. call it with parameters
// to return an oject with the appropriate payload
// example: store.dispatch( updateBattery(45) );