// list of pairable devices
// this array will eventually be populated automatically by the BLE manager
export default initialParameterObject = {
    "BatteryLevel" : 0,
    "StorageCapacity" : 0,
    "DeviceClock" : "12:00:00",
    "RecordingDuration" : 0, // hours
    "SamplingRate" : 0, // kHz
    "Sensitivity" : "High",
    "IsTriggerSchedule" : true, // needs a helper function for display
    "ScheduleStart" : "0:00 PM",
    "ScheduleEnd" : "0:00 PM",
    "LightIntensity" : "High",
    "SoundLevel" : "High",
    "GpsCoordinates" : "00.000.000.000",
}



