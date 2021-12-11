# songbird-mobile
Repo for BYB SongBird Mobile App

## Description
This app is developed using React Native and uses Redux to manage application states. Native Base is used for UI implementation. This app uses bluetooth low energy (BLE) to scan and connect with a Songbird device. Basic functionalities including display battery status, storage capacity, start/stop recording, set recording duration, set recording sensitivity etc are supported to control the board. Additionally, this app supports wireless data transfer through BLE based on React-Native-Fetch-Blob.

## Next Steps
* Package apk for wireless transfer branch
* Run app on iOS and push to Testflight
* Add a submit button to “set sampling rate” screen
* Add ability to input recording duration in terms of hours
* Increase maximum recording duration
* Connect results of DIR command to file contents in SaveFileScreen

## Setting up environment
https://reactnative.dev/docs/environment-setup  
NOTE: Follow the guide for "React-Native CLI Quickstart" instead of "Expo CLI Quickstart"

## Running app
https://reactnative.dev/docs/running-on-device

## Libraries

### BLE PLX
https://github.com/dotintent/react-native-ble-plx 

### RN-Fetch-Blob
https://github.com/joltup/rn-fetch-blob

### Native-base
https://docs.nativebase.io/?utm_source=HomePage&utm_medium=header&utm_campaign=NativeBase_3

### Redux
https://redux.js.org/api/api-reference

### Redux Thunk
https://github.com/reduxjs/redux-thunk


## Songbird API
* read battery level: BAT?\r	
  * response - BAT:080\r
* read storage capacity: CS?\r
  * response - "CS:NO CARDS\r" in case there are no SD cards in the device
  * response - "CS:xkB:ykB\r" x and y are free SD card space in kBytes  
* read recording duration - RD?\r
  * response - RD:x\r - Example: RD:0005\r - Recording duration is 5 minute
* write recording duration WD:xxxx\r - x four ASCII bytes in minutes - Example: WD:0010\r 
  * response - WD:OK\r or WD:ERR\r
* read sampling rate - RS?\r
   * response - RS:x\r 
* write sampling rate: WS:x\r
   * X = ASCII 0 (0x30) -> 384000 Hz
   * X = ASCII 1 (0x31) -> 192000 Hz
   * X = ASCII 2 (0x32) -> 96000 Hz
   * X = ASCII 3 (0x33) -> 48000 Hz
   * X = ASCII 4 (0x34) -> 24000 Hz
   * X = ASCII 5 (0x35) -> 12000 Hz
   * response: WS:OK\r - success
   * response: WS:ERR\r 
* read GPS - GPS?\r 
   * response - GPS:ddmmmmmm: x:dddmmmmmm:y\r
    * ddmmmmmm = GPS Latitude d - degree m - minutes
    * x = N/S
    * dddmmmmmm = GPS Longitude d - degree m - minutes
    * Y = E/W
* write GPS - GPS:ddmmmmmm: x:dddmmmmmm:y\r
   * response - GPS:OK\r
* read device clock time - RTC?\r
   * response: RTC:h: m:s: m:d:y\r - Example: RTC:17:41:34:04:06:21\r 
* write device clock time - RTC:h: m:s: m:d:y\r
   * response: RTC:OK\r 
* read recording status  - SR?\r
   * response: SR:x\r - x = “1” Acquisition in progress “0” - Acquisition OFF
* start recording - START\r
   * response: START:OK\r  - if cards in
   * response: START:NO CARDS\r  - if cards not in
* stop recording - STOP\r
   * response: STOP:OK\r
   * response: STOP:ERR\r
* read directory - DIR:x\r  - x = 1 or 2, refers to SD card
   * response: <list of files on card>
* transmit file - RW:x:yyyyyy\r  - x = SD card of file, y = index of file


