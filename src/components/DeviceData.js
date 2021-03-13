<<<<<<< HEAD
// list of pairable devices
// this array will eventually be populated automatically by the BLE manager
const devices = [
    { device: 'songbird device 1',  battery: 50, key: 'a' },
    { device: 'songbird device 2',  battery: 49, key: 'b' },
    { device: 'songbird device 3',  battery: 48, key: 'c' },
    { device: 'songbird device 4',  battery: 47, key: 'd' },
    { device: 'songbird device 5',  battery: 46, key: 'e' },
];
export default devices;


=======
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



>>>>>>> acd6a634e7d491efcc01501d36f7b74c14c80fb2
