


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

export const initNewParameterObjectAction = (parameterObject) => ({
    type: "initNewParameterObjectAction",
    payload: parameterObject,
})

export const changeNewParameterObject = (parameter, value) => ({
    type: "changeNewParameterObject",
    par: parameter,
    val: value,
})

export const initLocation = (locationObj) => ({
    type: "initLocation",
    payload: locationObj,
})

export const disconnectedBLE = () => ({
    type: "disconnectedBLE",
})

