


// actions

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

export const changeParameterObject = (parameter, value) => ({
    type: "changeParameterObject",
    par: parameter,
    val: value,
})

export const setParameterObject = (parameterObject) => ({
    type: "setParameterObject",
    payload: parameterObject,
})

export const updateLastResponse = (response) => ({
    type: "updateLastResponse",
    payload: response
})

export const initLocation = (locationObj) => ({
    type: "initLocation",
    payload: locationObj,
})

export const disconnectedBLE = () => ({
    type: "disconnectedBLE",
})

